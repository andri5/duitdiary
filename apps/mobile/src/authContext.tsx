import { createContext, useContext } from 'react';
import type { User } from './lib/auth';

export type AuthContextValue = {
  setUser: (user: User | null) => void;
};

export const AuthContext = createContext<AuthContextValue>({
  setUser: () => undefined,
});

export const useAuth = () => useContext(AuthContext);

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};
