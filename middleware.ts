import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/college',
  '/tutorials', 
  '/tech',
  '/externals',
  '/sign-in(.*)',
  '/sign-up(.*)'
]);

// Define protected routes for each role
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isStudentRoute = createRouteMatcher(['/student(.*)']);
const isLecturerRoute = createRouteMatcher(['/lecturer(.*)']);

export default clerkMiddleware((auth, req) => {
  const pathname = req.nextUrl.pathname;
  
  console.log('=== MIDDLEWARE DEBUG ===');
  console.log('Path:', pathname);
  console.log('User ID:', auth().userId);
  console.log('========================');
  
  // TEMPORARILY DISABLE ALL MIDDLEWARE PROTECTION FOR TESTING
  // This will allow us to test if the admin page works without middleware interference
  return;
  
  // Protect routes that are not public
  if (!isPublicRoute(req)) {
    auth().protect();
  }
  
  // If user is signed in, handle role-based access
  if (auth().userId) {
    const sessionClaims = auth().sessionClaims;
    const userRole = (sessionClaims?.publicMetadata as any)?.role || 
                    (sessionClaims?.privateMetadata as any)?.role || 
                    (sessionClaims?.metadata as any)?.role;
    
    console.log('=== MIDDLEWARE DEBUG ===');
    console.log('Path:', pathname);
    console.log('User ID:', auth().userId);
    console.log('Detected Role:', userRole);
    console.log('========================');
    
    // Handle role-based access control
    if (isAdminRoute(req)) {
      if (!userRole) {
        console.log('No role detected for admin access - allowing access for development');
        // Allow access if no role is detected - let the component handle it
      } else if (userRole !== 'admin') {
        console.log(`User with role ${userRole} denied admin access`);
        return Response.redirect(new URL(userRole === 'student' ? '/student' : '/lecturer', req.url));
      }
    }
    
    if (isStudentRoute(req)) {
      if (!userRole) {
        console.log('No role detected for student access - allowing access for development');
        // Allow access if no role is detected - let the component handle it
      } else if (userRole !== 'student') {
        console.log(`User with role ${userRole} denied student access`);
        return Response.redirect(new URL(userRole === 'admin' ? '/admin' : '/lecturer', req.url));
      }
    }
    
    if (isLecturerRoute(req)) {
      if (!userRole) {
        console.log('No role detected for lecturer access - allowing access for development');
        // Allow access if no role is detected - let the component handle it
      } else if (userRole !== 'lecturer') {
        console.log(`User with role ${userRole} denied lecturer access`);
        return Response.redirect(new URL(userRole === 'admin' ? '/admin' : '/student', req.url));
      }
    }
    
    // Redirect from root based on role
    if (pathname === '/') {
      if (userRole) {
        console.log('Redirecting from root based on role:', userRole);
        if (userRole === 'admin') {
          return Response.redirect(new URL('/admin', req.url));
        } else if (userRole === 'lecturer') {
          return Response.redirect(new URL('/lecturer', req.url));
        } else if (userRole === 'student') {
          return Response.redirect(new URL('/student', req.url));
        }
      } else {
        console.log('No role detected on root, staying on homepage');
      }
    }
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};



