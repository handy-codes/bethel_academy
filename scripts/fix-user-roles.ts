const { PrismaClient } = require('@prisma/client');
const { clerkClient } = require('@clerk/nextjs/server');

const prisma = new PrismaClient();

async function fixUserRoles() {
  try {
    console.log('🔧 Fixing user roles in Bethel Academy CBT System...\n');
    
    // Get all users from Clerk
    console.log('📋 Fetching all users from Clerk...');
    const allUsers = await clerkClient.users.getUserList({ limit: 100 });
    console.log(`Found ${allUsers.data.length} users in Clerk\n`);
    
    let fixedCount = 0;
    let errorCount = 0;
    
    for (const user of allUsers.data) {
      const email = user.emailAddresses[0]?.emailAddress;
      if (!email) continue;
      
      const currentRole = user.publicMetadata?.role || user.privateMetadata?.role;
      
      console.log(`👤 Processing user: ${email}`);
      console.log(`   Current role: ${currentRole || 'NONE'}`);
      
      // If user has no role, we need to assign one
      if (!currentRole) {
        let assignedRole: string;
        
        // Auto-assign roles based on email patterns (you can customize this logic)
        if (email.includes('admin') || email === 'paxymek@gmail.com' || email === 'walsam4christ@gmail.com') {
          assignedRole = 'admin';
        } else if (email.includes('lecturer') || email.includes('teacher')) {
          assignedRole = 'lecturer';
        } else {
          assignedRole = 'student'; // Default to student
        }
        
        try {
          // Update user metadata in Clerk
          await clerkClient.users.updateUser(user.id, {
            publicMetadata: { role: assignedRole },
            privateMetadata: { role: assignedRole }
          });
          
          // Update or create user in database
          await prisma.user.upsert({
            where: { email },
            update: {
              role: assignedRole,
              name: `${user.firstName || 'Unknown'} ${user.lastName || 'User'}`
            },
            create: {
              email,
              name: `${user.firstName || 'Unknown'} ${user.lastName || 'User'}`,
              role: assignedRole
            }
          });
          
          console.log(`   ✅ Assigned role: ${assignedRole}`);
          fixedCount++;
        } catch (error) {
          console.log(`   ❌ Failed to assign role: ${error}`);
          errorCount++;
        }
      } else {
        console.log(`   ✅ Role already set: ${currentRole}`);
        
        // Ensure database is in sync
        try {
          await prisma.user.upsert({
            where: { email },
            update: {
              role: currentRole as string,
              name: `${user.firstName || 'Unknown'} ${user.lastName || 'User'}`
            },
            create: {
              email,
              name: `${user.firstName || 'Unknown'} ${user.lastName || 'User'}`,
              role: currentRole as string
            }
          });
        } catch (error) {
          console.log(`   ⚠️  Database sync failed: ${error}`);
        }
      }
      
      console.log(''); // Empty line for readability
    }
    
    console.log('🎉 User role fix completed!');
    console.log(`📊 Summary:`);
    console.log(`   Total users processed: ${allUsers.data.length}`);
    console.log(`   Roles fixed: ${fixedCount}`);
    console.log(`   Errors: ${errorCount}`);
    
    if (fixedCount > 0) {
      console.log('\n🔄 Please restart your application for changes to take effect.');
      console.log('💡 Users may need to sign out and sign back in to see role changes.');
    }
    
  } catch (error) {
    console.error('❌ Failed to fix user roles:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// CLI interface
if (require.main === module) {
  console.log('🚀 Starting user role fix process...\n');
  
  fixUserRoles()
    .then(() => {
      console.log('\n✅ User role fix completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ User role fix failed:', error);
      process.exit(1);
    });
}

module.exports = { fixUserRoles };
