
import React from 'react';
import Navigation from '@/components/Navigation';
import ClientInput from '@/components/ClientInput';

const ClientsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto p-6">
        <ClientInput />
      </main>
    </div>
  );
};

export default ClientsPage;
