import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeFormatService {
  transform(value: string, mode: 'short' | '24hr' | '12hr' | 'full' | 'min'): string {
    if (!value) return '';

    switch (mode) {
      case 'min':
        const [hours, minutes] = value.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes;
        return `${totalMinutes}`;

      case 'short':
        // "HH:mm:ss" → "HH:mm"
        return value.length >= 5 ? value.slice(0, 5) : value;

      case '24hr':
        // "09:30 AM" → "09:30:00"
        const [hourPart, modifier] = value.split(' ');
        // if (!modifier) return value; // already 24hr
        let [h, m] = hourPart.split(':').map(Number);
        if (modifier === 'PM' && h < 12) h += 12;
        if (modifier === 'AM' && h === 12) h = 0;
        return `${h.toString().padStart(2, '0')}:${m
          .toString()
          .padStart(2, '0')}:00`;

      case '12hr':
        // "14:30:00" → "2:30 PM"
        const [hour, minute] = value.split(':').map(Number);
        const period = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 === 0 ? 12 : hour % 12;
        return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;

      case 'full':
        // "9:5" → "09:05:00"
        const parts = value.split(':');
        const hh = parts[0]?.padStart(2, '0') ?? '00';
        const mm = parts[1]?.padStart(2, '0') ?? '00';
        return `${hh}:${mm}:00`;

      default:
        return value;
    }
  }

  parseToDate(value: string): Date | null {
    if (!value) return null;

    let h = 0, m = 0;

    // Case 1: "HH:mm:ss" or "HH:mm"
    if (value.includes(':') && !value.includes('AM') && !value.includes('PM')) {
      const parts = value.split(':').map(Number);
      h = parts[0];
      m = parts[1] ?? 0;
    }

    // Case 2: "HH:mm AM/PM"
    else if (value.includes('AM') || value.includes('PM')) {
      const [hourPart, modifier] = value.split(' ');
      let [hh, mm] = hourPart.split(':').map(Number);
      if (modifier === 'PM' && hh < 12) hh += 12;
      if (modifier === 'AM' && hh === 12) hh = 0;
      h = hh;
      m = mm ?? 0;
    }

    // Build date object (all on same day, only hours/minutes matter)
    const date = new Date();
    date.setHours(h, m, 0, 0);

    return date;
  }
}
