
import { Session, User } from "@supabase/supabase-js";
import { UserProfile, UserRole } from "@/types/user";

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  isAdmin: () => boolean;
  isConsultant: () => boolean;
  isClientOwner: () => boolean;
  isProjectManager: () => boolean;
};
