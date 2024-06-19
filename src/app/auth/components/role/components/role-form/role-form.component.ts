import { BreakpointObserver } from '@angular/cdk/layout';
import { STEPPER_GLOBAL_OPTIONS, StepperOrientation } from '@angular/cdk/stepper';
import { CommonModule, AsyncPipe, NgIf, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';
import { Observable, map } from 'rxjs';
import { MY_FORMATS } from '../../../user/user.component';
import { RolService } from '@services/security/rol/rol.service';
import { AppRolMenuService } from '@services/security/approlmenu/approlmenu.service';
import { CreateAppRolMenu, GetPermiso, ListaTotalMenus, ListaTotalPermisos, ListadoMenusPermisos, Menu, MenuPermiso, MenuRol, UpdateAppRolMenu } from '@models/security/approlmenu.model';
import { CreateRol, UpdateRol } from '@models/security/role.model';
import { UserService } from '@services/security/user/user.service';
import { MatListModule, MatListOption } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule,MatCardModule, MatSidenavModule, MatStepperModule,
    ReactiveFormsModule, MatFormFieldModule, MatDatepickerModule,
    MatInputModule, MatButtonModule,MatSelectModule, MatPaginatorModule,
    MatTableModule, MatSortModule,MatIconModule,ReactiveFormsModule,
    MatChipsModule, RouterLink, MatAutocompleteModule, AsyncPipe, FormsModule,
    NgIf, DatePipe, HttpClientModule,
    RouterModule, RouterLink, RouterModule, RouterOutlet,
    MatToolbarModule, MatMenuModule, RouterOutlet, FontAwesomeModule,
    MatDialogModule, MatDialogActions,
    MatDialogClose, MatDialogContent, MatDialogTitle,MatNativeDateModule, MatListModule, MatSlideToggleModule, MatDividerModule],
  templateUrl: './role-form.component.html',
  styleUrl: './role-form.component.scss',
  providers: [DatePipe,
      {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
      {
        provide: STEPPER_GLOBAL_OPTIONS,
        useValue: {displayDefaultIndicatorType: false},
      },

    ],
})
export class RoleFormComponent implements OnInit {
  stepperOrientation: Observable<StepperOrientation>;
  disableSiguiente = false;
  desabilitarCreate= true;

  isEditable = true;

  menuPermiso = new Map();
  sortedMenuPermiso = new Map();

  listaMenus: Menu[] = [];
  listaMenusPermisos: MenuPermiso[] = [];
  listaMenusRol: MenuRol[] = [];

  idRol: number = 0;
  idAppRolMenu: number = 0;

  idRoleAcccess: number | null = null;
  selectedPermissionId: number | null = null;
  listaPermisos: GetPermiso[] = [];

  // Para funcionamiento del checkbox
  idMenusSelected = new Set<any>();
  idActiveMenu: number = 0;
  activeInactive: boolean = false;
  isMenuUnselected: boolean = true;

  constructor(
    private rolService: RolService,
    private appRolMenuService: AppRolMenuService,
    private userService: UserService,
    private builderForm: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private datePipe: DatePipe,
    breakpointObserver: BreakpointObserver
  ) {
    //mediaquery de steps
    this.stepperOrientation = breakpointObserver
    .observe('(min-width: 570px)')
    .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));

    this.buildForm();
  }

  pipe = new DatePipe('es');

  ngOnInit(): void {
    this.idRol = this.rolService.getSelectedId();
    if(this.idRol !== 0){
      this.getRol();
    }
  }

  formStepper01!: FormGroup;
  formStepper02!: FormGroup ;

  private buildForm(){
    this.formStepper01 = this.builderForm.group({
      v_rol: ['', [Validators.required, Validators.pattern(/^[A-Za-zñÑáéíóúÁÉÍÓÚ]+(?: [A-Za-zñÑáéíóúÁÉÍÓÚ]+)*$/)]],
      v_descripcion: ['', [ Validators.required, Validators.pattern(/^[A-Za-zñÑáéíóúÁÉÍÓÚ]+(?: [A-Za-zñÑáéíóúÁÉÍÓÚ]+)*$/)]]
    });

    this.listMenus();

    this.formStepper02 = this.builderForm.group({
    });
  }

  //Step 1
  get isRolFieldInvalidForm() {
    return this.rolField?.touched && this.rolField?.invalid;
  }
  get rolField() {
    return this.formStepper01.get('v_rol');
  }
  get isDescrFieldInvalidForm() {
    return this.descrField?.touched && this.descrField?.invalid;
  }
  get descrField() {
    return this.formStepper01.get('v_descripcion');
  }

  saveStep1() {
    if (this.formStepper01.valid){
      this.listPermisos();
      this.listMenus();
      if (!this.idRol) {
        this.listMapMenus();
      }
    }else {
      this.formStepper01.markAllAsTouched();
    }
  }

  saveStep2() {
    if (this.formStepper02.valid){
      if (this.idRol) {
        this.updateRol();
      }else{
        this.onSaveRol();
      }
    }else {
      this.formStepper02.markAllAsTouched();
    }
  }

  listMenus(){
    this.appRolMenuService.getListMenu().subscribe((data: ListaTotalMenus) => {
      if (data.hasSucceeded) {
        this.listaMenus = data.value;
      }
    });
  }

  listPermisos(){
    this.appRolMenuService.getListPermiso().subscribe((data: ListaTotalPermisos) => {
      if (data.hasSucceeded) {
        this.listaPermisos = data.value;
      }
    });
  }

  listMapMenus(){
    this.appRolMenuService.getMenusPermisos().subscribe((data: ListadoMenusPermisos) => {
      if (data.hasSucceeded) {
        this.listaMenusPermisos = data.value;
        this.listaMenusPermisos.forEach(x => {
          this.menuPermiso.set(x.i_MENU_ID, 5);
          this.selectedPermissionId = 5;
        });
      }
    })
  }

  // Vista de menus_permisos
  getLastValue(set: any | null){
    let value;
    for(value of set);
    return value._value;
  }

  selectionChange(option: MatListOption[]) {
    option.forEach(m => {
      this.activeInactive = m.selected
    });
  }

  getIdMenu(menusSelected: any | null){
    if(menusSelected._selection.size !== 0 && this.activeInactive == true){
      for(var i of menusSelected._selection){
        this.idMenusSelected.add(i._value);
      }
      this.idActiveMenu = this.getLastValue(menusSelected._selection);
      this.menuPermiso.set(this.idActiveMenu, 2);
    } else {
      if(this.onGet) {
        this.menuPermisoGet.forEach((m, n) => {
          if(m !== 5) {
            this.idMenusSelected.add(n);
          }
        });
      }

      for(var j of this.idMenusSelected.values()){
        for(var k of menusSelected._selection){
          if(j === k._value){
            this.isMenuUnselected = false;
            break;
          }else{
            this.isMenuUnselected = true;
          }
        }

        if(this.isMenuUnselected == true){
          this.idActiveMenu = j;
          this.idMenusSelected.delete(j);
          break;
        }
      }

      this.menuPermiso.set(this.idActiveMenu, 5);
    }
  }

  onChangePermission(idMenu: number, event: any): void {
    this.selectedPermissionId = event.value;
    this.menuPermiso.set(idMenu, this.selectedPermissionId);
  }

  messageError: string = '';
  isSucceded: boolean = true;
  onSaveRol() {
    const dataRol : Partial<CreateRol> = {
      v_ROLE: this.rolField?.value ?? '',
      v_DESCRIPTION: this.descrField?.value ?? '',
    }

    this.rolService.createRol(dataRol).subscribe(res => {
      this.rolService.getListRole().subscribe(data => {
        this.idRoleAcccess = data.value[data.value.length-1].i_ROLE_ID;

        this.sortMap();
        this.sortedMenuPermiso.forEach((permiso, menu) => {
          this.onSaveAppRoleMenu(menu, permiso);
        });

        if(this.isSucceded){
          this.toastrService.success("Registro exitoso.", 'Éxito', { timeOut: 3000 });
          this.router.navigate(["rapidiario/roles"]);
        }
      });
    }, response => {
      this.messageError = String(response.error?.value?.[0].message);
      if(this.messageError == "Registro ya existente (nombre) o registro inactivo"){
        this.showErrorExists();
        this.isSucceded = false;
      }
      this.router.navigate(["rapidiario/roles"]);
    });
  }

  showErrorExists(){
    this.toastrService.error('El rol ingresado ya existe o está inactivo.', 'Error', {
      timeOut: 3000,
    });
  }

  sortMap() {
    let sortedEntries = [...this.menuPermiso.entries()];
    sortedEntries.sort((a, b) => a[0] - b[0]);
    this.sortedMenuPermiso = new Map(sortedEntries);
  }

  onSaveAppRoleMenu(idMenu: number, idPermiso: number) {
    const dataAppRolMenu : Partial<CreateAppRolMenu> = {
      i_ROLE_ID: String(this.idRoleAcccess),
      i_MENU_ID: String(idMenu),
      i_PERMISSION_ID: String(idPermiso),
    }

    this.appRolMenuService.createAppRolMenu(dataAppRolMenu).subscribe({
    });
  }

  menuPermisoGet = new Map();
  appRolMenus: MenuRol[] = [];
  onGet: boolean = false;
  getRol() {
    this.formStepper01.reset();
    this.rolService.getRol(this.idRol)
    .subscribe(data => {
      if (this.rolField) {
        this.rolField.setValue(data.value[0].v_ROLE ?? '');
      }
      if (this.descrField) {
          this.descrField.setValue(data.value[0].v_DESCRIPTION ?? '');
      }

      this.selectedPermissionId = null;
      this.menuPermiso.clear();
      this.appRolMenuService.getMenuRol(this.idRol).subscribe(data => {
        if (data.hasSucceeded) {
          this.listaMenusRol = data.value;
          this.listaMenusRol.forEach(x => {
            this.menuPermiso.set(x.i_MENU_ID, x.i_PERMISSION_ID);
            this.menuPermisoGet.set(x.i_MENU_ID, x.i_PERMISSION_ID);
            this.appRolMenus.push(x);
            this.selectedPermissionId = x.i_PERMISSION_ID;
          });

          this.onGet = true;
        }
      });
    });
  }

  updateRol() {
    const dataRol : Partial<UpdateRol> = {
      i_ROLE_ID: Number(this.idRol),
      v_ROLE: String(this.formStepper01.value.v_rol),
      v_DESCRIPTION: String(this.formStepper01.value.v_descripcion)
    }

    this.rolService.updateRol(dataRol).subscribe(res => {
        this.getUpdateMenus();

        for(var i = 0; i < this.appRolMenus.length; i++) {
          this.menuPermiso.forEach((p,m) => {
            if(m === this.appRolMenus[i].i_MENU_ID) {
              this.updateAppRoleMenu(this.appRolMenus[i].i_APP_ROL_MENU_ID, p);
            }
          });
        }

        if(this.isSucceded){
          this.toastrService.success("Actualización exitosa.", 'Éxito', { timeOut: 3000 });
          this.router.navigate(["rapidiario/roles"]);
        }
    }, response => {
      this.messageError = String(response.error?.value?.[0].message);
      if(this.messageError == "Registro ya existente (nombre) o registro inactivo"){
        this.showErrorExists();
        this.isSucceded = false;
      }
      this.router.navigate(["rapidiario/roles"]);
    });
  }

  getUpdateMenus() {
    this.menuPermiso.forEach((_,m) => {
      if(this.menuPermiso.get(m) === this.menuPermisoGet.get(m)) {
        this.menuPermiso.delete(m);
        this.appRolMenus.filter(x => x.i_MENU_ID !== m);
      }
    });
  }

  updateAppRoleMenu(idAppRolMenu: number, idPermiso: number) {
    const dataAppRolMenu : Partial<UpdateAppRolMenu> = {
      i_APPLICATION_ROLE_MENU_ID: idAppRolMenu,
      i_PERMISSION_ID: String(idPermiso),
    }

    this.appRolMenuService.updateAppRolMenu(dataAppRolMenu).subscribe({
    });
  }
}
