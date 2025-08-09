import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { StatusBadge, LifeStatus } from './StatusBadge';
import { Search, Download, Shield, Clock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface IdentityRecord {
  id: string;
  birthId: string;
  address: string;
  birthDate: string;
  location: string;
  status: LifeStatus;
  quorum?: number;
  lastVerified: string;
  sdtTokenId?: string;
}

const mockRecords: IdentityRecord[] = [
  {
    id: '1',
    birthId: 'LC-2024-001234',
    address: '0x742d35Cc6634C0532925a3b8d404fC5e6C8e7c8d',
    birthDate: '1990-05-15',
    location: 'New York, USA',
    status: 'alive',
    lastVerified: '2024-08-01'
  },
  {
    id: '2',
    birthId: 'LC-2024-005678',
    address: '0x8ba1f109551bD432803012645Hac136c19ACe3Fc',
    birthDate: '1985-12-22',
    location: 'London, UK',
    status: 'deceased',
    lastVerified: '2024-07-28',
    sdtTokenId: 'SDT-2024-001'
  },
  {
    id: '3',
    birthId: 'LC-2024-009876',
    address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
    birthDate: '1978-03-10',
    location: 'Toronto, Canada',
    status: 'pending',
    quorum: 2,
    lastVerified: '2024-08-05'
  }
];

export function PublicSearch() {
  const [searchType, setSearchType] = useState<'birthId' | 'address'>('birthId');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IdentityRecord[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    setIsSearching(true);
    
    // Mock search
    setTimeout(() => {
      const results = mockRecords.filter(record => {
        const searchTerm = searchQuery.toLowerCase();
        if (searchType === 'birthId') {
          return record.birthId.toLowerCase().includes(searchTerm);
        } else {
          return record.address.toLowerCase().includes(searchTerm);
        }
      });
      
      setSearchResults(results);
      setIsSearching(false);
      
      if (results.length === 0) {
        toast.info('No records found for your search');
      } else {
        toast.success(`Found ${results.length} record(s)`);
      }
    }, 1500);
  };

  const exportReceipt = (record: IdentityRecord) => {
    // Mock receipt export
    const receipt = {
      verificationId: `VER-${Date.now()}`,
      birthId: record.birthId,
      address: record.address,
      status: record.status,
      verifiedAt: new Date().toISOString(),
      blockchain: 'Ethereum Mainnet'
    };
    
    const blob = new Blob([JSON.stringify(receipt, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifechain-verification-${record.birthId}.json`;
    a.click();
    
    toast.success('Verification receipt downloaded');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl">Public Identity Verification</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Search the LifeChain registry to verify life/death status and view public identity information. 
          All searches are logged on-chain for transparency.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="size-5" />
            Search Registry
          </CardTitle>
          <CardDescription>
            Search by Birth ID or wallet address to find identity records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={searchType} onValueChange={(value) => setSearchType(value as 'birthId' | 'address')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="birthId">Birth ID</TabsTrigger>
              <TabsTrigger value="address">Wallet Address</TabsTrigger>
            </TabsList>
            
            <TabsContent value="birthId" className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter Birth ID (e.g., LC-2024-001234)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={isSearching}
                  className="px-8"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Birth IDs are unique identifiers assigned during registration (format: LC-YYYY-XXXXXX)
              </p>
            </TabsContent>
            
            <TabsContent value="address" className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter wallet address (0x...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={isSearching}
                  className="px-8"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Search by the Ethereum address associated with the identity
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl flex items-center gap-2">
            Search Results ({searchResults.length})
            <Badge variant="secondary">{searchResults.length} found</Badge>
          </h2>
          
          <div className="grid gap-4">
            {searchResults.map((record) => (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        Birth ID: {record.birthId}
                        {record.status === 'alive' && (
                          <Badge variant="outline" className="text-xs">
                            <Shield className="size-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        Address: <code className="text-xs">{record.address}</code>
                      </CardDescription>
                    </div>
                    
                    <StatusBadge 
                      status={record.status}
                      quorum={record.quorum}
                    />
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Birth Date</label>
                      <p className="text-sm">{record.birthDate}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Birth Location</label>
                      <p className="text-sm">{record.location}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Last Verified</label>
                      <p className="text-sm flex items-center gap-1">
                        <Clock className="size-3" />
                        {record.lastVerified}
                      </p>
                    </div>
                  </div>

                  {record.sdtTokenId && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="destructive" className="text-xs">
                          SDT Issued
                        </Badge>
                        <span>Token ID: {record.sdtTokenId}</span>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          View Token
                          <ExternalLink className="size-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>This information is publicly verifiable on-chain</p>
                      <p>Personal details are encrypted and not displayed</p>
                    </div>
                    
                    <Button 
                      onClick={() => exportReceipt(record)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Download className="size-4" />
                      Export Receipt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {searchResults.length === 0 && searchQuery && !isSearching && (
        <Card className="text-center py-8">
          <CardContent>
            <div className="space-y-4">
              <div className="text-muted-foreground">
                No records found for "{searchQuery}"
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Try searching with:</p>
                <p>• Complete Birth ID (LC-YYYY-XXXXXX)</p>
                <p>• Full wallet address (0x...)</p>
                <p>• Make sure the identity is registered in the system</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}