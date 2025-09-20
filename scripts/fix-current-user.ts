const { clerkClient } = require('@clerk/nextjs/server');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixCurrentUser() {
  try {
    console.log('🔧 Fixing current user role...');
    
    // Get the admin email
    const adminEmail = 'paxymek@gmail.com';
    
    console.log(`Looking for user: ${adminEmail}`);
    
    // Find user in Clerk
    const users = await clerkClient.users.getUserList({
      emailAddress: [adminEmail]
    });
    
    if (users.data.length === 0) {
      console.log('❌ User not found in Clerk');
      return;
    }
    
    const user = users.data[0];
    console.log('✅ User found in Clerk');
    console.log('Current metadata:', user.publicMetadata);
    
    // Update user role in Clerk
    await clerkClient.users.updateUser(user.id, {
      publicMetadata: { role: 'admin' },
      privateMetadata: { role: 'admin' }
    });
    
    console.log('✅ Updated Clerk metadata');
    
    // Update in database
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        role: 'admin',
        name: `${user.firstName || 'Admin'} ${user.lastName || 'User'}`
      },
      create: {
        email: adminEmail,
        name: `${user.firstName || 'Admin'} ${user.lastName || 'User'}`,
        role: 'admin'
      }
    });
    
    console.log('✅ Updated database');
    console.log('🎉 User role fixed! Please sign out and sign back in.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixCurrentUser();
