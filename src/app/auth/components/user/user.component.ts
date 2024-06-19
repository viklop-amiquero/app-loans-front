import { UserService } from '../../../core/services/security/user/user.service';
import { Component, OnInit, inject, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { NgIf, DatePipe, CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {MatInputModule} from '@angular/material/input';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatCardModule} from '@angular/material/card';
import { AuthService } from '@services/auth.service';
import { DialogService } from '@services/dialog/dialog.service';
import { DialogcustomComponent } from 'src/app/admin/components/dialogcustom/dialogcustom.component';
import { CreateUser, UpdateUserAccess, UpdateUserApp } from '@models/security/user.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RolService } from '@services/security/rol/rol.service';
import { ListaRoles, Rol } from '@models/security/role.model';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import { ColaboradorService } from '@services/colaborador/colaborador.service';
import { ListaPersonas, Pers } from '@models/colaborador/colaborador.model';
import { PaginatorService } from '@services/paginator.service';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { DetailMenuRol } from '@models/auth.model';
import { AppRolMenuService } from '@services/security/approlmenu/approlmenu.service';
import { faArrowDown, faArrowUp, faBolt, faClock, faEye, faPencil, faSquarePlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Observable, map, startWith } from 'rxjs';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatPaginatorModule, CommonModule,
    MatChipsModule, NgIf, DatePipe, FontAwesomeModule, MatDialogModule, MatCardModule, MatFormFieldModule,
    MatSelectModule, ReactiveFormsModule, MatInputModule, MatDatepickerModule, MatAutocompleteModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    {provide: MatPaginatorIntl, useClass: PaginatorService}
  ],
})
export class UserComponent implements OnInit {

  private userService = inject(UserService);
  private router= inject(Router);
  private authService = inject(AuthService);
  private dialogService = inject(DialogService);
  private toastrService = inject(ToastrService);
  private formBuilder = inject(FormBuilder);
  private matDialogRef!: MatDialogRef<DialogcustomComponent>

  faEye= faEye;
  faTrash = faTrash;
  faPencil = faPencil;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faBolt = faBolt;
  faClock = faClock;
  faSquarePlus= faSquarePlus;

  listaRoles: Rol[] = [];
  selectedRoleId: number | null = null;

  maxDateInicio: Date;
  minDateInicio: Date;
  minDateFin: Date;
  anio: number = new Date().getFullYear();

    // BUSQUEDA DE PERSONAS
  listaPersonas: Pers[] = [];
  personaFind!: Observable<Pers[]>;
  fullName: string = "";
  selectPersonId: number | null = null;

  @ViewChild('autoPers') personaAutocomplete!: MatAutocomplete;

  formUser = this.formBuilder.group({
    v_name: ['', [Validators.required]],
    v_rol: ['', [Validators.required]],
    d_fecha_inicio: ['', [Validators.required]],
    d_fecha_fin: [{ value: '', disabled: true }, [Validators.required]],
  });

  constructor(
    public dialog: MatDialog,
    private rolService: RolService,
    private colaboradorService: ColaboradorService,
    private appRolMenuService: AppRolMenuService)
  {
    this.minDateInicio = new Date();
    this.minDateFin = new Date();
    this.maxDateInicio = new Date(this.anio+1,11,31);
  }

  enableEndDate() {
    this.minDateFin = new Date();
    let fechaActual = new Date();
    fechaActual.setHours(0);
    fechaActual.setMinutes(0);
    fechaActual.setSeconds(0);
    fechaActual.setMilliseconds(0);
    let fechaInicio = new Date(this.formUser.value.d_fecha_inicio!);
    const input1= this.formUser.get('d_fecha_inicio')?.value;
    if (input1 !== null || undefined) {
      this.formUser.get('d_fecha_fin')?.enable();
      if(this.idUsuario === 0 || fechaInicio >= fechaActual) {
        this.minDateFin = new Date(this.formUser.value.d_fecha_inicio!);
        this.minDateFin.setDate(this.minDateFin.getDate() + 1);
      }
    } else {
      this.formUser.get('d_fecha_fin')?.disable();
    }
  }

  maxStartDate(){
    const input2 = this.formUser.get('d_fecha_fin')?.value;
    if (input2 !== null || undefined){
      this.maxDateInicio = new Date(this.formUser.value.d_fecha_fin!);
      this.maxDateInicio.setDate(this.maxDateInicio.getDate() - 1);
    }
  }

  openDialog(template: TemplateRef<any>) {
    this.colaboradorService.getTotalPersonas().subscribe(resp => {
      this.listaPersonas = resp.value;
      if (this.nameField) {
          this.personaFind = this.nameField.valueChanges.pipe(
            startWith(''),
            map(value => this._filterPersServ(value || ''))
          );
        };
        this.personaAutocomplete.displayWith = (option: number) => {
          let selected = this.listaPersonas.find( (tds) => tds.i_PERSON_ID === option );
          return selected ? (selected.v_FIRST_NAME + " " + selected.v_PATERNAL_LAST_NAME + " " + selected.v_MOTHER_LAST_NAME) : '';
        };
    })
    this.matDialogRef = this.dialogService.openDialogCustom({
      template
    })
    this.matDialogRef
      .afterClosed().subscribe(res => {
        this.idUsuario = 0;
        this.formUser.reset();
        this.minDateInicio = new Date();
        this.minDateFin = new Date();
        this.maxDateInicio = new Date(this.anio+1,11,31);
        this.formUser.get('d_fecha_fin')?.disable();
      });
  }

  get isNameFieldInvalidForm() {
    return this.nameField?.touched && this.nameField?.invalid;
  }
  get nameField() {
    return this.formUser.get('v_name');
  }
  get roleField() {
    return this.formUser.get('v_rol');
  }
  get isDateStartFieldInvalidForm() {
    return this.dateStartField?.touched && this.dateStartField?.invalid;
  }
  get dateStartField() {
    return this.formUser.get('d_fecha_inicio');
  }
  get isDateEndFieldInvalidForm() {
    return this.dateEndField?.touched && this.dateEndField?.invalid;
  }
  get dateEndField() {
    return this.formUser.get('d_fecha_fin');
  }

  idUsuarioForm: number = 0;
  nameUsuario: string = "";

  //Para los permisos
  idMenu: number = 0;
  permisos: number[] = [];

  idRole: number = 0;
  accessMenu: DetailMenuRol[] = [];

  ngOnInit(): void {
    this.authService.getProfile().subscribe(data => {
      this.idUser = Number(data.id);
      this.idRole = Number(data.id_role);

      this.appRolMenuService.getDetailMenuRol(this.idRole).subscribe(data => {
        this.accessMenu = data.value;
        this.authService.setListMenusRol(this.accessMenu);

        const rutaUsuario ='/'+ this.router.url.split('/')[2];

        this.authService.setMenuAccess(rutaUsuario);
        this.idMenu = this.authService.getSelectedMenuId();
        this.permisos = this.authService.getPermiso();
        this.getListadoUserTable();
      });
    });

    this.rolService.getListRole().subscribe((data: ListaRoles) => {
      if (data.hasSucceeded) {
        this.listaRoles = data.value;
        this.listaRoles = this.listaRoles.filter(x => x.b_STATE == "1");
      }
    })
  }

  // BUSQUEDA DE PERSONA
  _filterPersServ(value: string): Pers[] {
    const filterValue = value;
    return this.listaPersonas.filter(option => (option.v_FIRST_NAME + " " + option.v_PATERNAL_LAST_NAME + " " + option.v_MOTHER_LAST_NAME).toLowerCase().includes(filterValue));
  }

  // CAPTURA EL ID DEL ROL EN EL SELECT
  onChangeRole(event: any): void {
    this.selectedRoleId = event.value;
  }

  messageError: string = '';
  messageErrorRegex: string = '';
  // CREA EL USUARIO
  onSave() {
    const dataUser : Partial<CreateUser> = {
      i_PERSON_ID: String(this.nameField?.value),
      i_ROLE_ID: String(this.selectedRoleId),
      d_START_DATE: this.dateStartField?.value ?? '',
      d_END_DATE: this.dateEndField?.value ?? '',
    }
      this.userService.createUser(dataUser).subscribe({
        next: () => {
          this.getListadoUserTable();
          this.matDialogRef.close();
          this.toastrService.success("Registro exitoso.", 'Éxito', { timeOut: 3000 });
        },
        error: (error) => {
          this.matDialogRef.close();
          this.messageError = String(error.error?.value?.[0].message);
          if(this.messageError == "La persona ya tiene un registro de usuario existente y activo"){
            this.showErrorPersonUser();
          }
          this.messageErrorRegex = String(error.error?.I_PERSON_ID?.[0]);
          if(this.messageErrorRegex == "El ID de la llave foránea no es válido (letras, caracteres especiales o espacios en blanco)"){
            this.showErrorPersonID();
          }
        }
      },
      );
  }

  showErrorPersonUser(){
    this.toastrService.error('La persona seleccionada ya tiene un usuario.', 'Error', {
      timeOut: 3000,
    });
  }

  showErrorPersonID(){
    this.toastrService.error('La persona seleccionada no existe.', 'Error', {
      timeOut: 3000,
    });
  }

  openEditUser(template: TemplateRef<any>, idUsuario: number) {
    this.idUsuario = idUsuario;
    if (this.idUsuario !== 0) {
      this.formUser.get('v_name')?.disable();
      this.minDateInicio = new Date(2024,0,1);
      this.getUser();
    }
    this.matDialogRef = this.dialogService.openDialogCustom({
      template
    });
    this.matDialogRef
      .afterClosed().subscribe(res => {
        this.formUser.reset();
        this.minDateInicio = new Date();
        this.minDateFin = new Date();
        this.maxDateInicio = new Date(this.anio+1,11,31);
        this.formUser.get('v_name')?.enable();
        this.formUser.get('d_fecha_fin')?.disable();
      });
  }

  openEditAccessUser(template: TemplateRef<any>, idUsuario: number) {
    this.idUsuario = idUsuario;
    if (this.idUsuario !== 0) {
      this.minDateInicio = new Date(2024,0,1);
      this.formUser.get('v_name')?.disable();
      this.formUser.get('v_rol')?.disable();
      this.formUser.get('d_fecha_inicio')?.disable();
      this.getUser();
    }
    this.matDialogRef = this.dialogService.openDialogCustom({
      template
    });
    this.matDialogRef
      .afterClosed().subscribe(res => {
        this.formUser.get('v_name')?.enable();
        this.formUser.get('v_rol')?.enable();
        this.formUser.get('d_fecha_inicio')?.enable();
        this.formUser.reset();
        this.minDateInicio = new Date();
        this.minDateFin = new Date();
        this.maxDateInicio = new Date(this.anio+1,11,31);
        this.formUser.get('d_fecha_fin')?.disable();
      });
  }

  getUser() {
    this.selectPersonId = null;
    this.selectedRoleId = null;
    this.formUser.get('d_fecha_fin')?.disable();
    this.userService.getUsuarioRole(this.idUsuario)
    .subscribe(data => {
      this.selectedRoleId = data.value.i_ROLE_ID;
      this.selectPersonId = data.value.i_PERSON_ID;
      if (this.nameField) {
        this.colaboradorService.getClienteId(String(this.selectPersonId)).subscribe(data => {
          this.fullName = data.value.v_FIRST_NAME + " " + data.value.v_PATERNAL_LAST_NAME + " " + data.value.v_MOTHER_LAST_NAME;
          this.nameField!.setValue(this.fullName);
        });
      }
      if (this.dateStartField) {
          this.dateStartField.setValue(String(data.value.d_START_DATE) ?? '');
          this.enableEndDate();
      }
      if (this.dateEndField) {
          this.dateEndField.setValue(String(data.value.d_END_DATE) ?? '');
          if(this.dateEndField.value === "null"){
            this.maxDateInicio = new Date(this.anio+1,11,31);
          } else {
            this.maxStartDate();
          }
      }
    });
  }

  updateUser(){
    const dataUserApp : Partial<UpdateUserApp> = {
      i_USER_ID: this.idUsuario,
      i_ROLE_ID: String(this.selectedRoleId),
      d_START_DATE: this.formUser.value.d_fecha_inicio!,
      d_END_DATE: this.formUser.value.d_fecha_fin!,
    }
    this.userService.updateUserApp(dataUserApp)
    .subscribe({
      next: () => {
        this.getListadoUserTable();
        this.matDialogRef.close();
        this.toastrService.success("Actualización exitosa.", 'Éxito', { timeOut: 3000 });
      },
      error: (error) => {
        this.matDialogRef.close();
        this.toastrService.error("No se pudo obtener respuesta.", 'Error', { timeOut: 3000 });
      }
    });
  }

  updateAccesoUsuario() {
    const dataUserAccess : Partial<UpdateUserAccess> = {
      i_USER_ID: this.idUsuario,
      d_END_DATE: this.formUser.value.d_fecha_fin!,
    }
    this.userService.updateAccessUser(dataUserAccess)
    .subscribe({
      next: () => {
        this.getListadoUserTable();
        this.matDialogRef.close();
        this.toastrService.success("Actualización exitosa.", 'Éxito', { timeOut: 3000 });
      },
      error: (error) => {
        this.matDialogRef.close();
        this.toastrService.error("No se pudo obtener respuesta.", 'Error', { timeOut: 3000 });
      }
    });
  }

  // PAGINADO
  idUser: number = 0;
  idUsuario: number = 0;

  filtro_v_selected: string = "";
  usuario: string = "";
  persona: string = "";
  rol: string = "";
  filtro: string = "";

  formFiltrarTable = this.formBuilder.group({
    filtro_v: [''],
    usuario: [''],
    persona: [''],
    rol: [''],
    estado: [''],
  });

  orderAscFullName: boolean = true;
  orderDescFullName: boolean = false;
  orderAscRole: boolean = true;
  orderDescRole: boolean = false;
  orderAscEstado: boolean = true;
  orderDescEstado: boolean = false;

  dataSource: any;
  length = 0;
  pageSizeOptions = [10, 20, 30, 40, 50];
  pageSize = 10;
  pageIndex = 0;
  sortField = 5;
  sortOrder = 'DESC';

  pageEvent?: PageEvent;

  clickAsc(indexColumn: number) {
    switch(indexColumn){
      case 2 :
        this.orderAscFullName = false;
        this.orderDescFullName = true;
        break;
      case 3 :
        this.orderAscRole = false;
        this.orderDescRole = true;
        break;
      case 4 :
        this.orderAscEstado = false;
        this.orderDescEstado = true;
        break;
    }

    this.sortField = indexColumn;
    this.sortOrder = 'ASC'
    this.getListadoUserTable();
  }

  clickDesc(indexColumn: number) {
    switch(indexColumn){
      case 2 :
        this.orderAscFullName = true;
        this.orderDescFullName = false;
        break;
      case 3 :
        this.orderAscRole = true;
        this.orderDescRole = false;
        break;
      case 4 :
        this.orderAscEstado = true;
        this.orderDescEstado = false;
        break;
    }

    this.sortField = indexColumn;
    this.sortOrder = 'DESC'
    this.getListadoUserTable();
  }

  displayedColumns: string[] = [
    'i_ID_USER',
    'v_USER',
    'v_FULL_NAME',
    'v_ROLE',
    'd_START_DATE',
    'd_END_DATE',
    'b_STATE',
    'ACTIONS'
  ];

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getListadoUserTable()
  }

  get getTipoFiltroFieldForm() {
    return this.formFiltrarTable.get('filtro_v');
  }

  get getUsuarioFieldForm() {
    return this.formFiltrarTable.get('usuario');
  }

  get getPersonaFieldForm() {
    return this.formFiltrarTable.get('persona');
  }

  get getRolFieldForm() {
    return this.formFiltrarTable.get('rol');
  }

  get getEstadoFieldForm() {
    return this.formFiltrarTable.get('estado');
  }

  changeSelectTipo(){
    this.filtro_v_selected = this.getTipoFiltroFieldForm?.value ?? "";
  }

  resetControls() {
    this.getUsuarioFieldForm?.reset();
    this.getPersonaFieldForm?.reset();
    this.getRolFieldForm?.reset();
    this.getEstadoFieldForm?.reset();
    this.pageIndex = 0;
  }

  getListadoUserTable() {
    if (this.filtro_v_selected === "USUARIO") {
      this.filtro = this.getUsuarioFieldForm?.value ?? "";
    }

    if (this.filtro_v_selected === "PERSONA") {
      this.filtro = this.getPersonaFieldForm?.value ?? "";
    }

    if (this.filtro_v_selected === "ROL") {
      this.filtro = this.getRolFieldForm?.value ?? "";
    }

    if (this.filtro_v_selected === "STATE") {
      this.filtro = this.getEstadoFieldForm?.value ?? "";
    }
    this.userService.getPagUser(this.filtro_v_selected, this.filtro, this.pageIndex, this.pageSize, this.sortField, this.sortOrder)
      .subscribe(resp => {
        this.dataSource = new MatTableDataSource(resp.value.data);
        this.length = resp.value.total_registros;
    });
  }

  deshabilitarBtn(state: string) {
    const estado= state;
    if (estado == '0' || estado == '2' || estado == '3'){
      return true;
    }
    return false;
  }

  openDeleteUsuario(template: TemplateRef<any>, idUsuario: number) {
    this.idUsuario = idUsuario;
    this.matDialogRef = this.dialogService.openDialogCustom({
      template
    })
  }

  deleteUsuario(){
    this.userService.deleteUser(String(this.idUsuario)).subscribe({
      next: () => {
        this.getListadoUserTable();
        this.matDialogRef.close();
        this.toastrService.success("Se anuló correctamente el usuario.", 'Éxito', { timeOut: 3000 });
      },
      error: (error) => {
        this.matDialogRef.close();
        this.toastrService.error("No se pudo obtener respuesta.", 'Error', { timeOut: 3000 });
      }
    });
  }

  activateUsuario(idUsuario: number){
    this.userService.activateUser(String(idUsuario))
        .subscribe({next:() => {
          this.getListadoUserTable()
          this.toastrService.success("Se activó correctamente el usuario.", 'Éxito', { timeOut: 3000 });
        },error: (error) => {
          this.toastrService.error("No se pudo obtener respuesta.", 'Error', { timeOut: 3000 });
        }
    });
  }
}
