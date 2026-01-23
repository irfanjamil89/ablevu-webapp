"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  user_role: string;
  paid_contributor: boolean;
  email: string;
  profile_picture_url?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from API
  const fetchUserData = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // First try to get from sessionStorage
      const cachedUser = sessionStorage.getItem('user');
      if (cachedUser) {
        const parsedUser = JSON.parse(cachedUser);
        setUserState(parsedUser);
      }

      // Then fetch fresh data from API

    



      const response = await fetch( process.env.NEXT_PUBLIC_API_BASE_URL+'users/1',{
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserState(data);
        sessionStorage.setItem('user', JSON.stringify(data));
      } else if (response.status === 401) {
        // Token is invalid, clear everything
        localStorage.removeItem('access_token');
        sessionStorage.removeItem('user');
        setUserState(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load user on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Save to sessionStorage whenever user changes
  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      sessionStorage.setItem('user', JSON.stringify(newUser));
    } else {
      sessionStorage.removeItem('user');
    }
  };

  // Partial update of user
  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUserState(updatedUser);
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Refresh user data from API
  const refreshUser = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}users`, // Use the correct endpoint
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, refreshUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}