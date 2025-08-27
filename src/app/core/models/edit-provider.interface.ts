export interface EditProviderViewModel {
  providerId: number;
  email: string | null;
  name: string;
  phoneNo: string;
  providerAvailabilityId: number;
  isRecurring: boolean;
  isAvailable: boolean;
  startTime: string; // Format: "HH:mm:ss" (TimeOnly maps to string)
  endTime: string;   // Format: "HH:mm:ss"
  days: string[];
}
