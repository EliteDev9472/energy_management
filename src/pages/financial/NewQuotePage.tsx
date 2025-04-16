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

export default function NewQuotePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [clientId, setClientId] = useState('');
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [number, setNumber] = useState('');
  const [issueDate, setIssueDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [vatRate, setVatRate] = useState<number | null>(21);
  const [notes, setNotes] = useState<string>('');
  const [items, setItems] = useState<any[]>([]);
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemRate, setNewItemRate] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

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
        if (data && data.length > 0) {
          setClientId(data[0].id);
        }
      }
    };

    fetchClients();
  }, [user]);

  const addItem = () => {
    if (newItemDescription && newItemQuantity > 0 && newItemRate >= 0) {
      setItems([
        ...items,
        {
          description: newItemDescription,
          quantity: newItemQuantity,
          rate: newItemRate,
        },
      ]);
      setNewItemDescription('');
      setNewItemQuantity(1);
      setNewItemRate(0);
    }
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
  };

  const calculateVatAmount = () => {
    const subtotal = calculateSubtotal();
    return vatRate ? subtotal * (vatRate / 100) : 0;
  };

  const calculateTotalAmount = () => {
    return calculateSubtotal() + calculateVatAmount();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);

    const subtotal = calculateSubtotal();
    const vatAmount = calculateVatAmount();
    const totalAmount = calculateTotalAmount();

    const newQuote = {
      client_id: clientId,
      created_by: user.id,
      number: number,
      issue_date: issueDate ? format(issueDate, 'yyyy-MM-dd') : null,
      due_date: dueDate ? format(dueDate, 'yyyy-MM-dd') : null,
      amount: totalAmount,
      subtotal: subtotal,
      vat_rate: vatRate,
      vat_amount: vatAmount,
      notes: notes,
      items: items as Json,
      type: 'quote',
      status: 'draft',
    };

    const { data, error } = await supabase.from('financial_documents').insert([
      newQuote
    ]).select().single();

    if (error) {
      toast({
        title: 'Error creating quote',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Quote created',
        description: 'Your quote has been created successfully.',
      });
      navigate(`/quotes/${data.id}`);
    }

    setIsSaving(false);
  };

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/quotes')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Terug
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-cedrus-blue dark:text-white">Nieuwe Offerte</h1>
            <p className="text-muted-foreground mt-1">
              Maak een nieuwe offerte aan
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Offerte Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientId">Klant</Label>
                  <Select value={clientId} onValueChange={setClientId}>
                    <SelectTrigger id="clientId">
                      <SelectValue placeholder="Selecteer een klant" />
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
                <div>
                  <Label htmlFor="number">Offertenummer</Label>
                  <Input
                    type="text"
                    id="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="issueDate">Datum uitgifte</Label>
                  <Input
                    type="date"
                    id="issueDate"
                    value={issueDate ? format(issueDate, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setIssueDate(new Date(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Vervaldatum</Label>
                  <Input
                    type="date"
                    id="dueDate"
                    value={dueDate ? format(dueDate, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setDueDate(new Date(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notities</Label>
                <Input
                  type="text"
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div>
                <h3 className="text-sm font-medium">Offerte Items</h3>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div>{item.description}</div>
                      <div>Aantal: {item.quantity}</div>
                      <div>Tarief: €{item.rate}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center gap-4">
                    <Input
                      type="text"
                      placeholder="Omschrijving"
                      value={newItemDescription}
                      onChange={(e) => setNewItemDescription(e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Aantal"
                      value={newItemQuantity}
                      onChange={(e) =>
                        setNewItemQuantity(Number(e.target.value))
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Tarief"
                      value={newItemRate}
                      onChange={(e) => setNewItemRate(Number(e.target.value))}
                    />
                    <Button type="button" variant="secondary" size="sm" onClick={addItem}>
                      <Plus className="h-4 w-4 mr-2" /> Toevoegen
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vatRate">BTW Percentage</Label>
                  <Input
                    type="number"
                    id="vatRate"
                    value={vatRate || ''}
                    onChange={(e) => setVatRate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Totaalbedrag</Label>
                  <Input
                    type="text"
                    id="amount"
                    value={`€${calculateTotalAmount().toFixed(2)}`}
                    readOnly
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="bg-cedrus-accent hover:bg-cedrus-accent/90"
                disabled={isSaving}
              >
                {isSaving ? 'Offerte aan het opslaan...' : 'Offerte aanmaken'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
