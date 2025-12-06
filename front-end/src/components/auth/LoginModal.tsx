import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, Eye, EyeOff, Users, User } from 'lucide-react';
import { useMutation } from '@apollo/client/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { REGISTER_MUTATION, RegisterVariables, RegisterData } from '@/graphql/auth.queries';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'signup';
type UserRole = 'EMPLOYEE' | 'ADMIN';

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<UserRole>('EMPLOYEE');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { login, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Register mutation
  const [registerMutation, { loading: registerLoading }] = useMutation<RegisterData, RegisterVariables>(
    REGISTER_MUTATION,
    {
      onCompleted: async (data) => {
        const token = data.register.access_token;
        localStorage.setItem('access_token', token);
        
        // Login setelah register
        await login(email, password);
        
        toast({
          title: 'Account Created',
          description: 'Your account has been created successfully!',
        });
        onClose();
        navigate('/dashboard');
      },
      onError: (error) => {
        toast({
          title: 'Registration Failed',
          description: error.message || 'Failed to create account. Please try again.',
          variant: 'destructive',
        });
      },
    }
  );

  if (!isOpen) return null;

  const isLoading = authLoading || registerLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'login') {
      try {
        await login(email, password);
        toast({
          title: 'Login Successful',
          description: 'Welcome back!',
        });
        onClose();
        navigate('/dashboard');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Invalid email or password. Please try again.';
        toast({
          title: 'Login Failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } else {
      // Register - Coming Soon
      const toastInstance = toast({
        title: 'Coming Soon',
        description: 'Registration feature will be available soon!',
      });

      // Dismiss toast after 10 seconds
      setTimeout(() => {
        toastInstance.dismiss();
      }, 10000);

      return;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Users className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {mode === 'login'
                  ? 'Sign in to your account'
                  : 'Sign up for a new account'}
              </p>
            </div>
          </div>

          {/* Auth mode toggle */}
          <div className="flex rounded-lg bg-muted p-1 mb-6">
            <button
              onClick={() => setMode('login')}
              className={cn(
                'flex-1 py-2 text-sm font-medium rounded-md transition-all',
                mode === 'login'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground'
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={cn(
                'flex-1 py-2 text-sm font-medium rounded-md transition-all',
                mode === 'signup'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground'
              )}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* Role selection - hanya untuk signup */}
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label>Role</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('EMPLOYEE')}
                  className={cn(
                    'p-3 rounded-lg border-2 text-center transition-all',
                    role === 'EMPLOYEE'
                      ? 'border-accent bg-accent/5'
                      : 'border-border hover:border-muted-foreground'
                  )}
                >
                  <p className="font-medium text-foreground">Employee</p>
                  <p className="text-xs text-muted-foreground">Access your profile</p>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={cn(
                    'p-3 rounded-lg border-2 text-center transition-all',
                    role === 'ADMIN'
                      ? 'border-accent bg-accent/5'
                      : 'border-border hover:border-muted-foreground'
                  )}
                >
                  <p className="font-medium text-foreground">Admin</p>
                  <p className="text-xs text-muted-foreground">Manage employees</p>
                </button>
              </div>
            </div>
          )}

          {/* Username - hanya untuk signup */}
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {mode === 'login' && (
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-accent hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : mode === 'login' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-accent hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-accent hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
