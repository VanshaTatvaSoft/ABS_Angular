import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { SweetToastService } from '../../core/services/toast/sweet-toast.service';
import { CommonModule } from '@angular/common';
import { Loader } from '../../shared/components/loader/loader';
import { LoaderService } from '../../core/services/loader-service/loader-service';
import { MyProfile } from './my-profile/my-profile';
import { MatDialog } from '@angular/material/dialog';
import { MyScheduleService } from '../../core/services/my-schedule-services/my-schedule-service';
import { formatTimeAgo } from '../../core/services/notification-time/time-ago.util';
import { Notification } from '../../core/models/notification.interface';
import Swal from 'sweetalert2';
import { SignalrService } from '../../core/services/signalr-service/signalr-service';
import { ChangePassword } from './change-password/change-password';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, CommonModule, RouterLinkActive, Loader],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout implements OnInit {
  userRole = '';
  userName = '';
  userImg: string | null = null;
  isLoading = false;
  notifications: Notification[] = [];
  sidebarCollapse: boolean = false;

  constructor( private authService: AuthService, private toastService: SweetToastService, private router: Router, private loaderService: LoaderService, private dialog: MatDialog, private myScheduleService: MyScheduleService, private signalrService: SignalrService){
    this.userName = authService.getUserName();
    this.userRole = authService.getUserRole();
    this.authService.userImage$.subscribe(url => {
      this.userImg = url;
    });
    // this.userImg = authService.getUserImage();
    this.loaderService.loading$.subscribe(val => this.isLoading = val);
  }

  ngOnInit(): void {
    this.loadNotifications();
    this.signalrService.startConnection();
    this.signalrService.notificationOccur = (msg) => {
      this.loadNotifications();
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: (res) => {
        this.toastService.showSuccess('Logged out successfully.');
        this.authService.clearUserState();
        this.router.navigate(['/login']);
      }
    });
  }

  sideBarToggel(){
    this.sidebarCollapse = !this.sidebarCollapse;
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

  changePasswordClicked(): void{
    const dialogRef = this.dialog.open(ChangePassword, {
      width: '500px',
      disableClose: true,
      autoFocus: false,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  loadNotifications(): void {
    if(this.userRole == 'provider'){
      this.myScheduleService.notification().subscribe((data) => {
        this.notifications = data;
      });
    }
  }

  formatTimeAgo(date: string): string {
    return formatTimeAgo(date);
  }

  markAsRead(notificationId: number): void {
    console.log('Mark single notification as read:', notificationId);
    Swal.fire({
      title: "Are you sure?",
      text: "You want to mark this appointment as read",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        this.myScheduleService.markAsRead(notificationId).subscribe({
          next: (res) => {
            if(!res){
              this.toastService.showError('Error occured');
            }
            else{
              this.loadNotifications();
              this.toastService.showSuccess('Notification marked as read');
            }
          }
        });
      }
    });
  }

  markAllAsRead(): void {
    if (this.notifications.length === 0) return;

    const unreadIds = this.notifications
      .filter(n => !n.isRead)
      .map(n => n.notificationId);

    if (unreadIds.length === 0) {
      this.toastService.showInfo('No unread notifications');
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You want to mark all notifications as read?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        this.myScheduleService.markAllAsRead(unreadIds).subscribe({
          next: (res) => {
            if (!res) {
              this.toastService.showError('Something went wrong.');
            } else {
              this.toastService.showSuccess('All notifications marked as read.');
              this.loadNotifications(); // Refresh list
            }
          },
          error: () => this.toastService.showError('API error occurred')
        });
      }
    });
  }

}
