import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Phone, DollarSign, Target, Clock } from 'lucide-react';

const Dashboard = () => {
  // Mock data - in real app this would come from API
  const metrics = {
    totalCalls: 127,
    discoveryCallsTotal: 89,
    closingCallsTotal: 38,
    proposalsCreated: 24,
    proposalsPitched: 18,
    closingRate: 15.8,
    totalCashCollected: 145000,
    avgRevenuePerClient: 12083,
    avgDealSize: 9650
  };

  const showUpRates = {
    firstDiscovery: 92.3,
    secondDiscovery: 78.4,
    thirdDiscovery: 65.1,
    firstClosing: 84.2,
    secondClosing: 71.6,
    thirdClosing: 58.9
  };

  const funnelRates = {
    discovery1To2: 68.5,
    discovery2To3: 54.2,
    discovery3ToClosing1: 42.1,
    closing1To2: 65.8,
    closing2To3: 48.3,
    closing3ToWon: 73.2
  };

  const timeMetrics = {
    discoveryToClosing: 14.2,
    discoveryToClose: 28.7,
    betweenDiscovery: 5.3,
    betweenClosing: 4.1,
    salesCycleDuration: 32.4
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sales Dashboard</h1>
        <p className="text-muted-foreground">Track your sales performance and KPIs</p>
      </div>

      {/* Key Metrics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Key Performance Indicators</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Calls"
            value={metrics.totalCalls}
            icon={Phone}
            trend={12.5}
          />
          <MetricCard
            title="Discovery Calls"
            value={metrics.discoveryCallsTotal}
            icon={Users}
            trend={8.2}
          />
          <MetricCard
            title="Closing Rate"
            value={metrics.closingRate}
            unit="%"
            icon={Target}
            trend={3.1}
          />
          <MetricCard
            title="Cash Collected"
            value={`$${(metrics.totalCashCollected / 1000).toFixed(0)}K`}
            icon={DollarSign}
            trend={15.8}
          />
          <MetricCard
            title="Average Deal Size"
            value={`$${(metrics.avgDealSize / 1000).toFixed(1)}K`}
            icon={DollarSign}
            trend={8.5}
          />
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Show-Up Rates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Show-Up Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Discovery Calls</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>1st Discovery</span>
                  <Badge variant="secondary">{showUpRates.firstDiscovery}%</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>2nd Discovery</span>
                  <Badge variant="secondary">{showUpRates.secondDiscovery}%</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>3rd Discovery</span>
                  <Badge variant="secondary">{showUpRates.thirdDiscovery}%</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Closing Calls</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>1st Closing</span>
                  <Badge variant="secondary">{showUpRates.firstClosing}%</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>2nd Closing</span>
                  <Badge variant="secondary">{showUpRates.secondClosing}%</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>3rd Closing</span>
                  <Badge variant="secondary">{showUpRates.thirdClosing}%</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Funnel Movement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Funnel Movement Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Discovery 1 → 2</span>
              <Badge variant="outline">{funnelRates.discovery1To2}%</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Discovery 2 → 3</span>
              <Badge variant="outline">{funnelRates.discovery2To3}%</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Discovery 3 → Closing 1</span>
              <Badge variant="outline">{funnelRates.discovery3ToClosing1}%</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Closing 1 → 2</span>
              <Badge variant="outline">{funnelRates.closing1To2}%</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Closing 2 → 3</span>
              <Badge variant="outline">{funnelRates.closing2To3}%</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Closing 3 → Won</span>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{funnelRates.closing3ToWon}%</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Time Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Time-Based Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Discovery → Closing</span>
              <Badge variant="secondary">{timeMetrics.discoveryToClosing} days</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Discovery → Close</span>
              <Badge variant="secondary">{timeMetrics.discoveryToClose} days</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Between Discovery Calls</span>
              <Badge variant="secondary">{timeMetrics.betweenDiscovery} days</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Between Closing Calls</span>
              <Badge variant="secondary">{timeMetrics.betweenClosing} days</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Sales Cycle Duration</span>
              <Badge variant="secondary">{timeMetrics.salesCycleDuration} days</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Additional Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Proposals Created</span>
                <span className="font-medium">{metrics.proposalsCreated}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>Proposals Pitched</span>
                <span className="font-medium">{metrics.proposalsPitched}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Avg Revenue per Client</span>
                <span className="font-medium">${metrics.avgRevenuePerClient.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
