
import { Badge } from "@/components/ui/badge";
import { ConnectionStatus } from "@/types/connection";

interface StatusBadgeProps {
  status: ConnectionStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = getVariantForStatus(status);
  const label = getStatusLabel(status);

  return <Badge variant={variant as any}>{label}</Badge>;
}

function getVariantForStatus(status: ConnectionStatus | string): "default" | "destructive" | "outline" | "secondary" {
  switch (status) {
    case "Actief":
    case "active":
    case "ACTIVE":
    case "actief":
      return "outline"; // Using outline instead of success since it's in the allowed variants
    case "Inactief":
    case "inactive":
      return "secondary";
    case "Storing":
    case "error":
    case "CANCELLED":
    case "afmelden":
    case "beëindigd":
      return "destructive";
    default:
      return "default";
  }
}

function getStatusLabel(status: ConnectionStatus | string): string {
  switch (status) {
    case "Actief":
    case "active":
    case "ACTIVE":
    case "actief":
      return "Actief";
    case "Inactief":
    case "inactive":
      return "Inactief";
    case "In aanvraag":
    case "pending":
    case "NEW":
    case "concept":
      return "In aanvraag";
    case "Storing":
    case "error":
      return "Storing";
    case "Geblokkeerd":
    case "blocked":
      return "Geblokkeerd";
    case "Gepland":
    case "planned":
    case "PLANNED":
      return "Gepland";
    case "Afgesloten":
    case "closed":
    case "CANCELLED":
    case "afmelden":
    case "beëindigd":
      return "Afgesloten";
    default:
      return status as string;
  }
}
