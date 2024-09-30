import { NextResponse } from 'next/server';

const redirectToDashboard = (request) => {
	const url = new URL('/dashboard', request.url);
	return NextResponse.redirect(url.toString());
};

const redirectToLogin = (request) => {
	const url = new URL('/', request.url);
	return NextResponse.redirect(url.toString());
};

export function middleware(request) {
	const token = request.cookies.get('token')?.value;

	// If token is present and the user is at the root URL, redirect to /dashboard
	if (token && request.nextUrl.pathname === '/') {
		return redirectToDashboard(request);
	}

	// If token is not present and the user is trying to access /dashboard, redirect to /
	if (!token) {
		return redirectToLogin(request);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/dashboard/:path*'],
};
