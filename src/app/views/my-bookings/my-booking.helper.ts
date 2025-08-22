export function checkCancelAppointment(appDate: string, appStartTime: string): boolean {
  try {
    if (!appDate || !appStartTime) return false;
    const [day, month, year] = appDate.split('/').map(Number);
    const [hours, minutes] = appStartTime.split(':').map(Number);
    if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hours) || isNaN(minutes)) return false;
    const appointmentDateTime = new Date(year, month - 1, day, hours, minutes);
    const now = new Date();
    if (now >= appointmentDateTime) return false;
    const oneHourBefore = new Date(appointmentDateTime.getTime() - 60 * 60 * 1000);
    if (now >= oneHourBefore) return false;
    return true;
  } catch (err) {
    return false;
  }
}

export const cancelAppointmentSwalConfig = {
  title: 'Cancel Appointment',
  text: 'Are you sure you want to cancel this appointment?',
  confirmButtonText: 'Yes, cancel it!',
  cancelButtonText: 'No, keep it'
};

export const myBookingColumnHeader = [
  { key: 'serial', header: '#', sortable: false },
  { key: 'providerName', header: 'Provider Name', sortable: false },
  { key: 'service', header: 'Service', sortable: false },
  { key: 'servicePrice', header: 'Service Price', sortable: false },
  { key: 'appointmentId', header: 'Appointment Id', hidden: true },
  { key: 'appointmentDate', header: 'Appointment Date', sortable: false },
  { key: 'startTime', header: 'Start Time', sortable: false },
  { key: 'endTime', header: 'End Time', sortable: false },
];