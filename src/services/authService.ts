import type { User, LoginCredentials, RegisterData } from '../types';
import { INITIAL_USERS } from '../data/initialData';

const STORAGE_KEY_USERS = 'animal_welfare_users';
const STORAGE_KEY_TOKENS = 'animal_welfare_auth_tokens';
const STORAGE_KEY_SESSIONS = 'animal_welfare_sessions';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize users if localStorage is empty
const initializeUsers = (): void => {
  const existing = localStorage.getItem(STORAGE_KEY_USERS);
  if (!existing) {
    const usersWithDates = INITIAL_USERS.map(user => ({
      ...user,
      createdAt: new Date().toISOString(),
    }));
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(usersWithDates));
  }
};

initializeUsers();

// Get all users from storage
const getStoredUsers = (): User[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_USERS);
    if (!stored) return [];
    return JSON.parse(stored).map((user: any) => ({
      ...user,
      createdAt: new Date(user.createdAt),
      lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
    }));
  } catch {
    return [];
  }
};

// Save users to storage
const saveUsers = (users: User[]): void => {
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
};

// Generate JWT-like token (simplified)
const generateToken = (userId: string, email: string, role: string): string => {
  const payload = {
    userId,
    email,
    role,
    exp: Date.now() + 3600000, // 1 hour
  };
  return btoa(JSON.stringify(payload));
};

// Decode token
const decodeToken = (token: string): any => {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
};

// Verify token
const verifyToken = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return false;
  return decoded.exp > Date.now();
};

export const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<{ user: Omit<User, 'password'>; token: string }> => {
    await delay(500);
    
    const users = getStoredUsers();
    const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, lastLogin: new Date() } : u
    );
    saveUsers(updatedUsers);

    const token = generateToken(user.id, user.email, user.role);
    
    // Store token
    localStorage.setItem(STORAGE_KEY_TOKENS, JSON.stringify({ accessToken: token, userId: user.id }));
    
    // Store session
    const sessions = JSON.parse(localStorage.getItem(STORAGE_KEY_SESSIONS) || '[]');
    sessions.push({
      userId: user.id,
      token,
      createdAt: new Date().toISOString(),
      ipAddress: '127.0.0.1', // Simulated
    });
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions.slice(-10))); // Keep last 10

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  },

  // Register
  register: async (data: RegisterData): Promise<{ user: Omit<User, 'password'>; token: string }> => {
    await delay(600);
    
    const users = getStoredUsers();
    
    // Check if email already exists
    if (users.some(u => u.email === data.email)) {
      throw new Error('Email already registered');
    }

    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email: data.email,
      password: data.password,
      name: data.name,
      role: 'user',
      phone: data.phone,
      createdAt: new Date(),
    };

    users.push(newUser);
    saveUsers(users);

    const token = generateToken(newUser.id, newUser.email, newUser.role);
    localStorage.setItem(STORAGE_KEY_TOKENS, JSON.stringify({ accessToken: token, userId: newUser.id }));

    const { password, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword, token };
  },

  // Get current user
  getCurrentUser: async (): Promise<Omit<User, 'password'> | null> => {
    await delay(200);
    
    const tokensStr = localStorage.getItem(STORAGE_KEY_TOKENS);
    if (!tokensStr) return null;

    const tokens = JSON.parse(tokensStr);
    if (!verifyToken(tokens.accessToken)) {
      localStorage.removeItem(STORAGE_KEY_TOKENS);
      return null;
    }

    const decoded = decodeToken(tokens.accessToken);
    const users = getStoredUsers();
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Logout
  logout: async (): Promise<void> => {
    await delay(200);
    localStorage.removeItem(STORAGE_KEY_TOKENS);
  },

  // Verify token
  verifyToken: (token: string): boolean => {
    return verifyToken(token);
  },

  // Get stored token
  getStoredToken: (): string | null => {
    const tokensStr = localStorage.getItem(STORAGE_KEY_TOKENS);
    if (!tokensStr) return null;
    
    const tokens = JSON.parse(tokensStr);
    if (!verifyToken(tokens.accessToken)) {
      localStorage.removeItem(STORAGE_KEY_TOKENS);
      return null;
    }
    
    return tokens.accessToken;
  },

  // Check if user is admin
  isAdmin: (user: Omit<User, 'password'> | null): boolean => {
    return user?.role === 'admin';
  },
};

