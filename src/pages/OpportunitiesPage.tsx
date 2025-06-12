
import React from 'react';
import Navigation from '@/components/Navigation';
import SalesOpportunityInput from '@/components/SalesOpportunityInput';

const OpportunitiesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto p-6">
        <SalesOpportunityInput />
      </main>
    </div>
  );
};

export default OpportunitiesPage;
