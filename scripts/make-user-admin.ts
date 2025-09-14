const { PrismaClient } = require('@prisma/client');
const { clerkClient } = require('@clerk/nextjs/server');

const prisma = new PrismaClient();

// Email to make admin
const USER_EMAIL = 'paxymek@gmail.com';

async function makeUserAdmin() {
  try {
    console.log('🚀 Making user admin for Bethel Academy...');
    console.log(`📧 Target email: ${USER_EMAIL}`);
    
    // Find user in Clerk
    let clerkUser;
    try {
      const users = await clerkClient.users.getUserList({
        emailAddress: [USER_EMAIL]
      });
      
      if (users.data.length === 0) {
        console.log('❌ User not found in Clerk. Please sign up first.');
        return;
      }
      
      clerkUser = users.data[0];
      console.log('✅ User found in Clerk');
    } catch (error) {
      console.log('❌ Error finding user in Clerk:', error);
      return;
    }

    // Update user's metadata to admin role in Clerk
    console.log('📧 Updating user role in Clerk...');
    await clerkClient.users.updateUser(clerkUser.id, {
      publicMetadata: {
        role: 'admin'
      },
      privateMetadata: {
        role: 'admin'
      }
    });
    console.log('✅ User role updated in Clerk');

    // Create or update user in database
    console.log('💾 Creating/updating user in database...');
    const adminUser = await prisma.user.upsert({
      where: { email: USER_EMAIL },
      update: {
        role: 'admin',
        name: clerkUser.firstName && clerkUser.lastName 
          ? `${clerkUser.firstName} ${clerkUser.lastName}`
          : 'Admin User'
      },
      create: {
        email: USER_EMAIL,
        name: clerkUser.firstName && clerkUser.lastName 
          ? `${clerkUser.firstName} ${clerkUser.lastName}`
          : 'Admin User',
        role: 'admin'
      }
    });

    console.log('✅ User created/updated in database');

    console.log('\n🎉 User successfully made admin!');
    console.log('\n📋 Admin Details:');
    console.log(`   Email: ${USER_EMAIL}`);
    console.log(`   Role: admin`);
    console.log(`   Clerk ID: ${clerkUser.id}`);
    console.log(`   Database ID: ${adminUser.id}`);
    
    console.log('\n🔑 Next Steps:');
    console.log('1. Sign out and sign back in with:', USER_EMAIL);
    console.log('2. You will see "Admin Dashboard" link in the navbar');
    console.log('3. Click it to access the admin dashboard');
    console.log('4. Use the admin dashboard to create students and lecturers');

  } catch (error) {
    console.error('❌ Error making user admin:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
if (require.main === module) {
  makeUserAdmin()
    .then(() => {
      console.log('\n✅ Setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = makeUserAdmin;
