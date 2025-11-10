import { NextResponse } from 'next/server';

export function middleware(req) {
    console.log(req,'------------req')
    const url = req.nextUrl.clone();
    
    const token = req.cookies.get("token")?.value; 
    const userCookie = req.cookies.get('currentuser')?.value; 

    if (!userCookie) {
        return NextResponse.redirect(new URL('/login', req.url)); 
    }

    const user = JSON.parse(userCookie); 
    const role = user?.role; 
    console.log(role, 'role');
    if (url.pathname.startsWith('/vendors') && role === 'USER') {
        return NextResponse.redirect(new URL('/', req.url));
    }
    if (url.pathname.startsWith('/dashboard') && role === 'VENDOR') {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/vendors/:path*', '/dashboard/:path*'], 
};
