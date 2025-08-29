import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
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
import { SignalrService } from '../../core/services/signalr-service/signalr-service';
import { ChangePassword } from './change-password/change-password';
import { SideBar } from './side-bar/side-bar';
import { ConfirmationService } from '../../core/services/confirmation-service/confirmation-service';
import { MarkAllAsReadConfirmationDailog, MarkNotificationAsReadConfirmationDailog } from './main-layout.helper';
import { openDailog } from '../../core/util/dailog-helper/dailog-helper';
import { MyEarning } from './my-earning/my-earning';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, CommonModule, Loader, SideBar],
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

  constructor( private authService: AuthService, private toastService: SweetToastService, private router: Router, private loaderService: LoaderService, private dialog: MatDialog, private myScheduleService: MyScheduleService, private signalrService: SignalrService, private confirmDailogService: ConfirmationService){
    this.userRole = authService.getUserRole();
    this.userName = authService.getUserName();
    this.authService.userImage$.subscribe(url => { this.userImg = url; });
    this.authService.userName$.subscribe(name => { this.userName = name; });
    this.loaderService.loading$.subscribe(val => this.isLoading = val);
  }

  ngOnInit(): void {
    this.loadNotifications();
    this.signalrService.startConnection();
    this.signalrService.notificationOccur = (msg) => { this.loadNotifications(); }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.toastService.showSuccess('Logged out successfully.');
        this.router.navigate(['/login']);
      }
    });
  }

  sideBarToggel = () => this.sidebarCollapse = !this.sidebarCollapse;

  myProfileClicked = () => openDailog(this.dialog, MyProfile, '500px', {}, '').subscribe();

  changePasswordClicked = () => openDailog(this.dialog, ChangePassword, '500px', {}, '').subscribe();

  myEarningClicked = () => openDailog(this.dialog, MyEarning, '600px', {}, '').subscribe();

  loadNotifications(): void {
    if(this.userRole == 'provider') this.myScheduleService.notification().subscribe(data =>  this.notifications = data);
  }

  formatTimeAgo = (date: string): string => formatTimeAgo(date);

  markAsRead(notificationId: number): void {
    this.confirmDailogService.confirm(MarkNotificationAsReadConfirmationDailog).then(confirmed => {
      if(confirmed){
        this.myScheduleService.markAsRead(notificationId).subscribe({
          next: (res) => {
            this.toastService[res ? 'showSuccess' : 'showError'](res ? 'Notification marked as read' : 'Error occured');
            if(res) this.loadNotifications();
          }
        });
      }
    })
  }

  markAllAsRead(): void {
    if (this.notifications.length === 0) return;
    const unreadIds = this.notifications.filter(n => !n.isRead).map(n => n.notificationId);

    if (unreadIds.length === 0) {
      this.toastService.showInfo('No unread notifications');
      return;
    }

    this.confirmDailogService.confirm(MarkAllAsReadConfirmationDailog).then(confirmed => {
      if(confirmed){
        this.myScheduleService.markAllAsRead(unreadIds).subscribe({
          next: (res) => {
            this.toastService[res ? 'showSuccess' : 'showError'](res ? 'All notifications marked as read.' : 'Something went wrong.');
            if(res) this.loadNotifications();
          },
          error: () => this.toastService.showError('API error occurred')
        });
      }
    })
  }

}
