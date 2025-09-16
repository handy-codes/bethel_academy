import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/college',
  '/tutorials', 
  '/tech',
  '/externals',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/debug-role',
  '/debug-user'
]);

export default clerkMiddleware((auth, req) => {
  const pathname = req.nextUrl.pathname;
  
  // If user is signed in
  if (auth().userId) {
    // Try different ways to get the role
    const sessionClaims = auth().sessionClaims;
    const userRole = (sessionClaims?.publicMetadata as any)?.role || 
                    (sessionClaims?.privateMetadata as any)?.role || 
                    (sessionClaims?.metadata as any)?.role;
    
    console.log('=== MIDDLEWARE DEBUG ===');
    console.log('Path:', pathname);
    console.log('User ID:', auth().userId);
    console.log('Session Claims:', JSON.stringify(sessionClaims, null, 2));
    console.log('Detected Role:', userRole);
    console.log('========================');
    
    // If we can't detect the role, don't redirect - let the user stay where they are
    if (!userRole) {
      console.log('No role detected, allowing access to:', pathname);
      return;
    }
    
    // Only redirect if user is trying to access a different role's dashboard
    // Don't redirect if they're already on the correct dashboard
    
    // Temporarily disable redirects to debug the issue
    // if (userRole === 'admin' && pathname.startsWith('/student')) {
    //   console.log('Redirecting admin user from student to admin');
    //   return Response.redirect(new URL('/admin', req.url));
    // }
    
    // if (userRole === 'student' && pathname.startsWith('/admin')) {
    //   console.log('Redirecting student user from admin to student');
    //   return Response.redirect(new URL('/student', req.url));
    // }
    
    // if (userRole === 'lecturer' && (pathname.startsWith('/admin') || pathname.startsWith('/student'))) {
    //   console.log('Redirecting lecturer user to lecturer dashboard');
    //   return Response.redirect(new URL('/lecturer', req.url));
    // }
    
    // If user is on root and signed in, redirect based on role
    if (pathname === '/') {
      console.log('Redirecting from root based on role:', userRole);
      if (userRole === 'admin') {
        return Response.redirect(new URL('/admin', req.url));
      } else if (userRole === 'lecturer') {
        return Response.redirect(new URL('/lecturer', req.url));
      } else if (userRole === 'student') {
        return Response.redirect(new URL('/student', req.url));
      }
      // If role is unknown, don't redirect - let them stay on home page
    }
  }
  
  // Protect routes that are not public
  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};



