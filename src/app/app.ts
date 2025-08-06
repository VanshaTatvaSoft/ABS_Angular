import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderService } from './core/services/loader-service/loader-service';
import { CommonModule } from '@angular/common';
import { Loader } from './shared/components/loader/loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Loader],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'ABS_Angular';
}
