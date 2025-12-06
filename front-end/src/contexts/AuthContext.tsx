import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { AUTH_ME_QUERY, AuthMeData } from '@/graphql/auth.queries';
import { LOGIN_MUTATION, LoginVariables, LoginData } from '@/graphql/auth.queries';
import { User, UserRole } from '@/types/graphql';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refetchUser: () => void;
  isAdmin: boolean;
  isEmployee: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage for existing session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Define logout function first using useCallback
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    // Clear Apollo cache
    window.location.href = '/';
  }, []);

  // Query untuk mendapatkan user info dari token
  const { data: authMeData, loading: authMeLoading, refetch: refetchAuthMe, error: authMeError } = useQuery<AuthMeData>(
    AUTH_ME_QUERY,
    {
      skip: !localStorage.getItem('access_token'),
      onCompleted: (data) => {
        if (data?.authMe) {
          setUser(data.authMe);
          localStorage.setItem('user', JSON.stringify(data.authMe));
        }
      },
      onError: (error) => {
        // Token invalid atau expired - clear user state
        console.error('Auth error:', error);
        setUser(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      },
      errorPolicy: 'all', // Continue rendering even if there's an error
    }
  );

  // Login mutation
  const [loginMutation, { loading: loginLoading }] = useMutation<LoginData, LoginVariables>(
    LOGIN_MUTATION,
    {
      onCompleted: async (data) => {
        const token = data.login.access_token;
        localStorage.setItem('access_token', token);
        
        // Refetch user info setelah login
        const result = await refetchAuthMe();
        if (result.data?.authMe) {
          setUser(result.data.authMe);
          localStorage.setItem('user', JSON.stringify(result.data.authMe));
        }
      },
      onError: (error) => {
        console.error('Login error:', error);
        throw error;
      },
    }
  );

  const login = async (email: string, password: string) => {
    await loginMutation({
      variables: { email, password },
    });
  };

  const refetchUser = async () => {
    if (localStorage.getItem('access_token')) {
      const result = await refetchAuthMe();
      if (result.data?.authMe) {
        setUser(result.data.authMe);
        localStorage.setItem('user', JSON.stringify(result.data.authMe));
      }
    }
  };

  useEffect(() => {
    // Save to localStorage whenever user changes
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Compute role-based flags
  const isAdmin = useMemo(() => user?.role === UserRole.ADMIN, [user?.role]);
  const isEmployee = useMemo(() => user?.role === UserRole.EMPLOYEE, [user?.role]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !!localStorage.getItem('access_token'),
        loading: authMeLoading || loginLoading,
        login,
        logout,
        refetchUser,
        isAdmin,
        isEmployee,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

