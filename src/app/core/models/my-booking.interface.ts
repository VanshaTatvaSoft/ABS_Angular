export interface MyBookingViewModel {
  clientId: number;
  myBookingList: BookingData[];
}

export interface BookingData {
  appointmentId: number;
  clientId: number;
  providerId: number;
  providerName: string;
  service: string;
  servicePrice: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
}
