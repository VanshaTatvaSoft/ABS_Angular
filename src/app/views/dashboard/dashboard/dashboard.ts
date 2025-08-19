import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CustomInput } from '../../../shared/components/custom-input/custom-input';
import { DASHBOARDOPTIONS } from '../../../shared/constants/dashboard-options.constant';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DashboardService } from '../../../core/services/dashboard/dashboard.service';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { DashboardCard } from '../../../shared/components/dashboard-card/dashboard-card';
import { SignalrService } from '../../../core/services/signalr-service/signalr-service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [CustomInput, CommonModule, DashboardCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  dashboardForm: FormGroup;
  DropdownOptions = DASHBOARDOPTIONS;
  dashboardData: any;
  revenueChart: Chart | null = null;
  serviceChart: Chart | null = null;

  constructor(private fb: FormBuilder, private dashboardService: DashboardService, private signalrService: SignalrService){
    this.dashboardForm = this.fb.group({
      dashboardOption: ['-1']
    })
    this.loadDashboardData(this.dashboardOptionControl.value);
  }

  ngOnInit(): void {
    this.signalrService.startConnection();

    this.signalrService.dashboardUpdated = (msg) => {
      console.log('appointment booked');
      this.loadDashboardData(this.dashboardOptionControl.value);
    }

    this.dashboardOptionControl.valueChanges.subscribe((value) => {
      // console.log('Selected Option:', value);
      this.loadDashboardData(value);
    });
  }

  valuechange(newOption: string): void {
    // console.log('Selected Option:', newOption);
    this.loadDashboardData(newOption);
  }

  loadDashboardData(option: string): void {
    this.dashboardService.getDashboardData(option).subscribe({
      next: (res) => {
        if (res) {
          this.dashboardData = res;
          this.renderRevenueChart(res.revenues);
          this.renderServiceChart(res.appointmentServices);
          // console.log('Dashboard Data:', res);
        }
      },
      error: (err) => {
        console.error('Error fetching dashboard data:', err);
      }
    });
  }

  get dashboardOptionControl(): FormControl {
    return this.dashboardForm.get('dashboardOption') as FormControl;
  }

  renderRevenueChart(revenues: { revenueDate: string, revenue: number }[]): void {
    const labels = revenues.map(r => new Date(r.revenueDate).toLocaleDateString());
    const data = revenues.map(r => r.revenue);

    if (this.revenueChart) {
      this.revenueChart.destroy();
    }

    const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;

    this.revenueChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Revenue (₹)',
          data: data,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#007bff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Revenue (₹)'
            }
          }
        }
      }
    });
  }

  renderServiceChart(services: { serviceName: string, count: number }[]): void {
    const labels = services.map(s => s.serviceName);
    const data = services.map(s => s.count);

    if (this.serviceChart) this.serviceChart.destroy();

    const ctx = document.getElementById('servicePieChart') as HTMLCanvasElement;

    this.serviceChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Services',
          data: data,
          backgroundColor: [
            '#007bff', '#28a745', '#ffc107', '#dc3545', '#6610f2', '#17a2b8',
            '#008bff', '#28a743', '#fcc107', '#dd3545', '#6610f1', '#18a2b8'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw} appointments`
            }
          }
        }
      }
    });
  }

}
