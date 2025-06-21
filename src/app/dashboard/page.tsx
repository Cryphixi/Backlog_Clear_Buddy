"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Schedule, SuggestedGame, Player } from '@/lib/types';
import { ScheduleInput } from '@/components/schedule-input';
import { RecommendationDisplay } from '@/components/recommendation-display';
import { Button } from '@/components/ui/button';
import { getGameRecommendationsAction, getPlayerSummaryAction } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Gamepad2, Loader2, User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Skeleton } from '@/components/ui/skeleton';

function DashboardContent() {
  const searchParams = useSearchParams();
  const steamId = searchParams.get('steamId');
  
  const [schedule, setSchedule] = useState<Schedule>({});
  const [recommendations, setRecommendations] = useState<SuggestedGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [player, setPlayer] = useState<Player | null>(null);
  const [isPlayerLoading, setIsPlayerLoading] = useState(true);

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
        setIsPlayerLoading(false);
    }
  }, [steamId, toast]);


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

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b shrink-0">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-8 h-8 text-accent" />
          <h1 className="text-xl font-bold font-headline text-primary-foreground">
            SteamTime Navigator
          </h1>
        </div>
        <div className="flex items-center gap-4">
            <Button onClick={handleGetRecommendations} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analyze & Suggest Games
            </Button>
            <div className="flex items-center gap-2">
                {isPlayerLoading ? (
                    <>
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-10 rounded-full" />
                    </>
                ) : player ? (
                    <>
                        <span className="text-sm font-medium">{player.personaname}</span>
                        <Avatar>
                            <AvatarImage src={player.avatarfull} alt={player.personaname} data-ai-hint="gamer avatar" />
                            <AvatarFallback><User /></AvatarFallback>
                        </Avatar>
                    </>
                ) : (
                    <Avatar>
                        <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                )}
            </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col md:flex-row gap-6 p-6 overflow-hidden">
        <div className="w-full md:w-1/2 lg:w-3/5 h-full">
          <ScheduleInput onScheduleChange={handleScheduleChange} />
        </div>
        <div className="w-full md:w-1/2 lg:w-2/5 h-full">
          <RecommendationDisplay recommendations={recommendations} isLoading={isLoading} error={error} />
        </div>
      </main>
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
