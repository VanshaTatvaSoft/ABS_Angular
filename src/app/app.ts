import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderService } from './core/services/loader-service/loader-service';
import { CommonModule } from '@angular/common';
import { Loader } from './shared/components/loader/loader';
import { DashboardService } from './core/services/dashboard/dashboard.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'ABS_Angular';
}
