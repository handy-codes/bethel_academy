import { PrismaClient } from '@prisma/client';
import { clerkClient } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

interface CreateUserOptions {
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'student' | 'lecturer';
}

async function createUser({ email, firstName, lastName, role }: CreateUserOptions) {
  try {
    console.log(`🚀 Creating ${role} user: ${email}...`);
    
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
        console.log(`✅ User role updated to ${role}`);
      }
    } catch (error) {
      console.log(`ℹ️  User not found in Clerk, creating new one: ${email}`);
    }

    // Create user in Clerk if it doesn't exist
    if (!clerkUser) {
      console.log(`📧 Creating user in Clerk: ${email}...`);
      clerkUser = await clerkClient.users.createUser({
        emailAddress: [email],
        firstName,
        lastName,
        publicMetadata: { role },
        privateMetadata: { role }
      });
      console.log(`✅ User created in Clerk: ${email}`);
    }

    // Create user in database
    console.log(`💾 Creating user in database: ${email}...`);
    const dbUser = await prisma.user.upsert({
      where: { email },
      update: {
        role,
        name: `${firstName} ${lastName}`
      },
      create: {
        email,
        name: `${firstName} ${lastName}`,
        role
      }
    });

    console.log(`✅ User created/updated in database: ${email}`);

    console.log(`\n🎉 ${role} user created successfully!`);
    console.log(`\n📋 User Details:`);
    console.log(`   Email: ${email}`);
    console.log(`   Name: ${firstName} ${lastName}`);
    console.log(`   Role: ${role}`);
    console.log(`   Clerk ID: ${clerkUser.id}`);
    console.log(`   Database ID: ${dbUser.id}`);

    return { clerkUser, dbUser };

  } catch (error) {
    console.error(`❌ Error creating user ${email}:`, error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 4) {
    console.log('Usage: npm run create-user <email> <firstName> <lastName> <role>');
    console.log('Roles: admin, student, lecturer');
    console.log('Example: npm run create-user john.doe@example.com John Doe student');
    process.exit(1);
  }

  const [email, firstName, lastName, role] = args;

  if (!['admin', 'student', 'lecturer'].includes(role)) {
    console.error('❌ Invalid role. Must be: admin, student, or lecturer');
    process.exit(1);
  }

  createUser({ email, firstName, lastName, role: role as any })
    .then(() => {
      console.log('\n✅ User creation completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ User creation failed:', error);
      process.exit(1);
    });
}

export default createUser;







