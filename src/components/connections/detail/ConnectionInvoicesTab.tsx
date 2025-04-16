
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Connection } from '@/types/connection';
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download, File } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { formatDate } from "@/lib/utils";

interface ConnectionInvoicesTabProps {
  connectionId: string;
}

type Invoice = {
  id: string;
  name: string;
  date: string;
  amount: string;
  status: string;
};

export function ConnectionInvoicesTab({ connectionId }: ConnectionInvoicesTabProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([
    // Sample data - in a real app, these would come from your database
    { id: "1", name: "Aansluiting factuur", date: "2024-01-15", amount: "€750,00", status: "Betaald" },
    { id: "2", name: "Capaciteitsuitbreiding", date: "2024-02-28", amount: "€250,00", status: "Openstaand" },
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Facturen</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Factuur uploaden
            </Button>
            <Button size="sm" variant="default">
              <Plus className="h-4 w-4 mr-2" />
              Nieuwe factuur
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <File className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Geen facturen beschikbaar</p>
              <Button className="mt-4" size="sm" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Eerste factuur uploaden
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left font-medium">Factuur</th>
                    <th className="py-3 px-4 text-left font-medium">Datum</th>
                    <th className="py-3 px-4 text-left font-medium">Bedrag</th>
                    <th className="py-3 px-4 text-left font-medium">Status</th>
                    <th className="py-3 px-4 text-right font-medium">Acties</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b">
                      <td className="py-3 px-4">{invoice.name}</td>
                      <td className="py-3 px-4">{formatDate(invoice.date)}</td>
                      <td className="py-3 px-4">{invoice.amount}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          invoice.status === "Betaald" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
