import { SlotData } from "./available-slot.interface";

export interface RescheduleAppointmentViewModel {
  providerId: number;
  serviceId: number;
  appointmentId: number;
  appointmentDate: string;
  slotsAvailable: SlotData[];
}
