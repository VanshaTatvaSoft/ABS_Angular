import { GenericInputInterface } from "@vanshasomani/generic-input"

export const ServiceFormConfig: {
  serviceName: GenericInputInterface;
  serviceDesc: GenericInputInterface;
  price: GenericInputInterface;
  commission: GenericInputInterface;
  duration: GenericInputInterface;
} = {
  serviceName: {
    appearance: 'outline',
    class: 'w-100 mb-3',
    label: 'Service Name',
    type: 'text',
    placeholder: 'Enter service name',
    id: 'serviceName',
    name: 'serviceName',
    icon: 'settings',
    disabled: false,
    customErrorMessages: {
      required: 'Service name is required'
    }
  },
  serviceDesc: {
    appearance: 'outline',
    class: 'w-100 mb-3',
    label: 'Service Description',
    type: 'textarea',
    placeholder: '',
    id: 'serviceDesc',
    name: 'serviceDesc',
    rows: 1,
    disabled: false,
    customErrorMessages: {
      required: 'Service description is required'
    }
  },
  price: {
    appearance: 'outline',
    class: 'w-100 mb-3',
    label: 'Price',
    type: 'number',
    placeholder: 'Enter Price',
    id: 'servicePrice',
    name: 'servicePrice',
    icon: 'money',
    disabled: false,
    customErrorMessages: {
      required: 'Service price is required',
      min: 'Price must be greater then 1',
    }
  },
  commission: {
    appearance: 'outline',
    class: 'w-100 mb-3',
    label: 'Commission',
    type: 'number',
    placeholder: 'Enter Commission',
    id: 'serviceCommission',
    name: 'serviceCommission',
    icon: 'percentage',
    disabled: false,
    customErrorMessages: {
      required: 'Service commission is required',
      min: 'Commission must be greater then 1%',
      max: 'Commission cannot be more then 100%',
    }
  },
  duration: {
    appearance: 'outline',
    class: 'w-100 mb-3',
    label: 'Duration',
    type: 'time',
    placeholder: 'Enter Duration',
    id: 'serviceDuration',
    name: 'serviceDuration',
    disabled: false,
    icon: 'access_time',
    customErrorMessages: {
      required: 'Service duration is required',
      timeZero: 'Service duration cannot be zero'
    }
  }
}