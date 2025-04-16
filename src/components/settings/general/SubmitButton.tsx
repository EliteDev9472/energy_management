
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  loading?: boolean;
}

export function SubmitButton({ loading = false }: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Bezig met opslaan...
        </>
      ) : (
        "Wijzigingen opslaan"
      )}
    </Button>
  );
}
