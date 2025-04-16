
import { Receipt, Upload, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';
import { type OrganizationWithDeletionInfo } from '@/services/organizations';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface Invoice {
  id: string;
  number: string;
  date: Date;
  amount: number;
  status: 'paid' | 'unpaid' | 'overdue';
  fileUrl?: string;
}

interface OrganizationInvoicesProps {
  organization: OrganizationWithDeletionInfo;
}

export function OrganizationInvoices({ organization }: OrganizationInvoicesProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mockup invoices for demonstration
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      number: 'INV-2023-001',
      date: new Date(2023, 0, 15),
      amount: 1250.00,
      status: 'paid',
      fileUrl: '#'
    },
    {
      id: '2',
      number: 'INV-2023-002',
      date: new Date(2023, 1, 20),
      amount: 875.50,
      status: 'paid',
      fileUrl: '#'
    },
    {
      id: '3',
      number: 'INV-2023-003',
      date: new Date(2023, 2, 10),
      amount: 1500.00,
      status: 'unpaid',
      fileUrl: '#'
    }
  ]);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      // Here we would implement the actual upload functionality
      // For now, just simulate adding a new invoice
      setTimeout(() => {
        const newInvoice: Invoice = {
          id: `${Date.now()}`,
          number: `INV-2023-00${invoices.length + 1}`,
          date: new Date(),
          amount: Math.random() * 2000,
          status: 'unpaid',
          fileUrl: '#'
        };
        
        setInvoices(prev => [...prev, newInvoice]);
        setIsUploading(false);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 1000);
    } catch (error) {
      console.error('Error uploading invoice:', error);
      setIsUploading(false);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500 hover:bg-green-600">Betaald</Badge>;
      case 'unpaid':
        return <Badge variant="outline">Nog te betalen</Badge>;
      case 'overdue':
        return <Badge className="bg-destructive">Verlopen</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-cedrus-accent" />
          Facturen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.docx,.doc"
            onChange={handleFileUpload}
            ref={fileInputRef}
          />
          <Button 
            variant="outline" 
            onClick={handleUploadClick}
            disabled={isUploading}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploaden...' : 'Upload factuur'}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Upload een factuur document (.pdf, .docx)
          </p>
        </div>
        
        {invoices.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nummer</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Bedrag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map(invoice => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.number}</TableCell>
                  <TableCell>{format(invoice.date, 'dd-MM-yyyy')}</TableCell>
                  <TableCell>€ {invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" title="Bekijk factuur">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Download factuur">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center p-4 text-muted-foreground">
            Geen facturen gevonden
          </div>
        )}
      </CardContent>
    </Card>
  );
}
