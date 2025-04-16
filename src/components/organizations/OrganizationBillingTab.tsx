import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Plus, Download, FileText, Filter, AlertCircle } from 'lucide-react';
import { formatDate } from '@/utils/formatters';
import { Loading } from '@/components/ui/loading';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from "@/integrations/supabase/client";
import { billingService, BillingItem } from '@/services/billingService';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Invoice {
  id: string;
  invoice_number: string;
  title: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  amount: number;
  issue_date: string;
  due_date: string;
  file_path?: string;
}

interface OrganizationBillingTabProps {
  organizationId: string;
}

export function OrganizationBillingTab({ organizationId }: OrganizationBillingTabProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [billableItems, setBillableItems] = useState<BillingItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(true);
  const [isLoadingBillables, setIsLoadingBillables] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('invoices');
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [monthlyRate, setMonthlyRate] = useState<number>(25);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  useEffect(() => {
    fetchInvoices();
    fetchBillableItems();
    fetchBillingSettings();
  }, [organizationId]);

  const fetchInvoices = async () => {
    setIsLoadingInvoices(true);
    try {
      const { data, error } = await supabase
        .from('organization_invoices')
        .select('*')
        .eq('organization_id', organizationId)
        .order('issue_date', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      const typedInvoices: Invoice[] = (data || []).map(invoice => ({
        ...invoice,
        status: invoice.status as 'paid' | 'pending' | 'overdue' | 'cancelled',
      }));
      
      setInvoices(typedInvoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast({
        title: 'Fout bij laden facturen',
        description: 'Er is een fout opgetreden bij het ophalen van de facturen.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingInvoices(false);
    }
  };

  const fetchBillableItems = async () => {
    setIsLoadingBillables(true);
    try {
      const items = await billingService.getUnbilledItems(organizationId);
      setBillableItems(items);
    } catch (error) {
      console.error('Error fetching billable items:', error);
      toast({
        title: 'Fout bij laden factureerbare items',
        description: 'Er is een fout opgetreden bij het ophalen van de factureerbare items.',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingBillables(false);
    }
  };

  const fetchBillingSettings = async () => {
    try {
      const settings = await billingService.getOrganizationBillingSettings(organizationId);
      setMonthlyRate(settings.monthly_ean_rate || 25);
    } catch (error) {
      console.error('Error fetching billing settings:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const newProjects = await billingService.checkForNewProjectBillingItems(organizationId);
      const newConnections = await billingService.checkForNewConnectionBillingItems(organizationId);
      const newMonthlyItems = await billingService.checkForMonthlyEANBillingItems(organizationId);
      
      const totalNew = newProjects + newConnections + newMonthlyItems;
      
      await fetchBillableItems();
      
      toast({
        title: 'Factureerbare items bijgewerkt',
        description: `${totalNew} nieuwe factureerbare items gevonden.`,
        variant: totalNew > 0 ? 'default' : 'default',
      });
    } catch (error) {
      console.error('Error refreshing billable items:', error);
      toast({
        title: 'Fout bij vernieuwen factureerbare items',
        description: 'Er is een fout opgetreden bij het vernieuwen van de factureerbare items.',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateInvoice = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: 'Geen items geselecteerd',
        description: 'Selecteer tenminste één item om te factureren.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsCreatingInvoice(true);
    try {
      await billingService.createInvoice(organizationId, selectedItems);
      
      await fetchInvoices();
      await fetchBillableItems();
      
      setSelectedItems([]);
      
      toast({
        title: 'Factuur aangemaakt',
        description: 'De factuur is succesvol aangemaakt.',
      });
      
      setActiveTab('invoices');
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: 'Fout bij aanmaken factuur',
        description: 'Er is een fout opgetreden bij het aanmaken van de factuur.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingInvoice(false);
    }
  };

  const handleDownload = (invoice: Invoice) => {
    if (invoice.file_path) {
      window.open(invoice.file_path, '_blank');
    } else {
      toast({
        title: 'Bestand niet beschikbaar',
        description: 'Het factuurbestand is niet beschikbaar voor download.',
        variant: 'destructive',
      });
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === billableItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(billableItems.map(item => item.id));
    }
  };

  const handleUpdateSettings = async () => {
    try {
      await billingService.updateOrganizationBillingSettings(organizationId, {
        monthly_ean_rate: monthlyRate
      });
      
      toast({
        title: 'Instellingen bijgewerkt',
        description: 'De facturatie-instellingen zijn bijgewerkt.',
      });
      
      setShowSettingsDialog(false);
    } catch (error) {
      console.error('Error updating billing settings:', error);
      toast({
        title: 'Fout bij bijwerken instellingen',
        description: 'Er is een fout opgetreden bij het bijwerken van de instellingen.',
        variant: 'destructive',
      });
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Betaald</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">In behandeling</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Te laat</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800">Geannuleerd</Badge>;
      case 'invoiced':
        return <Badge className="bg-blue-100 text-blue-800">Gefactureerd</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getBillingTypeLabel = (type: string) => {
    switch (type) {
      case 'project':
        return 'Projectkosten';
      case 'connection':
        return 'Aansluitkosten';
      case 'monthly':
        return 'Maandelijkse EAN';
      default:
        return type;
    }
  };

  const filteredBillableItems = billableItems.filter(item => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      item.reference_name.toLowerCase().includes(query) ||
      getBillingTypeLabel(item.type).toLowerCase().includes(query) ||
      formatAmount(item.amount).toLowerCase().includes(query)
    );
  });
  
  const totalSelectedAmount = selectedItems.reduce((sum, id) => {
    const item = billableItems.find(item => item.id === id);
    return sum + (item ? item.amount : 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Facturatie</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowSettingsDialog(true)}>
            Instellingen
          </Button>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Vernieuwen...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Vernieuwen
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="invoices">Facturen</TabsTrigger>
          <TabsTrigger value="billable">Factureerbare Items</TabsTrigger>
        </TabsList>
        
        <TabsContent value="invoices">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Facturen</CardTitle>
              <Button onClick={() => setActiveTab('billable')} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Nieuwe Factuur
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingInvoices ? (
                <Loading text="Facturen laden..." />
              ) : invoices.length === 0 ? (
                <div className="py-8 text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Geen facturen gevonden</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Er zijn nog geen facturen voor deze organisatie.
                  </p>
                  <Button className="mt-4" variant="outline" onClick={() => setActiveTab('billable')}>
                    Maak een factuur
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Factuurnummer</TableHead>
                      <TableHead>Omschrijving</TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead>Vervaldatum</TableHead>
                      <TableHead>Bedrag</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.invoice_number}</TableCell>
                        <TableCell>{invoice.title}</TableCell>
                        <TableCell>{formatDate(invoice.issue_date)}</TableCell>
                        <TableCell>{formatDate(invoice.due_date)}</TableCell>
                        <TableCell>{formatAmount(invoice.amount)}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(invoice)}
                            disabled={!invoice.file_path}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Facturatieoverzicht</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Open facturen</div>
                  <div className="mt-1 text-2xl font-bold">
                    {invoices.filter(i => i.status === 'pending').length}
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Te laat</div>
                  <div className="mt-1 text-2xl font-bold">
                    {invoices.filter(i => i.status === 'overdue').length}
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Totaal uitstaand</div>
                  <div className="mt-1 text-2xl font-bold">
                    {formatAmount(
                      invoices
                        .filter(i => ['pending', 'overdue'].includes(i.status))
                        .reduce((sum, invoice) => sum + invoice.amount, 0)
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billable">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Factureerbare Items</CardTitle>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">Totaal geselecteerd:</span>
                  <span className="font-bold">{formatAmount(totalSelectedAmount)}</span>
                </div>
                <Button 
                  onClick={handleCreateInvoice} 
                  disabled={selectedItems.length === 0 || isCreatingInvoice}
                  size="sm"
                >
                  {isCreatingInvoice ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Verwerken...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Factuur Aanmaken
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Zoeken..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>

              {isLoadingBillables ? (
                <Loading text="Factureerbare items laden..." />
              ) : filteredBillableItems.length === 0 ? (
                <div className="py-8 text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Geen factureerbare items gevonden</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Er zijn momenteel geen factureerbare items voor deze organisatie.
                  </p>
                  <Button className="mt-4" variant="outline" onClick={handleRefresh}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Controleer op nieuwe items
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox 
                          checked={selectedItems.length === filteredBillableItems.length && filteredBillableItems.length > 0}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead>Referentie</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Factureerbaar vanaf</TableHead>
                      <TableHead>Bedrag</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBillableItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => handleSelectItem(item.id)}
                            aria-label="Select row"
                          />
                        </TableCell>
                        <TableCell>{item.reference_name}</TableCell>
                        <TableCell>{getBillingTypeLabel(item.type)}</TableCell>
                        <TableCell>{formatDate(item.billable_from)}</TableCell>
                        <TableCell>{formatAmount(item.amount)}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Facturatie Informatie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Projectkosten</div>
                    <Badge className="bg-purple-100 text-purple-800">Eenmalig</Badge>
                  </div>
                  <div className="mt-2 text-2xl font-bold">€500</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Wordt toegevoegd bij het aanmaken van een nieuw project
                  </p>
                </div>
                
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Aansluitkosten</div>
                    <Badge className="bg-blue-100 text-blue-800">Eenmalig</Badge>
                  </div>
                  <div className="mt-2 text-2xl font-bold">€100</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Wordt toegevoegd wanneer een aansluiting de status "In behandeling" krijgt
                  </p>
                </div>
                
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Maandelijkse EAN kosten</div>
                    <Badge className="bg-green-100 text-green-800">Maandelijks</Badge>
                  </div>
                  <div className="mt-2 text-2xl font-bold">€{monthlyRate}</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Maandelijkse kosten per actieve aansluiting met EAN
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Facturatie Instellingen</DialogTitle>
            <DialogDescription>
              Pas de facturatie-instellingen aan voor deze organisatie.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="monthly-rate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Maandelijkse EAN tarief (€)
              </label>
              <Input
                id="monthly-rate"
                type="number"
                min="0"
                step="0.01"
                value={monthlyRate}
                onChange={(e) => setMonthlyRate(Number(e.target.value))}
              />
              <p className="text-sm text-muted-foreground">
                Dit bedrag wordt maandelijks gefactureerd voor elke actieve aansluiting met een EAN.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
              Annuleren
            </Button>
            <Button onClick={handleUpdateSettings}>
              Opslaan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
