import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key'
);

const ADMIN_TOKEN_NAME = 'admin-token';
const TOKEN_EXPIRY = '7d';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'editor';
  permissions: string[];
  createdAt: Date;
  lastLogin?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: AdminUser;
  token?: string;
  error?: string;
}

// Mock admin users (replace with database queries)
const MOCK_ADMIN_USERS: Array<AdminUser & { password: string }> = [
  {
    id: '1',
    email: 'admin@charity.org',
    name: 'Super Admin',
    role: 'super_admin',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/GHQJ8WM3u', // hashed 'admin123'
    permissions: ['*'],
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date()
  },
  {
    id: '2',
    email: 'editor@charity.org',
    name: 'Content Editor',
    role: 'editor',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/GHQJ8WM3u', // hashed 'editor123'
    permissions: ['read:all', 'write:content', 'write:events', 'write:causes'],
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date()
  }
];

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Create a JWT token for admin user
 */
export async function createToken(user: AdminUser): Promise<string> {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    permissions: user.permissions,
    iat: Math.floor(Date.now() / 1000)
  };

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

/**
 * Verify and decode JWT token
 */
export async function verifyToken(token: string): Promise<AdminUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as AdminUser['role'],
      permissions: payload.permissions as string[],
      createdAt: new Date(),
      lastLogin: new Date()
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Authenticate admin user with email and password
 */
export async function authenticateAdmin(credentials: LoginCredentials): Promise<AuthResult> {
  try {
    // Find user by email (replace with database query)
    const user = MOCK_ADMIN_USERS.find(u => u.email === credentials.email);
    
    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // Verify password
    const isValidPassword = await verifyPassword(credentials.password, user.password);
    
    if (!isValidPassword) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // Create token
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: user.permissions,
      createdAt: user.createdAt,
      lastLogin: new Date()
    };

    const token = await createToken(userWithoutPassword);

    return {
      success: true,
      user: userWithoutPassword,
      token
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      error: 'Authentication failed'
    };
  }
}

/**
 * Get current admin user from request
 */
export async function getCurrentAdmin(request: NextRequest): Promise<AdminUser | null> {
  try {
    const token = request.cookies.get(ADMIN_TOKEN_NAME)?.value;
    
    if (!token) {
      return null;
    }

    return await verifyToken(token);
  } catch (error) {
    console.error('Get current admin error:', error);
    return null;
  }
}

/**
 * Get current admin user from server-side cookies
 */
export async function getCurrentAdminFromCookies(): Promise<AdminUser | null> {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get(ADMIN_TOKEN_NAME)?.value;
    
    if (!token) {
      return null;
    }

    return await verifyToken(token);
  } catch (error) {
    console.error('Get current admin from cookies error:', error);
    return null;
  }
}

/**
 * Set admin authentication cookie
 */
export async function setAuthCookie(token: string) {
  const cookieStore = cookies();
  (await cookieStore).set(ADMIN_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  });
}

/**
 * Clear admin authentication cookie
 */
export async function clearAuthCookie() {
  const cookieStore = cookies();
  (await cookieStore).delete(ADMIN_TOKEN_NAME);
}

/**
 * Check if user has specific permission
 */
export function hasPermission(user: AdminUser, permission: string): boolean {
  // Super admin has all permissions
  if (user.role === 'super_admin' || user.permissions.includes('*')) {
    return true;
  }

  // Check specific permission
  return user.permissions.includes(permission);
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(user: AdminUser, permissions: string[]): boolean {
  return permissions.some(permission => hasPermission(user, permission));
}

/**
 * Check if user has all specified permissions
 */
export function hasAllPermissions(user: AdminUser, permissions: string[]): boolean {
  return permissions.every(permission => hasPermission(user, permission));
}

/**
 * Role-based access control
 */
export const ROLE_PERMISSIONS = {
  super_admin: ['*'],
  admin: [
    'read:all',
    'write:all',
    'delete:content',
    'manage:users',
    'manage:settings'
  ],
  editor: [
    'read:all',
    'write:content',
    'write:events',
    'write:causes',
    'write:blog'
  ]
} as const;

/**
 * Get permissions for a role
 */
export function getPermissionsForRole(role: AdminUser['role']): string[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Logout admin user
 */
export async function logoutAdmin(): Promise<void> {
  clearAuthCookie();
}