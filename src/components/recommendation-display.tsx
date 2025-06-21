"use client";

import { useState } from 'react';
import type { SuggestedGame } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ThumbsUp, ThumbsDown, Info, Bot } from 'lucide-react';
import { getGameDetails } from '@/app/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface RecommendationDisplayProps {
  recommendations: SuggestedGame[];
  isLoading: boolean;
  error: string | null;
}

export function RecommendationDisplay({ recommendations, isLoading, error }: RecommendationDisplayProps) {

  const [details, setDetails] = useState<{ [key: string]: string }>({});
  const [isDetailsLoading, setIsDetailsLoading] = useState<string | null>(null);

  const handleFetchDetails = async (gameTitle: string) => {
    if(details[gameTitle]) return;

    setIsDetailsLoading(gameTitle);
    const result = await getGameDetails(gameTitle);
    setDetails(prev => ({...prev, [gameTitle]: result.gameDetails}));
    setIsDetailsLoading(null);
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
              <CardFooter>
                 <Skeleton className="h-8 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      );
    }
    
    if (error) {
      return <div className="text-destructive text-center p-8">{error}</div>;
    }
    
    if (recommendations.length === 0) {
      return (
        <div className="text-center p-8 flex flex-col items-center justify-center h-full">
            <Bot className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-headline font-semibold">Ready for your Game-Plan</h3>
            <p className="text-muted-foreground mt-2">
                Fill in your schedule, click "Analyze & Suggest", and I'll find the best games for you to play from your library.
            </p>
            <Card className="mt-6 text-sm text-left p-4">
                <CardTitle className="text-base font-headline">Future Features</CardTitle>
                <CardDescription className="mt-2">
                Direct Steam API integration, wishlist analysis, and sharing recommendations with friends are coming soon!
                </CardDescription>
            </Card>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {recommendations.map((game) => (
          <Card key={game.gameTitle}>
            <CardHeader>
              <CardTitle className="font-headline">{game.gameTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{game.reason}</p>
            </CardContent>
            <CardFooter className="justify-between">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => handleFetchDetails(game.gameTitle)}>
                            <Info className="w-4 h-4 mr-2"/>
                            Details
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle className="font-headline">{game.gameTitle}</DialogTitle>
                        <DialogDescription>
                            AI-generated summary based on web data.
                        </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 text-sm max-h-[60vh] overflow-y-auto">
                            {isDetailsLoading === game.gameTitle && <Skeleton className="h-24 w-full" />}
                            {details[game.gameTitle] && <p>{details[game.gameTitle]}</p>}
                        </div>
                    </DialogContent>
                </Dialog>

                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" aria-label="Good suggestion">
                        <ThumbsUp className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Bad suggestion">
                        <ThumbsDown className="w-4 h-4" />
                    </Button>
                </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">Your AI-Powered Game-Plan</CardTitle>
        <CardDescription>Here are the games from your library that best fit your schedule and playstyle.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto pr-2">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
