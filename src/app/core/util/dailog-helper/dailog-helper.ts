import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";

export function openDailog<T>(
  dialog: MatDialog,
  component: any,
  width: string,
  data: any = {},
  maxHeight: string = '90vh',
  disableClose = true,
  autoFocus = false
): Observable<any>{
  const dailogRef = dialog.open(component, {
    width,
    maxHeight,
    disableClose,
    autoFocus,
    data
  })
  return dailogRef.afterClosed();
}