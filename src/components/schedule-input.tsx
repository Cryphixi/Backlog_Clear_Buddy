"use client";

import React, { useState } from 'react';
import type { Schedule } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 18 }, (_, i) => i + 6); // 6 AM to 11 PM

interface ScheduleInputProps {
  onScheduleChange: (schedule: Schedule) => void;
}

export function ScheduleInput({ onScheduleChange }: ScheduleInputProps) {
  const [localSchedule, setLocalSchedule] = useState<Schedule>({});

  const toggleSlot = (day: string, hour: number) => {
    const newSchedule = { ...localSchedule };
    if (!newSchedule[day]) {
      newSchedule[day] = {};
    }
    newSchedule[day][hour] = !newSchedule[day][hour];
    setLocalSchedule(newSchedule);
    onScheduleChange(newSchedule);
  };
  
  const formatHour = (hour: number) => {
    if (hour === 12) return '12 PM';
    if (hour === 0 || hour === 24) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    return `${hour % 12} PM`;
  }

  return (
    <Card className="h-full flex flex-col bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
      <CardHeader className="border-b border-border/50">
        <CardTitle className="font-headline flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-accent/10">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            Your Weekly Schedule
        </CardTitle>
        <CardDescription className="mt-2">
          Select your available gaming slots below. Click a slot to toggle it on or off.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col pt-4">
        <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-2 text-center font-semibold text-xs text-muted-foreground pb-3 sticky top-0 bg-card/80 backdrop-blur-sm z-10">
          <div></div>
          {days.map(day => (
            <div key={day} className="py-1 rounded-md bg-muted/30">
              {day}
            </div>
          ))}
        </div>
        <div className="flex-grow overflow-y-auto pr-2 -mr-2">
            <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-2 text-center">
            {hours.map(hour => (
                <React.Fragment key={hour}>
                <div className="text-xs text-muted-foreground pr-3 flex items-center justify-end font-medium py-1">
                    {formatHour(hour)}
                </div>
                {days.map(day => (
                    <button
                    key={`${day}-${hour}`}
                    onClick={() => toggleSlot(day, hour)}
                    className={cn(
                        "h-9 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95",
                        "border-2 border-transparent",
                        localSchedule[day]?.[hour]
                        ? "bg-gradient-to-br from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 shadow-md shadow-accent/20 border-accent/30"
                        : "bg-muted/30 hover:bg-muted/50 border-muted/50 hover:border-muted"
                    )}
                    aria-label={`Toggle ${day} at ${formatHour(hour)}`}
                    title={`${day} at ${formatHour(hour)}`}
                    />
                ))}
                </React.Fragment>
            ))}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
