/* eslint-disable @typescript-eslint/no-explicit-any */
// app/context/AuthContext.tsx
"use client";
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { UserProfile } from '../services/auth/authTypes';
import AuthService from '../services/auth/authService';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: UserProfile }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Проверяем токен при загрузке приложения
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        dispatch({ type: 'AUTH_FAILURE', payload: 'No token found' });
        return;
      }

      try {
        dispatch({ type: 'AUTH_START' });
        const userProfile = await AuthService.getProfile();
        dispatch({ type: 'AUTH_SUCCESS', payload: userProfile });
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        
        // Если токен истёк, пробуем обновить
        if (error.response?.status === 403 || error.response?.status === 401) {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const response = await AuthService.refresh(refreshToken);
              localStorage.setItem('authToken', response.accessToken);
              localStorage.setItem('refreshToken', response.refreshToken);
              
              // Повторно получаем профиль с новым токеном
              const userProfile = await AuthService.getProfile();
              dispatch({ type: 'AUTH_SUCCESS', payload: userProfile });
              return;
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
            }
          }
        }
        
        // Очищаем токены и показываем ошибку
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        dispatch({ type: 'AUTH_FAILURE', payload: 'Authentication failed' });
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await AuthService.login({ email, password });
      localStorage.setItem('authToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      const userProfile = await AuthService.getProfile();
      dispatch({ type: 'AUTH_SUCCESS', payload: userProfile });
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const refreshAuth = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    try {
      const response = await AuthService.refresh(refreshToken);
      localStorage.setItem('authToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      const userProfile = await AuthService.getProfile();
      dispatch({ type: 'AUTH_SUCCESS', payload: userProfile });
      
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      dispatch({ type: 'AUTH_FAILURE', payload: 'Token refresh failed' });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        clearError,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};