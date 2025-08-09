import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { StatusBadge } from './StatusBadge';
import { 
  Shield, 
  Upload, 
  Lock, 
  Users, 
  FileText, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  Plus,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface VerifierPortalProps {
  isConnected: boolean;
}

interface AttestationRecord {
  id: string;
  type: 'birth' | 'death';
  birthId: string;
  status: 'pending' | 'approved' | 'requires_quorum';
  createdAt: string;
  attestors: number;
  requiredAttestors: number;
  institution: string;
}

const mockAttestations: AttestationRecord[] = [
  {
    id: '1',
    type: 'birth',
    birthId: 'LC-2024-001234',
    status: 'approved',
    createdAt: '2024-08-01',
    attestors: 3,
    requiredAttestors: 2,
    institution: 'General Hospital'
  },
  {
    id: '2',
    type: 'death',
    birthId: 'LC-2024-005678',
    status: 'requires_quorum',
    createdAt: '2024-08-05',
    attestors: 2,
    requiredAttestors: 3,
    institution: 'Memorial Funeral Home'
  }
];

export function VerifierPortal({ isConnected }: VerifierPortalProps) {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'birth',
    birthId: '',
    fullName: '',
    birthDate: '',
    birthLocation: '',
    parentNames: '',
    deathDate: '',
    deathLocation: '',
    causeOfDeath: '',
    supporting_documents: null as File[] | null
  });

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-xl">Wallet Connection Required</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Verifiers must connect their authorized wallet to access the attestation portal. 
                Only registered institutions can submit verifications.
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Hospital staff and registrars</p>
                <p>• Funeral homes and coroners</p>
                <p>• Government agencies and NGOs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock submission
    setTimeout(() => {
      toast.success('Attestation submitted successfully');
      setIsSubmitting(false);
      setFormData({
        type: 'birth',
        birthId: '',
        fullName: '',
        birthDate: '',
        birthLocation: '',
        parentNames: '',
        deathDate: '',
        deathLocation: '',
        causeOfDeath: '',
        supporting_documents: null
      });
    }, 2000);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      setFormData({ ...formData, supporting_documents: Array.from(files) });
      toast.success(`${files.length} document(s) uploaded`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Verifier Portal</h1>
          <p className="text-muted-foreground">Submit attestations and manage verifications</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Shield className="size-4" />
          Authorized Verifier
        </Badge>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="birth">Birth Attestation</TabsTrigger>
          <TabsTrigger value="death">Death Attestation</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="size-4 text-green-500" />
                  Approved Attestations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">47</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="size-4 text-amber-500" />
                  Pending Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">12</div>
                <p className="text-xs text-muted-foreground">Awaiting quorum</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="size-4 text-blue-500" />
                  Co-Verifiers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">8</div>
                <p className="text-xs text-muted-foreground">Active collaborators</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Attestations</CardTitle>
              <CardDescription>Your latest verification submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAttestations.map((attestation) => (
                  <div key={attestation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={attestation.type === 'birth' ? 'default' : 'destructive'}>
                          {attestation.type}
                        </Badge>
                        <span className="text-sm">ID: {attestation.birthId}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Submitted on {attestation.createdAt} • {attestation.institution}
                      </p>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <StatusBadge 
                        status={attestation.status === 'approved' ? 'alive' : 'pending'} 
                        quorum={attestation.attestors}
                        maxQuorum={attestation.requiredAttestors}
                      />
                      <p className="text-xs text-muted-foreground">
                        {attestation.attestors}/{attestation.requiredAttestors} attestors
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="birth" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="size-5" />
                Birth Attestation Form
              </CardTitle>
              <CardDescription>
                Submit a new birth registration with supporting documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="birthId">Birth ID</Label>
                    <Input
                      id="birthId"
                      placeholder="LC-2024-XXXXXX"
                      value={formData.birthId}
                      onChange={(e) => setFormData({ ...formData, birthId: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Full legal name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="birthDate">Date of Birth</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthLocation">Place of Birth</Label>
                    <Input
                      id="birthLocation"
                      placeholder="City, State/Province, Country"
                      value={formData.birthLocation}
                      onChange={(e) => setFormData({ ...formData, birthLocation: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="parentNames">Parent/Guardian Names</Label>
                  <Input
                    id="parentNames"
                    placeholder="Full names of parents or legal guardians"
                    value={formData.parentNames}
                    onChange={(e) => setFormData({ ...formData, parentNames: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="supporting_documents">Supporting Documents</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <div className="space-y-2">
                      <Input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                        id="file-upload"
                      />
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" size="sm">
                          Choose Files
                        </Button>
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Upload birth certificate, medical records, ID documents
                      </p>
                      {formData.supporting_documents && (
                        <div className="text-xs text-green-600 flex items-center gap-1">
                          <Lock className="size-3" />
                          {formData.supporting_documents.length} encrypted document(s) ready
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Submitting Attestation...' : 'Submit Birth Attestation'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="death" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="size-5" />
                Death Attestation Form
              </CardTitle>
              <CardDescription>
                Submit death verification to trigger SDT issuance and post-mortem automation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="existingBirthId">Existing Birth ID</Label>
                    <Input
                      id="existingBirthId"
                      placeholder="LC-2024-XXXXXX"
                      value={formData.birthId}
                      onChange={(e) => setFormData({ ...formData, birthId: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="deathDate">Date of Death</Label>
                    <Input
                      id="deathDate"
                      type="date"
                      value={formData.deathDate}
                      onChange={(e) => setFormData({ ...formData, deathDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deathLocation">Place of Death</Label>
                    <Input
                      id="deathLocation"
                      placeholder="Institution/location of death"
                      value={formData.deathLocation}
                      onChange={(e) => setFormData({ ...formData, deathLocation: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="causeOfDeath">Cause of Death</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, causeOfDeath: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cause" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="natural">Natural Causes</SelectItem>
                        <SelectItem value="medical">Medical Condition</SelectItem>
                        <SelectItem value="accident">Accident</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="deathDocuments">Death Certificate & Supporting Documents</Label>
                  <div className="border-2 border-dashed border-red-200 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-red-400 mb-2" />
                    <div className="space-y-2">
                      <Input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                        id="death-file-upload"
                      />
                      <Label htmlFor="death-file-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" size="sm">
                          Choose Files
                        </Button>
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Death certificate, autopsy reports, medical records
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="size-4 text-red-600 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-red-800">Important Notice</h4>
                      <p className="text-xs text-red-700">
                        Death attestations require additional verification from co-attestors. 
                        SDT will be issued only after reaching the required quorum threshold.
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  variant="destructive"
                  className="w-full"
                >
                  {isSubmitting ? 'Submitting Death Attestation...' : 'Submit Death Attestation'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attestation History</CardTitle>
              <CardDescription>
                Complete record of your verification submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAttestations.map((attestation) => (
                  <Card key={attestation.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant={attestation.type === 'birth' ? 'default' : 'destructive'}>
                          {attestation.type} attestation
                        </Badge>
                        <span>ID: {attestation.birthId}</span>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="size-3" />
                        {attestation.createdAt}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Progress 
                        value={(attestation.attestors / attestation.requiredAttestors) * 100} 
                        className="h-2"
                      />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {attestation.attestors} of {attestation.requiredAttestors} required attestors
                        </span>
                        <span className={`font-medium ${
                          attestation.status === 'approved' 
                            ? 'text-green-600' 
                            : attestation.status === 'requires_quorum'
                            ? 'text-amber-600'
                            : 'text-gray-600'
                        }`}>
                          {attestation.status === 'approved' ? 'Approved' : 
                           attestation.status === 'requires_quorum' ? 'Needs More Attestors' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}