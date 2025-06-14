
import React from 'react';
import Navigation from '@/components/Navigation';
import EnhancedDashboard from '@/components/EnhancedDashboard';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto p-6">
        <EnhancedDashboard />
      </main>
    </div>
  );
};

export default Index;
