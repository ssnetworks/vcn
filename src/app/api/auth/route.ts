import { NextResponse } from 'next/server';
import { getUserByUsername, hashPassword, addAuditLog } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const user = getUserByUsername(username);

    if (!user) {
      // Security: log failed login attempt
      addAuditLog(`Failed login attempt for username: ${username}`, 'SYSTEM');
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const hashedPassword = hashPassword(password);
    if (user.passwordHash !== hashedPassword) {
      addAuditLog(`Failed login attempt (incorrect password) for username: ${username}`, 'SYSTEM');
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Log successful login
    addAuditLog(`User logged in successfully`, username);

    return NextResponse.json({
      success: true,
      token: `session_${username}_${Date.now()}`,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Auth API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
