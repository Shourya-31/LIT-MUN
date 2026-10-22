import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import argon2 from 'argon2';
import { Pool } from 'pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required to create an administrator.');

const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function createAdmin(): Promise<void> {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_FULL_NAME } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_FULL_NAME || ADMIN_PASSWORD.length < 12) {
    throw new Error('Set ADMIN_EMAIL, ADMIN_FULL_NAME, and ADMIN_PASSWORD (at least 12 characters).');
  }

  const email = ADMIN_EMAIL.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('An account with that email already exists; this command will not promote or overwrite it.');
  }

  const user = await prisma.user.create({
    data: {
      email,
      fullName: ADMIN_FULL_NAME.trim(),
      phone: 'Not provided',
      institution: 'LIT-MUN Secretariat',
      passwordHash: await argon2.hash(ADMIN_PASSWORD, { type: argon2.argon2id }),
      role: 'ADMIN',
      emailVerifiedAt: new Date(),
    },
    select: { id: true, email: true, role: true },
  });
  console.info(`Created administrator account ${user.email} (${user.id}).`);
}

try {
  await createAdmin();
} finally {
  await prisma.$disconnect();
  await pool.end();
}
