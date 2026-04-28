require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testLogin() {
  try {
    console.log('Testing login flow...\n');
    
    // Check if admin exists
    const admin = await prisma.admin.findUnique({
      where: { email: 'admin@iskcon.org' }
    });
    
    console.log('1. Admin record found:', admin ? 'YES' : 'NO');
    
    if (!admin) {
      console.log('❌ Admin not found in database');
      return;
    }
    
    console.log('   Email:', admin.email);
    console.log('   Hashed password:', admin.password.substring(0, 20) + '...');
    
    // Test password comparison
    const testPassword = 'admin123';
    const isMatch = await bcrypt.compare(testPassword, admin.password);
    
    console.log('\n2. Password verification:');
    console.log('   Test password:', testPassword);
    console.log('   Password matches:', isMatch ? '✅ YES' : '❌ NO');
    
    if (!isMatch) {
      console.log('\n   ⚠️ Password mismatch! Fixing...');
      const newHash = await bcrypt.hash('admin123', 10);
      await prisma.admin.update({
        where: { email: 'admin@iskcon.org' },
        data: { password: newHash }
      });
      console.log('   ✅ Password reset to admin123');
    }
    
    console.log('\n3. Summary:');
    console.log('   Email: admin@iskcon.org');
    console.log('   Password: admin123');
    console.log('   Status: Ready to login');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
