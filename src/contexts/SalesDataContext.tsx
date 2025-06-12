
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Contact {
  id: number;
  name: string;
  position: string;
  email: string;
  phone: string;
  linkedin: string;
}

interface Note {
  id: number;
  content: string;
  author: string;
  timestamp: Date;
}

interface SalesOpportunity {
  id: number;
  name: string;
  salesperson: string;
  leadSource: string;
  contacts: Contact[];
  discovery1Date?: Date;
  discovery2Date?: Date;
  discovery3Date?: Date;
  closing1Date?: Date;
  closing2Date?: Date;
  closing3Date?: Date;
  discovery1Duration?: number;
  discovery2Duration?: number;
  discovery3Duration?: number;
  closing1Duration?: number;
  closing2Duration?: number;
  closing3Duration?: number;
  discovery1Link?: string;
  discovery2Link?: string;
  discovery3Link?: string;
  closing1Link?: string;
  closing2Link?: string;
  closing3Link?: string;
  proposalStatus: 'not-created' | 'created' | 'pitched';
  opportunityStatus: 'active' | 'won' | 'lost';
  revenue: number;
  cashCollected: number;
  notes: Note[];
  files: File[];
}

interface Salesperson {
  id: number;
  name: string;
}

interface LeadSource {
  id: number;
  name: string;
}

interface SalesDataContextType {
  opportunities: SalesOpportunity[];
  setOpportunities: React.Dispatch<React.SetStateAction<SalesOpportunity[]>>;
  salespersons: Salesperson[];
  setSalespersons: React.Dispatch<React.SetStateAction<Salesperson[]>>;
  leadSources: LeadSource[];
  setLeadSources: React.Dispatch<React.SetStateAction<LeadSource[]>>;
  getMetrics: () => any;
  getTrendData: () => any[];
}

const SalesDataContext = createContext<SalesDataContextType | undefined>(undefined);

export const useSalesData = () => {
  const context = useContext(SalesDataContext);
  if (!context) {
    throw new Error('useSalesData must be used within a SalesDataProvider');
  }
  return context;
};

export const SalesDataProvider = ({ children }: { children: ReactNode }) => {
  const [opportunities, setOpportunities] = useState<SalesOpportunity[]>([
    {
      id: 1,
      name: 'ABC Corporation Deal',
      salesperson: 'John Smith',
      leadSource: 'Website',
      contacts: [
        { id: 1, name: 'Jane Doe', position: 'CEO', email: 'jane@abc.com', phone: '+1234567890', linkedin: 'linkedin.com/in/janedoe' }
      ],
      discovery1Date: new Date('2024-05-15'),
      discovery2Date: new Date('2024-05-20'),
      closing1Date: new Date('2024-05-25'),
      discovery1Duration: 45,
      discovery2Duration: 38,
      closing1Duration: 52,
      proposalStatus: 'pitched',
      opportunityStatus: 'active',
      revenue: 15000,
      cashCollected: 5000,
      notes: [
        { id: 1, content: 'Initial meeting went well', author: 'John Smith', timestamp: new Date('2024-05-15') }
      ],
      files: []
    },
    {
      id: 2,
      name: 'XYZ Company Project',
      salesperson: 'Sarah Johnson',
      leadSource: 'Referral',
      contacts: [
        { id: 2, name: 'Bob Wilson', position: 'CTO', email: 'bob@xyz.com', phone: '+1987654321', linkedin: 'linkedin.com/in/bobwilson' }
      ],
      discovery1Date: new Date('2024-06-01'),
      discovery2Date: new Date('2024-06-05'),
      discovery3Date: new Date('2024-06-10'),
      closing1Date: new Date('2024-06-15'),
      discovery1Duration: 42,
      discovery2Duration: 35,
      discovery3Duration: 40,
      closing1Duration: 48,
      proposalStatus: 'created',
      opportunityStatus: 'won',
      revenue: 25000,
      cashCollected: 25000,
      notes: [],
      files: []
    }
  ]);

  const [salespersons, setSalespersons] = useState<Salesperson[]>([
    { id: 1, name: 'John Smith' },
    { id: 2, name: 'Sarah Johnson' },
    { id: 3, name: 'Mike Davis' }
  ]);

  const [leadSources, setLeadSources] = useState<LeadSource[]>([
    { id: 1, name: 'Website' },
    { id: 2, name: 'Referral' },
    { id: 3, name: 'Cold Outreach' }
  ]);

  const getMetrics = () => {
    const totalCalls = opportunities.reduce((sum, opp) => {
      let callCount = 0;
      if (opp.discovery1Date) callCount++;
      if (opp.discovery2Date) callCount++;
      if (opp.discovery3Date) callCount++;
      if (opp.closing1Date) callCount++;
      if (opp.closing2Date) callCount++;
      if (opp.closing3Date) callCount++;
      return sum + callCount;
    }, 0);

    const totalRevenue = opportunities.reduce((sum, opp) => sum + opp.revenue, 0);
    const totalCashCollected = opportunities.reduce((sum, opp) => sum + opp.cashCollected, 0);
    
    const discovery1Calls = opportunities.filter(opp => opp.discovery1Date).length;
    const discovery2Calls = opportunities.filter(opp => opp.discovery2Date).length;
    const discovery3Calls = opportunities.filter(opp => opp.discovery3Date).length;
    const closing1Calls = opportunities.filter(opp => opp.closing1Date).length;
    const closing2Calls = opportunities.filter(opp => opp.closing2Date).length;
    const closing3Calls = opportunities.filter(opp => opp.closing3Date).length;

    const avgDiscovery1Duration = opportunities
      .filter(opp => opp.discovery1Duration)
      .reduce((sum, opp, _, arr) => sum + (opp.discovery1Duration || 0) / arr.length, 0);
    
    const avgDiscovery2Duration = opportunities
      .filter(opp => opp.discovery2Duration)
      .reduce((sum, opp, _, arr) => sum + (opp.discovery2Duration || 0) / arr.length, 0);
    
    const avgDiscovery3Duration = opportunities
      .filter(opp => opp.discovery3Duration)
      .reduce((sum, opp, _, arr) => sum + (opp.discovery3Duration || 0) / arr.length, 0);
    
    const avgClosing1Duration = opportunities
      .filter(opp => opp.closing1Duration)
      .reduce((sum, opp, _, arr) => sum + (opp.closing1Duration || 0) / arr.length, 0);
    
    const avgClosing2Duration = opportunities
      .filter(opp => opp.closing2Duration)
      .reduce((sum, opp, _, arr) => sum + (opp.closing2Duration || 0) / arr.length, 0);
    
    const avgClosing3Duration = opportunities
      .filter(opp => opp.closing3Duration)
      .reduce((sum, opp, _, arr) => sum + (opp.closing3Duration || 0) / arr.length, 0);

    const proposalsCreated = opportunities.filter(opp => 
      opp.proposalStatus === 'created' || opp.proposalStatus === 'pitched'
    ).length;
    
    const proposalsPitched = opportunities.filter(opp => 
      opp.proposalStatus === 'pitched'
    ).length;

    const overallShowUpRate = totalCalls > 0 ? 85.5 : 0; // Mock calculation

    return {
      totalCalls,
      overallShowUpRate,
      totalRevenue,
      totalCashCollected,
      discovery1Calls,
      discovery2Calls,
      discovery3Calls,
      closing1Calls,
      closing2Calls,
      closing3Calls,
      avgDiscovery1Duration: Math.round(avgDiscovery1Duration),
      avgDiscovery2Duration: Math.round(avgDiscovery2Duration),
      avgDiscovery3Duration: Math.round(avgDiscovery3Duration),
      avgClosing1Duration: Math.round(avgClosing1Duration),
      avgClosing2Duration: Math.round(avgClosing2Duration),
      avgClosing3Duration: Math.round(avgClosing3Duration),
      proposalsCreated,
      proposalsPitched
    };
  };

  const getTrendData = () => {
    // Generate trend data based on opportunities dates
    const monthlyData: { [key: string]: any } = {};
    
    opportunities.forEach(opp => {
      const dates = [
        opp.discovery1Date,
        opp.discovery2Date,
        opp.discovery3Date,
        opp.closing1Date,
        opp.closing2Date,
        opp.closing3Date
      ].filter(Boolean);

      dates.forEach(date => {
        if (date) {
          const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
              month: monthKey,
              cashCollected: 0,
              revenue: 0,
              totalCalls: 0,
              leadsWebsite: 0,
              leadsReferral: 0,
              leadsColdOutreach: 0
            };
          }
          
          monthlyData[monthKey].totalCalls += 1;
          monthlyData[monthKey].cashCollected += opp.cashCollected / dates.length;
          monthlyData[monthKey].revenue += opp.revenue / dates.length;
          
          if (opp.leadSource === 'Website') monthlyData[monthKey].leadsWebsite += 1;
          if (opp.leadSource === 'Referral') monthlyData[monthKey].leadsReferral += 1;
          if (opp.leadSource === 'Cold Outreach') monthlyData[monthKey].leadsColdOutreach += 1;
        }
      });
    });

    return Object.values(monthlyData);
  };

  return (
    <SalesDataContext.Provider value={{
      opportunities,
      setOpportunities,
      salespersons,
      setSalespersons,
      leadSources,
      setLeadSources,
      getMetrics,
      getTrendData
    }}>
      {children}
    </SalesDataContext.Provider>
  );
};
