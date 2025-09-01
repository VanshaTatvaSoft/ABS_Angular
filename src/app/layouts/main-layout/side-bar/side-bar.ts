import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ShowIfRoleDirective } from '../../../directives/show-if-role-directive';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, RouterLink, RouterLinkActive, ShowIfRoleDirective],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css'
})
export class SideBar {
  userRole = '';
  constructor(private authService: AuthService) {
    this.userRole = this.authService.getUserRole();
  }
}
