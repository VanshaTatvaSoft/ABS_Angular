import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceRevenue } from '../../../core/models/provider-revenue.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-provider-revenue-page',
  imports: [CommonModule],
  templateUrl: './provider-revenue-page.html',
  styleUrl: './provider-revenue-page.css'
})
export class ProviderRevenuePage implements OnInit{
  providerId: number = 0;
  revenueList!: ServiceRevenue[];
  constructor(private route: ActivatedRoute){}

  ngOnInit(): void {
    // this.route.queryParams.subscribe(params => {
    //   this.providerId = +params['providerId'];
    //    this.providerService.getProviderRevenue(this.providerId).subscribe({
    //     next: (res) => {
    //       this.revenueList = res.revenueList;
    //     }
    //   })
    // })

    this.route.data.subscribe(data => {
      this.revenueList = data['revenueData']?.revenueList ?? [];
    })
  }
}
