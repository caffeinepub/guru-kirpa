import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { useGetCallerUserRole } from '../hooks/useGetCallerUserRole';
import LoginButton from './LoginButton';
import { GraduationCap, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserRole } from '../backend';

interface HeaderProps {
  onNavigate?: (view: 'dashboard' | 'report' | 'admin') => void;
  currentView?: string;
}

export default function Header({ onNavigate, currentView }: HeaderProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: userRole } = useGetCallerUserRole();
  const isAuthenticated = !!identity;
  const isAdmin = userRole === UserRole.admin;

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate?.('dashboard')}
          >
            <img 
              src="/assets/generated/guru-kirpa-logo.dim_256x256.png" 
              alt="Guru Kirpa Logo" 
              className="h-12 w-12 rounded-lg shadow-sm"
            />
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Guru Kirpa</h1>
              <p className="text-sm text-muted-foreground">Educational Institute</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && userProfile && (
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/50">
                <GraduationCap className="h-5 w-5 text-accent-foreground" />
                <span className="text-sm font-medium text-accent-foreground">{userProfile.name}</span>
              </div>
            )}
            {isAdmin && currentView !== 'admin' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate?.('admin')}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                Admin
              </Button>
            )}
            <LoginButton />
          </div>
        </div>
      </div>
    </header>
  );
}
