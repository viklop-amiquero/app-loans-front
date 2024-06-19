import { Component, TemplateRef, OnInit, ViewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Profile, UpdateUser } from '@models/auth.model';
import { AuthService } from '@services/auth.service';
import { TokenService } from '@services/token.service';
import { DialogService } from '@services/dialog/dialog.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogcustomComponent } from './../../../admin/components/dialogcustom/dialogcustom.component';
import { DomSanitizer } from '@angular/platform-browser';
import { valueListApp } from '@models/auth.model';
import { FontAwesomeModule  } from '@fortawesome/angular-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faEye, faHome, faFilePdf, faFileExcel, faPhone, faFile, faBirthdayCake, faFileCircleCheck, faCalendar, faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ColaboradorService } from '@services/colaborador/colaborador.service';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-list-app',
  standalone: true,
  imports: [MatSidenavModule, MatToolbarModule, MatMenuModule, MatCardModule, MatGridListModule, MatFormFieldModule, RouterOutlet, NgTemplateOutlet, MatButtonModule, FontAwesomeModule,
    CommonModule, MatInputModule, ReactiveFormsModule, MatDialogModule, MatIconModule],
  templateUrl: './list-app.component.html',
  styleUrl: './list-app.component.scss'
})
export class ListAppComponent implements OnInit {
  faArrowRightFromBracket = faArrowRightFromBracket;
  faHome = faHome;
  faFilePdf = faFilePdf;
  faFileExcel = faFileExcel;
  faPhone = faPhone;
  faFile = faFile;
  faBirthdayCake = faBirthdayCake;
  faFileCircleCheck = faFileCircleCheck;
  faCalendar = faCalendar;
  faNetworkWired = faNetworkWired;
  faEye = faEye;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  formChange!: FormGroup;

  private buildForm() {
    this.formChange = this.formBuilder.group({
      newpassword: ['', [Validators.required]],
      oldpassword: ['', [Validators.required]]
    })
  }

  hideoldp = true;
  hidenewp = true;

  get oldPasswordField() {
    return this.formChange.get('password');
  }
  get newPasswordField() {
    return this.formChange.get('password');
  }

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private dialogService: DialogService,
    private formBuilder: FormBuilder,
    private modalService: MatDialog,
    private colaboradorService: ColaboradorService,
    private imgb64: DomSanitizer,
    public toastr: ToastrService,
  ) {
    this.buildForm();
  }

  private matDialogRef!: MatDialogRef<DialogcustomComponent>

  openDialog(template: TemplateRef<any>) {
    this.matDialogRef = this.dialogService.openDialogCustom({
      template
    })
    this.matDialogRef
      .afterClosed()
      .subscribe(res => { this.formChange.reset() });
  }

  imgperfil: any;

  profile: Profile = {
    id: 0,
    id_person: '',
    user_name: '',
    name: '',
    paternal_surname: '',
    maternal_surname: '',
    state: '',
    id_role: '',
    role: '',
    changepassword: '',
  };

  valueListApp: valueListApp[] = [];
  ngOnInit(): void {
    this.authService.getProfile()
    .subscribe(data => { this.profile = data })
    if (this.profile.changepassword === "True") {
      this.logout()
    }

    this.colaboradorService.getClienteId(String(this.profile.id_person))
      .subscribe(data => {
        if (data.value.i_SEX_ID == 2) {
          this.imgperfil = '../../../../assets/images/photo-profile-male.jpg';
        }
        if (data.value.i_SEX_ID == 1) {
          this.imgperfil = '../../../../assets/images/photo-profile-female.jpg';
        }
    });
  }

  @ViewChild('changePassword') contentModal:any;

  passwordold = "";
  passwordnew = "";

  onSave() {
    if (this.formChange?.valid) {
      const changes: UpdateUser = {
        v_ID_USER: String(this.profile.id),
        v_PASSWORD: String(this.formChange?.value.oldpassword),
        v_NEW_PASSWORD: String(this.formChange?.value.newpassword),
      }
      this.authService.updateUser(changes)
      .subscribe(data => {
        this.formChange?.reset();
        this.matDialogRef.close();
        this.authService.logout();
        this.router.navigate(['./login']);
      }, response => {
        this.passwordnew = String(response.error?.V_NEW_PASSWORD?.[0]) === 'undefined' ? 'correcto' : 'incorrecto';
        if ( this.passwordnew =='incorrecto' ) {
          this.showErrorPassNew()
        }
        this.passwordold = String(response.error?.value?.[0].message);
        if(this.passwordold == "Contraseña incorrecta"){
          this.showErrorPassOld();
        }
        else if(this.passwordold == "Hay coincidencia. Contraseña ya usada"){
          this.showErrorSamePass();
        }
      })
    }
  }

  showError(){
    this.toastr.error('Usuario y/o contraseña incorrectos.', 'Error', {
      timeOut: 3000,
    });
  }

  showErrorPassOld(){
    this.toastr.error('Contraseña actual incorrecta.', 'Error', {
      timeOut: 3000,
    });
  }

  showErrorPassNew(){
    this.toastr.error('Incluya al menos una letra mayúscula, una letra minúscula, un número y un símbolo.', 'Error', {
      timeOut: 5000,
    });
  }

  showErrorSamePass(){
    this.toastr.error('La contraseña nueva no debe coincidir con ninguna otra anterior.', 'Error', {
      timeOut: 5000,
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['./login']);
  }
}
