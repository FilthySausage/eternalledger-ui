import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { StatusBadge } from './StatusBadge';
import { 
  User, 
  Settings, 
  Shield, 
  Clock, 
  Heart,
  Banknote,
  CreditCard,
  FileText,
  Users,
  ArrowRight,
  Calendar,
  MapPin,
  Edit3
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface UserDashboardProps {
  isConnected: boolean;
  address: string;
}

interface AutomationSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'financial' | 'subscriptions' | 'legal';
  icon: React.ComponentType<{ className?: string }>;
}

interface LifeEvent {
  id: string;
  type: string;
  date: string;
  location: string;
  verifiers: number;
  status: 'verified' | 'pending';
}

const mockAutomationSettings: AutomationSetting[] = [
  {
    id: '1',
    name: 'Pension Payments',
    description: 'Automatically suspend pension payments upon verified death',
    enabled: true,
    category: 'financial',
    icon: Banknote
  },
  {
    id: '2',
    name: 'Bank Accounts',
    description: 'Freeze bank accounts and notify financial institutions',
    enabled: true,
    category: 'financial',
    icon: CreditCard
  },
  {
    id: '3',
    name: 'Subscription Services',
    description: 'Cancel recurring subscriptions and memberships',
    enabled: false,
    category: 'subscriptions',
    icon: FileText
  },
  {
    id: '4',
    name: 'Will Execution',
    description: 'Trigger automated will and estate distribution',
    enabled: true,
    category: 'legal',
    icon: FileText
  }
];

const mockLifeEvents: LifeEvent[] = [
  {
    id: '1',
    type: 'Birth Registration',
    date: '1990-05-15',
    location: 'General Hospital, New York',
    verifiers: 3,
    status: 'verified'
  },
  {
    id: '2',
    type: 'Education Milestone',
    date: '2012-06-01',
    location: 'NYU, New York',
    verifiers: 2,
    status: 'verified'
  }
];

export function UserDashboard({ isConnected, address }: UserDashboardProps) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [automationSettings, setAutomationSettings] = useState(mockAutomationSettings);
  const [custodyTransition, setCustodyTransition] = useState(false);

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-xl">Connect Your Wallet</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Connect your wallet to view your LifeChain identity, manage automation settings, 
                and control consent for post-mortem actions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const toggleAutomation = (id: string) => {
    setAutomationSettings(settings =>
      settings.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
    toast.success('Automation setting updated');
  };

  const handleCustodyTransition = () => {
    setCustodyTransition(!custodyTransition);
    toast.success(custodyTransition ? 'Custody transition cancelled' : 'Custody transition initiated');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">My LifeChain Dashboard</h1>
          <p className="text-muted-foreground">Manage your decentralized identity and automation settings</p>
        </div>
        <div className="text-right space-y-1">
          <StatusBadge status="alive" />
          <p className="text-xs text-muted-foreground">Birth ID: LC-2024-001234</p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Life Timeline</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="consent">Consent & Access</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Heart className="size-4 text-green-500" />
                  Life Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-green-600">Active</div>
                <p className="text-xs text-muted-foreground">Last verified 3 days ago</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="size-4 text-blue-500" />
                  Verifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">7</div>
                <p className="text-xs text-muted-foreground">Life events verified</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="size-4 text-purple-500" />
                  Automations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {automationSettings.filter(s => s.enabled).length}
                </div>
                <p className="text-xs text-muted-foreground">Active post-mortem actions</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Identity Overview</CardTitle>
              <CardDescription>Your on-chain identity information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Birth Date</Label>
                    <p>May 15, 1990</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Birth Location</Label>
                    <p>General Hospital, New York, USA</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Wallet Address</Label>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{address}</code>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Current Guardian</Label>
                    <p className="flex items-center gap-2">
                      Self-custody 
                      <Badge variant="outline" className="text-xs">Active since age 18</Badge>
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Backup Guardians</Label>
                    <p>2 designated emergency contacts</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Privacy Level</Label>
                    <p className="flex items-center gap-2">
                      Minimal public data
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <Edit3 className="size-3 mr-1" />
                        Edit
                      </Button>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Life Event Timeline</CardTitle>
              <CardDescription>
                Verified milestones and events in your LifeChain record
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockLifeEvents.map((event, index) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`size-3 rounded-full ${
                        event.status === 'verified' ? 'bg-green-500' : 'bg-amber-500'
                      }`} />
                      {index < mockLifeEvents.length - 1 && (
                        <div className="w-px h-16 bg-border mt-2" />
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{event.type}</h4>
                        <Badge variant={event.status === 'verified' ? 'default' : 'secondary'}>
                          {event.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          {event.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="size-3" />
                          {event.verifiers} verifiers
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-6" />
              
              <div className="text-center">
                <Button variant="outline" className="flex items-center gap-2">
                  <Clock className="size-4" />
                  Request Event Verification
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post-Mortem Automation Settings</CardTitle>
              <CardDescription>
                Configure which actions should be automatically triggered when a Soulbound Death Token is issued
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {['financial', 'subscriptions', 'legal'].map(category => (
                  <div key={category}>
                    <h3 className="font-medium mb-4 capitalize">{category} Services</h3>
                    <div className="space-y-4">
                      {automationSettings
                        .filter(setting => setting.category === category)
                        .map(setting => {
                          const Icon = setting.icon;
                          return (
                            <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <Icon className="size-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">{setting.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {setting.description}
                                  </p>
                                </div>
                              </div>
                              <Switch
                                checked={setting.enabled}
                                onCheckedChange={() => toggleAutomation(setting.id)}
                              />
                            </div>
                          );
                        })}
                    </div>
                    {category !== 'legal' && <Separator className="mt-6" />}
                  </div>
                ))}
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-2">
                  <Shield className="size-4 text-amber-600 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-amber-800">Security Notice</h4>
                    <p className="text-xs text-amber-700">
                      Automation triggers require multi-signature verification and will only execute 
                      after SDT issuance is confirmed by the required quorum of verifiers.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Access Control & Consent</CardTitle>
              <CardDescription>
                Manage who can access your identity information and execute post-mortem actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium">Custody Status</h3>
                    <p className="text-sm text-muted-foreground">
                      {custodyTransition ? 'Transitioning to self-custody' : 'Self-custody (adult)'}
                    </p>
                  </div>
                  <Badge variant={custodyTransition ? 'secondary' : 'default'}>
                    {custodyTransition ? 'In Transition' : 'Active'}
                  </Badge>
                </div>
                
                {!custodyTransition && (
                  <Button
                    onClick={handleCustodyTransition}
                    variant="outline"
                    className="w-full"
                  >
                    Initiate Custody Transition
                  </Button>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-4">Authorized Executors</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Estate Executor</p>
                      <p className="text-sm text-muted-foreground">Primary will executor</p>
                    </div>
                    <Badge variant="outline">Pending Assignment</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Financial Power of Attorney</p>
                      <p className="text-sm text-muted-foreground">Banking and asset management</p>
                    </div>
                    <Badge variant="outline">Not Assigned</Badge>
                  </div>
                </div>
                
                <Button className="w-full mt-4 flex items-center gap-2">
                  Add Executor
                  <ArrowRight className="size-4" />
                </Button>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-4">Emergency Contacts</h3>
                <div className="space-y-3">
                  {['Primary Emergency Contact', 'Secondary Emergency Contact'].map((contact, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{contact}</p>
                        <p className="text-sm text-muted-foreground">
                          {index === 0 ? 'Can trigger emergency procedures' : 'Backup notification recipient'}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Configure
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}