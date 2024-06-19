import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faPlusCircle, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { DetailMenuRol } from '@models/auth.model';
import { ClienteDoc } from '@models/colaborador/colaborador.model';
import { CreateCuenta, PaginadoCuenta, TipoCuenta } from '@models/rapidiario/cuenta.model';
import { AuthService } from '@services/auth.service';
import { ColaboradorService } from '@services/colaborador/colaborador.service';
import { DataService } from '@services/data.service';
import { DialogService } from '@services/dialog/dialog.service';
import { PaginatorService } from '@services/paginator.service';
import { CuentaService } from '@services/rapidiario/cuenta.service';
import { AppRolMenuService } from '@services/security/approlmenu/approlmenu.service';
import { ToastrService } from 'ngx-toastr';
import { DialogcustomComponent } from 'src/app/admin/components/dialogcustom/dialogcustom.component';

@Component({
  selector: 'app-cuenta',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatTableModule, HttpClientModule,
    MatPaginatorModule, MatInputModule, MatButtonModule, MatSelectModule, MatNativeDateModule,
    MatTableModule, MatSortModule, MatIconModule, MatFormFieldModule,
    MatCheckboxModule, MatPaginatorModule, DatePipe, RouterLink, RouterModule,
    MatMenuModule, RouterOutlet, FontAwesomeModule,
    MatDialogModule, MatDialogActions,
    MatDialogClose, MatDialogContent, MatDialogTitle, MatTooltipModule
  ],
  templateUrl: './cuenta.component.html',
  styleUrl: './cuenta.component.scss',
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class CuentaComponent implements OnInit {

  faEye = faEye;
  faSquarePlus=faSquarePlus;
  faPlusCircle= faPlusCircle;

  constructor(
    private cuentaService: CuentaService,
    private colaboradorService: ColaboradorService,
    private authService: AuthService,
    private appRolMenuService: AppRolMenuService,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    private toastrService: ToastrService,
    private router: Router,
    private dataService: DataService
  ) {
    this.buildForm();
  }
  tooltipText = 'Click para mas información de la cuenta del cliente';

  private matDialogRef!: MatDialogRef<DialogcustomComponent>
  formCuenta!: FormGroup;
  form!: FormGroup;
  tiposcuenta = new FormControl('', [Validators.required]);

  cuentasSeleccionadas: string = '';
  idCliente: number = 0;
  disableBtn = true;

  private buildForm() {
    this.formCuenta = this.formBuilder.group({
      nrodocument: ['', [Validators.required, Validators.pattern(/^[0-9]{8,12}$/)]],
    });

    this.form = this.formBuilder.group({
      tipo: [''],
      dni: ['', [Validators.minLength(8), Validators.pattern(/^([0-9])*$/)]],
      nombre: [''],
      estado: [''],
    });
  }
  displayedColumns: string[] = [

    'i_ACCOUNT_ID',
    'v_DNI',
    'v_NAME',
    'b_STATE',
    'ACTIONS'
  ];

  clienteDoc: ClienteDoc = {
    v_NRO_DOCUMENT: '',
    i_PERSON_ID: 0,
    v_FIRST_NAME: '',
    v_SECOND_NAME: null,
    v_PATERNAL_LAST_NAME: '',
    v_MOTHER_LAST_NAME: ''
  }
  cuentacliente: any;
  tipocuenta: TipoCuenta[] = [];

  tipo: string = "";
  filtro: string | null | undefined;
  estado: string = "";
  dni = "";

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

        const urlParts = this.router.url.split('/');
        const rutaRol = '/' + urlParts[2] + '/' + urlParts[3];

        this.authService.setMenuAccess(rutaRol);
        this.idMenu = this.authService.getSelectedMenuId();
        this.permisos = this.authService.getPermiso();
        this.permisos.forEach(p => {
        });
        this.getAllCuentaTable();
      });
    });

    this.cuentaService.getAllTipoCuenta().subscribe(resp => {
      this.tipocuenta = resp.value
    });
  }

  get nroDocumentoField() {
    return this.formCuenta?.get('nrodocument');
  }
  get isNrodocumentValidForm() {
    return this.formCuenta.get('nrodocument')?.touched && this.formCuenta.get('nrodocument')?.valid;
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
    this.getAllCuentaTable()

  }
  clickAsc() {
    this.orderAsc = false;
    this.orderDesc = true;

    this.sortField = 2;
    this.sortOrder = 'ASC'
    this.getAllCuentaTable()
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getAllCuentaTable()
  }

  paginadocuenta: PaginadoCuenta= {
    value: {
      total_paginas: 0,
      total_registros: 0,
      data: [
        {
          i_ACCOUNT_ID: '',
          i_PERSON_ID: 0,
          i_TYPE_ACCOUNT_ID: '',
          v_NUMBER_DOC: '',
          v_NUMBER_ACCOUNT: '',
          v_FIRST_NAME: '',
          v_SECOND_NAME: null,
          v_PATERNAL_LAST_NAME: '',
          v_MOTHER_LAST_NAME: '',
          i_SALDO: '',
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

  getAllCuentaTable() {
    if (this.tipoFieldForm?.value === "DNI") {
      this.filtro = this.dniFieldForm?.value;
    } if (this.tipoFieldForm?.value === "NAME") {
      this.filtro = this.nameFieldForm?.value;
    } if (this.tipoFieldForm?.value === "STATE") {
      this.filtro = this.stateFieldForm?.value;
    }
    this.cuentaService.getAllCuenta(this.tipoFieldForm?.value, this.filtro, this.pageIndex, this.pageSize, this.sortField, this.sortOrder)
      .subscribe(data => {
        this.paginadocuenta.value = data.value;
        this.dataSource = new MatTableDataSource(this.paginadocuenta.value.data);
        this.length = this.paginadocuenta.value.total_registros;
      });
  }

  getClienteXDocumento(nroDocumento: string) {
    this.colaboradorService.getClienteXDocumento(nroDocumento).subscribe({
      next: (data) => {
        this.idCliente = data.value.i_PERSON_ID;
        this.clienteDoc = data.value;
      }, error: (e: HttpErrorResponse) => {
        this.toastrService.error(e.error.value[0].message, "Error", { timeOut: 3200 });
      }
    })
  }

  createCuenta() {
    if (this.idCliente) {
      const data: Partial<CreateCuenta> = {
        i_PERSON_ID: this.idCliente,
        v_TYPE_ACCOUNT_ID: this.selectedAccountTypes(),
      }
      this.cuentaService.createCuenta(data).subscribe({
        next: () => {
          this.getAllCuentaTable();
          this.toastrService.success("Se guardaron los datos correctamente.", 'Exitoso', { timeOut: 3200 });
          this.router.navigate(["rapidiario/finanzas/cuentas"]);
        },
        error: (error) => {
          this.toastrService.error(error.error.value[0].message, 'Error en guardar', { timeOut: 3200 });
        }
      });
    } else {
      this.toastrService.error('Hacer click en buscar', 'Error', { timeOut: 3200 });
    }

  }

  openDialogNewCuenta(template: TemplateRef<any>) {
    this.matDialogRef = this.dialogService.openDialogCustom({
      template
    })
    this.matDialogRef
      .afterClosed()
      .subscribe(res => { this.formCuenta.reset(); this.limpiarDatos(); this.tiposcuenta.reset() });
  }

  onSave() {
    if (this.formCuenta.valid && this.tiposcuenta.valid) {
      this.createCuenta();
      this.matDialogRef!.close();
    } else {
      this.formCuenta.markAllAsTouched();
      this.tiposcuenta.markAllAsTouched();
    }
  }
  selectedAccountTypes(): string {
    let valorString: string = "";
    if (this.tiposcuenta.value) {
      valorString = this.tiposcuenta.value.toString();

    }
    return valorString.trim();
  }
  validarNumeros(event: KeyboardEvent): void {
    const codigoTecla = event.key.charCodeAt(0);
    if (
      event.key === 'Backspace' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight'
    ) {
      return;
    }
    if (event.ctrlKey && event.key === 'c') {
      return;
    }
    if (event.ctrlKey && event.key === 'v') {
      return;
    }
    if (codigoTecla < 48 || codigoTecla > 57) {
      event.preventDefault();
    }

  }
  validarPegadoNumeros(event: ClipboardEvent): void {
    event.preventDefault();
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    if (!clipboardData) {
      return;
    }
    const pastedText = clipboardData.getData('text');
    if (/^\d+$/.test(pastedText)) {
      document.execCommand('insertText', false, pastedText);
    }
  }
  habilitarBtn() {
    let nrodocumento = this.nroDocumentoField?.value;
    if (nrodocumento.length < 8) {
      this.disableBtn = true;
    } else {
      this.disableBtn = false;
    }
  }
  limpiarDatos() {
    this.disableBtn = true;
    this.clienteDoc.v_NRO_DOCUMENT = '';
    this.clienteDoc.i_PERSON_ID = 0;
    this.clienteDoc.v_FIRST_NAME = '';
    this.clienteDoc.v_SECOND_NAME = null;
    this.clienteDoc.v_PATERNAL_LAST_NAME = '';
    this.clienteDoc.v_MOTHER_LAST_NAME = '';
  }
  sendIdCliente(idCliente:number){
    this.dataService.sendData(idCliente);
  }

}
