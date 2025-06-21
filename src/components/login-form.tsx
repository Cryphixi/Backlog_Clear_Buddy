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
    <Card className="bg-card">
      <form onSubmit={handleLogin}>
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary-foreground rounded-full h-12 w-12 flex items-center justify-center mb-4">
                <SteamIcon className="h-8 w-8 text-black" />
            </div>
          <CardTitle className="font-headline text-2xl">Connect your Steam Account</CardTitle>
          <CardDescription>
            Enter your 64-bit Steam Profile ID to get started. We'll analyze your library and playtime.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="steamId" className="sr-only">Steam Profile ID</Label>
            <Input
              id="steamId"
              placeholder="e.g., 76561197960287930"
              value={steamId}
              onChange={(e) => setSteamId(e.target.value)}
              required
              disabled={isLoading}
              className="text-center"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full font-bold" disabled={isLoading || !steamId}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoading ? "Connecting..." : "Connect with Steam"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
