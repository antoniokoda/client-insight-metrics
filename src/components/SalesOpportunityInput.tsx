
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CalendarIcon, Plus, Edit, Save, X, FileText, Users, Trash2, Link } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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
  files: string[];
}

interface Salesperson {
  id: number;
  name: string;
}

interface LeadSource {
  id: number;
  name: string;
}

const SalesOpportunityInput = () => {
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
    }
  ]);

  const [salespersons, setSalespersons] = useState<Salesperson[]>([
    { id: 1, name: 'John Smith' },
    { id: 2, name: 'Sarah Johnson' }
  ]);

  const [leadSources, setLeadSources] = useState<LeadSource[]>([
    { id: 1, name: 'Website' },
    { id: 2, name: 'Referral' },
    { id: 3, name: 'Cold Outreach' }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<number | null>(null);
  const [showContactsDialog, setShowContactsDialog] = useState(false);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [newNote, setNewNote] = useState('');

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

  const addContact = (opportunityId: number) => {
    const newContact: Contact = {
      id: Date.now(),
      name: '',
      position: '',
      email: '',
      phone: '',
      linkedin: ''
    };
    
    setOpportunities(opportunities.map(opp => 
      opp.id === opportunityId 
        ? { ...opp, contacts: [...opp.contacts, newContact] }
        : opp
    ));
  };

  const updateContact = (opportunityId: number, contactId: number, field: keyof Contact, value: string) => {
    setOpportunities(opportunities.map(opp => 
      opp.id === opportunityId 
        ? {
            ...opp,
            contacts: opp.contacts.map(contact =>
              contact.id === contactId ? { ...contact, [field]: value } : contact
            )
          }
        : opp
    ));
  };

  const addNote = (opportunityId: number) => {
    if (!newNote.trim()) return;
    
    const note: Note = {
      id: Date.now(),
      content: newNote,
      author: 'Current User', // This would be the logged-in user
      timestamp: new Date()
    };
    
    setOpportunities(opportunities.map(opp => 
      opp.id === opportunityId 
        ? { ...opp, notes: [...opp.notes, note] }
        : opp
    ));
    
    setNewNote('');
  };

  const deleteOpportunity = (id: number) => {
    setOpportunities(opportunities.filter(opp => opp.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Opportunities Management</h1>
          <p className="text-muted-foreground">Track sales opportunities, contacts, and call details</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Opportunity
          </Button>
        </div>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Salespersons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {salespersons.map(person => (
                <div key={person.id} className="flex justify-between items-center">
                  <span>{person.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSalespersons(salespersons.filter(p => p.id !== person.id))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input placeholder="New salesperson name" id="new-salesperson" />
                <Button 
                  onClick={() => {
                    const input = document.getElementById('new-salesperson') as HTMLInputElement;
                    if (input.value.trim()) {
                      setSalespersons([...salespersons, { id: Date.now(), name: input.value }]);
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leadSources.map(source => (
                <div key={source.id} className="flex justify-between items-center">
                  <span>{source.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLeadSources(leadSources.filter(s => s.id !== source.id))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input placeholder="New lead source" id="new-lead-source" />
                <Button 
                  onClick={() => {
                    const input = document.getElementById('new-lead-source') as HTMLInputElement;
                    if (input.value.trim()) {
                      setLeadSources([...leadSources, { id: Date.now(), name: input.value }]);
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {opportunities.map((opportunity) => (
          <Card key={opportunity.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Input
                    value={opportunity.name}
                    onChange={(e) => {
                      setOpportunities(opportunities.map(opp => 
                        opp.id === opportunity.id 
                          ? { ...opp, name: e.target.value }
                          : opp
                      ));
                    }}
                    className="text-lg font-semibold border-none p-0 focus-visible:ring-0"
                  />
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{opportunity.salesperson}</Badge>
                    <Badge variant="secondary">{opportunity.leadSource}</Badge>
                    <Badge variant={opportunity.opportunityStatus === 'won' ? 'default' : opportunity.opportunityStatus === 'lost' ? 'destructive' : 'secondary'}>
                      {opportunity.opportunityStatus}
                    </Badge>
                    <Badge variant={opportunity.proposalStatus === 'pitched' ? 'default' : opportunity.proposalStatus === 'created' ? 'secondary' : 'outline'}>
                      Proposal: {opportunity.proposalStatus}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Users className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Contacts for {opportunity.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {opportunity.contacts.map((contact) => (
                          <div key={contact.id} className="grid grid-cols-5 gap-4 p-4 border rounded">
                            <Input
                              placeholder="Name"
                              value={contact.name}
                              onChange={(e) => updateContact(opportunity.id, contact.id, 'name', e.target.value)}
                            />
                            <Input
                              placeholder="Position"
                              value={contact.position}
                              onChange={(e) => updateContact(opportunity.id, contact.id, 'position', e.target.value)}
                            />
                            <Input
                              placeholder="Email"
                              value={contact.email}
                              onChange={(e) => updateContact(opportunity.id, contact.id, 'email', e.target.value)}
                            />
                            <Input
                              placeholder="Phone"
                              value={contact.phone}
                              onChange={(e) => updateContact(opportunity.id, contact.id, 'phone', e.target.value)}
                            />
                            <Input
                              placeholder="LinkedIn"
                              value={contact.linkedin}
                              onChange={(e) => updateContact(opportunity.id, contact.id, 'linkedin', e.target.value)}
                            />
                          </div>
                        ))}
                        <Button onClick={() => addContact(opportunity.id)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Contact
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Notes for {opportunity.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {opportunity.notes.map((note) => (
                          <div key={note.id} className="p-3 border rounded">
                            <div className="flex justify-between text-sm text-muted-foreground mb-2">
                              <span>{note.author}</span>
                              <span>{format(note.timestamp, 'MMM dd, yyyy HH:mm')}</span>
                            </div>
                            <p>{note.content}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Add a note..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                        />
                        <Button onClick={() => addNote(opportunity.id)}>Add</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteOpportunity(opportunity.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Main Fields */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div>
                  <Label>Salesperson</Label>
                  <Select
                    value={opportunity.salesperson}
                    onValueChange={(value) => {
                      setOpportunities(opportunities.map(opp => 
                        opp.id === opportunity.id 
                          ? { ...opp, salesperson: value }
                          : opp
                      ));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {salespersons.map(person => (
                        <SelectItem key={person.id} value={person.name}>{person.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Lead Source</Label>
                  <Select
                    value={opportunity.leadSource}
                    onValueChange={(value) => {
                      setOpportunities(opportunities.map(opp => 
                        opp.id === opportunity.id 
                          ? { ...opp, leadSource: value }
                          : opp
                      ));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {leadSources.map(source => (
                        <SelectItem key={source.id} value={source.name}>{source.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Opportunity Status</Label>
                  <Select
                    value={opportunity.opportunityStatus}
                    onValueChange={(value: 'active' | 'won' | 'lost') => {
                      setOpportunities(opportunities.map(opp => 
                        opp.id === opportunity.id 
                          ? { ...opp, opportunityStatus: value }
                          : opp
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
                  <Label>Proposal Status</Label>
                  <Select
                    value={opportunity.proposalStatus}
                    onValueChange={(value: 'not-created' | 'created' | 'pitched') => {
                      setOpportunities(opportunities.map(opp => 
                        opp.id === opportunity.id 
                          ? { ...opp, proposalStatus: value }
                          : opp
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label>Revenue ($)</Label>
                  <Input
                    type="number"
                    value={opportunity.revenue}
                    onChange={(e) => {
                      setOpportunities(opportunities.map(opp => 
                        opp.id === opportunity.id 
                          ? { ...opp, revenue: parseInt(e.target.value) || 0 }
                          : opp
                      ));
                    }}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Cash Collected ($)</Label>
                  <Input
                    type="number"
                    value={opportunity.cashCollected}
                    onChange={(e) => {
                      setOpportunities(opportunities.map(opp => 
                        opp.id === opportunity.id 
                          ? { ...opp, cashCollected: parseInt(e.target.value) || 0 }
                          : opp
                      ));
                    }}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Call Details - Compact Version */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Call Details</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Discovery Calls */}
                  <div>
                    <h5 className="text-xs font-medium mb-2">Discovery Calls</h5>
                    <div className="space-y-2">
                      {[1, 2, 3].map((num) => (
                        <div key={num} className="grid grid-cols-5 gap-1 items-center text-xs">
                          <span className="text-xs">D{num}:</span>
                          <DatePicker
                            date={opportunity[`discovery${num}Date` as keyof SalesOpportunity] as Date}
                            onSelect={(date) => {
                              setOpportunities(opportunities.map(opp => 
                                opp.id === opportunity.id 
                                  ? { ...opp, [`discovery${num}Date`]: date }
                                  : opp
                              ));
                            }}
                            placeholder={`Date`}
                          />
                          <Input
                            type="number"
                            placeholder="min"
                            className="text-xs h-8"
                            value={opportunity[`discovery${num}Duration` as keyof SalesOpportunity] as number || ''}
                            onChange={(e) => {
                              setOpportunities(opportunities.map(opp => 
                                opp.id === opportunity.id 
                                  ? { ...opp, [`discovery${num}Duration`]: parseInt(e.target.value) || 0 }
                                  : opp
                              ));
                            }}
                          />
                          <Input
                            placeholder="Link"
                            className="text-xs h-8 col-span-2"
                            value={opportunity[`discovery${num}Link` as keyof SalesOpportunity] as string || ''}
                            onChange={(e) => {
                              setOpportunities(opportunities.map(opp => 
                                opp.id === opportunity.id 
                                  ? { ...opp, [`discovery${num}Link`]: e.target.value }
                                  : opp
                              ));
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Closing Calls */}
                  <div>
                    <h5 className="text-xs font-medium mb-2">Closing Calls</h5>
                    <div className="space-y-2">
                      {[1, 2, 3].map((num) => (
                        <div key={num} className="grid grid-cols-5 gap-1 items-center text-xs">
                          <span className="text-xs">C{num}:</span>
                          <DatePicker
                            date={opportunity[`closing${num}Date` as keyof SalesOpportunity] as Date}
                            onSelect={(date) => {
                              setOpportunities(opportunities.map(opp => 
                                opp.id === opportunity.id 
                                  ? { ...opp, [`closing${num}Date`]: date }
                                  : opp
                              ));
                            }}
                            placeholder={`Date`}
                          />
                          <Input
                            type="number"
                            placeholder="min"
                            className="text-xs h-8"
                            value={opportunity[`closing${num}Duration` as keyof SalesOpportunity] as number || ''}
                            onChange={(e) => {
                              setOpportunities(opportunities.map(opp => 
                                opp.id === opportunity.id 
                                  ? { ...opp, [`closing${num}Duration`]: parseInt(e.target.value) || 0 }
                                  : opp
                              ));
                            }}
                          />
                          <Input
                            placeholder="Link"
                            className="text-xs h-8 col-span-2"
                            value={opportunity[`closing${num}Link` as keyof SalesOpportunity] as string || ''}
                            onChange={(e) => {
                              setOpportunities(opportunities.map(opp => 
                                opp.id === opportunity.id 
                                  ? { ...opp, [`closing${num}Link`]: e.target.value }
                                  : opp
                              ));
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SalesOpportunityInput;
