import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { SweetToastService } from '../../core/services/toast/sweet-toast.service';
import { CommonModule } from '@angular/common';
import { Loader } from '../../shared/components/loader/loader';
import { LoaderService } from '../../core/services/loader-service/loader-service';
import { MyProfile } from './my-profile/my-profile';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, CommonModule, RouterLinkActive, Loader],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {
  userRole = '';
  userName = '';
  isLoading = false;

  constructor( private authService: AuthService, private toastService: SweetToastService, private router: Router, private loaderService: LoaderService, private dialog: MatDialog){
    this.userName = authService.getUserName();
    this.userRole = authService.getUserRole();
    this.loaderService.loading$.subscribe(val => this.isLoading = val);
  }

  logout(): void {
    this.authService.logout().subscribe();
    this.toastService.showSuccess('Logged out successfully.');
    this.authService.clearUserState();
    this.router.navigate(['/login']);
  }

  myProfileClicked(): void{
    const dialogRef = this.dialog.open(MyProfile, {
      width: '500px',
      disableClose: true,     // ✅ Prevents closing via outside click
      autoFocus: false,       // Optional: prevent auto focus on first input
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

}
