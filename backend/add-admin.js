require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function addAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.admin.upsert({
      where: { email: 'admin@iskcon.org' },
      update: { password: hashedPassword },
      create: {
        email: 'admin@iskcon.org',
        password: hashedPassword,
      },
    });

    console.log('✅ Admin created/updated successfully:', admin);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addAdmin();
