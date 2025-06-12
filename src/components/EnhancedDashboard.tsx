import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { TrendingUp, Users, Phone, DollarSign, Target, Clock, BarChart3, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useSalesData } from '@/contexts/SalesDataContext';

const EnhancedDashboard = () => {
  const { opportunities, salespersons, getMetrics, getTrendData } = useSalesData();
  const [selectedSalesperson, setSelectedSalesperson] = useState<string>('all');
  const [selectedLeadSource, setSelectedLeadSource] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['cashCollected', 'revenue', 'totalCalls']);

  // Get real data from context
  const trendData = getTrendData();
  const metrics = getMetrics();

  // Calculate salesperson performance from real data
  const salespersonData = salespersons.map(person => {
    const personOpps = opportunities.filter(opp => opp.salesperson === person.name);
    const totalCalls = personOpps.reduce((sum, opp) => {
      let callCount = 0;
      if (opp.discovery1Date) callCount++;
      if (opp.discovery2Date) callCount++;
      if (opp.discovery3Date) callCount++;
      if (opp.closing1Date) callCount++;
      if (opp.closing2Date) callCount++;
      if (opp.closing3Date) callCount++;
      return sum + callCount;
    }, 0);
    
    const revenue = personOpps.reduce((sum, opp) => sum + opp.revenue, 0);
    const cashCollected = personOpps.reduce((sum, opp) => sum + opp.cashCollected, 0);
    const wonOpps = personOpps.filter(opp => opp.opportunityStatus === 'won').length;
    const totalOpps = personOpps.length;
    const closingRate = totalOpps > 0 ? (wonOpps / totalOpps) * 100 : 0;

    return {
      name: person.name,
      totalCalls,
      revenue,
      cashCollected,
      closingRate: parseFloat(closingRate.toFixed(1))
    };
  });

  // Calculate lead source distribution from real data
  const leadSourceData = [
    { name: 'Website', value: opportunities.filter(opp => opp.leadSource === 'Website').length, color: '#8884d8' },
    { name: 'Referral', value: opportunities.filter(opp => opp.leadSource === 'Referral').length, color: '#82ca9d' },
    { name: 'Cold Outreach', value: opportunities.filter(opp => opp.leadSource === 'Cold Outreach').length, color: '#ffc658' }
  ].filter(item => item.value > 0);

  // Filter data based on selected month
  const getFilteredData = () => {
    if (selectedMonth === 'all') return trendData;
    return trendData.filter(data => data.month.toLowerCase() === selectedMonth);
  };

  // Get months that have data
  const getAvailableMonths = () => {
    return trendData.map(data => data.month);
  };

  const MetricCard = ({ title, value, unit = '', icon: Icon, trend, className = '' }: any) => (
    <Card className={`transition-all hover:shadow-lg ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === 'number' ? value.toLocaleString() : value}{unit}
        </div>
        {trend && (
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">↗ {trend}%</span> from last month
          </p>
        )}
      </CardContent>
    </Card>
  );

  const SmallMetricCard = ({ title, value, unit = '', icon: Icon, className = '' }: any) => (
    <Card className={`transition-all hover:shadow-lg ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
        <CardTitle className="text-xs font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-3 w-3 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-lg font-bold">
          {typeof value === 'number' ? value.toLocaleString() : value}{unit}
        </div>
      </CardContent>
    </Card>
  );

  const metricOptions = [
    { id: 'cashCollected', label: 'Cash Collected', color: '#8884d8' },
    { id: 'revenue', label: 'Revenue', color: '#82ca9d' },
    { id: 'totalCalls', label: 'Total Calls', color: '#ffc658' },
    { id: 'leadsWebsite', label: 'Website Leads', color: '#ff7300' },
    { id: 'leadsReferral', label: 'Referral Leads', color: '#00ff00' },
    { id: 'leadsColdOutreach', label: 'Cold Outreach Leads', color: '#ff0000' }
  ];

  const availableMonths = getAvailableMonths();

  return (
    <div className="space-y-10 px-2 md:px-6 py-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Enhanced Sales Dashboard</h1>
        <p className="text-lg text-gray-500 mt-1">Comprehensive sales performance and KPI tracking</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <Select value={selectedSalesperson} onValueChange={setSelectedSalesperson}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Salesperson" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Salespersons</SelectItem>
            {salespersons.map((person) => (
              <SelectItem key={person.id} value={person.name.toLowerCase().replace(' ', '')}>{person.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedLeadSource} onValueChange={setSelectedLeadSource}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Lead Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Lead Sources</SelectItem>
            <SelectItem value="website">Website</SelectItem>
            <SelectItem value="referral">Referral</SelectItem>
            <SelectItem value="cold">Cold Outreach</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Months</SelectItem>
            {availableMonths.map((month) => (
              <SelectItem key={month} value={month.toLowerCase()}>{month}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Key Metrics - 6 cards in a row */}
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
        <MetricCard
          title="Total Calls"
          value={metrics.totalCalls}
          icon={Phone}
          trend={12.5}
          className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200 border-0"
        />
        <MetricCard
          title="Overall Show-Up Rate"
          value={metrics.overallShowUpRate}
          unit="%"
          icon={Target}
          trend={3.2}
          className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200 border-0"
        />
        <MetricCard
          title="Total Revenue"
          value={`$${(metrics.totalRevenue / 1000).toFixed(0)}K`}
          icon={DollarSign}
          trend={15.8}
          className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200 border-0"
        />
        <MetricCard
          title="Cash Collected"
          value={`$${(metrics.totalCashCollected / 1000).toFixed(0)}K`}
          icon={DollarSign}
          trend={8.5}
          className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200 border-0"
        />
        <MetricCard
          title="Proposals Created"
          value={metrics.proposalsCreated}
          icon={FileText}
          trend={10.2}
          className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200 border-0"
        />
        <MetricCard
          title="Proposals Pitched"
          value={metrics.proposalsPitched}
          icon={FileText}
          trend={7.8}
          className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200 border-0"
        />
      </div>

      {/* Show-Up Rates Section */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-gray-900">Show-Up Rates</h3>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <SmallMetricCard
            title="Discovery 1 Show-Up"
            value={metrics.discovery1ShowUpRate}
            unit="%"
            icon={Target}
            className="bg-blue-50 rounded-xl shadow border-0"
          />
          <SmallMetricCard
            title="Discovery 2 Show-Up"
            value={metrics.discovery2ShowUpRate}
            unit="%"
            icon={Target}
            className="bg-blue-50 rounded-xl shadow border-0"
          />
          <SmallMetricCard
            title="Discovery 3 Show-Up"
            value={metrics.discovery3ShowUpRate}
            unit="%"
            icon={Target}
            className="bg-blue-50 rounded-xl shadow border-0"
          />
          <SmallMetricCard
            title="Closing 1 Show-Up"
            value={metrics.closing1ShowUpRate}
            unit="%"
            icon={Target}
            className="bg-green-50 rounded-xl shadow border-0"
          />
          <SmallMetricCard
            title="Closing 2 Show-Up"
            value={metrics.closing2ShowUpRate}
            unit="%"
            icon={Target}
            className="bg-green-50 rounded-xl shadow border-0"
          />
          <SmallMetricCard
            title="Closing 3 Show-Up"
            value={metrics.closing3ShowUpRate}
            unit="%"
            icon={Target}
            className="bg-green-50 rounded-xl shadow border-0"
          />
        </div>
      </div>

      {/* Trend Analysis Chart */}
      <Card className="bg-white rounded-xl shadow-lg p-2 md:p-6 border-0">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-2xl font-bold text-gray-900">Monthly Trend Analysis</CardTitle>
            <div className="flex gap-4 flex-wrap items-center">
              <div className="text-sm text-gray-600">Select Metrics:</div>
              <div className="flex gap-2 flex-wrap">
                {metricOptions.map((metric) => (
                  <div key={metric.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={metric.id}
                      checked={selectedMetrics.includes(metric.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedMetrics([...selectedMetrics, metric.id]);
                        } else {
                          setSelectedMetrics(selectedMetrics.filter(m => m !== metric.id));
                        }
                      }}
                    />
                    <label htmlFor={metric.id} className="text-sm">{metric.label}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={getFilteredData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {selectedMetrics.map((metricId) => {
                  const metric = metricOptions.find(m => m.id === metricId);
                  return metric ? (
                    <Line
                      key={metricId}
                      type="monotone"
                      dataKey={metricId}
                      stroke={metric.color}
                      strokeWidth={3}
                      name={metric.label}
                    />
                  ) : null;
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Salesperson Performance */}
        <Card className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200 border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <Users className="h-5 w-5 text-blue-500" />
              Individual Salesperson Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salespersonData.map((person, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-semibold mb-2 text-gray-800">{person.name}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Total Calls:</span>
                      <span className="font-bold ml-2 text-gray-900">{person.totalCalls}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Revenue:</span>
                      <span className="font-bold ml-2 text-green-700">${person.revenue.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Cash Collected:</span>
                      <span className="font-bold ml-2 text-blue-700">${person.cashCollected.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Closing Rate:</span>
                      <span className="font-bold ml-2 text-purple-700">{person.closingRate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lead Source Distribution */}
        <Card className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200 border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Lead Source Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={leadSourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {leadSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call Type Metrics - Smaller cards at the bottom */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-gray-900">Call Details</h3>
        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6">
          <SmallMetricCard
            title="Discovery 1 Calls"
            value={metrics.discovery1Calls}
            icon={Phone}
            className="bg-blue-50 rounded-xl shadow border-0"
          />
          <SmallMetricCard
            title="Discovery 2 Calls"
            value={metrics.discovery2Calls}
            icon={Phone}
            className="bg-blue-50 rounded-xl shadow border-0"
          />
          <SmallMetricCard
            title="Discovery 3 Calls"
            value={metrics.discovery3Calls}
            icon={Phone}
            className="bg-blue-50 rounded-xl shadow border-0"
          />
          <SmallMetricCard
            title="Closing 1 Calls"
            value={metrics.closing1Calls}
            icon={Phone}
            className="bg-green-50 rounded-xl shadow border-0"
          />
          <SmallMetricCard
            title="Closing 2 Calls"
            value={metrics.closing2Calls}
            icon={Phone}
            className="bg-green-50 rounded-xl shadow border-0"
          />
          <SmallMetricCard
            title="Closing 3 Calls"
            value={metrics.closing3Calls}
            icon={Phone}
            className="bg-green-50 rounded-xl shadow border-0"
          />
        </div>
      </div>

      {/* Average Call Duration Metrics - Smaller cards at the bottom */}
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6 mt-6">
        <SmallMetricCard
          title="Avg Discovery 1 Duration"
          value={metrics.avgDiscovery1Duration}
          unit=" min"
          icon={Clock}
          className="bg-purple-50 rounded-xl shadow border-0"
        />
        <SmallMetricCard
          title="Avg Discovery 2 Duration"
          value={metrics.avgDiscovery2Duration}
          unit=" min"
          icon={Clock}
          className="bg-purple-50 rounded-xl shadow border-0"
        />
        <SmallMetricCard
          title="Avg Discovery 3 Duration"
          value={metrics.avgDiscovery3Duration}
          unit=" min"
          icon={Clock}
          className="bg-purple-50 rounded-xl shadow border-0"
        />
        <SmallMetricCard
          title="Avg Closing 1 Duration"
          value={metrics.avgClosing1Duration}
          unit=" min"
          icon={Clock}
          className="bg-orange-50 rounded-xl shadow border-0"
        />
        <SmallMetricCard
          title="Avg Closing 2 Duration"
          value={metrics.avgClosing2Duration}
          unit=" min"
          icon={Clock}
          className="bg-orange-50 rounded-xl shadow border-0"
        />
        <SmallMetricCard
          title="Avg Closing 3 Duration"
          value={metrics.avgClosing3Duration}
          unit=" min"
          icon={Clock}
          className="bg-orange-50 rounded-xl shadow border-0"
        />
      </div>
    </div>
  );
};

export default EnhancedDashboard;
