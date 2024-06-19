import { Component, OnInit, TemplateRef } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Router, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRightFromBracket, faBars, faAngleRight, faAngleDown, faHouse, faRectangleList } from '@fortawesome/free-solid-svg-icons';
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from '@services/dialog/dialog.service';
import { AuthService } from '@services/auth.service';
import { DetailMenuRol, MenuUserRol, Profile, UpdateUser } from '@models/auth.model';
import { DomSanitizer } from '@angular/platform-browser';

import { MatDialogRef, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, } from '@angular/material/dialog';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DialogcustomComponent } from '../dialogcustom/dialogcustom.component';
import { faEye, faHome, faFilePdf, faFileExcel, faPhone, faFile, faBirthdayCake, faFileCircleCheck, faCalendar, faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AppRolMenuService } from '@services/security/approlmenu/approlmenu.service';
import { ColaboradorService } from '@services/colaborador/colaborador.service';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MatSidenavModule, MatToolbarModule, MatMenuModule, RouterOutlet, CommonModule, MatButtonModule, FontAwesomeModule,
          MatInputModule, ReactiveFormsModule, MatDialogModule, MatDialogActions, MatDividerModule,
          MatDialogClose, MatDialogContent, MatDialogTitle, RouterLink, MatIconModule, MatListModule, MatExpansionModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent implements OnInit {
  faBars = faBars;
  faAngleRight = faAngleRight;
  faAngleDown = faAngleDown;
  faHouse = faHouse;
  faRectangleList = faRectangleList;
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

  rutaActual: string = "";
  menuData: MenuUserRol[] = [];
  menuExpanded: any[] = [];
  menuBoolExpanded: boolean = false;

  idMenu: number = 0;
  idRol: number = 0;
  idPerson: number = 0;
  imgperfil: any;

  profile: Profile = {
    id:               0,
    id_person:        '',
    user_name:        '',
    name:             '',
    paternal_surname: '',
    maternal_surname: '',
    id_role:          '',
    role:             '',
    changepassword:   '',
    state:            '',
  };

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
    private router: Router,
    private authService: AuthService,
    private appRolMenuService: AppRolMenuService,
    private colaboradorService: ColaboradorService,
    private imgb64: DomSanitizer,
    private dialogService: DialogService,
    private formBuilder: FormBuilder,
    public toastr: ToastrService,
  ) {
    this.rutaActual = this.router.url;
    this.buildForm();
  }

  listIconMenu: any[] = [];

  ngOnInit(): void {
    this.authService.getProfile().subscribe(data => {
      this.profile = data;

      this.authService.getMenuUserRol(String(this.profile.id), this.profile.id_role).subscribe(data => {
        this.menuData = data.value;
      });

      this.colaboradorService.getClienteId(String(this.profile.id_person))
      .subscribe(data => {
        if (data.value.i_SEX_ID == 2) {
          this.imgperfil = '../../../../assets/images/photo-profile-male.jpg';
        }
        if (data.value.i_SEX_ID == 1) {
          this.imgperfil = '../../../../assets/images/photo-profile-female.jpg';
        }
    });
    });
  }

  private matDialogRef? : MatDialogRef<DialogcustomComponent>

  openDialog(template: TemplateRef<any>) {
    this.matDialogRef = this.dialogService.openDialogCustom({
      template
    })
    this.matDialogRef
      .afterClosed()
      .subscribe(res => {this.formChange.reset()});
  }

  toggleMenu(idMenu: number, ruta: string | null): void {
    this.rutaActual = ruta!;
    if (ruta != null) {
      this.router.navigate(['rapidiario'+[ruta]]);
    }
  }

  accessMenu: DetailMenuRol[] = [];
  accessOneMenu: DetailMenuRol[] = [];
  getMenusAccess() {
    this.appRolMenuService.getDetailMenuRol(Number(this.profile.id_role)).subscribe(data => {
      this.accessMenu = data.value;
      this.authService.setListMenusRol(this.accessMenu);
    });
  }

  toggleMenuPadre(idMenu: number, ruta: string | null): void{
    if(idMenu == this.idMenu){
      this.menuBoolExpanded = !this.menuBoolExpanded;
    }else{
      this.menuBoolExpanded = true;
      this.idMenu = idMenu;
    }
  }

  btnSubmenu(direccion: string, tipo: string){
    if (direccion != null && tipo == 'ruta') {
      this.router.navigate([direccion]);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['./login']);
  }


  passwordold = "";
  passwordold1 = "";
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
        this.matDialogRef!.close();
        this.authService.logout()
        this.router.navigate(['/login']);
      }, response => {
        this.passwordnew = String(response.error?.V_NEW_PASSWORD?.[0]) === 'undefined' ? 'correcto' : 'incorrecto';
        if ( this.passwordnew =='incorrecto' ) {
          this.showErrorPassNew();
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
}
