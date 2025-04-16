
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Calendar, BarChart as BarChartIcon, LineChart as LineChartIcon, Loader } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { DateRangePicker } from '@/components/connections/filters/DateRangePicker';
import { DateRange } from 'react-day-picker';
import { format, subMonths, subDays, isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

// Sample data structure for real-time data
interface ConsumptionData {
  date: string;
  consumption: number;
}

// Enhanced sample data - this would come from your database in a real app
const generateData = () => {
  const monthlyData: ConsumptionData[] = [];
  const today = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = subMonths(today, i);
    monthlyData.push({
      date: format(date, 'yyyy-MM-dd'),
      consumption: Math.floor(Math.random() * 300) + 200, // Random value between 200-500
    });
  }
  
  const dailyData: ConsumptionData[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = subDays(today, i);
    dailyData.push({
      date: format(date, 'yyyy-MM-dd'),
      consumption: Math.floor(Math.random() * 20) + 5, // Random value between 5-25
    });
  }
  
  const hourlyData: ConsumptionData[] = [];
  for (let i = 0; i < 24; i++) {
    hourlyData.push({
      date: `${i.toString().padStart(2, '0')}:00`,
      consumption: Math.floor(Math.random() * 10) + 1, // Random value between 1-10
    });
  }
  
  return { monthlyData, dailyData, hourlyData };
};

export default function ConsumptionPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [viewType, setViewType] = useState<'monthly' | 'daily' | 'hourly'>('monthly');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 12),
    to: new Date(),
  });
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [data, setData] = useState(() => generateData());
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Filter data based on selected date range
  const filteredData = () => {
    if (!dateRange?.from) {
      return viewType === 'monthly' 
        ? data.monthlyData 
        : viewType === 'daily' 
          ? data.dailyData 
          : data.hourlyData;
    }

    const from = startOfDay(dateRange.from);
    const to = dateRange.to ? endOfDay(dateRange.to) : endOfDay(new Date());

    if (viewType === 'monthly') {
      return data.monthlyData.filter(item => {
        const date = parseISO(item.date);
        return isWithinInterval(date, { start: from, end: to });
      });
    } else if (viewType === 'daily') {
      return data.dailyData.filter(item => {
        const date = parseISO(item.date);
        return isWithinInterval(date, { start: from, end: to });
      });
    } else {
      // Hourly data doesn't have a specific date, so we return all
      return data.hourlyData;
    }
  };

  // Simulating data fetching
  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setData(generateData());
      setIsLoading(false);
      toast({
        title: "Gegevens ververst",
        description: "De verbruiksgegevens zijn bijgewerkt."
      });
    }, 800);
  };

  const handleDownloadData = () => {
    toast({
      title: "Data wordt gedownload",
      description: "Het verbruiksoverzicht wordt als CSV gedownload."
    });
    
    // In a real app, you would generate and download a CSV file here
    setTimeout(() => {
      const element = document.createElement("a");
      const currentData = filteredData();
      const csv = [
        ["Datum", "Verbruik (kWh)"],
        ...currentData.map(item => [item.date, item.consumption.toString()])
      ].map(row => row.join(",")).join("\n");
      
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      
      element.href = url;
      element.download = `verbruik-${id}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 500);
  };

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate(`/connections/${id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Terug naar aansluiting
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-cedrus-blue dark:text-white">Verbruiksgegevens</h1>
            <p className="text-muted-foreground mt-1">
              Bekijk en analyseer uw energieverbruik
            </p>
          </div>
          <Button 
            variant="outline"
            onClick={handleDownloadData}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Data
          </Button>
        </div>

        <Tabs defaultValue="overview" className="mb-6">
          <TabsList>
            <TabsTrigger value="overview">Overzicht</TabsTrigger>
            <TabsTrigger value="analysis">Analyses</TabsTrigger>
            <TabsTrigger value="comparison">Vergelijking</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Verbruik over tijd</CardTitle>
                <div className="flex items-center flex-wrap gap-2">
                  <DateRangePicker 
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                  />
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant={viewType === 'monthly' ? 'default' : 'outline'} 
                      onClick={() => setViewType('monthly')}
                      className={viewType === 'monthly' ? 'bg-cedrus-accent text-white hover:bg-cedrus-accent/90' : ''}
                    >
                      Maandelijks
                    </Button>
                    <Button 
                      size="sm" 
                      variant={viewType === 'daily' ? 'default' : 'outline'} 
                      onClick={() => setViewType('daily')}
                      className={viewType === 'daily' ? 'bg-cedrus-accent text-white hover:bg-cedrus-accent/90' : ''}
                    >
                      Dagelijks
                    </Button>
                    <Button 
                      size="sm" 
                      variant={viewType === 'hourly' ? 'default' : 'outline'} 
                      onClick={() => setViewType('hourly')}
                      className={viewType === 'hourly' ? 'bg-cedrus-accent text-white hover:bg-cedrus-accent/90' : ''}
                    >
                      Uurlijks
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant={chartType === 'line' ? 'default' : 'outline'} 
                      onClick={() => setChartType('line')}
                      className={chartType === 'line' ? 'bg-cedrus-accent text-white hover:bg-cedrus-accent/90' : ''}
                    >
                      <LineChartIcon className="h-4 w-4 mr-2" />
                      Lijn
                    </Button>
                    <Button 
                      size="sm" 
                      variant={chartType === 'bar' ? 'default' : 'outline'} 
                      onClick={() => setChartType('bar')}
                      className={chartType === 'bar' ? 'bg-cedrus-accent text-white hover:bg-cedrus-accent/90' : ''}
                    >
                      <BarChartIcon className="h-4 w-4 mr-2" />
                      Staaf
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={refreshData}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : "Verversen"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80 mt-4">
                  {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <Loader className="h-8 w-8 animate-spin text-cedrus-accent" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === 'line' ? (
                        <LineChart data={filteredData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={(value) => {
                              if (viewType === 'hourly') return value;
                              const date = new Date(value);
                              return viewType === 'monthly' 
                                ? format(date, 'MMM yyyy') 
                                : format(date, 'd MMM');
                            }}
                          />
                          <YAxis />
                          <Tooltip 
                            labelFormatter={(value) => {
                              if (viewType === 'hourly') return `Tijd: ${value}`;
                              const date = new Date(value);
                              return `Datum: ${format(date, 'd MMMM yyyy')}`;
                            }}
                            formatter={(value: number) => [`${value} kWh`, 'Verbruik']}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="consumption" 
                            name="Verbruik (kWh)" 
                            stroke="#A4C687" 
                            activeDot={{ r: 8 }} 
                            strokeWidth={2}
                          />
                        </LineChart>
                      ) : (
                        <BarChart data={filteredData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={(value) => {
                              if (viewType === 'hourly') return value;
                              const date = new Date(value);
                              return viewType === 'monthly' 
                                ? format(date, 'MMM yyyy') 
                                : format(date, 'd MMM');
                            }}
                          />
                          <YAxis />
                          <Tooltip 
                            labelFormatter={(value) => {
                              if (viewType === 'hourly') return `Tijd: ${value}`;
                              const date = new Date(value);
                              return `Datum: ${format(date, 'd MMMM yyyy')}`;
                            }}
                            formatter={(value: number) => [`${value} kWh`, 'Verbruik']}
                          />
                          <Legend />
                          <Bar 
                            dataKey="consumption" 
                            name="Verbruik (kWh)" 
                            fill="#A4C687" 
                          />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analysis">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-4">
                  <div className="text-center p-12 border rounded-md bg-muted/20">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Verbruiksanalyse</h3>
                    <p className="text-muted-foreground mb-4">
                      Hier vindt u gedetailleerde analyses van uw energieverbruik, inclusief piek- en dalgebruik, trends en kostenberekeningen.
                    </p>
                    <Button className="bg-cedrus-accent hover:bg-cedrus-accent/90">Bekijk analyse</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="comparison">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-4">
                  <div className="text-center p-12 border rounded-md bg-muted/20">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Vergelijkingsrapport</h3>
                    <p className="text-muted-foreground mb-4">
                      Vergelijk uw energieverbruik met soortgelijke aansluitingen, eerdere periodes of gemiddelden in uw regio.
                    </p>
                    <Button className="bg-cedrus-accent hover:bg-cedrus-accent/90">Start vergelijking</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
