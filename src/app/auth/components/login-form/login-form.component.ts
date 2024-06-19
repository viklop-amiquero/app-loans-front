import { Component, ViewChild, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { TokenService } from '@services/token.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RequestStatus } from '@models/request-status.models';
import { Profile, UpdateUser } from '@models/auth.model';
import { ToastrService } from 'ngx-toastr';
import { DialogcustomComponent } from 'src/app/admin/components/dialogcustom/dialogcustom.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DialogService } from '@services/dialog/dialog.service';
import { DomSanitizer } from '@angular/platform-browser';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { faEye, faHome, faFilePdf, faFileExcel, faPhone, faFile, faBirthdayCake, faFileCircleCheck, faCalendar, faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { AppRolMenuService } from '@services/security/approlmenu/approlmenu.service';
import { ColaboradorService } from '@services/colaborador/colaborador.service';
@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ MatCardModule, MatFormFieldModule, MatProgressSpinnerModule, ReactiveFormsModule, CommonModule,
            MatInputModule, MatButtonModule, FontAwesomeModule,
            CommonModule , DialogcustomComponent, MatDialogModule,  NgTemplateOutlet, RouterOutlet    ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginFormComponent implements OnInit {
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
  faUser = faUser;
  faLock = faLock;

  form = this.formBuilder.nonNullable.group({
    v_user: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^([0-9])*$/)]],
    v_password: ['', [ Validators.required, Validators.minLength(8)]]
  });

  get userFieldForm() {
    return this.form.get('v_user');
  }
  get isUserFieldValidForm() {
    return this.form.get('v_user')?.touched && this.form.get('v_user')?.valid;
  }
  get isUserFieldInvalidForm() {
    return this.form.get('v_user')?.touched && this.form.get('v_user')?.invalid;
  }

  get passwordFieldForm() {
    return this.form.get('v_password');
  }
  get isPasswordFieldValidForm() {
    return this.form.get('v_password')?.touched && this.form.get('v_password')?.valid;
  }
  get isPasswordFieldInvalidForm() {
    return this.form.get('v_password')?.touched && this.form.get('v_password')?.invalid;
  }

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
    return this.formChange?.get('password');
  }
  get newPasswordField() {
    return this.formChange?.get('password');
  }

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private colaboradorService: ColaboradorService,
    private appRolMenuService: AppRolMenuService,
    private tokenService: TokenService,
    private router: Router,
    private dialogService: DialogService,
    private formBuilder: FormBuilder,
    private modalService: MatDialog,
    private imgb64: DomSanitizer,
    public toastr: ToastrService,
    library: FaIconLibrary
  ) {
    this.buildForm();
    library.addIconPacks(fas);
  }

  status: RequestStatus = 'init';

  profile: Profile = {
    id:               0,
    id_person:        '',
    user_name:        '',
    name:             '',
    paternal_surname: '',
    maternal_surname: '',
    state:            '',
    id_role:          '',
    role:             '',
    changepassword:   '',
  };

  passwordold = "";
  passwordnew = "";
  usuario = "";
  ngOnInit() {
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

  @ViewChild('changePassword') contentModal:any;

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
        this.router.navigate(['/login']);
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
    } else {
      this.form.markAllAsTouched();
    }
  }

  consultingService = false;
  login() {
    if (this.form.valid) {
      this.consultingService = true;
      this.status = 'loading';
      const { v_user, v_password} = this.form.getRawValue();
      this.authService.login(v_user, v_password).subscribe(data => {
        this.authService.getProfile().subscribe(data => { this.profile = data });
        this.router.navigate(['/rapidiario/inicio']);
      }, response => {
        this.status = 'failed';
        this.consultingService = false;
        this.usuario = String(response.error?.value?.[0].message);
        if(this.usuario == "El usuario se bloqueo por exceso de intentos"){
          this.showErrorTry();
        } else if(this.usuario == "El usuario esta bloqueado"){
          this.showErrorBlocked();
        } else if(this.usuario == "El usuario esta inactivo"){
          this.showErrorInactive();
        } else if(this.usuario == "Su acceso al sistema ha expirado. Contacte con el administrador para renovar su acceso"){
          this.showErrorAccess();
        } else if(this.usuario == "Usuario y/o contraseña incorrectos" || "Usuario no autorizado"){
          this.showError();
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  showError(){
    this.toastr.error('Usuario y/o contraseña incorrectos.', 'Error', {
      timeOut: 3000,
    });
  }

  showErrorBlocked(){
    this.toastr.error('Usuario bloqueado.', 'Error', {
      timeOut: 3000,
    });
  }

  showErrorTry(){
    this.toastr.error('El usuario ha sido bloqueado por exceso de intentos.', 'Error', {
      timeOut: 3000,
    });
  }

  showErrorInactive(){
    this.toastr.error('Usuario inactivo.', 'Error', {
      timeOut: 3000,
    });
  }

  showErrorAccess(){
    this.toastr.error('Su acceso al sistema ha expirado.', 'Error', {
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

  changeStatus() {
    this.status = 'none';
  }
}
