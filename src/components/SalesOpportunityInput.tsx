
import React, { useState, useRef } from 'react';
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
import { CalendarIcon, Plus, Edit, Save, X, FileText, Users, Trash2, Link, Upload, Download } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useSalesData } from '@/contexts/SalesDataContext';
import { useToast } from '@/hooks/use-toast';

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

const SalesOpportunityInput = () => {
  const { 
    opportunities, 
    setOpportunities, 
    salespersons, 
    setSalespersons, 
    leadSources, 
    setLeadSources 
  } = useSalesData();
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<number | null>(null);
  const [showContactsDialog, setShowContactsDialog] = useState(false);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [showFilesDialog, setShowFilesDialog] = useState(false);
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
      author: 'Current User',
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
    toast({
      title: "Opportunity deleted",
      description: "The sales opportunity has been successfully deleted.",
    });
  };

  const handleFileUpload = (opportunityId: number, files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    setOpportunities(opportunities.map(opp => 
      opp.id === opportunityId 
        ? { ...opp, files: [...opp.files, ...newFiles] }
        : opp
    ));
    
    toast({
      title: "Files uploaded",
      description: `${newFiles.length} file(s) have been uploaded successfully.`,
    });
  };

  const handleFileDownload = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File downloaded",
      description: `${file.name} has been downloaded.`,
    });
  };

  const removeFile = (opportunityId: number, fileIndex: number) => {
    setOpportunities(opportunities.map(opp => 
      opp.id === opportunityId 
        ? { ...opp, files: opp.files.filter((_, index) => index !== fileIndex) }
        : opp
    ));
  };

  return (
    <div className="space-y-10 px-2 md:px-6 py-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-2 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Sales Opportunities Management</h1>
          <p className="text-lg text-gray-500 mt-1">Track sales opportunities, contacts, and call details</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow duration-200">
            <Plus className="h-4 w-4" />
            Add Opportunity
          </Button>
        </div>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200 border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Salespersons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {salespersons.map(person => (
                <div key={person.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50">
                  <span className="font-medium text-gray-800">{person.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-red-50"
                    onClick={() => setSalespersons(salespersons.filter(p => p.id !== person.id))}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <Input placeholder="New salesperson name" id="new-salesperson" />
                <Button 
                  className="shadow"
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

        <Card className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200 border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leadSources.map(source => (
                <div key={source.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50">
                  <span className="font-medium text-gray-800">{source.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-red-50"
                    onClick={() => setLeadSources(leadSources.filter(s => s.id !== source.id))}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <Input placeholder="New lead source" id="new-lead-source" />
                <Button 
                  className="shadow"
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
      <div className="space-y-8">
        {opportunities.map((opportunity) => (
          <Card key={opportunity.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200 border-0">
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
                    className="text-lg font-semibold border-none p-0 focus-visible:ring-0 bg-transparent"
                  />
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">{opportunity.salesperson}</Badge>
                    <Badge variant="secondary" className="bg-purple-50 text-purple-800 border-purple-200">{opportunity.leadSource}</Badge>
                    <Badge variant={opportunity.opportunityStatus === 'won' ? 'default' : opportunity.opportunityStatus === 'lost' ? 'destructive' : 'secondary'}
                      className={
                        opportunity.opportunityStatus === 'won' ? 'bg-green-100 text-green-800' :
                        opportunity.opportunityStatus === 'lost' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-50 text-yellow-800'
                      }
                    >
                      {opportunity.opportunityStatus}
                    </Badge>
                    <Badge variant={opportunity.proposalStatus === 'pitched' ? 'default' : opportunity.proposalStatus === 'created' ? 'secondary' : 'outline'}
                      className={
                        opportunity.proposalStatus === 'pitched' ? 'bg-green-50 text-green-800' :
                        opportunity.proposalStatus === 'created' ? 'bg-yellow-50 text-yellow-800' :
                        'bg-gray-50 text-gray-800'
                      }
                    >
                      Proposal: {opportunity.proposalStatus}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="hover:bg-blue-50 rounded-full">
                        <Users className="h-4 w-4 text-blue-500" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl rounded-xl p-6">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900">Contacts for {opportunity.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {opportunity.contacts.map((contact) => (
                          <div key={contact.id} className="grid grid-cols-5 gap-4 p-4 border rounded-lg bg-gray-50">
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
                        <Button onClick={() => addContact(opportunity.id)} className="shadow">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Contact
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="hover:bg-purple-50 rounded-full">
                        <FileText className="h-4 w-4 text-purple-500" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-xl p-6">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900">Notes for {opportunity.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {opportunity.notes.map((note) => (
                          <div key={note.id} className="p-3 border rounded-lg bg-gray-50">
                            <div className="flex justify-between text-sm text-gray-500 mb-2">
                              <span>{note.author}</span>
                              <span>{format(note.timestamp, 'MMM dd, yyyy HH:mm')}</span>
                            </div>
                            <p>{note.content}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Textarea
                          placeholder="Add a note..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          className="rounded-lg"
                        />
                        <Button onClick={() => addNote(opportunity.id)} className="shadow">Add</Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={showFilesDialog && selectedOpportunity === opportunity.id} onOpenChange={(open) => {
                    setShowFilesDialog(open);
                    if (open) setSelectedOpportunity(opportunity.id);
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="hover:bg-green-50 rounded-full">
                        <Upload className="h-4 w-4 text-green-500" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-xl p-6">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900">Files for {opportunity.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFileUpload(opportunity.id, e.target.files)}
                          />
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            Upload Files
                          </Button>
                          <p className="text-sm text-gray-500 mt-2">Click to upload or drag and drop files</p>
                        </div>
                        
                        {opportunity.files.length > 0 && (
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            <h4 className="font-semibold">Uploaded Files:</h4>
                            {opportunity.files.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">{file.name}</span>
                                  <span className="text-xs text-gray-400">
                                    ({(file.size / 1024).toFixed(1)} KB)
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleFileDownload(file)}
                                    className="hover:bg-blue-50"
                                  >
                                    <Download className="h-4 w-4 text-blue-500" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(opportunity.id, index)}
                                    className="hover:bg-red-50"
                                  >
                                    <X className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-red-50 rounded-full"
                    onClick={() => deleteOpportunity(opportunity.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Main Fields */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <div>
                  <Label className="font-semibold text-gray-700 mb-1 block">Salesperson</Label>
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
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg">
                      {salespersons.map(person => (
                        <SelectItem key={person.id} value={person.name}>{person.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-semibold text-gray-700 mb-1 block">Lead Source</Label>
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
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg">
                      {leadSources.map(source => (
                        <SelectItem key={source.id} value={source.name}>{source.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-semibold text-gray-700 mb-1 block">Opportunity Status</Label>
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
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="won">Won</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-semibold text-gray-700 mb-1 block">Proposal Status</Label>
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
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg">
                      <SelectItem value="not-created">Not Created</SelectItem>
                      <SelectItem value="created">Created</SelectItem>
                      <SelectItem value="pitched">Pitched</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <Label className="font-semibold text-gray-700 mb-1 block">Revenue ($)</Label>
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
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <Label className="font-semibold text-gray-700 mb-1 block">Cash Collected ($)</Label>
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
                    className="rounded-lg"
                  />
                </div>
              </div>

              {/* Call Details - Compact Version */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg text-gray-900">Call Details</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Discovery Calls */}
                  <div>
                    <h5 className="text-md font-semibold mb-2 text-blue-700">Discovery Calls</h5>
                    <div className="space-y-2">
                      {[1, 2, 3].map((num) => (
                        <div key={num} className="grid grid-cols-5 gap-2 items-center text-sm">
                          <span className="font-semibold text-blue-700">D{num}:</span>
                          <DatePicker
                            date={opportunity[`discovery${num}Date` as keyof typeof opportunity] as Date}
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
                            className="text-sm h-9 rounded-lg"
                            value={opportunity[`discovery${num}Duration` as keyof typeof opportunity] as number || ''}
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
                            className="text-sm h-9 col-span-2 rounded-lg"
                            value={opportunity[`discovery${num}Link` as keyof typeof opportunity] as string || ''}
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
                    <h5 className="text-md font-semibold mb-2 text-green-700">Closing Calls</h5>
                    <div className="space-y-2">
                      {[1, 2, 3].map((num) => (
                        <div key={num} className="grid grid-cols-5 gap-2 items-center text-sm">
                          <span className="font-semibold text-green-700">C{num}:</span>
                          <DatePicker
                            date={opportunity[`closing${num}Date` as keyof typeof opportunity] as Date}
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
                            className="text-sm h-9 rounded-lg"
                            value={opportunity[`closing${num}Duration` as keyof typeof opportunity] as number || ''}
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
                            className="text-sm h-9 col-span-2 rounded-lg"
                            value={opportunity[`closing${num}Link` as keyof typeof opportunity] as string || ''}
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
