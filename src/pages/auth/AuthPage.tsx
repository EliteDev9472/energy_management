
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "signin";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { signIn, signUp, loading } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Velden ontbreken",
        description: "Vul alle velden in",
        variant: "destructive",
      });
      return;
    }
    await signIn(email, password);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast({
        title: "Velden ontbreken",
        description: "Vul alle velden in",
        variant: "destructive",
      });
      return;
    }
    if (password.length < 6) {
      toast({
        title: "Wachtwoord te kort",
        description: "Het wachtwoord moet minimaal 6 karakters bevatten",
        variant: "destructive",
      });
      return;
    }
    await signUp(email, password, name);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-cedrus-blue dark:text-white">
            Cedrus Energy
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Energiebeheer platform voor uw aansluitingen
          </p>
        </div>

        <Tabs defaultValue={mode} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Inloggen</TabsTrigger>
            <TabsTrigger value="signup">Registreren</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-6">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">E-mailadres</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="uw@email.nl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Wachtwoord</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-cedrus-accent hover:bg-cedrus-accent/90"
                disabled={loading}
              >
                {loading ? "Bezig met inloggen..." : "Inloggen"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-6">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Naam</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Uw naam"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">E-mailadres</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="uw@email.nl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Wachtwoord</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-cedrus-accent hover:bg-cedrus-accent/90"
                disabled={loading}
              >
                {loading ? "Bezig met registreren..." : "Registreren"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
