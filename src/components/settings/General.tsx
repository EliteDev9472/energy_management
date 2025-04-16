
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { GeneralForm } from "./general/GeneralForm";

export function General() {
  const { loading } = useSettings();

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-cedrus-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Algemene Instellingen</h3>
        <p className="text-sm text-muted-foreground">
          Beheer uw persoonlijke informatie en accountvoorkeuren.
        </p>
      </div>
      <Separator />
      <GeneralForm />
    </div>
  );
}
