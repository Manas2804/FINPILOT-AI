import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" },
});

export const config = {
  matcher: ["/dashboard/:path*", "/income/:path*", "/expenses/:path*", "/loans/:path*", "/profile/:path*"],
};
