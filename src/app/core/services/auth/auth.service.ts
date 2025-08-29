import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResponseInterface } from '../../models/response.interface';
import { MyProfileInterface } from '../../models/my-profile.interface';
import { JwtService } from '../jwt-service/jwt-service';
import { GenericService } from '../generic-service/generic-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private entryPoint = 'UserLogin';
  private userRoleSubject = new BehaviorSubject<string>('');
  private userNameSubject = new BehaviorSubject<string>('');
  private userImageSubject = new BehaviorSubject<string | null>(null);
  userRole$ = this.userRoleSubject.asObservable();
  userName$ = this.userNameSubject.asObservable();
  userImage$ = this.userImageSubject.asObservable();

  constructor(private jwtService: JwtService, private generic: GenericService) {}

  setUserRole = (role: string | '') => role ? this.userRoleSubject.next(role) : undefined;

  setUserName = (name: string | '') => name ? this.userNameSubject.next(name) : undefined;

  setUserImage = (base64: string | null) => this.userImageSubject.next(base64);

  getUserRole = (): string => this.userRoleSubject.getValue();

  getUserName = (): string => this.userNameSubject.getValue();

  getUserImage = (): string | null => this.userImageSubject.getValue();

  login = (data: any): Observable<ResponseInterface> => this.generic.create<ResponseInterface>(`${this.entryPoint}/login`, data);

  checkEmailExist = (email: string): Observable<boolean> => this.generic.getList<boolean>(`${this.entryPoint}/check-email-exist?email=${email}`);

  register = (data: any): Observable<ResponseInterface> => this.generic.create<ResponseInterface>(`${this.entryPoint}/register`, data);

  firstLogin = (data: any): Observable<ResponseInterface> => this.generic.create<ResponseInterface>(`${this.entryPoint}/first-change-password`, data);

  forgotPassword = (data: any): Observable<ResponseInterface> => this.generic.create<ResponseInterface>(`${this.entryPoint}/forgot-password`, data);

  resetPasswordCheck = (email: string, token: string): Observable<ResponseInterface> =>
    this.generic.getList<ResponseInterface>(`${this.entryPoint}/reset-password-check?email=${email}&token=${token}`);

  resetPassword = (data: any): Observable<ResponseInterface> => this.generic.create<ResponseInterface>(`${this.entryPoint}/reset-password`, data);

  rememberMe = (): Observable<ResponseInterface> => this.generic.getList<ResponseInterface>(`${this.entryPoint}/remember-me`);

  logout = (): Observable<any> => this.generic.getList<any>(`${this.entryPoint}/logout`);

  validateAccessToken = (): Observable<ResponseInterface> => this.generic.getList<ResponseInterface>(`${this.entryPoint}/validate-access-token`);

  myProfileGet = (): Observable<MyProfileInterface> => this.generic.getList<MyProfileInterface>(`${this.entryPoint}/my-profile`);

  myProfilePost = (profileData: FormData): Observable<ResponseInterface> => this.generic.update<ResponseInterface>(`${this.entryPoint}/my-profile`, profileData);

  changePasswordPost = (formData: any): Observable<ResponseInterface> => this.generic.create<ResponseInterface>(`${this.entryPoint}/change-password`, formData);

  getUserProfileImg = (): Observable<ResponseInterface> =>
    this.generic.getList<ResponseInterface>(`${this.entryPoint}/get-user-profile?userId=${Number(this.jwtService.getUserId())}`);

  getMyRevenue = (formData: any): Observable<number> =>
    this.generic.getList<number>(`${this.entryPoint}/get-my-earning`, {startDate: formData.startDate, endDate: formData.endDate, filter: formData.filter});

}
