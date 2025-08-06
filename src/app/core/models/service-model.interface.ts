export interface ServiceInfo {
  serviceId: number;
  serviceName: string;
  serviceDesc: string;
  duration: string;
  price: number;
  count: number;
}

export interface PaginationInterface {
  currentPage: number;
  pageSize: number;
  totalRecord: number;
  totalPage: number;
  minRow: number;
  maxRow: number;
}

export interface ServiceModel {
  serviceList: ServiceInfo[];
  servicePagination: PaginationInterface;
}
