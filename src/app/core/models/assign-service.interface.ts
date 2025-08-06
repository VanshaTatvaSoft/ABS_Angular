import { ServiceInfo } from "./service-model.interface";

export interface AssignServiceViewModel {
  providerId: number;
  providerName: string;
  providerEmail: string;
  existingServiceId: number[];
  serviceList: ServiceInfo[];
}