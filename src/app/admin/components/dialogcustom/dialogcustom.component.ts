import { Component, Inject, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'
//import { DialogCustomData } from '@models/auth.model'
import { DialogCustomData } from '@models/dialog.model';
import { CommonModule } from '@angular/common';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-dialogcustom',
  standalone: true,
  imports: [ CommonModule, FontAwesomeModule, MatDialogModule ],
  template: '<button type="button" class="closeDialogUp" mat-dialog-close><fa-icon [icon]="faXmark"></fa-icon></button><ng-container *ngTemplateOutlet="data.template"> </ng-container>',
  // templateUrl: './dialogcustom.component.html',
  styleUrl: './dialogcustom.component.scss'
})
export class DialogcustomComponent {

  faXmark = faXmark;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogCustomData){}

}
