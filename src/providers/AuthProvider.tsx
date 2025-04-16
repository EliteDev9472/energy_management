
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Session, User } from "@supabase/supabase-js";
import { UserProfile } from "@/types/user";
import { AuthContext } from "@/contexts/AuthContext";
import { hasRole, isAdmin, isConsultant, isClientOwner, isProjectManager } from "@/utils/authUtils";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        setUserProfile(data as UserProfile);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast({
          title: "Aanmelden mislukt",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succesvol aangemeld",
          description: "U bent nu ingelogd op uw account."
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Er is een fout opgetreden",
        description: "Probeer het later opnieuw",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name,
          }
        }
      });
      
      if (error) {
        toast({
          title: "Registratie mislukt",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registratie succesvol",
          description: "Uw account is aangemaakt. U kunt nu inloggen."
        });
        navigate("/auth?mode=signin");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        title: "Er is een fout opgetreden",
        description: "Probeer het later opnieuw",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      toast({
        title: "Uitgelogd",
        description: "U bent uitgelogd van uw account."
      });
      navigate("/auth");
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Er is een fout opgetreden",
        description: "Probeer het later opnieuw",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      userProfile,
      signIn, 
      signUp, 
      signOut, 
      loading,
      hasRole: (roles) => hasRole(userProfile, roles),
      isAdmin: () => isAdmin(userProfile),
      isConsultant: () => isConsultant(userProfile),
      isClientOwner: () => isClientOwner(userProfile),
      isProjectManager: () => isProjectManager(userProfile)
    }}>
      {children}
    </AuthContext.Provider>
  );
}
