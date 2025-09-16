const { PrismaClient } = require('@prisma/client');
const { clerkClient } = require('@clerk/nextjs/server');

const prisma = new PrismaClient();

// Admin email for Walsam - this will be used for Google OAuth
const ADMIN_EMAIL = 'walsam4christ@gmail.com';

async function setupWalsamGoogleAdmin() {
  try {
    console.log('🚀 Setting up Walsam admin user for Google OAuth...');
    
    // Check if admin user already exists in Clerk
    let clerkUser;
    try {
      const users = await clerkClient.users.getUserList({
        emailAddress: [ADMIN_EMAIL]
      });
      
      if (users.data.length > 0) {
        clerkUser = users.data[0];
        console.log('✅ Walsam admin user already exists in Clerk');
      }
    } catch (error) {
      console.log('ℹ️  Walsam admin user not found in Clerk, will create new one');
    }

    // Create admin user in Clerk if it doesn't exist
    // Note: This creates a user that can sign in with Google OAuth
    if (!clerkUser) {
      console.log('📧 Creating Walsam admin user in Clerk for Google OAuth...');
      clerkUser = await clerkClient.users.createUser({
        emailAddress: [ADMIN_EMAIL],
        firstName: 'Walsam',
        lastName: 'Admin',
        username: 'walsam4christ',
        // No password set - user will sign in with Google
        publicMetadata: {
          role: 'admin'
        },
        privateMetadata: {
          role: 'admin'
        }
      });
      console.log('✅ Walsam admin user created in Clerk for Google OAuth');
    } else {
      // Update existing user's metadata to ensure admin role
      await clerkClient.users.updateUser(clerkUser.id, {
        publicMetadata: {
          role: 'admin'
        },
        privateMetadata: {
          role: 'admin'
        }
      });
      console.log('✅ Walsam admin user role updated in Clerk');
    }

    // Create admin user in database
    console.log('💾 Creating Walsam admin user in database...');
    const adminUser = await prisma.user.upsert({
      where: { email: ADMIN_EMAIL },
      update: {
        role: 'admin',
        name: 'Walsam Admin'
      },
      create: {
        email: ADMIN_EMAIL,
        name: 'Walsam Admin',
        role: 'admin'
      }
    });

    console.log('✅ Walsam admin user created/updated in database');

    // Create some sample exams if they don't exist
    console.log('📚 Creating sample exams...');
    
    const sampleExams = [
      {
        id: 'walsam-math-exam',
        title: 'JAMB Mathematics Practice Test',
        description: 'Comprehensive mathematics test covering algebra, geometry, and calculus',
        subject: 'MATHEMATICS' as const,
        duration: 120,
        totalQuestions: 15,
        instructions: 'Read each question carefully and select the best answer. You can navigate between questions and change your answers before submitting.',
        isActive: true,
        createdBy: clerkUser.id
      },
      {
        id: 'walsam-english-exam',
        title: 'JAMB English Language Practice Test',
        description: 'English language test covering grammar, comprehension, and literature',
        subject: 'ENGLISH' as const,
        duration: 120,
        totalQuestions: 50,
        instructions: 'Read each question carefully and select the best answer.',
        isActive: true,
        createdBy: clerkUser.id
      },
      {
        id: 'walsam-physics-exam',
        title: 'Physics Fundamentals Test',
        description: 'Basic physics concepts covering mechanics, thermodynamics, and waves',
        subject: 'PHYSICS' as const,
        duration: 90,
        totalQuestions: 40,
        instructions: 'Read each question carefully and select the best answer.',
        isActive: true,
        createdBy: clerkUser.id
      }
    ];

    for (const examData of sampleExams) {
      await prisma.exam.upsert({
        where: { id: examData.id },
        update: examData,
        create: examData
      });
    }

    console.log('✅ Sample exams created');

    console.log('\n🎉 Walsam admin setup completed successfully!');
    console.log('\n📋 Admin Details:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Role: admin`);
    console.log(`   Authentication: Google OAuth`);
    console.log(`   Clerk ID: ${clerkUser.id}`);
    console.log(`   Database ID: ${adminUser.id}`);
    
    console.log('\n🔑 Next Steps:');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Go to: http://localhost:3000');
    console.log('3. Click "Login" button in the navbar');
    console.log('4. Click "Continue with Google"');
    console.log(`5. Sign in with: ${ADMIN_EMAIL}`);
    console.log('6. You will see "Admin Dashboard" link in the navbar');
    console.log('7. Click it to access the admin dashboard');
    console.log('8. Use the admin dashboard to create students and lecturers');
    
    console.log('\n⚠️  Important Notes:');
    console.log('   - Make sure Google OAuth is enabled in your Clerk dashboard');
    console.log('   - The user will sign in with their Google account');
    console.log('   - No password is required - only Google authentication');
    console.log('   - Make sure to set up Clerk environment variables in your .env file');
    console.log('   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key');
    console.log('   CLERK_SECRET_KEY=your_secret_key');

  } catch (error) {
    console.error('❌ Error setting up Walsam admin:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
if (require.main === module) {
  setupWalsamGoogleAdmin()
    .then(() => {
      console.log('\n✅ Walsam Google admin setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Walsam Google admin setup failed:', error);
      process.exit(1);
    });
}

module.exports = setupWalsamGoogleAdmin;
