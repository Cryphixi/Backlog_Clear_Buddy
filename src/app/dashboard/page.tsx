"use client";

import { useState } from 'react';
import type { Schedule, SuggestedGame } from '@/lib/types';
import { ScheduleInput } from '@/components/schedule-input';
import { RecommendationDisplay } from '@/components/recommendation-display';
import { Button } from '@/components/ui/button';
import { getGameRecommendationsAction } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Gamepad2, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardPage() {
  const [schedule, setSchedule] = useState<Schedule>({});
  const [recommendations, setRecommendations] = useState<SuggestedGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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

      const result = await getGameRecommendationsAction(scheduleString);
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
            <Avatar>
                <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="gamer avatar" />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
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
