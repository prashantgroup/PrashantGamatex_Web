"use client";

import React, { useState, useCallback } from "react";
import Calendar from "react-calendar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCalendar } from "@/hooks/useCalendar";
import { useUserStore } from "@/store/store";
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
import { Calendar as CalendarIcon, Clock, User } from "lucide-react";
import 'react-calendar/dist/Calendar.css';

interface Event {
  time: string;
  partyName: string;
  machineName: string;
}

interface EventsData {
  [date: string]: Event[];
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function CalendarPage() {
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

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  const formatDateForKey = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const renderEvents = () => {
    if (!selectedDate || !calendarData) return null;
    
    const dateKey = formatDateForKey(selectedDate);
    const dayEvents = calendarData[dateKey] || [];

    if (dayEvents.length === 0) {
      return (
        <div className="py-8 text-center">
          <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg">
            No events planned for this day
          </p>
        </div>
      );
    }

    return dayEvents.map((event: Event, index: number) => (
      <Card key={index} className="mb-4 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1.5 h-4 w-4" />
              {event.time}
            </div>
            {event.machineName === "Lead Reminder" ? (
              <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                Lead
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                Followup
              </Badge>
            )}
          </div>
          <div className="flex items-center mb-1">
            <User className="mr-1.5 h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-lg">{event.partyName}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{event.machineName}</p>
        </CardContent>
      </Card>
    ));
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && calendarData) {
      const dateKey = formatDateForKey(date);
      if (calendarData[dateKey] && calendarData[dateKey].length > 0) {
        return 'has-events';
      }
    }
    return null;
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Calendar</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          {/* Header */}
          <div className="px-6 py-6 border-b">
            <div className="flex items-center gap-3 mb-2">
              <CalendarIcon className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Calendar</h1>
            </div>
            <p className="text-muted-foreground">View and manage all your events and reminders</p>
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading calendar...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-destructive">Failed to load calendar data</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              {/* Calendar Section */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <div className="calendar-container">
                      <Calendar
                        onChange={onDateChange}
                        value={selectedDate}
                        tileClassName={tileClassName}
                        className="react-calendar-custom"
                        locale="en-US"
                        calendarType="iso8601"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Events Section */}
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    Events for {selectedDate?.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h2>
                  <div className="space-y-4">
                    {renderEvents()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>

      <style jsx global>{`
        .calendar-container .react-calendar-custom {
          width: 100%;
          border: none;
          font-family: inherit;
        }
        
        .react-calendar-custom .react-calendar__navigation {
          display: flex;
          height: 44px;
          margin-bottom: 1rem;
        }
        
        .react-calendar-custom .react-calendar__navigation button {
          min-width: 44px;
          background: none;
          border: 1px solid hsl(var(--border));
          border-radius: 6px;
          color: hsl(var(--foreground));
          font-size: 16px;
          font-weight: 600;
        }
        
        .react-calendar-custom .react-calendar__navigation button:hover {
          background-color: hsl(var(--accent));
        }
        
        .react-calendar-custom .react-calendar__navigation button:disabled {
          background-color: hsl(var(--muted));
          color: hsl(var(--muted-foreground));
        }
        
        .react-calendar-custom .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: 600;
          font-size: 0.75rem;
          color: hsl(var(--muted-foreground));
          margin-bottom: 0.5rem;
        }
        
        .react-calendar-custom .react-calendar__month-view__weekdays__weekday {
          padding: 0.5rem;
        }
        
        .react-calendar-custom .react-calendar__month-view__days__day {
          border-radius: 6px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          margin: 1px;
          border: 1px solid transparent;
        }
        
        .react-calendar-custom .react-calendar__month-view__days__day:hover {
          background-color: hsl(var(--accent));
        }
        
        .react-calendar-custom .react-calendar__month-view__days__day--active {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }
        
        .react-calendar-custom .react-calendar__month-view__days__day--neighboringMonth {
          color: hsl(var(--muted-foreground));
        }
        
        .react-calendar-custom .react-calendar__tile.has-events {
          background-color: hsl(var(--primary) / 0.1);
          border: 1px solid hsl(var(--primary) / 0.3);
          position: relative;
        }
        
        .react-calendar-custom .react-calendar__tile.has-events::after {
          content: '';
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 6px;
          height: 6px;
          background-color: hsl(var(--primary));
          border-radius: 50%;
        }
        
        .react-calendar-custom .react-calendar__tile.has-events.react-calendar__month-view__days__day--active::after {
          background-color: hsl(var(--primary-foreground));
        }
      `}</style>
    </SidebarProvider>
  );
}
