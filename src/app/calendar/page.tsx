"use client";

import React, { useState, useCallback } from "react";
import Calendar from "react-calendar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCalendar } from "@/hooks/useCalendar";
import { useUserStore } from "@/store/store";
import { AuthGuard } from "@/components/auth-guard";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Calendar as CalendarIcon, Clock, User, AlertCircle } from "lucide-react";
import 'react-calendar/dist/Calendar.css';

interface Event {
  time: string;
  partyName: string;
  machineName: string;
  date?: string;
  eventDate?: string;
  reminderDate?: string;
}

interface EventsData {
  [date: string]: Event[];
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function CalendarPage() {
  return (
    <AuthGuard>
      <CalendarContent />
    </AuthGuard>
  );
}

function CalendarContent() {
  const { user } = useUserStore();
  const { data: calendarData, isLoading, error } = useCalendar();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const onDateChange = useCallback((value: Value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    } else if (Array.isArray(value) && value[0]) {
      setSelectedDate(value[0]);
    }
  }, []);

  const formatDateForKey = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const getEventsForDate = (date: Date | null): Event[] => {
    if (!date || !calendarData) return [];
    
    const dateKey = formatDateForKey(date);
    
    if (Array.isArray(calendarData)) {
      return calendarData.filter((event: any) => {
        const eventDate = event.date || event.eventDate || event.reminderDate;
        if (eventDate) {
          const eventDateKey = new Date(eventDate).toISOString().split('T')[0];
          return eventDateKey === dateKey;
        }
        return false;
      });
    } else if (typeof calendarData === 'object') {
      return calendarData[dateKey] || [];
    }
    
    return [];
  };

  const hasEventsOnDate = (date: Date): boolean => {
    return getEventsForDate(date).length > 0;
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && hasEventsOnDate(date)) {
      return 'has-events';
    }
    return null;
  };

  const renderEvents = () => {
    const dayEvents = getEventsForDate(selectedDate);

    if (dayEvents.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CalendarIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-sm">
            No events scheduled for this day
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {dayEvents.map((event: Event, index: number) => (
          <Card key={index} className="border-l-3 border-l-primary/30 hover:border-l-primary/50 hover:shadow-sm transition-all duration-200 rounded-md">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-sm">
                  <Clock className="h-3 w-3 mr-1" />
                  {event.time}
                </div>
                <Badge 
                  variant={event.machineName === "Lead Reminder" ? "default" : "secondary"}
                  className={`text-xs px-2 py-0.5 rounded-sm font-medium ${
                    event.machineName === "Lead Reminder" 
                      ? "bg-blue-500 hover:bg-blue-600 text-white border-0" 
                      : "bg-green-50 text-green-700 hover:bg-green-100 border-green-200/50"
                  }`}
                >
                  {event.machineName === "Lead Reminder" ? "Lead" : "Follow-up"}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center">
                  <User className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                  <h3 className="font-medium text-sm text-foreground leading-tight">{event.partyName}</h3>
                </div>
                <p className="text-xs text-muted-foreground pl-5 leading-relaxed">{event.machineName}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Calendar</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex-none px-6 py-6 border-b bg-gradient-to-r from-background to-muted/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CalendarIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
                  <p className="text-sm text-muted-foreground">
                    View and manage your events and reminders
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">Loading calendar...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <Card className="w-full max-w-md mx-4">
                    <CardContent className="flex flex-col items-center gap-4 p-6">
                      <AlertCircle className="h-12 w-12 text-destructive" />
                      <div className="text-center">
                        <h3 className="font-semibold mb-2">Failed to load calendar</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          There was an error loading your calendar data.
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={() => window.location.reload()}
                        >
                          Try Again
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 h-full">
                  {/* Calendar Section */}
                  <div className="lg:col-span-2">
                    <Card className="h-full">
                      <CardContent className="p-6">
                        <Calendar
                          onChange={onDateChange}
                          value={selectedDate}
                          tileClassName={tileClassName}
                          className="modern-calendar"
                          locale="en-US"
                          calendarType="gregory"
                          showNeighboringMonth={true}
                          minDetail="month"
                          maxDetail="month"
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Events Section */}
                  <div className="lg:col-span-1">
                    <Card className="h-full">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <CalendarIcon className="h-5 w-5" />
                          {selectedDate?.toLocaleDateString('en-US', { 
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {renderEvents()}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>

      <style jsx global>{`
        /* Modern Calendar Styling */
        .modern-calendar {
          width: 100%;
          border: none;
          font-family: inherit;
          background: transparent;
        }

        /* Navigation */
        .modern-calendar .react-calendar__navigation {
          display: flex;
          height: 48px;
          margin-bottom: 1.5rem;
          gap: 0.5rem;
        }

        .modern-calendar .react-calendar__navigation button {
          min-width: 44px;
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          color: hsl(var(--foreground));
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .modern-calendar .react-calendar__navigation button:hover:enabled {
          background: hsl(var(--accent));
          border-color: hsl(var(--accent-foreground));
        }

        .modern-calendar .react-calendar__navigation button:disabled {
          background: hsl(var(--muted));
          color: hsl(var(--muted-foreground));
          cursor: not-allowed;
        }

        /* Month view */
        .modern-calendar .react-calendar__month-view {
          width: 100%;
        }

        /* Weekdays */
        .modern-calendar .react-calendar__month-view__weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          margin-bottom: 1rem;
          padding: 0;
        }

        .modern-calendar .react-calendar__month-view__weekdays__weekday {
          text-align: center;
          text-transform: uppercase;
          font-weight: 600;
          font-size: 12px;
          color: hsl(var(--muted-foreground));
          padding: 0.75rem 0;
          border-bottom: 1px solid hsl(var(--border));
        }

        /* Days grid */
        .modern-calendar .react-calendar__month-view__days {
          display: grid !important;
          grid-template-columns: repeat(7, 1fr) !important;
          gap: 4px;
          width: 100%;
        }

        /* Individual day tiles */
        .modern-calendar .react-calendar__tile {
          width: 100% !important;
          height: 48px !important;
          border: 1px solid transparent;
          border-radius: 8px;
          background: transparent;
          color: hsl(var(--foreground));
          font-size: 14px;
          font-weight: 500;
          display: flex !important;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          cursor: pointer;
          position: relative;
        }

        .modern-calendar .react-calendar__tile:hover:enabled {
          background: hsl(var(--accent));
          border-color: hsl(var(--border));
        }

        .modern-calendar .react-calendar__tile--active {
          background: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
          border-color: hsl(var(--primary));
        }

        .modern-calendar .react-calendar__tile--now {
          background: hsl(var(--secondary));
          color: hsl(var(--secondary-foreground));
          border-color: hsl(var(--border));
        }

        .modern-calendar .react-calendar__tile--neighboringMonth {
          color: hsl(var(--muted-foreground));
          opacity: 0.5;
        }

        /* Weekend styling */
        .modern-calendar .react-calendar__month-view__days__day:nth-child(7n),
        .modern-calendar .react-calendar__month-view__days__day:nth-child(7n+1) {
          color: hsl(var(--destructive));
        }

        /* Events indicator */
        .modern-calendar .react-calendar__tile.has-events {
          background: hsl(var(--primary) / 0.08) !important;
          border: 1px solid hsl(var(--primary) / 0.2) !important;
          position: relative;
        }

        .modern-calendar .react-calendar__tile.has-events::after {
          content: '';
          position: absolute;
          bottom: 3px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: hsl(var(--primary));
          border-radius: 50%;
        }

        .modern-calendar .react-calendar__tile.has-events:hover {
          background: hsl(var(--primary) / 0.12) !important;
          border-color: hsl(var(--primary) / 0.3) !important;
        }

        .modern-calendar .react-calendar__tile.has-events.react-calendar__tile--active {
          background: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
          border-color: hsl(var(--primary)) !important;
        }

        .modern-calendar .react-calendar__tile.has-events.react-calendar__tile--active::after {
          background: hsl(var(--primary-foreground));
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .modern-calendar .react-calendar__tile {
            height: 40px !important;
            font-size: 13px;
          }
          
          .modern-calendar .react-calendar__month-view__weekdays__weekday {
            font-size: 11px;
            padding: 0.5rem 0;
          }
        }
      `}</style>
    </SidebarProvider>
  );
}