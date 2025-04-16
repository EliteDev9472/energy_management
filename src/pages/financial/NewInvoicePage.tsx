import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Trash2, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import type { Json } from '@/integrations/supabase/types';

export default function NewInvoicePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [clientId, setClientId] = useState('');
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [number, setNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<
    { id: string; name: string; quantity: number; price: number }[]
  >([{ id: '1', name: '', quantity: 1, price: 0 }]);
  const [notes, setNotes] = useState('');
  const [type, setType] = useState('invoice');
  const [status, setStatus] = useState('draft');
  const [vatRate, setVatRate] = useState<number | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name')
        .eq('role', 'client');

      if (error) {
        toast({
          title: 'Error fetching clients',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setClients(data as { id: string; name: string }[]);
      }
    };

    fetchClients();
  }, [user]);

  const addItem = () => {
    setItems([
      ...items,
      { id: String(Date.now()), name: '', quantity: 1, price: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: string,
    field: string,
    value: string | number
  ) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateSubtotal = () => {
    return items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  };

  const calculateVatAmount = () => {
    const subtotal = calculateSubtotal();
    return vatRate ? subtotal * (vatRate / 100) : 0;
  };

  const calculateTotalAmount = () => {
    return calculateSubtotal() + calculateVatAmount();
  };

  const handleSubmit = async () => {
    if (!user) return;

    const subtotal = calculateSubtotal();
    const vatAmount = calculateVatAmount();
    const amount = calculateTotalAmount();

    const newFinancialDocument = {
      client_id: clientId,
      number,
      issue_date: issueDate,
      due_date: dueDate || null,
      items: items as unknown as Json,
      notes: notes || null,
      type,
      status,
      subtotal,
      vat_rate: vatRate || null,
      vat_amount: vatAmount || null,
      amount,
      created_by: user.id,
    };

    const { data, error } = await supabase
      .from('financial_documents')
      .insert([newFinancialDocument]);

    if (error) {
      toast({
        title: 'Error creating financial document',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Financial document created',
        description: 'Your financial document has been created successfully.',
      });
      navigate('/financial-documents');
    }
  };

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/financial-documents')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Terug
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-cedrus-blue dark:text-white">Nieuw Financieel Document</h1>
            <p className="text-muted-foreground mt-1">
              Maak een nieuw financieel document aan
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Financieel Document Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Selecteer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invoice">Factuur</SelectItem>
                    <SelectItem value="quote">Offerte</SelectItem>
                    <SelectItem value="credit_note">Credit Nota</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="clientId">Klant</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger id="clientId">
                    <SelectValue placeholder="Selecteer klant" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="number">Nummer</Label>
                  <Input
                    id="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Selecteer status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Concept</SelectItem>
                      <SelectItem value="sent">Verzonden</SelectItem>
                      <SelectItem value="paid">Betaald</SelectItem>
                      <SelectItem value="overdue">Verlopen</SelectItem>
                      <SelectItem value="void">Geannuleerd</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="issueDate">Datum Uitgifte</Label>
                  <Input
                    type="date"
                    id="issueDate"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Vervaldatum</Label>
                  <Input
                    type="date"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium">Items</h3>
                {items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-5 gap-4 mb-4">
                    <Input
                      type="text"
                      placeholder="Item naam"
                      value={item.name}
                      onChange={(e) =>
                        updateItem(item.id, 'name', e.target.value)
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Aantal"
                      value={String(item.quantity)}
                      onChange={(e) =>
                        updateItem(item.id, 'quantity', Number(e.target.value))
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Prijs"
                      value={String(item.price)}
                      onChange={(e) =>
                        updateItem(item.id, 'price', Number(e.target.value))
                      }
                    />
                    <div className="col-span-2 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Verwijder
                      </Button>
                      {index === items.length - 1 && (
                        <Button variant="secondary" size="sm" onClick={addItem}>
                          <Plus className="h-4 w-4 mr-2" />
                          Item Toevoegen
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="vatRate">BTW Percentage</Label>
                <Input
                  type="number"
                  id="vatRate"
                  placeholder="Bijv. 21"
                  value={vatRate !== null ? String(vatRate) : ''}
                  onChange={(e) =>
                    setVatRate(e.target.value ? Number(e.target.value) : null)
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notities</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => navigate('/financial-documents')}>
                  Annuleren
                </Button>
                <Button className="bg-cedrus-accent hover:bg-cedrus-accent/90" onClick={handleSubmit}>
                  Financieel Document Aanmaken
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
