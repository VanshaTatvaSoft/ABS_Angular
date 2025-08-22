import { PaginationInterface, ServiceInfo } from "./service-model.interface"

export interface ProviderInfo{
  providerId: number,
  providerName: string,
  email: string,
  phoneNo: string,
  providerProfileImg: string
}

export interface ProviderModel{
  providerList: ProviderInfo[],
  providerPagination: PaginationInterface,
  serviceList: ServiceInfo[]
}