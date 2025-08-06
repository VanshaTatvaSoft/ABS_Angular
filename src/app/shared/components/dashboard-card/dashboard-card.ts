import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-card.html',
  styleUrl: './dashboard-card.css'
})
export class DashboardCard {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() icon: string = '';
  @Input() color: string = 'primary';
  @Input() quickLink: string = '';
  @Input() quickLinkName: string = '';

}
