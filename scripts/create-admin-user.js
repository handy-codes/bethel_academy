const { PrismaClient } = require('@prisma/client');
const { clerkClient } = require('@clerk/nextjs/server');

const prisma = new PrismaClient();

async function createAdminUser(email, role = 'admin') {
  try {
    console.log(`🚀 Creating ${role.toUpperCase()} user: ${email}...`);
    
    // Check if user already exists in Clerk
    let clerkUser;
    try {
      const users = await clerkClient.users.getUserList({
        emailAddress: [email]
      });
      
      if (users.data.length > 0) {
        clerkUser = users.data[0];
        console.log(`✅ User already exists in Clerk: ${email}`);
        
        // Update user metadata with role
        await clerkClient.users.updateUser(clerkUser.id, {
          publicMetadata: { role },
          privateMetadata: { role }
        });
        console.log(`✅ User role updated to ${role.toUpperCase()}`);
      }
    } catch (error) {
      console.log(`ℹ️  User not found in Clerk, creating new one: ${email}`);
    }

    // Create user in Clerk if it doesn't exist
    if (!clerkUser) {
      console.log(`📧 Creating user in Clerk: ${email}...`);
      const emailParts = email.split('@');
      const firstName = emailParts[0].split('.')[0] || emailParts[0];
      const lastName = emailParts[0].split('.')[1] || 'User';
      const username = emailParts[0].replace(/[^a-zA-Z0-9_-]/g, '_'); // Clean username
      
      clerkUser = await clerkClient.users.createUser({
        emailAddress: [email],
        firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
        lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
        username: username,
        password: 'TempSecurePass2024!@#', // Temporary password - user should change on first login
        publicMetadata: { role },
        privateMetadata: { role }
      });
      console.log(`✅ User created in Clerk: ${email}`);
      console.log(`🔑 Temporary password set: TempSecurePass2024!@#`);
      console.log(`   User can sign in with Google OAuth or change password on first login`);
    }

    // Create user in database
    console.log(`💾 Creating user in database: ${email}...`);
    const dbUser = await prisma.user.upsert({
      where: { email },
      update: {
        role,
        name: `${clerkUser.firstName} ${clerkUser.lastName}`
      },
      create: {
        email,
        name: `${clerkUser.firstName} ${clerkUser.lastName}`,
        role
      }
    });

    console.log(`✅ User created/updated in database: ${email}`);

    console.log(`\n🎉 ${role.toUpperCase()} user created successfully!`);
    console.log(`\n📋 User Details:`);
    console.log(`   Email: ${email}`);
    console.log(`   Role: ${role.toUpperCase()}`);
    console.log(`   Authentication: Google OAuth`);
    console.log(`   Clerk ID: ${clerkUser.id}`);
    console.log(`   Database ID: ${dbUser.id}`);
    
    console.log(`\n🔑 Next Steps:`);
    console.log('1. Start your development server: npm run dev');
    console.log('2. Go to: http://localhost:3000');
    console.log('3. Click "Login" button in the navbar');
    console.log('4. Click "Continue with Google"');
    console.log(`5. Sign in with: ${email}`);
    console.log('6. You will see the appropriate dashboard link in the navbar');
    console.log('7. Click it to access your dashboard');
    
    console.log(`\n⚠️  Note: Make sure Google OAuth is enabled in your Clerk dashboard`);
    console.log('   and that Clerk environment variables are set in your .env file');

  } catch (error) {
    console.error(`❌ Error creating ${role} user:`, error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node scripts/create-admin-user.js <email> [role]');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/create-admin-user.js paxymek@gmail.com ADMIN');
  console.log('  node scripts/create-admin-user.js john.doe@student.com STUDENT');
  console.log('  node scripts/create-admin-user.js jane.smith@lecturer.com LECTURER');
  console.log('');
  console.log('Roles: ADMIN, STUDENT, LECTURER (default: ADMIN)');
  process.exit(1);
}

const email = args[0];
const role = (args[1] || 'ADMIN').toLowerCase();

// Validate email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.error('❌ Invalid email address');
  process.exit(1);
}

// Validate role
const validRoles = ['admin', 'student', 'lecturer'];
if (!validRoles.includes(role)) {
  console.error('❌ Invalid role. Must be one of: ADMIN, STUDENT, LECTURER');
  process.exit(1);
}

// Run the function
createAdminUser(email, role)
  .then(() => {
    console.log('\n✅ User creation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ User creation failed:', error);
    process.exit(1);
  });
