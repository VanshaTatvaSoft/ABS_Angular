import { formatDate } from "@angular/common";
import { ConfirmDialogConfig } from "../../core/models/confirm-dialog.interface";
import { TimeFormatService } from "../../core/services/time-format-service/time-format-service";
import { Workbook } from "exceljs";
import fs from 'file-saver';
import { MyScheduleViewModel } from "../../core/models/my-schedule.interface";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

export const MyScheduleColumns = [
  { key: 'serial', header: '#', sortable: false },
  { key: 'clientName', header: 'Client Name', sortable: true },
  { key: 'service', header: 'Service', sortable: false },
  { key: 'servicePrice', header: 'Service Price', sortable: true },
  { key: 'appointmentDate', header: 'Appointment Date', sortable: true },
  { key: 'startTime', header: 'Start Time', sortable: false },
  { key: 'endTime', header: 'End Time', sortable: false }
];

export const CompleteAppointmentConfirmationDailog: ConfirmDialogConfig = {
  title: "Complete Appointment",
  text: "Are you sure you want to complete this appointment?",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: 'Yes, complete it!',
  cancelButtonText: 'No, keep it'
}

export function checkCancelAppointment(appDate: string, appStartTime: string, timeFormatService: TimeFormatService): boolean {
  try {
    if (!appDate || !appStartTime) return false;

    const [day, month, year] = appDate.split('/').map(Number);
    appStartTime = timeFormatService.transform(appStartTime, '24hr');
    const [hours, minutes] = appStartTime.split(':').map(Number);

    if (
      isNaN(day) || isNaN(month) || isNaN(year) ||
      isNaN(hours) || isNaN(minutes)
    ) {
      return false;
    }

    const appointmentDateTime = new Date(year, month - 1, day, hours, minutes);

    const now = new Date();
    const appointmentDay = formatDate(appointmentDateTime, 'yyyy-MM-dd', 'en-IN');
    const today = formatDate(now, 'yyyy-MM-dd', 'en-IN');

    if (appointmentDay < today) return true;

    if (appointmentDay === today) {
      return appointmentDateTime <= now;
    }

    return false;
  } catch (err) {
    return false;
  }
}

export async function exportToExcelHelper(
  entireData: MyScheduleViewModel,
  columns: { key: string; header: string }[],
  userName: string,
  filter: string,
  searchData: string | null,
  sortBy: string,
  sortDirection: string
) {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('My Schedule');
  let userRow = worksheet.addRow([]);
  userRow.getCell(1).value = {
    richText: [
      { text: 'User: ', font: { bold: true } },
      { text: userName || '' }
    ]
  };
  let filterRow = worksheet.addRow([]);
  filterRow.getCell(1).value = {
    richText: [
      { text: 'Filter: ', font: { bold: true } },
      { text: filter.toUpperCase() || '' }
    ]
  };
  let searchRow = worksheet.addRow([]);
  searchRow.getCell(1).value = {
    richText: [
      { text: 'Search: ', font: { bold: true } },
      { text: searchData || '' }
    ]
  };
  let sortByRow = worksheet.addRow([]);
  sortByRow.getCell(1).value = {
    richText: [
      { text: 'Sort By: ', font: { bold: true } },
      { text: sortBy.toUpperCase() || '' }
    ]
  };
  let sortDirectionRow = worksheet.addRow([]);
  sortDirectionRow.getCell(1).value = {
    richText: [
      { text: 'Sort Direction: ', font: { bold: true } },
      { text: sortDirection.toUpperCase() || '' }
    ]
  };

  worksheet.addRow([]);

  const headers = columns.map(c => c.header);
  worksheet.addRow(headers);

  entireData?.myScheduleList.forEach((item, index) => {
    const row = worksheet.addRow([
      index + 1,
      item.clientName,
      item.service,
      item.servicePrice,
      item.appointmentDate,
      item.startTime,
      item.endTime
    ]);
    row.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
  });

  worksheet.getRow(worksheet.lastRow!.number - entireData!.myScheduleList.length).eachCell(cell => {
    cell.font = { bold: true };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFCCCCCC' }
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  fs.saveAs(blob, `MySchedule_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export async function exportToPdf(
  entireData1: MyScheduleViewModel,
  columns: { key: string; header: string }[],
  userName: string,
  filter: string,
  searchData: string | null,
  sortBy: string,
  sortDirection: string,
  userImg: string | null,
  getProfileImageUrl: (imgPath: string) => string
) {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(`Provider: ${userName}`, 14, 20);
  if (userImg) {
    try {
      const imgPath = userImg.split("/").pop();
      const imageUrl = getProfileImageUrl(imgPath!);
      const response = await fetch(imageUrl, { mode: "cors", credentials: "include" });
      const blob = await response.blob();

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Draw circular cropped image using canvas
      const circularImage = await new Promise<string>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const size = 60;
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d")!;

          // Clip in a circle
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();

          ctx.drawImage(img, 0, 0, size, size);
          resolve(canvas.toDataURL("image/png"));
        };
        img.src = base64;
      });

      doc.addImage(circularImage, "PNG", 160, 10, 30, 30); // x,y,w,h
    } catch (err) {
      console.error("Error loading profile image:", err);
    }
  }

  doc.setFontSize(12);
  doc.text(`Filter: ${filter.toUpperCase()}`, 14, 35);
  doc.text(`Search: ${searchData || ''}`, 14, 42);
  doc.text(`Sort By: ${sortBy.toUpperCase()}`, 14, 49);
  doc.text(`Sort Direction: ${sortDirection.toUpperCase()}`, 14, 56);

  const headers = columns.map(c => c.header);
  const entireData = entireData1?.myScheduleList.map((item, index) => [
    index + 1,
    item.clientName,
    item.service,
    item.servicePrice,
    item.appointmentDate,
    item.startTime,
    item.endTime
  ]);
  autoTable(doc, {
    startY: 65,
    head: [headers],
    body: entireData,
    theme: 'grid',
    headStyles: { fillColor: [220, 220, 220], textColor: 20, halign: 'center' },
    bodyStyles: { halign: 'center', valign: 'middle' },
    styles: { fontSize: 10 },
  });

  doc.save(`MySchedule_${new Date().toISOString().split('T')[0]}.pdf`);
}