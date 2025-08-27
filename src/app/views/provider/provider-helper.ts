import jsPDF from "jspdf";
import { ConfirmDialogConfig } from "../../core/models/confirm-dialog.interface";
import { MyScheduleService } from "../../core/services/my-schedule-services/my-schedule-service";
import { ProviderInfo } from "../../core/models/provider-model.interface";

export const DeleteProviderSwalConfig: ConfirmDialogConfig = {
  title: "Delete Provider",
  text: "Are you sure you want to delete this provider?",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: 'Yes, delete it!',
  cancelButtonText: 'No, keep it'
}

export const ProviderColumnHeader = [
  { key: 'serial', header: '#', sortable: false },
  { key: 'providerName', header: 'Provider Name', sortable: true },
  { key: 'email', header: 'Provider Email', sortable: true },
  { key: 'phoneNo', header: 'Provider Phone No.', sortable: false },
  { key: 'revenueGenerated', header: 'Revenue Generated', sortable: true },
];

export async function getBase64ImageFromURL(imgPathUrl: string, myScheduleService: MyScheduleService): Promise<string>{
  try {
    const imgPath = imgPathUrl.split("/").pop();
    const imageUrl = myScheduleService.getProfileImageUrl(imgPath!);
    const response = await fetch(imageUrl, { mode: "cors", credentials: "include" });
    const blob = await response.blob();
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    const circularImage = await new Promise<string>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const size = 60; // adjust size
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
    return circularImage;
  } catch (error) {
    console.error("Error loading image:", error);
    return "";
  }
}

export async function exportToPdf(
  userProfileImage: string | null,
  userName: string,
  userRole: string,
  myScheduleService: MyScheduleService,
  providerList: ProviderInfo[]
) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Provider List', 14, 18);
  doc.setFont('helvetica', 'normal');
  const userImage = userProfileImage;
  if(userImage) {
    const userImageData = await getBase64ImageFromURL(userImage, myScheduleService);
    doc.addImage(userImageData, "PNG", 170, 5, 20, 20);
  }
  doc.text(userName, 130, 14);
  doc.text(userRole, 130, 20);

  let y = 30;
  let rowIndex = 0;
  let rowHeight = 40;

  for (const provider of providerList) {
    if (rowIndex % 2 === 0) doc.setFillColor(175, 201, 224);
    else doc.setFillColor(217, 235, 250);
    doc.roundedRect(5, y - 5, 200, rowHeight, 5, 5, 'F');

    let imgData = '';
    if (provider.providerProfileImg) imgData = await getBase64ImageFromURL(provider.providerProfileImg, myScheduleService);

    doc.setFillColor(252, 252, 252);
    doc.roundedRect(10, y, 30, 30, 5, 5, 'F');
    if (imgData) doc.addImage(imgData, 'PNG', 10, y, 30, 30);
    else {
      doc.setFontSize(10);
      doc.text('N/A', 25, y + 15, { align: 'center' });
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Provider Name : ', 50, y+8);
    doc.setFont('helvetica', 'normal');
    doc.text(provider.providerName, 85, y+8);
    doc.setFont('helvetica', 'bold');
    doc.text('Provider Email : ', 50, y+16);
    doc.setFont('helvetica', 'normal');
    doc.text(provider.email, 85, y+16);
    doc.setFont('helvetica', 'bold');
    doc.text('Provider Phone No : ', 50, y+24);
    doc.setFont('helvetica', 'normal');
    doc.text(provider.phoneNo.toString(), 93, y+24);

    y += 45;
    if(y > 280){
      doc.addPage();
      y = 15;
    }
    rowIndex++;
  }
  doc.save('provider-list.pdf');
}
