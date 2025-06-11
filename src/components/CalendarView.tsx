
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

interface CallEvent {
  id: number;
  clientName: string;
  callType: 'discovery' | 'closing';
  callNumber: number;
  date: Date;
  duration?: number;
  status: 'completed' | 'scheduled';
}

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Mock call events - in real app this would come from API
  const callEvents: CallEvent[] = [
    {
      id: 1,
      clientName: 'ABC Corporation',
      callType: 'discovery',
      callNumber: 1,
      date: new Date('2024-06-15'),
      duration: 45,
      status: 'completed'
    },
    {
      id: 2,
      clientName: 'ABC Corporation',
      callType: 'discovery',
      callNumber: 2,
      date: new Date('2024-06-20'),
      duration: 38,
      status: 'completed'
    },
    {
      id: 3,
      clientName: 'Tech Startup Inc',
      callType: 'discovery',
      callNumber: 1,
      date: new Date('2024-06-18'),
      duration: 32,
      status: 'completed'
    },
    {
      id: 4,
      clientName: 'ABC Corporation',
      callType: 'closing',
      callNumber: 1,
      date: new Date('2024-06-25'),
      duration: 52,
      status: 'completed'
    },
    {
      id: 5,
      clientName: 'New Client Corp',
      callType: 'discovery',
      callNumber: 1,
      date: new Date('2024-06-28'),
      status: 'scheduled'
    },
    {
      id: 6,
      clientName: 'Tech Startup Inc',
      callType: 'closing',
      callNumber: 1,
      date: new Date('2024-06-30'),
      status: 'scheduled'
    }
  ];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day: Date) => {
    return callEvents.filter(event => isSameDay(event.date, day));
  };

  const getCallTypeColor = (callType: 'discovery' | 'closing', status: 'completed' | 'scheduled') => {
    if (status === 'scheduled') {
      return callType === 'discovery' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
    }
    return callType === 'discovery' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Call Calendar</h1>
        <p className="text-muted-foreground">Track all your scheduled and completed calls</p>
      </div>

      {/* Calendar Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {format(currentDate, 'MMMM yyyy')}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="space-y-4">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center font-medium text-muted-foreground text-sm">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map(day => {
                const dayEvents = getEventsForDay(day);
                const isToday = isSameDay(day, new Date());
                
                return (
                  <div
                    key={day.toISOString()}
                    className={`min-h-[120px] p-2 border rounded-lg ${
                      isSameMonth(day, currentDate) 
                        ? 'bg-background' 
                        : 'bg-muted/30 text-muted-foreground'
                    } ${isToday ? 'ring-2 ring-primary' : ''}`}
                  >
                    <div className={`text-sm font-medium mb-2 ${isToday ? 'text-primary' : ''}`}>
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.map(event => (
                        <div
                          key={event.id}
                          className={`p-1 rounded text-xs ${getCallTypeColor(event.callType, event.status)}`}
                        >
                          <div className="font-medium truncate">{event.clientName}</div>
                          <div className="flex items-center justify-between">
                            <span>{event.callType} {event.callNumber}</span>
                            {event.duration && (
                              <span>{event.duration}m</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100"></div>
              <span className="text-sm">Discovery Call (Completed)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-100"></div>
              <span className="text-sm">Closing Call (Completed)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-100"></div>
              <span className="text-sm">Discovery Call (Scheduled)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-100"></div>
              <span className="text-sm">Closing Call (Scheduled)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Calls */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {callEvents
              .filter(event => event.status === 'scheduled')
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .map(event => (
                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{event.clientName}</div>
                    <div className="text-sm text-muted-foreground">
                      {event.callType === 'discovery' ? 'Discovery' : 'Closing'} Call {event.callNumber}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{format(event.date, 'MMM dd, yyyy')}</div>
                    <Badge variant="outline" className={getCallTypeColor(event.callType, event.status)}>
                      Scheduled
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
