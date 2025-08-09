import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { PublicSearch } from './components/PublicSearch';
import { VerifierPortal } from './components/VerifierPortal';
import { UserDashboard } from './components/UserDashboard';
import { WalletConnect } from './components/WalletConnect';
import { Toaster } from './components/ui/sonner';

type Page = 'landing' | 'public' | 'verifier' | 'user';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string>('');
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');

  const handleWalletConnect = (address: string) => {
    setIsWalletConnected(true);
    setConnectedAddress(address);
  };

  const handleWalletDisconnect = () => {
    setIsWalletConnected(false);
    setConnectedAddress('');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'public':
        return <PublicSearch />;
      case 'verifier':
        return <VerifierPortal isConnected={isWalletConnected} />;
      case 'user':
        return <UserDashboard isConnected={isWalletConnected} address={connectedAddress} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage('landing')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="size-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">LC</span>
              </div>
              <span className="font-semibold text-lg">LifeChain</span>
            </button>
            
            {currentPage !== 'landing' && (
              <nav className="flex items-center gap-6 ml-8">
                <button
                  onClick={() => setCurrentPage('public')}
                  className={`text-sm transition-colors ${
                    currentPage === 'public' 
                      ? 'text-primary font-medium' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Public Search
                </button>
                <button
                  onClick={() => setCurrentPage('verifier')}
                  className={`text-sm transition-colors ${
                    currentPage === 'verifier' 
                      ? 'text-primary font-medium' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Verifier Portal
                </button>
                <button
                  onClick={() => setCurrentPage('user')}
                  className={`text-sm transition-colors ${
                    currentPage === 'user' 
                      ? 'text-primary font-medium' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  My Dashboard
                </button>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-4">
            <select
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value)}
              className="text-sm border rounded-lg px-3 py-1.5 bg-background"
            >
              <option value="ethereum">Ethereum</option>
              <option value="polygon">Polygon</option>
              <option value="arbitrum">Arbitrum</option>
            </select>
            
            <WalletConnect
              isConnected={isWalletConnected}
              address={connectedAddress}
              onConnect={handleWalletConnect}
              onDisconnect={handleWalletDisconnect}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>

      <Toaster />
    </div>
  );
}