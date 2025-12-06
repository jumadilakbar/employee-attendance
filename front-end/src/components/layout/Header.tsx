import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Users, Settings, BarChart3, FileText, Bell, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <BarChart3 className="h-4 w-4" /> },
  { 
    label: 'Employee Management', 
    href: '/employees', 
    icon: <Users className="h-4 w-4" />,
    children: [
      { label: 'All Employees', href: '/employees' },
      { label: 'Not Found page', href: '/employees/not-found' },
    ]
  },
  { label: 'Attendance', href: '/attendance', icon: <FileText className="h-4 w-4" /> },
  { label: 'User Management', href: '/users', icon: <User className="h-4 w-4" /> },
];

interface HeaderProps {
  onLoginClick?: () => void;
}

export function Header({ onLoginClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSubmenu = (label: string) => {
    setActiveSubmenu(activeSubmenu === label ? null : label);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavClick = (href: string) => {
    navigate(href);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Users className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">EmpTrack</span>
        </div>

        {/* Desktop Navigation */}
        {isAuthenticated && (
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <div key={item.label} className="relative group">
              <button
                  onClick={() => handleNavClick(item.href)}
                className={cn(
                  "nav-link flex items-center gap-1",
                    location.pathname === item.href && "text-primary font-medium",
                  item.children && "pr-1"
                )}
              >
                {item.icon}
                {item.label}
                {item.children && (
                  <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
                )}
              </button>
              
              {item.children && (
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-card rounded-lg border border-border shadow-lg py-2 min-w-[180px] animate-slide-down">
                    {item.children.map((child) => (
                        <button
                        key={child.label}
                          onClick={() => handleNavClick(child.href)}
                          className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        {child.label}
                        </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Bell className="h-5 w-5" />
          </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarFallback>
                        {user?.email.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.email}</p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {onLoginClick && (
          <Button onClick={onLoginClick} className="hidden md:flex bg-primary hover:bg-primary/90">
            Sign In
          </Button>
              )}
            </>
          )}
          
          {/* Mobile Menu Button */}
          {isAuthenticated && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isAuthenticated && (
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="container py-4 space-y-1">
          {navItems.map((item) => (
            <div key={item.label}>
              <button
                  onClick={() => {
                    if (item.children) {
                      toggleSubmenu(item.label);
                    } else {
                      handleNavClick(item.href);
                    }
                  }}
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-colors",
                    location.pathname === item.href && "bg-muted font-medium"
                  )}
              >
                <span className="flex items-center gap-3">
                  {item.icon}
                  {item.label}
                </span>
                {item.children && (
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      activeSubmenu === item.label && "rotate-180"
                    )}
                  />
                )}
              </button>
              
              {item.children && (
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-200",
                    activeSubmenu === item.label ? "max-h-[200px]" : "max-h-0"
                  )}
                >
                  <div className="pl-12 py-1 space-y-1">
                    {item.children.map((child) => (
                        <button
                        key={child.label}
                          onClick={() => handleNavClick(child.href)}
                          className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {child.label}
                        </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          
            <div className="pt-4 px-4 border-t border-border mt-4">
              <div className="px-4 py-2 mb-2">
                <p className="text-sm font-medium">{user?.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
              <Button onClick={handleLogout} variant="outline" className="w-full">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
            </Button>
          </div>
        </nav>
      </div>
      )}
    </header>
  );
}
