
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { NewUserForm } from "@/components/admin/users/NewUserForm";

export default function NewUserPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/users")}>
            <ArrowLeft />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Nieuwe Gebruiker Toevoegen</h1>
            <p className="text-muted-foreground">Maak een nieuwe gebruiker aan en wijs een rol toe</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gebruiker Gegevens</CardTitle>
            <CardDescription>Vul de gegevens in voor de nieuwe gebruiker</CardDescription>
          </CardHeader>
          <CardContent>
            <NewUserForm loading={loading} setLoading={setLoading} onSuccess={() => navigate('/admin/users')} />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
