import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { TrendingUp, Users, Phone, DollarSign, Target, Clock, BarChart3, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const EnhancedDashboard = () => {
  const [selectedSalesperson, setSelectedSalesperson] = useState<string>('all');
  const [selectedLeadSource, setSelectedLeadSource] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['cashCollected', 'revenue', 'totalCalls']);

  // Mock data - in real app this would come from API
  const trendData = [
    { month: 'Jan', cashCollected: 45000, revenue: 60000, totalCalls: 120, leadsWebsite: 25, leadsReferral: 15, leadsColdOutreach: 10 },
    { month: 'Feb', cashCollected: 52000, revenue: 70000, totalCalls: 135, leadsWebsite: 30, leadsReferral: 18, leadsColdOutreach: 12 },
    { month: 'Mar', cashCollected: 48000, revenue: 65000, totalCalls: 128, leadsWebsite: 28, leadsReferral: 16, leadsColdOutreach: 11 },
    { month: 'Apr', cashCollected: 55000, revenue: 75000, totalCalls: 142, leadsWebsite: 32, leadsReferral: 20, leadsColdOutreach: 15 },
    { month: 'May', cashCollected: 61000, revenue: 82000, totalCalls: 155, leadsWebsite: 35, leadsReferral: 22, leadsColdOutreach: 18 },
    { month: 'Jun', cashCollected: 58000, revenue: 78000, totalCalls: 148, leadsWebsite: 33, leadsReferral: 21, leadsColdOutreach: 16 }
  ];

  const salespersonData = [
    { name: 'John Smith', totalCalls: 85, revenue: 45000, cashCollected: 32000, closingRate: 18.2 },
    { name: 'Sarah Johnson', totalCalls: 92, revenue: 52000, cashCollected: 38000, closingRate: 21.7 },
    { name: 'Mike Davis', totalCalls: 78, revenue: 38000, cashCollected: 28000, closingRate: 15.4 }
  ];

  const leadSourceData = [
    { name: 'Website', value: 45, color: '#8884d8' },
    { name: 'Referral', value: 30, color: '#82ca9d' },
    { name: 'Cold Outreach', value: 25, color: '#ffc658' }
  ];

  const metrics = {
    totalCalls: 255,
    overallShowUpRate: 87.3,
    totalRevenue: 195000,
    totalCashCollected: 145000,
    avgDiscoveryDuration: 38.5,
    avgClosingDuration: 48.3,
    discovery1Calls: 45,
    discovery2Calls: 38,
    discovery3Calls: 32,
    closing1Calls: 28,
    closing2Calls: 22,
    closing3Calls: 18,
    avgDiscovery1Duration: 42,
    avgDiscovery2Duration: 38,
    avgDiscovery3Duration: 35,
    avgClosing1Duration: 52,
    avgClosing2Duration: 48,
    avgClosing3Duration: 45,
    proposalsCreated: 24,
    proposalsPitched: 18
  };

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Enhanced Sales Dashboard</h1>
        <p className="text-muted-foreground">Comprehensive sales performance and KPI tracking</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Select value={selectedSalesperson} onValueChange={setSelectedSalesperson}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Salesperson" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Salespersons</SelectItem>
            <SelectItem value="john">John Smith</SelectItem>
            <SelectItem value="sarah">Sarah Johnson</SelectItem>
            <SelectItem value="mike">Mike Davis</SelectItem>
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

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Total Calls"
          value={metrics.totalCalls}
          icon={Phone}
          trend={12.5}
        />
        <MetricCard
          title="Overall Show-Up Rate"
          value={metrics.overallShowUpRate}
          unit="%"
          icon={Target}
          trend={3.2}
        />
        <MetricCard
          title="Total Revenue"
          value={`$${(metrics.totalRevenue / 1000).toFixed(0)}K`}
          icon={DollarSign}
          trend={15.8}
        />
        <MetricCard
          title="Cash Collected"
          value={`$${(metrics.totalCashCollected / 1000).toFixed(0)}K`}
          icon={DollarSign}
          trend={8.5}
        />
        <MetricCard
          title="Proposals Created"
          value={metrics.proposalsCreated}
          icon={FileText}
          trend={10.2}
        />
      </div>

      {/* Additional Key Metrics */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        <MetricCard
          title="Proposals Pitched"
          value={metrics.proposalsPitched}
          icon={FileText}
          trend={7.8}
        />
      </div>

      {/* Call Type Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Discovery 1 Calls"
          value={metrics.discovery1Calls}
          icon={Phone}
          className="bg-blue-50"
        />
        <MetricCard
          title="Discovery 2 Calls"
          value={metrics.discovery2Calls}
          icon={Phone}
          className="bg-blue-50"
        />
        <MetricCard
          title="Discovery 3 Calls"
          value={metrics.discovery3Calls}
          icon={Phone}
          className="bg-blue-50"
        />
        <MetricCard
          title="Closing 1 Calls"
          value={metrics.closing1Calls}
          icon={Phone}
          className="bg-green-50"
        />
        <MetricCard
          title="Closing 2 Calls"
          value={metrics.closing2Calls}
          icon={Phone}
          className="bg-green-50"
        />
        <MetricCard
          title="Closing 3 Calls"
          value={metrics.closing3Calls}
          icon={Phone}
          className="bg-green-50"
        />
      </div>

      {/* Average Call Duration Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Avg Discovery 1 Duration"
          value={metrics.avgDiscovery1Duration}
          unit=" min"
          icon={Clock}
          className="bg-purple-50"
        />
        <MetricCard
          title="Avg Discovery 2 Duration"
          value={metrics.avgDiscovery2Duration}
          unit=" min"
          icon={Clock}
          className="bg-purple-50"
        />
        <MetricCard
          title="Avg Discovery 3 Duration"
          value={metrics.avgDiscovery3Duration}
          unit=" min"
          icon={Clock}
          className="bg-purple-50"
        />
        <MetricCard
          title="Avg Closing 1 Duration"
          value={metrics.avgClosing1Duration}
          unit=" min"
          icon={Clock}
          className="bg-orange-50"
        />
        <MetricCard
          title="Avg Closing 2 Duration"
          value={metrics.avgClosing2Duration}
          unit=" min"
          icon={Clock}
          className="bg-orange-50"
        />
        <MetricCard
          title="Avg Closing 3 Duration"
          value={metrics.avgClosing3Duration}
          unit=" min"
          icon={Clock}
          className="bg-orange-50"
        />
      </div>

      {/* Trend Analysis Chart */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Monthly Trend Analysis</CardTitle>
            <div className="flex gap-4">
              <div className="text-sm">Select Metrics:</div>
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
                    strokeWidth={2}
                    name={metric.label}
                  />
                ) : null;
              })}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Salesperson Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Individual Salesperson Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salespersonData.map((person, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{person.name}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total Calls:</span>
                      <span className="font-medium ml-2">{person.totalCalls}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="font-medium ml-2">${person.revenue.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cash Collected:</span>
                      <span className="font-medium ml-2">${person.cashCollected.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Closing Rate:</span>
                      <span className="font-medium ml-2">{person.closingRate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lead Source Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Source Distribution</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
