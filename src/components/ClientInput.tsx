
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Edit, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Client {
  id: number;
  name: string;
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
  proposalStatus: 'not-created' | 'created' | 'pitched';
  clientStatus: 'active' | 'won' | 'lost';
  revenue: number;
  notes: string;
}

const ClientInput = () => {
  const [clients, setClients] = useState<Client[]>([
    {
      id: 1,
      name: 'ABC Corporation',
      discovery1Date: new Date('2024-05-15'),
      discovery2Date: new Date('2024-05-20'),
      closing1Date: new Date('2024-05-25'),
      discovery1Duration: 45,
      discovery2Duration: 38,
      closing1Duration: 52,
      proposalStatus: 'pitched',
      clientStatus: 'active',
      revenue: 15000,
      notes: 'Interested in enterprise package'
    },
    {
      id: 2,
      name: 'Tech Startup Inc',
      discovery1Date: new Date('2024-05-18'),
      discovery2Date: new Date('2024-05-23'),
      discovery1Duration: 32,
      discovery2Duration: 41,
      proposalStatus: 'created',
      clientStatus: 'active',
      revenue: 0,
      notes: 'Budget approved, waiting for decision'
    }
  ]);

  const [editingClient, setEditingClient] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: '',
    proposalStatus: 'not-created',
    clientStatus: 'active',
    revenue: 0,
    notes: ''
  });

  const DatePicker = ({ date, onSelect, placeholder }: { date?: Date; onSelect: (date: Date | undefined) => void; placeholder: string }) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "MMM dd, yyyy") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onSelect}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    );
  };

  const getStatusBadge = (status: string, type: 'proposal' | 'client') => {
    const variants = {
      proposal: {
        'not-created': 'destructive',
        'created': 'secondary',
        'pitched': 'default'
      },
      client: {
        'active': 'secondary',
        'won': 'default',
        'lost': 'destructive'
      }
    };

    const labels = {
      proposal: {
        'not-created': 'Not Created',
        'created': 'Created',
        'pitched': 'Pitched'
      },
      client: {
        'active': 'Active',
        'won': 'Won',
        'lost': 'Lost'
      }
    };

    return (
      <Badge variant={variants[type][status as keyof typeof variants[typeof type]] as any}>
        {labels[type][status as keyof typeof labels[typeof type]]}
      </Badge>
    );
  };

  const handleAddClient = () => {
    if (newClient.name) {
      const client: Client = {
        id: Date.now(),
        name: newClient.name,
        proposalStatus: newClient.proposalStatus as any || 'not-created',
        clientStatus: newClient.clientStatus as any || 'active',
        revenue: newClient.revenue || 0,
        notes: newClient.notes || ''
      };
      setClients([...clients, client]);
      setNewClient({
        name: '',
        proposalStatus: 'not-created',
        clientStatus: 'active',
        revenue: 0,
        notes: ''
      });
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Data Management</h1>
          <p className="text-muted-foreground">Track client interactions and call details</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Add Client Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Add New Client
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Client Name</Label>
                <Input
                  id="name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <Label>Client Status</Label>
                <Select
                  value={newClient.clientStatus}
                  onValueChange={(value) => setNewClient({ ...newClient, clientStatus: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddClient}>Add Client</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Client List */}
      <div className="space-y-4">
        {clients.map((client) => (
          <Card key={client.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    {getStatusBadge(client.proposalStatus, 'proposal')}
                    {getStatusBadge(client.clientStatus, 'client')}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingClient(editingClient === client.id ? null : client.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Discovery Calls */}
                <div>
                  <h4 className="font-semibold mb-3">Discovery Calls</h4>
                  <div className="space-y-3">
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="flex items-center gap-4">
                        <span className="text-sm font-medium w-16">Call {num}:</span>
                        <div className="flex-1">
                          <DatePicker
                            date={client[`discovery${num}Date` as keyof Client] as Date}
                            onSelect={(date) => {
                              setClients(clients.map(c => 
                                c.id === client.id 
                                  ? { ...c, [`discovery${num}Date`]: date }
                                  : c
                              ));
                            }}
                            placeholder={`Select date for discovery call ${num}`}
                          />
                        </div>
                        <div className="w-24">
                          <Input
                            type="number"
                            placeholder="Duration"
                            value={client[`discovery${num}Duration` as keyof Client] as number || ''}
                            onChange={(e) => {
                              setClients(clients.map(c => 
                                c.id === client.id 
                                  ? { ...c, [`discovery${num}Duration`]: parseInt(e.target.value) || 0 }
                                  : c
                              ));
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">min</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Closing Calls */}
                <div>
                  <h4 className="font-semibold mb-3">Closing Calls</h4>
                  <div className="space-y-3">
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="flex items-center gap-4">
                        <span className="text-sm font-medium w-16">Call {num}:</span>
                        <div className="flex-1">
                          <DatePicker
                            date={client[`closing${num}Date` as keyof Client] as Date}
                            onSelect={(date) => {
                              setClients(clients.map(c => 
                                c.id === client.id 
                                  ? { ...c, [`closing${num}Date`]: date }
                                  : c
                              ));
                            }}
                            placeholder={`Select date for closing call ${num}`}
                          />
                        </div>
                        <div className="w-24">
                          <Input
                            type="number"
                            placeholder="Duration"
                            value={client[`closing${num}Duration` as keyof Client] as number || ''}
                            onChange={(e) => {
                              setClients(clients.map(c => 
                                c.id === client.id 
                                  ? { ...c, [`closing${num}Duration`]: parseInt(e.target.value) || 0 }
                                  : c
                              ));
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">min</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div>
                  <Label>Proposal Status</Label>
                  <Select
                    value={client.proposalStatus}
                    onValueChange={(value) => {
                      setClients(clients.map(c => 
                        c.id === client.id 
                          ? { ...c, proposalStatus: value as any }
                          : c
                      ));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-created">Not Created</SelectItem>
                      <SelectItem value="created">Created</SelectItem>
                      <SelectItem value="pitched">Pitched</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Client Status</Label>
                  <Select
                    value={client.clientStatus}
                    onValueChange={(value) => {
                      setClients(clients.map(c => 
                        c.id === client.id 
                          ? { ...c, clientStatus: value as any }
                          : c
                      ));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="won">Won</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Revenue Collected ($)</Label>
                  <Input
                    type="number"
                    value={client.revenue}
                    onChange={(e) => {
                      setClients(clients.map(c => 
                        c.id === client.id 
                          ? { ...c, revenue: parseInt(e.target.value) || 0 }
                          : c
                      ));
                    }}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label>Notes</Label>
                <Textarea
                  value={client.notes}
                  onChange={(e) => {
                    setClients(clients.map(c => 
                      c.id === client.id 
                        ? { ...c, notes: e.target.value }
                        : c
                    ));
                  }}
                  placeholder="Add notes about this client..."
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientInput;
