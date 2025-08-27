import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ServiceRevenue } from '../../../core/models/provider-revenue.interface';

@Component({
  selector: 'app-provider-revenue',
  imports: [MatDialogActions, MatDialogContent, MatButtonModule],
  templateUrl: './provider-revenue.html',
  styleUrl: './provider-revenue.css'
})
export class ProviderRevenue {
  revenueList!: ServiceRevenue[];

  constructor(
    private dialogRef: MatDialogRef<ProviderRevenue>,
    @Inject(MAT_DIALOG_DATA) public data: []
  ) {
    this.revenueList = data;
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
