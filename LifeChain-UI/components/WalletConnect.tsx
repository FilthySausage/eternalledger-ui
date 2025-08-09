import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Wallet, Copy, LogOut, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface WalletConnectProps {
  isConnected: boolean;
  address: string;
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}

export function WalletConnect({ isConnected, address, onConnect, onDisconnect }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Mock wallet connection
    setTimeout(() => {
      const mockAddress = '0x742d35Cc6634C0532925a3b8d404fC5e6C8e7c8d';
      onConnect(mockAddress);
      toast.success('Wallet connected successfully');
      setIsConnecting(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    onDisconnect();
    toast.info('Wallet disconnected');
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied to clipboard');
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <Button 
        onClick={handleConnect} 
        disabled={isConnecting}
        className="flex items-center gap-2"
      >
        <Wallet className="size-4" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <div className="size-2 bg-green-500 rounded-full"></div>
          <span className="hidden sm:inline">{formatAddress(address)}</span>
          <Wallet className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="size-4 text-green-500" />
              <span className="text-sm">Connected</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              Mainnet
            </Badge>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm">Wallet Address</label>
            <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
              <code className="text-xs flex-1">{address}</code>
              <Button
                size="sm"
                variant="ghost"
                onClick={copyAddress}
                className="size-8 p-0"
              >
                <Copy className="size-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-xs text-muted-foreground">
              Balance: 2.45 ETH
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDisconnect}
              className="flex items-center gap-1 text-xs"
            >
              <LogOut className="size-3" />
              Disconnect
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}