import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

interface UserProps {
  id: string;
  avatar_url: string;
  name: string;
  email: string;
}

interface AuthContextData {
  user: UserProps | null;
  Login(userData: Request): Promise<void>;
  Logout(): void;
  updateUser(data: UserProps): void;
}

interface Request {
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<UserProps | null>(() => {
    const storagedUser = sessionStorage.getItem('@GoBarber:user');
    const storagedToken = sessionStorage.getItem('@GoBarber:token');

    if (storagedUser && storagedToken) {
      api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
      return JSON.parse(storagedUser);
    }

    return null;
  });

  const Login = useCallback(async ({ email, password }: Request) => {
    const { data } = await api.post('/sessions', {
      email,
      password,
    });

    setUser(data.user);
    api.defaults.headers.Authorization = `Bearer ${data.token}`;

    sessionStorage.setItem('@GoBarber:user', JSON.stringify(data.user));
    sessionStorage.setItem('@GoBarber:token', data.token);
  }, []);

  const Logout = useCallback(() => {
    setUser(null);
    api.defaults.headers.Authorization = '';

    sessionStorage.removeItem('@GoBarber:user');
    sessionStorage.removeItem('@GoBarber:token');
  }, []);

  const updateUser = useCallback((data: UserProps) => {
    setUser(data);

    sessionStorage.setItem('@GoBarber:user', JSON.stringify(data));
  }, []);

  return (
    <AuthContext.Provider value={{ user: user, Login, Logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
