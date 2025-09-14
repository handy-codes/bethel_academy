import { PrismaClient } from '@prisma/client';
import { clerkClient } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

// Admin email for localhost setup
const ADMIN_EMAIL = 'paxymek@gmail.com';

async function setupAdmin() {
  try {
    console.log('🚀 Setting up admin user for Bethel Academy...');
    
    // Check if admin user already exists in Clerk
    let clerkUser;
    try {
      const users = await clerkClient.users.getUserList({
        emailAddress: [ADMIN_EMAIL]
      });
      
      if (users.data.length > 0) {
        clerkUser = users.data[0];
        console.log('✅ Admin user already exists in Clerk');
      }
    } catch (error) {
      console.log('ℹ️  Admin user not found in Clerk, will create new one');
    }

    // Create admin user in Clerk if it doesn't exist
    if (!clerkUser) {
      console.log('📧 Creating admin user in Clerk...');
      clerkUser = await clerkClient.users.createUser({
        emailAddress: [ADMIN_EMAIL],
        firstName: 'Admin',
        lastName: 'User',
        publicMetadata: {
          role: 'admin'
        },
        privateMetadata: {
          role: 'admin'
        }
      });
      console.log('✅ Admin user created in Clerk');
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
      console.log('✅ Admin user role updated in Clerk');
    }

    // Create admin user in database
    console.log('💾 Creating admin user in database...');
    const adminUser = await prisma.user.upsert({
      where: { email: ADMIN_EMAIL },
      update: {
        role: 'admin',
        name: 'Admin User'
      },
      create: {
        email: ADMIN_EMAIL,
        name: 'Admin User',
        role: 'admin'
      }
    });

    console.log('✅ Admin user created/updated in database');

    // Create some sample exams if they don't exist
    console.log('📚 Creating sample exams...');
    
    const sampleExams = [
      {
        id: 'sample-math-exam',
        title: 'JAMB Mathematics Practice Test',
        description: 'Comprehensive mathematics test covering algebra, geometry, and calculus',
        subject: 'MATHEMATICS' as const,
        duration: 120,
        totalQuestions: 50,
        instructions: 'Read each question carefully and select the best answer.',
        isActive: true,
        createdBy: clerkUser.id
      },
      {
        id: 'sample-english-exam',
        title: 'JAMB English Language Practice Test',
        description: 'English language test covering grammar, comprehension, and literature',
        subject: 'ENGLISH' as const,
        duration: 120,
        totalQuestions: 100,
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

    console.log('\n🎉 Admin setup completed successfully!');
    console.log('\n📋 Admin Details:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Role: admin`);
    console.log(`   Clerk ID: ${clerkUser.id}`);
    console.log(`   Database ID: ${adminUser.id}`);
    
    console.log('\n🔑 Next Steps:');
    console.log('1. Sign in with the admin email:', ADMIN_EMAIL);
    console.log('2. You will see "Admin Dashboard" link in the navbar');
    console.log('3. Click it to access the admin dashboard');
    console.log('4. Use the admin dashboard to create students and lecturers');
    
    console.log('\n⚠️  Note: Make sure to set up Clerk environment variables in your .env file');
    console.log('   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key');
    console.log('   CLERK_SECRET_KEY=your_secret_key');

  } catch (error) {
    console.error('❌ Error setting up admin:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
if (require.main === module) {
  setupAdmin()
    .then(() => {
      console.log('\n✅ Setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Setup failed:', error);
      process.exit(1);
    });
}

export default setupAdmin;







