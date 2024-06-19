import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'
import { DialogcustomComponent } from '../../../admin/components/dialogcustom/dialogcustom.component';
import { DialogCustomData } from '@models/dialog.model';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private matDialog: MatDialog) { }

  openDialogCustom(data: DialogCustomData) {
    return this.matDialog.open(DialogcustomComponent, {
      data,
      disableClose: true,
      autoFocus: false,
    })
  }
}
