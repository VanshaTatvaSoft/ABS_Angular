import { Injectable, numberAttribute } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResponseInterface } from '../../models/response.interface';
import { MyProfileInterface } from '../../models/my-profile.interface';
import { JwtService } from '../jwt-service/jwt-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/UserLogin`;
  private userRoleSubject = new BehaviorSubject<string>('');
  private userNameSubject = new BehaviorSubject<string>('');
  private userImageSubject = new BehaviorSubject<string | null>(null);
  userRole$ = this.userRoleSubject.asObservable();
  userName$ = this.userNameSubject.asObservable();
  userImage$ = this.userImageSubject.asObservable();

  constructor(private http: HttpClient, private jwtService: JwtService) {}

  setUserRole(role: string | '') {
    if(role) this.userRoleSubject.next(role);
    else return;
  }

  setUserName(name: string | '') {
    if(name) this.userNameSubject.next(name);
    else return;
  }

  setUserImage(base64: string | null) {
    this.userImageSubject.next(base64);
  }

  getUserRole(): string {
    return this.userRoleSubject.getValue();
  }

  getUserName(): string {
    return this.userNameSubject.getValue();
  }

  clearUserState(): void {
    this.userRoleSubject.next('');
    this.userRoleSubject.complete();

    this.userNameSubject.next('');
    this.userNameSubject.complete();
  }

  login(data: any): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(`${this.apiUrl}/login`, data, {
      withCredentials: true,
    });
  }

  checkEmailExist(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-email-exist?email=${email}`, {
      withCredentials: true,
    });
  }

  register(data: any): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(`${this.apiUrl}/register`, data, {
      withCredentials: true,
    });
  }

  firstLogin(data: any): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(`${this.apiUrl}/first-change-password`, data, {
      withCredentials: true,
    });
  }

  forgotPassword(data: any): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(`${this.apiUrl}/forgot-password`, data, {
      withCredentials: true,
    });
  }

  resetPasswordCheck(email: string, token: string): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(`${this.apiUrl}/reset-password-check?email=${email}&token=${token}`, {
      withCredentials: true,
    });
  }

  resetPassword(data: any): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(`${this.apiUrl}/reset-password`, data, {
      withCredentials: true,
    });
  }

  rememberMe(): Observable<ResponseInterface>{
    return this.http.get<ResponseInterface>(`${this.apiUrl}/remember-me`, {
      withCredentials: true,
    });
  }

  logout(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/logout`, {
      withCredentials: true,
    });
  }

  validateAccessToken(): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(`${this.apiUrl}/validate-access-token`, {
      withCredentials: true,
    });
  }

  myProfileGet(): Observable<MyProfileInterface> {
    return this.http.get<MyProfileInterface>(`${this.apiUrl}/my-profile`, {
      withCredentials: true
    });
  }

  myProfilePost(profileData: FormData): Observable<ResponseInterface> {
    return this.http.put<ResponseInterface>(`${this.apiUrl}/my-profile`, profileData);
  }

  changePasswordPost(formData: any): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(`${this.apiUrl}/change-password`, formData);
  }

  getUserProfileImg(): Observable<ResponseInterface> {
    const userId : number = Number(this.jwtService.getUserId());
    return this.http.get<ResponseInterface>(`${this.apiUrl}/get-user-profile?userId=${userId}`)
  }

}
