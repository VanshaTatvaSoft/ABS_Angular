export interface BookAppointmentInterface {
  clientId: number;
  clientEmail: string;
  clientName: string;
  clientPhoneNo: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  serviceList: AppointmentServiceData[];
  providerList: AppointmentProviderData[];
}

export interface AppointmentServiceData {
  serviceId: number;
  serviceName: string;
  duration: string; // TimeSpan as ISO string (e.g., '00:30:00')
  price: number;
}

export interface AppointmentProviderData {
  providerId: number;
  providerName: string;
  providerEmail: string;
  providerPhoneNo: number;
  ratting: number;
}
