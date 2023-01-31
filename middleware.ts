import { NextRequest, NextResponse } from "next/server"

function generateCsrfToken(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(256 / 8));
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie
export default async function middleware(request: NextRequest) {
    const response = NextResponse.next();
    
    console.log(request.nextUrl.pathname, request.method)
    if (request.nextUrl.pathname.startsWith('/api') && !['GET', 'HEAD'].includes(request.method)) {
        const tokenInCookie = request.cookies.get('csrf-token');
        const tokenInRequest = request.headers.get('x-csrf-token');
        if (tokenInCookie !== tokenInRequest) {
            return new NextResponse(null, { status: 400 });
        }
    }

    response.cookies.set('csrf-token', generateCsrfToken(), {
        sameSite: 'strict',
        httpOnly: false,
    });

    return response;
}
