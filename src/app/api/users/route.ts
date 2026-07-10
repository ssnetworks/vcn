import { NextResponse } from 'next/server';
import { getUsers, getUserByUsername, addUser, deleteUser, hashPassword, addAuditLog } from '@/lib/db';

export const dynamic = 'force-dynamic';

function validateSession(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer session_')) {
    return null;
  }
  const parts = authHeader.split('_');
  if (parts.length < 2) return null;
  return parts[1];
}

// GET /api/users - List users
export async function GET(request: Request) {
  try {
    const adminUser = validateSession(request);
    if (!adminUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const users = getUsers().map(u => ({
      id: u.id,
      username: u.username,
      role: u.role,
      createdAt: u.createdAt,
    }));

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/users - Create new investigator
export async function POST(request: Request) {
  try {
    const adminUser = validateSession(request);
    if (!adminUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Verify requesting user is SuperAdmin
    const requester = getUserByUsername(adminUser);
    if (!requester || requester.role !== 'SuperAdmin') {
      return NextResponse.json({ success: false, error: 'Forbidden. Only SuperAdmin can manage users.' }, { status: 403 });
    }

    const body = await request.json();
    const { username, password, role } = body;

    if (!username || !password || !role) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const existing = getUserByUsername(username);
    if (existing) {
      return NextResponse.json({ success: false, error: 'Username already exists' }, { status: 409 });
    }

    const newUser = addUser({
      username: username.toLowerCase().trim(),
      passwordHash: hashPassword(password),
      role: role || 'Investigator',
    });

    addAuditLog(`Created new team user account: ${newUser.username} (${newUser.role})`, adminUser);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        createdAt: newUser.createdAt,
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/users - Delete a user
export async function DELETE(request: Request) {
  try {
    const adminUser = validateSession(request);
    if (!adminUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const requester = getUserByUsername(adminUser);
    if (!requester || requester.role !== 'SuperAdmin') {
      return NextResponse.json({ success: false, error: 'Forbidden. Only SuperAdmin can delete users.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Missing user ID' }, { status: 400 });
    }

    // Prevent self-deletion
    const userToDelete = getUsers().find(u => u.id === userId);
    if (!userToDelete) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if (userToDelete.username.toLowerCase() === adminUser.toLowerCase()) {
      return NextResponse.json({ success: false, error: 'Self-deletion is not permitted' }, { status: 400 });
    }

    const success = deleteUser(userId);
    if (success) {
      addAuditLog(`Deleted team user account: ${userToDelete.username}`, adminUser);
      return NextResponse.json({ success: true, message: 'User deleted successfully' });
    }

    return NextResponse.json({ success: false, error: 'Failed to delete user' }, { status: 500 });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
