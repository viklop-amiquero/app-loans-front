import { CommonModule, DatePipe, } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, TemplateRef } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ColaboradorService } from '@services/colaborador/colaborador.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ClienteId, ClienteTotal, SubClienteId } from '@models/colaborador/colaborador.model';
import { PaginatorService } from '@services/paginator.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '@services/auth.service';
import { UserService } from '@services/security/user/user.service';
import { DialogcustomComponent } from 'src/app/admin/components/dialogcustom/dialogcustom.component';
import { DialogService } from '@services/dialog/dialog.service';
import { faArrowDown, faArrowUp, faBolt, faEye, faPencil, faSquarePlus, faTrash} from '@fortawesome/free-solid-svg-icons';
import { AppRolMenuService } from '@services/security/approlmenu/approlmenu.service';
import { DetailMenuRol } from '@models/auth.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-colaborador',
  standalone: true,
  host: {
    '[attr.app-colaborador-id]': 'true'
  },
  imports: [
    CommonModule, MatSidenavModule,
    ReactiveFormsModule, MatFormFieldModule, FormsModule,
    MatInputModule, MatButtonModule, MatSelectModule,
    MatTableModule, MatSortModule, MatIconModule,
    MatChipsModule, RouterLink, RouterModule,
    MatToolbarModule, MatMenuModule, RouterOutlet, FontAwesomeModule,
    MatDialogModule, MatDialogActions, HttpClientModule,
    MatDialogClose, MatDialogContent, MatDialogTitle,MatProgressSpinnerModule,
    MatCardModule, MatStepperModule, MatDatepickerModule, MatPaginatorModule, DatePipe
  ],
  templateUrl: './colaborador.component.html',
  styleUrl: './colaborador.component.scss',
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class ColaboradorComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private colaboradorService: ColaboradorService,
    private appRolMenuService: AppRolMenuService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private router: Router,
    private dialogService: DialogService
  ) {
  }
  faEye = faEye;
  faTrash = faTrash;
  faPencil = faPencil;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faBolt = faBolt;
  faSquarePlus= faSquarePlus;

  displayedColumns: string[] = [
    'i_PERSON_ID',
    'v_DNI',
    'v_NAME',
    'v_ADDRESS',
    'v_DISTRICT',
    'v_MOVIL_PHONE',
    'd_DATE_CREATE',
    'b_STATE',
    'ACTIONS'
  ];

  dataDetailCliente: SubClienteId = {
    i_PERSON_ID: 0,
    i_UBIGEO_ID: 0,
    i_SEX_ID: 0,
    v_FIRST_NAME: '',
    v_SECOND_NAME: '',
    v_PATERNAL_LAST_NAME: '',
    v_MOTHER_LAST_NAME: '',
    i_AGE: 0,
    d_BIRTHDATE: new Date,
    v_ADDRESS_HOME: '',
    v_ADDRESS_WORK: '',
    b_STATE: '',
    v_DEPARTMENT: '',
    v_PROVINCE: '',
    v_DISTRICT: '',
    document_persona: [],
    contact: [],
    contact_emergency: [],
    i_POSITION_ID: 0
  };

  private matDialogRef!: MatDialogRef<DialogcustomComponent>

  idCliente: number = 0;
  idInfoCliente: number = 0;
  dniUsuario: string = "";

  tipo: string = "";
  filtro: string | null | undefined;
  estado: string = "";
  dni = ""

  opteniendoDateSer = false;

  form = this.formBuilder.group({

    tipo: [''],
    dni: ['', [Validators.minLength(8), Validators.pattern(/^([0-9])*$/)]],
    nombre: [''],
    estado: [''],

  });
  //Para los permisos
  idMenu: number = 0;
  permisos: number[] = [];

  idRole: number = 0;
  accessMenu: DetailMenuRol[] = [];

  idUser: number = 0;

  ngOnInit(): void {
    this.authService.getProfile().subscribe(data => {
      this.idUser = Number(data.id);
      this.idRole = Number(data.id_role);

      this.appRolMenuService.getDetailMenuRol(Number(this.idRole)).subscribe(data => {
        this.accessMenu = data.value;
        this.authService.setListMenusRol(this.accessMenu);

        const rutaRol ='/'+ this.router.url.split('/')[2];

        this.authService.setMenuAccess(rutaRol);
        this.idMenu = this.authService.getSelectedMenuId();
        this.permisos = this.authService.getPermiso();
        this.getAllClientTable();
      });
    });

    if (this.idInfoCliente != 0) {
      this.getClienteId();
    }

  }

  get tipoFieldForm() {
    return this.form.get('tipo');
  }
  get dniFieldForm() {
    return this.form.get('dni');
  }
  get isDniFieldValidForm() {
    return this.form.get('dni')?.touched && this.form.get('dni')?.valid;
  }
  get isDniFieldInvalidForm() {
    return this.form.get('dni')?.touched && this.form.get('dni')?.invalid;
  }

  get nameFieldForm() {
    return this.form.get('nombre');
  }
  get isNameFieldValidForm() {
    return this.form.get('nombre')?.touched && this.form.get('nombre')?.valid;
  }
  get isNameFieldInvalidForm() {
    return this.form.get('nombre')?.touched && this.form.get('nombre')?.invalid;
  }

  get stateFieldForm() {
    return this.form.get('estado');
  }


  changeSelectTipo() {
    this.tipo = this.tipoFieldForm?.value ?? '';
  }
  changeSelectState() {
    this.estado = this.stateFieldForm?.value ?? '';
  }

  length = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 20, 30, 40, 50];


  sortField = 1;
  sortOrder = 'ASC';
  pageEvent: PageEvent | undefined;

  orderAsc = true;
  orderDesc = false;
  clickDesc() {
    this.orderAsc = true;
    this.orderDesc = false;

    this.sortField = 2;
    this.sortOrder = 'DESC'
    this.getAllClientTable()

  }
  clickAsc() {
    this.orderAsc = false;
    this.orderDesc = true;

    this.sortField = 2;
    this.sortOrder = 'ASC'
    this.getAllClientTable()
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getAllClientTable()
  }


  clientetotal: ClienteTotal = {
    value: {
      total_paginas: 0,
      total_registros: 0,
      data: [
        {
          i_PERSON_ID: 0,
          v_DNI: '',
          v_PATERNAL_LAST_NAME: '',
          v_MOTHER_LAST_NAME: '',
          v_FIRST_NAME: '',
          v_ADDRESS: '',
          v_PROVINCE: '',
          v_DISTRICT: '',
          v_MOVIL_PHONE: '',
          d_DATE_CREATE: new Date,
          b_STATE: '',
        }
      ]
    },
    statusCode: 0,
    hasSucceeded: false
  }

  dataSource: any;

  resetControls() {
    this.dniFieldForm?.reset();
    this.nameFieldForm?.reset();
    this.stateFieldForm?.reset();
    this.pageIndex = 0;
  }

  getAllClientTable() {
    if (this.tipoFieldForm?.value === "DNI") {
      this.filtro = this.dniFieldForm?.value;
    } if (this.tipoFieldForm?.value === "NAME") {
      this.filtro = this.nameFieldForm?.value;
    } if (this.tipoFieldForm?.value === "STATE") {
      this.filtro = this.stateFieldForm?.value;
    }
    this.colaboradorService.getAllCliente(this.tipoFieldForm?.value, this.filtro, this.pageIndex, this.pageSize, this.sortField, this.sortOrder)
      .subscribe(data => {
        this.clientetotal.value = data.value;
        this.dataSource = new MatTableDataSource(this.clientetotal.value.data);
        this.length = this.clientetotal.value.total_registros;
      });
  }
  deleteCliente() {
    this.validUserDelete(String(this.idCliente), this.dniUsuario);
  }

  activarCliente(id: string) {
    const data: Partial<ClienteId> = {
    }
    this.colaboradorService.activateCliente(id)
      .subscribe({
        next: () => {
          this.getAllClientTable()
          this.toastrService.success("Se activo a la cliente indicado.", 'Activado correctamente', { timeOut: 3200 });
        }, error: (error) => {
          this.toastrService.error("Hubo un error. No se pudo activar.", 'Error', { timeOut: 3200 });

        }
      });

  }
  validUserDelete(id: string, dniUser: string) {
    this.userService.getUserPers(dniUser).subscribe(data => {
      const nameUser = data.value[0].v_USER;
      if (nameUser === "") {
        this.colaboradorService.deleteCliente(id).subscribe({
          next: () => {
            this.getAllClientTable();
            this.matDialogRef.close();
            this.toastrService.success("Se anuló correctamente a la cliente.", 'Eliminado correctamente', { timeOut: 3200 });
          }, error: (error) => {
            this.matDialogRef.close();
            this.toastrService.error(error.error.value[0].message, 'Error', { timeOut: 3200 });
            console.log(error);
          }
        });
      } else {
        this.toastrService.error("No se pudo eliminar. porque tiene un usuario creado", 'Error', { timeOut: 3200 });
      }
    })
  }

  openDeleteCliente(template: TemplateRef<any>, idCliente: number, dniUser: string) {
    this.idCliente = idCliente;
    this.dniUsuario = dniUser;
    this.matDialogRef = this.dialogService.openDialogCustom({
      template
    })

  }
  openDetailCliente(template: TemplateRef<any>, idDetailCliente: string) {
    this.idInfoCliente = Number(idDetailCliente);
    this.matDialogRef = this.dialogService.openDialogCustom({
      template
    })
    this.getClienteId();
    this.opteniendoDateSer = false;
  }
  getClienteId() {
    this.colaboradorService.getClienteId(String(this.idInfoCliente)).subscribe(data => {
      this.dataDetailCliente = data.value;
      this.opteniendoDateSer = true;

    }, error => {
      this.opteniendoDateSer = false;
    }
    );
  }
  getSex(): string {
    const idSex = this.dataDetailCliente.i_SEX_ID;
    if (idSex === 1) {
      return 'FEMENINO';
    } else {
      return 'MASCULINO';
    }
  }
  getDoctument(): string {
    const idTypeDoc = this.dataDetailCliente.document_persona[0].i_TYPE_DOCUMENT_ID;

    if (idTypeDoc === 1) {
      return 'DNI';
    }
    else if (idTypeDoc === 2) {
      return 'CARNET DE EXTRANJERÍA';
    } else {
      return 'PASAPORTE';
    }
  }
  deshabilitarBtn(state: string):boolean {
    const estado = state;
    if (estado == '0') {
      return true;
    }
    return false;
  }

  //clic en editar y crear
  addColaborador() {
    sessionStorage.setItem('clienteEdit', "");
    this.router.navigate(["/rapidiario/colaborador/create"]);
  }
  editColaborador(idColaborador: string) {
    sessionStorage.setItem('clienteEdit', idColaborador);

    this.router.navigate(["/rapidiario/colaborador/edit"]);
  }

}
