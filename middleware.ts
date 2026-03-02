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
const isParentRoute = createRouteMatcher(['/parent(.*)']);

export default clerkMiddleware((auth, req) => {
  const pathname = req.nextUrl.pathname;

  // TEMPORARILY DISABLE ALL MIDDLEWARE PROTECTION FOR TESTING
  // Remove this return to re-enable route protection and role-based redirects
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

    if (isAdminRoute(req)) {
      if (userRole && userRole !== 'admin') {
        return Response.redirect(new URL(userRole === 'student' ? '/student' : '/lecturer', req.url));
      }
    }

    if (isStudentRoute(req)) {
      if (userRole && userRole !== 'student') {
        return Response.redirect(new URL(userRole === 'admin' ? '/admin' : '/lecturer', req.url));
      }
    }

    if (isLecturerRoute(req)) {
      if (userRole && userRole !== 'lecturer') {
        return Response.redirect(new URL(userRole === 'admin' ? '/admin' : '/student', req.url));
      }
    }

    if (isParentRoute(req)) {
      if (userRole && userRole !== 'parent') {
        return Response.redirect(new URL(userRole === 'admin' ? '/admin' : userRole === 'student' ? '/student' : '/lecturer', req.url));
      }
    }

    if (pathname === '/' && userRole) {
      if (userRole === 'admin') return Response.redirect(new URL('/admin', req.url));
      if (userRole === 'lecturer') return Response.redirect(new URL('/lecturer', req.url));
      if (userRole === 'student') return Response.redirect(new URL('/student', req.url));
      if (userRole === 'parent') return Response.redirect(new URL('/parent', req.url));
    }
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};



