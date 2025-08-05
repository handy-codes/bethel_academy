import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { LiveClassUserRole } from "@prisma/client";

export async function syncUserRole(userId?: string) {
  try {
    console.log("Syncing user role for userId:", userId);
    
    if (!userId) {
      console.error("No userId provided for sync");
      return null;
    }
    
    // First check if user exists by clerk ID
    let user = await db.liveClassUser.findUnique({
      where: { clerkUserId: userId }
    });
    
    // If not found by clerk ID, try to find by email from Clerk
    if (!user) {
      try {
        // Use the function call syntax to avoid deprecation warning
        const clerkUser = await clerkClient().users.getUser(userId);
        const userEmail = clerkUser.emailAddresses[0]?.emailAddress;
        
        if (userEmail) {
          console.log("User not found by clerk ID, checking by email:", userEmail);
          
          // Try to find user by email
          user = await db.liveClassUser.findUnique({
            where: { email: userEmail }
          });
          
          // If found by email, update with clerk ID
          if (user) {
            console.log("Found user by email, updating with clerk ID");
            user = await db.liveClassUser.update({
              where: { id: user.id },
              data: { clerkUserId: userId }
            });
          }
        }
      } catch (clerkError) {
        console.error("Error fetching user from Clerk:", clerkError);
      }
    }
    
    // If still not found, create a new user
    if (!user) {
      try {
        // Use the function call syntax to avoid deprecation warning
        const clerkUser = await clerkClient().users.getUser(userId);
        const userEmail = clerkUser.emailAddresses[0]?.emailAddress;
        const userName = clerkUser.firstName && clerkUser.lastName 
          ? `${clerkUser.firstName} ${clerkUser.lastName}`
          : clerkUser.firstName || "New User";
        
        console.log("Creating new user with email:", userEmail);
        
        user = await db.liveClassUser.create({
          data: {
            clerkUserId: userId,
            email: userEmail || "",
            name: userName,
            role: LiveClassUserRole.LEARNER,
            isActive: true
          }
        });
        
        console.log("Created new user:", user.id);
      } catch (createError) {
        console.error("Error creating new user:", createError);
        return null;
      }
    }
    
    console.log("User sync successful:", { userId: user.id, role: user.role });
    return user;
  } catch (error) {
    console.error("Error in syncUserRole:", error);
    return null;
  }
} 