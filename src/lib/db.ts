import fs from 'fs';
import path from 'path';

// Define Database Types
export interface Report {
  id: string;
  name?: string;
  isAnonymous: boolean;
  email?: string;
  phone?: string;
  country: string;
  state: string;
  category: string;
  dateOfIncident: string;
  socialMediaPlatform: string;
  description: string;
  evidenceUrl?: string; // base64 data URL or local path
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'New' | 'Under Investigation' | 'Resolved' | 'Dismissed';
  investigator?: string;
  consent: boolean;
  notes?: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  passwordHash: string; // stored as simple hash or string for demo, we will use basic hashing
  role: 'SuperAdmin' | 'Investigator';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  username: string;
  action: string;
  ip: string;
  timestamp: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Reviewed' | 'Archived';
  createdAt: string;
}

export interface DatabaseSchema {
  reports: Report[];
  users: User[];
  auditLogs: AuditLog[];
  inquiries?: Inquiry[];
}

// In-Memory cache fallback in case file system throws EROFS on serverless environments
let memoryDbCache: DatabaseSchema | null = null;

// Determine if we are running in a read-only environment like Vercel serverless functions
const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
const DB_FILE_PATH = isVercel
  ? path.join('/tmp', 'vcn_database.json')
  : path.join(process.cwd(), 'vcn_database.json');

// Simple hash function for passwords
export function hashPassword(password: string): string {
  // A simple, secure-enough-for-local-demo hash
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `hash_${hash}`;
}

// Initial seed data
const DEFAULT_USERS: User[] = [
  {
    id: 'usr_1',
    username: 'admin',
    passwordHash: hashPassword('vcn_ninja_secure'),
    role: 'SuperAdmin',
    createdAt: new Date('2026-07-01T10:00:00Z').toISOString(),
  },
  {
    id: 'usr_2',
    username: 'kailash_investigator',
    passwordHash: hashPassword('vcn_investigator_2026'),
    role: 'Investigator',
    createdAt: new Date('2026-07-02T11:00:00Z').toISOString(),
  }
];

const DEFAULT_REPORTS: Report[] = [
  {
    id: 'rep_1001',
    name: 'Sarah Jenkins',
    isAnonymous: false,
    email: 'sarah.j@example.com',
    phone: '+1-555-0199',
    country: 'United States',
    state: 'California',
    category: 'Cyber Harassment Assistance',
    dateOfIncident: '2026-07-05',
    socialMediaPlatform: 'Instagram',
    description: 'Received multiple threatening messages and deepfake images from an anonymous account claiming to know my home address. The harasser has been creating new accounts when blocked.',
    priority: 'High',
    status: 'Under Investigation',
    investigator: 'kailash_investigator',
    evidenceUrl: '/mock_evidence.png',
    consent: true,
    notes: 'Threat analysis completed. Located primary IP range of harasser using OSINT methods. Drafting platform complaint.',
    createdAt: new Date('2026-07-06T14:32:00Z').toISOString(),
  },
  {
    id: 'rep_1002',
    isAnonymous: true,
    country: 'India',
    state: 'Maharashtra',
    category: 'Women Cyber Safety Support',
    dateOfIncident: '2026-07-08',
    socialMediaPlatform: 'Telegram',
    description: 'Discovered a private channel sharing non-consensual images of college students. The group has over 2,000 members and is selling access.',
    priority: 'Critical',
    status: 'New',
    consent: true,
    createdAt: new Date('2026-07-09T08:15:00Z').toISOString(),
  },
  {
    id: 'rep_1003',
    name: 'Elena Rostova',
    isAnonymous: false,
    email: 'elena.ros@example.com',
    country: 'Canada',
    state: 'Ontario',
    category: 'Social Media Account Recovery Guidance',
    dateOfIncident: '2026-07-02',
    socialMediaPlatform: 'Facebook',
    description: 'My profile was hacked through a phishing link. The hijacker changed the recovery email and is now messaging my contacts asking for financial loans.',
    priority: 'Medium',
    status: 'Resolved',
    investigator: 'admin',
    consent: true,
    notes: 'Guided victim through official security escalation paths. Provided step-by-step account recovery wizard. Profile recovered, two-factor authentication set up.',
    createdAt: new Date('2026-07-03T18:45:00Z').toISOString(),
  },
  {
    id: 'rep_1004',
    isAnonymous: true,
    country: 'United Kingdom',
    state: 'London',
    category: 'Online Scam Reporting Guidance',
    dateOfIncident: '2026-07-04',
    socialMediaPlatform: 'WhatsApp',
    description: 'A scammer posing as a job recruiter stole €3,500 from me under the pretense of "home training kit deposits". Trying to report the crypto address they used.',
    priority: 'Medium',
    status: 'Resolved',
    investigator: 'admin',
    consent: true,
    notes: 'Traced crypto ledger transactions to a centralized exchange. Assisted victim in filing an official cyber fraud police report with the structured transaction evidence.',
    createdAt: new Date('2026-07-05T09:20:00Z').toISOString(),
  },
  {
    id: 'rep_1005',
    isAnonymous: true,
    country: 'United States',
    state: 'Texas',
    category: 'Ethical Hacking Awareness',
    dateOfIncident: '2026-07-07',
    socialMediaPlatform: 'Discord',
    description: 'Found a server teaching underage teens how to conduct DDoS attacks and spread remote access trojans (RATs). Reporting for safety review.',
    priority: 'Low',
    status: 'Dismissed',
    consent: true,
    notes: 'Server had already been reported and taken down by Discord Trust & Safety before investigation commenced.',
    createdAt: new Date('2026-07-08T11:05:00Z').toISOString(),
  }
];

const DEFAULT_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud_1',
    username: 'admin',
    action: 'System initialized and seeded',
    ip: '127.0.0.1',
    timestamp: new Date('2026-07-01T10:00:00Z').toISOString(),
  },
  {
    id: 'aud_2',
    username: 'admin',
    action: 'Created user kailash_investigator',
    ip: '127.0.0.1',
    timestamp: new Date('2026-07-02T11:05:00Z').toISOString(),
  },
  {
    id: 'aud_3',
    username: 'kailash_investigator',
    action: 'Assigned investigator for Case rep_1001',
    ip: '192.168.1.102',
    timestamp: new Date('2026-07-06T16:00:00Z').toISOString(),
  }
];

const DEFAULT_INQUIRIES: Inquiry[] = [
  {
    id: 'inq_1001',
    name: 'Melissa Vance',
    email: 'melissa.v@example.com',
    subject: 'Requesting school cyber awareness workshop',
    message: 'Hello, I am a school counselor at Oakridge High. We would love to host a cyber awareness seminar for our female students next month. Please let us know if you have operators available.',
    status: 'Unread',
    createdAt: new Date('2026-07-09T09:15:00Z').toISOString(),
  },
  {
    id: 'inq_1002',
    name: 'Robert C.',
    email: 'robert.c@example.com',
    subject: 'Cyber Stalking Guidance Inquiry',
    message: 'My daughter is experiencing continuous cyber stalking on Snapchat. We blocked the user but they keep making new accounts. Do you have a guide on how we should compile evidence for law enforcement?',
    status: 'Reviewed',
    createdAt: new Date('2026-07-08T14:22:00Z').toISOString(),
  }
];

// Read from JSON file
export function readDb(): DatabaseSchema {
  try {
    if (memoryDbCache) {
      return memoryDbCache;
    }

    if (!fs.existsSync(DB_FILE_PATH)) {
      const db: DatabaseSchema = {
        reports: DEFAULT_REPORTS,
        users: DEFAULT_USERS,
        auditLogs: DEFAULT_AUDIT_LOGS,
        inquiries: DEFAULT_INQUIRIES,
      };
      try {
        fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');
      } catch (writeErr) {
        console.warn('Unable to write seed to file system, using memory cache:', writeErr);
      }
      memoryDbCache = db;
      return db;
    }

    const fileData = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    const db: DatabaseSchema = JSON.parse(fileData);
    if (!db.inquiries) {
      db.inquiries = DEFAULT_INQUIRIES;
    }
    memoryDbCache = db;
    return db;
  } catch (error) {
    console.error('Error reading JSON DB, using seeded default:', error);
    const fallbackDb = {
      reports: DEFAULT_REPORTS,
      users: DEFAULT_USERS,
      auditLogs: DEFAULT_AUDIT_LOGS,
      inquiries: DEFAULT_INQUIRIES,
    };
    memoryDbCache = fallbackDb;
    return fallbackDb;
  }
}

// Write to JSON file
export function writeDb(db: DatabaseSchema): void {
  memoryDbCache = db;
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.warn('Failed to write JSON DB to disk (expected on read-only environments). Using in-memory fallback:', error);
  }
}

// Helper methods
export function getReports(): Report[] {
  const db = readDb();
  return db.reports;
}

export function getReportById(id: string): Report | undefined {
  const db = readDb();
  return db.reports.find(r => r.id === id);
}

export function addReport(report: Omit<Report, 'id' | 'createdAt' | 'status'>): Report {
  const db = readDb();
  const nextId = `rep_${Math.floor(1000 + Math.random() * 9000)}`;
  const newReport: Report = {
    ...report,
    id: nextId,
    status: 'New',
    createdAt: new Date().toISOString(),
  };
  db.reports.unshift(newReport); // Put new reports at the top
  writeDb(db);
  return newReport;
}

export function updateReport(id: string, updates: Partial<Report>): Report | undefined {
  const db = readDb();
  const index = db.reports.findIndex(r => r.id === id);
  if (index === -1) return undefined;
  
  db.reports[index] = {
    ...db.reports[index],
    ...updates,
  };
  writeDb(db);
  return db.reports[index];
}

export function deleteReport(id: string): boolean {
  const db = readDb();
  const initialLength = db.reports.length;
  db.reports = db.reports.filter(r => r.id !== id);
  if (db.reports.length === initialLength) return false;
  writeDb(db);
  return true;
}

export function getUsers(): User[] {
  const db = readDb();
  return db.users;
}

export function getUserByUsername(username: string): User | undefined {
  const db = readDb();
  return db.users.find(u => u.username.toLowerCase() === username.toLowerCase());
}

export function addUser(user: Omit<User, 'id' | 'createdAt'>): User {
  const db = readDb();
  const nextId = `usr_${Math.floor(10 + Math.random() * 90)}`;
  const newUser: User = {
    ...user,
    id: nextId,
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  writeDb(db);
  return newUser;
}

export function deleteUser(id: string): boolean {
  const db = readDb();
  const initialLength = db.users.length;
  db.users = db.users.filter(u => u.id !== id);
  if (db.users.length === initialLength) return false;
  writeDb(db);
  return true;
}

export function getAuditLogs(): AuditLog[] {
  const db = readDb();
  return db.auditLogs;
}

export function addAuditLog(action: string, username: string, ip: string = '127.0.0.1'): AuditLog {
  const db = readDb();
  const nextId = `aud_${Math.floor(100 + Math.random() * 900)}`;
  const newLog: AuditLog = {
    id: nextId,
    username,
    action,
    ip,
    timestamp: new Date().toISOString(),
  };
  db.auditLogs.unshift(newLog); // Put new logs at the top
  writeDb(db);
  return newLog;
}

export function getInquiries(): Inquiry[] {
  const db = readDb();
  return db.inquiries || [];
}

export function addInquiry(inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Inquiry {
  const db = readDb();
  const nextId = `inq_${Math.floor(1000 + Math.random() * 9000)}`;
  const newInquiry: Inquiry = {
    ...inquiry,
    id: nextId,
    status: 'Unread',
    createdAt: new Date().toISOString(),
  };
  if (!db.inquiries) db.inquiries = [];
  db.inquiries.unshift(newInquiry);
  writeDb(db);
  return newInquiry;
}

export function updateInquiryStatus(id: string, status: Inquiry['status']): Inquiry | undefined {
  const db = readDb();
  if (!db.inquiries) return undefined;
  const index = db.inquiries.findIndex(i => i.id === id);
  if (index === -1) return undefined;
  db.inquiries[index].status = status;
  writeDb(db);
  return db.inquiries[index];
}

export function deleteInquiry(id: string): boolean {
  const db = readDb();
  if (!db.inquiries) return false;
  const initialLength = db.inquiries.length;
  db.inquiries = db.inquiries.filter(i => i.id !== id);
  if (db.inquiries.length === initialLength) return false;
  writeDb(db);
  return true;
}
