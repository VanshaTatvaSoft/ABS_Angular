export interface ProviderServiceViewModel {
  revenueList: ServiceRevenue[];
}

export interface ServiceRevenue {
  serviceName: string;
  servicePrice: string;
  serviceEarning: string;
}