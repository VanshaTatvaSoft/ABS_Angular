import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  "email": string,
  "username": string,
  "role": string,
  "userid": string,
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string,
  "exp": number,
  "iss": string,
  "aud": string
}

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  cookieService = inject(CookieService);

  private getAccessToken(): string | null {
    return this.cookieService.get('accessToken') || null;
  }

  getUserRole(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;

    const decoded = jwtDecode<JwtPayload>(token);
    return decoded["role"] || null;
  }

  getUserName(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;

    const decoded = jwtDecode<JwtPayload>(token);
    return decoded["username"] || null;
  }

}
