"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Schedule, SuggestedGame, Player } from '@/lib/types';
import { ScheduleInput } from '@/components/schedule-input';
import { RecommendationDisplay } from '@/components/recommendation-display';
import { Button, buttonVariants } from '@/components/ui/button';
import { getGameRecommendationsAction, getPlayerSummaryAction } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Gamepad2, Loader2, User, Settings, LogOut } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Skeleton } from '@/components/ui/skeleton';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const steamId = searchParams.get('steamId');
  
  const [schedule, setSchedule] = useState<Schedule>({});
  const [recommendations, setRecommendations] = useState<SuggestedGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [player, setPlayer] = useState<Player | null>(null);
  const [isPlayerLoading, setIsPlayerLoading] = useState(true);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  useEffect(() => {
    if (steamId) {
      setIsPlayerLoading(true);
      getPlayerSummaryAction(steamId)
        .then(setPlayer)
        .catch(e => {
            toast({
                variant: "destructive",
                title: "Failed to load Steam Profile",
                description: e.message,
            })
        })
        .finally(() => setIsPlayerLoading(false));
    } else {
        // If no steamId, redirect to login
        router.push('/');
    }
  }, [steamId, toast, router]);


  const handleScheduleChange = (newSchedule: Schedule) => {
    setSchedule(newSchedule);
  };

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      const scheduleString = JSON.stringify(schedule);
      if (Object.keys(schedule).length === 0) {
        toast({
            variant: "destructive",
            title: "Empty Schedule",
            description: "Please select at least one time slot before analyzing.",
        })
        setIsLoading(false);
        return;
      }
      if (!steamId) {
        toast({
            variant: "destructive",
            title: "Missing Steam ID",
            description: "Steam ID not found in URL. Please log in again.",
        });
        setIsLoading(false);
        return;
      }

      const result = await getGameRecommendationsAction(steamId, scheduleString);
      if (result.suggestedGames.length === 0) {
        toast({
            title: "No Suggestions Found",
            description: "We couldn't find any specific game suggestions for your schedule. Try adding more time slots!",
        })
      }
      setRecommendations(result.suggestedGames);
    } catch (e: any) {
      setError(e.message);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: e.message,
      })
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b shrink-0 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Gamepad2 className="w-8 h-8 text-accent" />
            <div className="absolute inset-0 bg-accent/20 blur-md rounded-full -z-10" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-headline text-primary-foreground">
              Backlog Buddy
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Powered by Clear
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
            <Button 
              onClick={handleGetRecommendations} 
              disabled={isLoading}
              className="gradient-primary hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Analyzing...' : 'Analyze & Suggest Games'}
            </Button>
            <div className="flex items-center gap-2">
                {isPlayerLoading ? (
                    <>
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-10 rounded-full" />
                    </>
                ) : player ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                             <Button variant="ghost" className="flex items-center gap-2 p-1 h-auto focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-ring rounded-full">
                                <span className="text-sm font-medium sr-only md:not-sr-only">{player.personaname}</span>
                                <Avatar>
                                    <AvatarImage src={player.avatarfull} alt={player.personaname} data-ai-hint="gamer avatar" />
                                    <AvatarFallback><User /></AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>{player.personaname}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => toast({ title: "Settings not implemented yet."})}>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => setShowSignOutConfirm(true)} className="text-destructive focus:text-destructive">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Sign Out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                     <Avatar>
                        <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                )}
            </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col md:flex-row gap-6 p-6 overflow-hidden bg-gradient-to-br from-background via-background to-muted/10">
        <div className="w-full md:w-1/2 lg:w-3/5 h-full animate-fade-in">
          <ScheduleInput onScheduleChange={handleScheduleChange} />
        </div>
        <div className="w-full md:w-1/2 lg:w-2/5 h-full animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <RecommendationDisplay recommendations={recommendations} isLoading={isLoading} error={error} />
        </div>
      </main>
      <AlertDialog open={showSignOutConfirm} onOpenChange={setShowSignOutConfirm}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
            <AlertDialogDescription>
                This will return you to the login page.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut} className={buttonVariants({ variant: "destructive" })}>Sign Out</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster />
    </div>
  );
}


export default function DashboardPage() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardContent />
      </Suspense>
    );
}
