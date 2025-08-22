import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BookAppointmentInterface } from "../../core/models/book-appointment.interface";
import { TimeFormatService } from "../../core/services/time-format-service/time-format-service";
import { PhoneNumberValidator } from "../../shared/validators/phone-number.validator";
import { TimeRangeValidator } from "../../shared/validators/start-end-time.validator";
import { BookAppointmentStartTimeValidator } from "../../shared/validators/book-appointment-starttime.validator";
import { formatDate } from "@angular/common";
import { GenericInputInterface } from "@vanshasomani/generic-input";

export function buildBookingForm(
  fb: FormBuilder,
  data: BookAppointmentInterface | undefined,
  timeFormatService: TimeFormatService
): FormGroup {
  return fb.group(
    {
      clientId: [data?.clientId ?? null],
      clientName: [data?.clientName ?? '', Validators.required],
      clientPhoneNo: [data?.clientPhoneNo?.toString() ?? null, [Validators.required, PhoneNumberValidator]],
      clientEmail: [data?.clientEmail ?? null],
      appointmentDate: ['', Validators.required],
      endTime: ['', Validators.required],
      startTime: ['', Validators.required],
      serviceId: ['', Validators.required],
    },
    {
      validators: [
        TimeRangeValidator(timeFormatService, data?.serviceList ?? []),
        BookAppointmentStartTimeValidator(timeFormatService)
      ]
    }
  );
}

export function extractBookingFormValues(formValue: any, timeFormatService: TimeFormatService) {
  return {
    appointmentDate: formatDate(formValue.appointmentDate, 'yyyy-MM-dd', 'en-IN'),
    startTime: timeFormatService.transform(formValue.startTime, '24hr'),
    endTime: timeFormatService.transform(formValue.endTime, '24hr'),
    serviceId: formValue.serviceId
  };
}

export const bookAppointmentColumnHeader = [
  { key: 'serial', header: '#', sortable: false },
  { key: 'providerName', header: 'Provider Name', sortable: false },
  { key: 'providerEmail', header: 'Provider Email', sortable: false },
  { key: 'providerPhoneNo', header: 'Provider Phone No.', sortable: false },
];

export const BookingFormConfig: {
  clientName: GenericInputInterface;
  clientPhoneNo: GenericInputInterface;
  appointmentDate: GenericInputInterface;
  startTime: GenericInputInterface;
  endTime: GenericInputInterface;
} = {
  clientName: {
    appearance: 'outline',
    class: 'w-100',
    label: 'Name',
    type: 'text',
    name: 'clientName',
    id: 'clientName',
    placeholder: 'Enter your name',
    icon: 'person',
    customErrorMessages: {
      required: 'Name is required'
    }
  },
  clientPhoneNo: {
    appearance: 'outline',
    type: 'text',
    id: 'clientPhoneNo',
    label: 'Phone Number',
    name: 'clientPhoneNo',
    placeholder: 'Enter phone number',
    class: 'w-100',
    icon: 'phone',
    customErrorMessages: {
      required: 'Phone number is required',
      invalidPhone: 'Phone number is invalid',
      invalidLength: 'Length of phone number must be 10 digits'
    }
  },
  appointmentDate: {
    appearance: 'outline',
    class: 'w-100',
    label: 'Appointment Date',
    type: 'date',
    id: 'appointmentDate',
    name: 'appointmentDate',
    placeholder: 'Select appointment date',
    minDate: new Date(),
    customErrorMessages: {
      required: 'Appointment date is required',
      matDatepickerMin: 'Appointment date is invalid'
    }
  },
  startTime: {
    appearance: 'outline',
    class: 'w-100',
    label: 'Start Time',
    type: 'time picker',
    id: 'startTime',
    name: 'startTime',
    placeholder: 'Select start time',
    customErrorMessages: {
      required: 'Start time is required'
    }
  },
  endTime: {
    appearance: 'outline',
    class: 'w-100',
    label: 'End Time',
    type: 'time picker',
    id: 'endTime',
    name: 'endTime',
    placeholder: 'Select end time',
    customErrorMessages: {
      required: 'End time is required'
    }
  }
}