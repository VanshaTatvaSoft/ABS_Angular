import { GenericInput, GenericInputInterface } from "@vanshasomani/generic-input";

export const EditProviderForm: {
  email: GenericInputInterface;
  name: GenericInputInterface;
  phoneNo: GenericInputInterface;
  isRecurring: GenericInputInterface;
  isAvailable: GenericInputInterface;
  startTime: GenericInputInterface;
  endTime: GenericInputInterface;
} = {
  email: {
    appearance: 'outline',
    class: 'w-100',
    label: 'Email address',
    type: 'email',
    name: 'providerEmail',
    id: 'providerEmail',
    placeholder: 'Enter email address',
    icon: 'email',
    disabled: true,
  },
  name: {
    appearance: 'outline',
    class: 'w-100',
    label: 'Provider Name',
    type: 'text',
    name: 'providerName',
    id: 'providerName',
    placeholder: 'Enter provider name',
    icon: 'person',
    customErrorMessages: {
      required: 'Provider name is required'
    }
  },
  phoneNo: {
    appearance: 'outline',
    label: 'Phone Number',
    class: 'w-100',
    type: 'text',
    name: 'providerPhoneNo',
    id: 'providerPhoneNo',
    placeholder: 'Enter phone number',
    icon: 'phone',
    customErrorMessages: {
      required: 'Phone number is required',
      invalidPhone: 'Phone number is invalid',
      invalidLength: 'Phone number must be of 10 digits'
    }
  },
  isRecurring: {
    appearance: 'outline',
    type: 'slide toggle',
    labelPosition: 'after',
    placeholder: 'isRecurring',
    id: 'isRecurringSwitch',
    name: 'isRecurringSwitch',
    label: 'Is Recurring'
  },
  isAvailable: {
    appearance: 'outline',
    type: 'slide toggle',
    labelPosition: 'after',
    placeholder: 'isAvailable',
    id: 'isAvailableSwitch',
    name: 'isAvailableSwitch',
    label: 'Is Available'
  },
  startTime: {
    appearance: 'outline',
    class: 'w-100',
    type: 'time picker',
    label: 'Start Time',
    placeholder: 'Select start time',
    id: 'startTime',
    name: 'startTime',
    customErrorMessages: {
      required: 'Start time is required'
    }
  },
  endTime: {
    appearance: 'outline',
    class: 'w-100',
    type: 'time picker',
    label: 'End Time',
    placeholder: 'Select end time',
    id: 'endTime',
    name: 'endTime',
    customErrorMessages: {
      required: 'End time is required'
    }
  }
}
