import NextAuth, {Session} from "next-auth"
import authConfig from "@/auth.config";
import {apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes} from "@/routes"
import {NextRequest} from "next/server";


const {auth} = NextAuth(authConfig)
export default auth((req: NextRequest & { auth: Session | null }) : Response | undefined => {
    const {nextUrl} = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    // /auth/api 로 시작하면 무조건 통과
    if (isApiAuthRoute) {
        return;
    }

    if (isAuthRoute) {
        // 권한이 이미 존재하는데 Login, register 화면에 진입했을 때,
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl.origin))
        }
        // authRoute 는 권한이 없어도 진입 가능
        return;
    }

    if(!isLoggedIn && !isPublicRoute) {
        let callbackUrl = nextUrl.pathname;
        if(nextUrl.search) {
            callbackUrl += nextUrl.search
        }

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);

        return Response.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl.origin))
    }

    return;
})

// todo : 06:39

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
