"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { SteamIcon } from '@/components/icons/steam-icon';
import { Loader2 } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const [steamId, setSteamId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!steamId) return;
    setIsLoading(true);
    // In a real app, you might do some client-side validation first.
    // For now, we'll just navigate to the dashboard with the steamId.
    setTimeout(() => {
      router.push(`/dashboard?steamId=${steamId}`);
    }, 1000);
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-xl">
      <form onSubmit={handleLogin}>
        <CardHeader className="text-center space-y-3">
            <div className="mx-auto bg-gradient-to-br from-primary-foreground to-primary-foreground/80 rounded-full h-14 w-14 flex items-center justify-center mb-2 shadow-lg ring-2 ring-accent/20">
                <SteamIcon className="h-8 w-8 text-black" />
            </div>
          <CardTitle className="font-headline text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Connect your Steam Account
          </CardTitle>
          <CardDescription className="text-sm">
            Enter your 64-bit Steam Profile ID to get started. We'll analyze your library and playtime to create your personalized gaming schedule.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="steamId" className="text-sm font-medium">
              Steam Profile ID
            </Label>
            <Input
              id="steamId"
              placeholder="e.g., 76561197960287930"
              value={steamId}
              onChange={(e) => setSteamId(e.target.value)}
              required
              disabled={isLoading}
              className="text-center h-11 transition-all focus:ring-2 focus:ring-accent/50"
            />
            <p className="text-xs text-muted-foreground text-center">
              Don't know your Steam ID? Check your Steam profile URL or use a Steam ID finder.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            type="submit" 
            className="w-full font-bold h-11 gradient-primary hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={isLoading || !steamId}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect with Steam"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
