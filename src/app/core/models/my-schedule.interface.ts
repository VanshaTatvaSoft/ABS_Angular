import { PaginationInterface } from "./service-model.interface";

export interface ScheduleData {
  appointmentId: number;
  clientId: number;
  providerId: number;
  clientName: string;
  service: string;
  servicePrice: number;
  appointmentDate: string;  // Use string for DateOnly
  startTime: string;        // Use string for TimeOnly
  endTime: string;          // Use string for TimeOnly
  status: string;
}

export interface MyScheduleViewModel {
  providerId: number;
  myScheduleList: ScheduleData[];
  mySchedulePagination: PaginationInterface;
}