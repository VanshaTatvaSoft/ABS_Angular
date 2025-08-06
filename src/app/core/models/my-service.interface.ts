import { PaginationInterface, ServiceInfo } from "./service-model.interface";

export interface MyServiceViewModel{
  providerId: number,
  myServices: ServiceInfo[],
  servicePagination: PaginationInterface
}