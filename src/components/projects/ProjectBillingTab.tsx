
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Clock, CreditCard, BarChart4 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Loading } from '@/components/ui/loading';
import { formatCurrency } from '@/lib/formatters';

interface ProjectBillingTabProps {
  projectId: string;
  projectName: string;
}

interface BillingItem {
  id: string;
  reference_id: string;
  reference_type: string;
  type: string;
  reference_name: string;
  amount: number;
  status: string;
  created_at: string;
  billable_from: string;
}

export function ProjectBillingTab({ projectId, projectName }: ProjectBillingTabProps) {
  const [billingItems, setBillingItems] = useState<BillingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectCost, setProjectCost] = useState(0);
  const [connectionCosts, setConnectionCosts] = useState(0);
  const [monthlyEanCosts, setMonthlyEanCosts] = useState(0);

  useEffect(() => {
    const fetchBillingItems = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('billing_items')
          .select('*')
          .eq('reference_id', projectId)
          .or(`reference_type.eq.project,type.eq.project_fee`);

        if (error) throw error;

        console.log("Billing items:", data);

        let projectFee = 0;
        let connectionFees = 0;
        let eanFees = 0;

        // Filter and aggregate billing items
        if (data) {
          setBillingItems(data);

          data.forEach(item => {
            if (item.type === 'project_fee') {
              projectFee += parseFloat(item.amount);
            } else if (item.type === 'connection_fee') {
              connectionFees += parseFloat(item.amount);
            } else if (item.type === 'monthly_ean_fee') {
              eanFees += parseFloat(item.amount);
            }
          });
        }

        setProjectCost(projectFee);
        setConnectionCosts(connectionFees);
        setMonthlyEanCosts(eanFees);
      } catch (error) {
        console.error("Error fetching billing items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingItems();
  }, [projectId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getBillingTypeDisplay = (type: string) => {
    switch (type) {
      case 'project_fee':
        return 'Project aanmaakkosten';
      case 'connection_fee':
        return 'Aansluitkosten';
      case 'monthly_ean_fee':
        return 'Maandelijkse EAN kosten';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Projectkosten</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-primary mr-2" />
              <div className="text-2xl font-bold">{formatCurrency(projectCost)}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Eenmalige kosten bij aanmaken project</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Aansluitingskosten</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-primary mr-2" />
              <div className="text-2xl font-bold">{formatCurrency(connectionCosts)}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Eenmalige kosten per aansluiting</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Maandelijkse kosten</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-primary mr-2" />
              <div className="text-2xl font-bold">{formatCurrency(monthlyEanCosts)}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Maandelijkse kosten per actieve EAN</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <BarChart4 className="h-5 w-5 mr-2 text-primary" />
            Facturatiehistorie
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loading />
          ) : billingItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Geen facturatiegegevens gevonden</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Omschrijving</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead className="text-right">Bedrag</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.reference_name}</TableCell>
                    <TableCell>{getBillingTypeDisplay(item.type)}</TableCell>
                    <TableCell>{formatDate(item.billable_from)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(parseFloat(item.amount.toString()))}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'paid' ? 'bg-green-100 text-green-800' : 
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status === 'paid' ? 'Betaald' : 
                         item.status === 'pending' ? 'In behandeling' : 
                         item.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
