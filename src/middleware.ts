import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Additional middleware logic can go here
    console.log('🔒 Middleware check for:', req.nextUrl.pathname)
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        console.log('🔍 Auth check for:', req.nextUrl.pathname)
        console.log('📋 Token:', token ? {
          email: token.email,
          role: token.role,
          id: token.id
        } : 'No token')
        
        // مؤقتاً: السماح للجميع بالوصول للـ dashboard
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          console.log('� Allowing dashboard access temporarily')
          return true // السماح للجميع مؤقتاً
        }
        // For other protected routes, just check if user is logged in
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ["/dashboard/:path*"]
}