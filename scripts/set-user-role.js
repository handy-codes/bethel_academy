// Load environment variables
require('dotenv').config({ path: '.env.local' });
const { clerkClient } = require('@clerk/nextjs/server');

async function setUserRole(email, role) {
  try {
    console.log(`🔧 Setting role for ${email} to ${role}...`);
    
    // Find user by email
    const users = await clerkClient.users.getUserList({
      emailAddress: [email]
    });
    
    if (users.data.length === 0) {
      console.error(`❌ User not found: ${email}`);
      return;
    }
    
    const user = users.data[0];
    console.log(`✅ Found user: ${user.emailAddresses[0].emailAddress}`);
    
    // Update user metadata
    await clerkClient.users.updateUser(user.id, {
      publicMetadata: {
        role: role
      },
      privateMetadata: {
        role: role
      }
    });
    
    console.log(`✅ Successfully set role to ${role} for ${email}`);
    console.log(`📋 User ID: ${user.id}`);
    console.log(`📧 Email: ${user.emailAddresses[0].emailAddress}`);
    
  } catch (error) {
    console.error('❌ Error setting user role:', error);
  }
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length !== 2) {
  console.log('Usage: node scripts/set-user-role.js <email> <role>');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/set-user-role.js paxymek@gmail.com admin');
  console.log('  node scripts/set-user-role.js john.doe@student.com student');
  console.log('  node scripts/set-user-role.js jane.smith@lecturer.com lecturer');
  console.log('');
  console.log('Roles: admin, student, lecturer');
  process.exit(1);
}

const email = args[0];
const role = args[1].toLowerCase();

// Validate role
const validRoles = ['admin', 'student', 'lecturer'];
if (!validRoles.includes(role)) {
  console.error('❌ Invalid role. Must be one of: admin, student, lecturer');
  process.exit(1);
}

// Run the function
setUserRole(email, role)
  .then(() => {
    console.log('\n✅ Role setting completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Role setting failed:', error);
    process.exit(1);
  });
