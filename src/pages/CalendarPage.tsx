
import React from 'react';
import Navigation from '@/components/Navigation';
import CalendarView from '@/components/CalendarView';

const CalendarPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto p-6">
        <CalendarView />
      </main>
    </div>
  );
};

export default CalendarPage;
