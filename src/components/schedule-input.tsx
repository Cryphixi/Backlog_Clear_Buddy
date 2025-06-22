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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Your Weekly Schedule
        </CardTitle>
        <CardDescription>Select your available gaming slots below. Click a slot to toggle it.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-1 text-center font-bold text-sm text-muted-foreground pb-2">
          <div></div>
          {days.map(day => <div key={day}>{day}</div>)}
        </div>
        <div className="flex-grow overflow-y-auto pr-2">
            <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-1 text-center">
            {hours.map(hour => (
                <React.Fragment key={hour}>
                <div className="text-sm text-muted-foreground pr-2 flex items-center justify-end">
                    {formatHour(hour)}
                </div>
                {days.map(day => (
                    <button
                    key={`${day}-${hour}`}
                    onClick={() => toggleSlot(day, hour)}
                    className={cn(
                        "h-8 rounded-md transition-colors duration-200 ease-in-out",
                        localSchedule[day]?.[hour]
                        ? "bg-accent hover:bg-accent/80"
                        : "bg-muted/50 hover:bg-muted"
                    )}
                    aria-label={`Toggle ${day} at ${hour}:00`}
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
