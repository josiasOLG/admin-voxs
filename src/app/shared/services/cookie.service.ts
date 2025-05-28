import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  setCookie(
    name: string,
    value: string,
    options: {
      path?: string;
      expires?: Date;
      secure?: boolean;
      sameSite?: 'Strict' | 'Lax' | 'None';
    } = {}
  ): void {
    if (typeof document === 'undefined') return;

    let cookieString = `${name}=${encodeURIComponent(value)}`;

    if (options.path) {
      cookieString += `; path=${options.path}`;
    }

    if (options.expires) {
      cookieString += `; expires=${options.expires.toUTCString()}`;
    }

    if (options.secure) {
      cookieString += '; secure';
    }

    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    }

    document.cookie = cookieString;
  }

  getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const nameEQ = name + '=';
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  }

  deleteCookie(name: string, options: { path?: string } = {}): void {
    if (typeof document === 'undefined') return;

    const path = options.path || '/';
    document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }

  getAllCookies(): Record<string, string> {
    if (typeof document === 'undefined') return {};

    const cookies: Record<string, string> = {};
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      const c = ca[i].trim();
      const [name, value] = c.split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    }

    return cookies;
  }
}
