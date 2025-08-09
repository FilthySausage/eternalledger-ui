import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Shield, Search, FileText, User, ArrowRight, CheckCircle } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: 'public' | 'verifier' | 'user') => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="size-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Shield className="size-8 text-white" />
          </div>
          <h1 className="text-4xl font-semibold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LifeChain
          </h1>
        </div>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          A decentralized birth-to-death identity registry that creates verifiable life events, 
          issues Soulbound Death Tokens, and automates post-mortem actions through trusted attestations.
        </p>

        <div className="flex items-center justify-center gap-8 mt-8">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="size-4 text-green-600" />
            <span>Verifiable Identity</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="size-4 text-green-600" />
            <span>Trusted Attestations</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="size-4 text-green-600" />
            <span>Automated Post-Mortem</span>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto size-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <FileText className="size-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Birth Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Trusted verifiers register new identities with secure attestations and supporting documents.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto size-12 bg-amber-100 rounded-lg flex items-center justify-center mb-2">
              <Shield className="size-6 text-amber-600" />
            </div>
            <CardTitle className="text-lg">Life Events</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Track verifiable life events with multi-signature attestations from authorized institutions.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto size-12 bg-red-100 rounded-lg flex items-center justify-center mb-2">
              <User className="size-6 text-red-600" />
            </div>
            <CardTitle className="text-lg">Death Token & Automation</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Soulbound Death Tokens trigger automated actions like pension suspension and will execution.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Persona Cards */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl mb-2">Choose Your Role</h2>
          <p className="text-muted-foreground">Access the features designed for your specific needs</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="size-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Search className="size-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Public Search</CardTitle>
                  <CardDescription>General Public</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Verify life/death status, search public registry data, and export verification receipts.
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Search by Birth ID or Address</li>
                <li>• Verify life/death status</li>
                <li>• Export verification receipts</li>
                <li>• View quorum status</li>
              </ul>
              <Button 
                onClick={() => onNavigate('public')} 
                className="w-full group-hover:bg-primary/90"
              >
                Start Search
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="size-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield className="size-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Verifier Portal</CardTitle>
                  <CardDescription>Institutions & Verifiers</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Submit attestations, manage credentials, and collaborate with co-verifiers on life events.
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Submit birth/death attestations</li>
                <li>• Upload encrypted documents</li>
                <li>• Manage verification keys</li>
                <li>• Track compliance status</li>
              </ul>
              <Button 
                onClick={() => onNavigate('verifier')} 
                variant="outline"
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
              >
                Access Portal
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="size-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <User className="size-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">User Dashboard</CardTitle>
                  <CardDescription>Individuals & Guardians</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Manage your identity, configure automation settings, and control consent for executors.
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• View identity & event history</li>
                <li>• Configure automation toggles</li>
                <li>• Manage consent & delegation</li>
                <li>• Custody transition wizard</li>
              </ul>
              <Button 
                onClick={() => onNavigate('user')} 
                variant="secondary"
                className="w-full group-hover:bg-secondary/80"
              >
                My Dashboard
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trust & Security */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0">
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <h3 className="text-xl">Powered by Blockchain Technology</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built on decentralized infrastructure with cryptographic proofs, multi-signature attestations, 
              and immutable record keeping to ensure the highest levels of trust and security.
            </p>
            <div className="flex items-center justify-center gap-8 mt-6 text-sm">
              <span className="flex items-center gap-2">
                <div className="size-2 bg-green-500 rounded-full"></div>
                Immutable Records
              </span>
              <span className="flex items-center gap-2">
                <div className="size-2 bg-blue-500 rounded-full"></div>
                Multi-Sig Verification
              </span>
              <span className="flex items-center gap-2">
                <div className="size-2 bg-purple-500 rounded-full"></div>
                Privacy Preserving
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}