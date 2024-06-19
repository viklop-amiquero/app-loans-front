import { Datum, OperacionNew } from '@models/rapidiario/operacion.model'
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, TemplateRef, signal } from '@angular/core'
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatStepperModule } from '@angular/material/stepper'
import { MatButtonModule } from '@angular/material/button'
import { MatSelectModule } from '@angular/material/select'
import { CuentaService } from '@services/rapidiario/cuenta.service'
import { Cuenta } from '@models/rapidiario/cuenta.model'
import { CommonModule } from '@angular/common'
import { Credito } from '@models/rapidiario/credito.model'
import { OperacionService } from '@services/rapidiario/operacion.service'
import { concatMap, toArray } from 'rxjs/operators'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'
import 'moment/locale/es'
import { CreditoService } from '@services/rapidiario/credito.service'
import { CuotaService } from '@services/rapidiario/cuota.service'
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { faSave, faCircleDollarToSlot, faCircleExclamation, faClock, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { ToastrService } from 'ngx-toastr'
import { DetailMenuRol } from '@models/auth.model'
import { AuthService } from '@services/auth.service'
import { AppRolMenuService } from '@services/security/approlmenu/approlmenu.service'
import { Router } from '@angular/router'
import { SubCuotaService } from '@services/rapidiario/subcuota.service'
import { CancelacionMora, ListCancMora, ListTiposCancMora, Mora, TipoCancMora, UpdateMora } from '@models/rapidiario/mora.model'
import Swal from 'sweetalert2'
import { MoraService } from '@services/rapidiario/mora.service'
import { DialogService } from '@services/dialog/dialog.service'
import { DialogcustomComponent } from 'src/app/admin/components/dialogcustom/dialogcustom.component'
import { HttpErrorResponse } from '@angular/common/http'
import { MatTableModule } from '@angular/material/table'
import { MatRadioModule } from '@angular/material/radio'
import { MatCheckboxModule } from '@angular/material/checkbox'

@Component({
  selector: 'app-operacion-create',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    FontAwesomeModule,
    MatTableModule,
    MatRadioModule,
    MatCheckboxModule

  ],
  templateUrl: './operacion-create.component.html',
  styleUrl: './operacion-create.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class OperacionCreateComponent implements OnInit {
  faClock= faClock;
  faSquarePlus= faSquarePlus;

  year = new Date().getFullYear()
  cuentas: Cuenta[] = []
  cuentaAhorro: Cuenta[] = [];
  cuentaCredito: Cuenta[] = [];
  cuentaAportes: Cuenta[] = [];
  creditos: Credito[] = []
  creditoActual: number = 0;
  cuotas: any[] = []
  cuotasCard: any[] = []
  movimientosAhorro: any[] = []
  movimientosAporte: any[] = []
  personExist: boolean = false;

  firstFormGroup = this._formBuilder.group({
    numeroDoc: ['', [Validators.required, Validators.pattern(/^[0-9]{8,12}$/)]],
  })

  cuotascliente:any;

  constructor(
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router,
    private toastrService:  ToastrService,
    private cuentaService: CuentaService,
    private operacionService: OperacionService,
    private creditoService: CreditoService,
    private subCuotaService: SubCuotaService,
    private cuotaService: CuotaService,
    private moraService: MoraService,
    private dialogService: DialogService,
    private authService: AuthService,
    private appRolMenuService: AppRolMenuService
  ) { }

  private matDialogRef!: MatDialogRef<DialogcustomComponent>

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
      });
    });
  }

  get nroDocumentoField() {
    return this.firstFormGroup?.get('numeroDoc');
  }
  get isNrodocumentValidForm() {
    return this.firstFormGroup.get('numeroDoc')?.touched && this.firstFormGroup.get('numeroDoc')?.valid;
  }

  onNumeroDoc() {
    const numeroDoc = this.firstFormGroup.value.numeroDoc
    if (numeroDoc !== undefined && numeroDoc !== null) {
      this.verificarCuenta(numeroDoc)
    }
  }

  documento: Cuenta={
      v_FIRST_NAME: '',
      v_SECOND_NAME: null,
      v_PATERNAL_LAST_NAME: '',
      v_MOTHER_LAST_NAME: '',
      v_NUMBER_DOC: '',
      v_NUMBER_ACCOUNT: '',
      i_ACCOUNT_ID: 0,
      i_PERSON_ID: 0,
      v_ACCOUNT_NUMBER: '',
      i_TYPE_ACCOUNT_ID: 0,
      i_SALDO: 0,
      b_STATE: ''
  }

  verificarCuenta(numeroDoc: string) {
    this.cuentas = [];
    this.cuentaService.getCuentaByDni(numeroDoc).subscribe(response => {
      if (response.value.data.length !== 0) {
        this.cuentas = response.value.data

        this.cuentaAhorro = this.cuentas.filter(x => x.i_TYPE_ACCOUNT_ID == 1);
        this.cuentaCredito = this.cuentas.filter(x => x.i_TYPE_ACCOUNT_ID == 2);
        this.cuentaAportes = this.cuentas.filter(x => x.i_TYPE_ACCOUNT_ID == 3);

        this.documento = response.value.data[0]
        this.personExist = true;

        const credito = this.cuentas.filter(cuenta => cuenta.i_TYPE_ACCOUNT_ID === 2 && cuenta.b_STATE === '1')

        this.verificarCreditos('ID_ACCOUNT', credito[0].i_ACCOUNT_ID)

        //Obtener los movimientos de la cuenta
        this.movimientosCuenta()
      } else {
        this.firstFormGroup.patchValue({
          numeroDoc: '',
        })
        this.personExist = false;
        this.documento.v_FIRST_NAME= '',
        this.documento.v_SECOND_NAME = '',
        this.documento.v_PATERNAL_LAST_NAME='',
        this.documento.v_MOTHER_LAST_NAME='',
        this.documento.v_NUMBER_ACCOUNT='',
        this.toastrService.error("El número de documento no existe o está deshabilitado", "Error", { timeOut: 3200 });
      }
    })
  }

  movimientosCuenta() {
    from(this.cuentas).pipe(
      concatMap(cuenta => this.operacionService.getOperacionByType('ID_CUENTA', cuenta.i_ACCOUNT_ID)),
      toArray(),
      map(responses => responses.map(response => response.value.data).flat())
    ).subscribe(
      (concatenatedData) => {

        this.filtrarMovimientosByType(concatenatedData)

      }
    )
  }

  verificarCreditos(type: string, value: number) {
    this.creditoService.getCreditoFiltered(type, value).subscribe({
      next: (dataResponse) => {
        this.creditos.push(dataResponse.value.data[0]);
        this.obtenerCuotas('ID_CREDIT', this.creditos[0].i_ID_CREDIT)

      }, error: (e) => { }
    })

  }

  obtenerCuotas(type: string, value: number) {
    this.cuotaService.getCuotasFiltered(type, value).subscribe({
      next: (data) => {
        this.cuotas = [];
        this.cuotascliente=data.value.data[0];
        data.value.data.forEach(cuota => this.cuotas.push(cuota));

        this.cuotasCard = this.cuotas.filter(x => x.b_STATE === "1");

        this.cuotaService.setListCuotas(this.cuotas);
      }
    })
    this.creditoActual = this.creditos[0].i_ID_CREDIT;
    this.creditos = [];
  }

  filtrarMovimientosByType(data: Datum[]) {
    const ahorro = data.filter(item => item.v_TYPE_OPERATION === 'RETIRO' || item.v_TYPE_OPERATION === 'DEPÓSITO').slice(0, 5)

    const aporte = data.filter(item => {
      const fecha = new Date(item.d_DATE_CREATE)
      const fechaYear = fecha.getFullYear()

      return item.v_TYPE_OPERATION === 'APORTE' && fechaYear === this.year
    })

    this.movimientosAhorro = []
    this.movimientosAporte = []

    ahorro.forEach(movimiento => this.movimientosAhorro.push(movimiento))
    aporte.forEach(movimiento => this.movimientosAporte.unshift(movimiento))
  }

  validatorNumber(event: KeyboardEvent): void {
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

  openDialog(template: TemplateRef<any>) {
    this.matDialogRef = this.dialogService.openDialogCustom({
      template
    })
    this.matDialogRef
      .afterClosed().subscribe(result => {
        this.cuotaFlag = false;
        this.secondFormGroup.reset();
        this.optionRadio.reset();
    })
  }

  // MODAL
  subCuotaChecked: boolean=false;
  checked: boolean = false;
  indeterminate = false;
  cuota: any = [];
  cuotasPagar: any[] = [];
  subCuotas: any[]=[];
  cuotaFlag: boolean = false;
  loading = signal<boolean>(false);
  totalmonto=0;
  optionRadio = new FormControl();

  dataSource: any[] = [];

  displayedColumns: string[] = ['CUOTA', 'MONTO', 'FECHA', 'ESTADO','ACCION','MORA'];
  operaciones: Operacion[] = [
    { value: '1', viewValue: 'RETIRO' },
    { value: '2', viewValue: 'DEPÓSITO' },
    { value: '3', viewValue: 'APORTE' },
    { value: '4', viewValue: 'CUOTA' },
    { value: '6', viewValue: 'INSCRIPCIÓN' },
    { value: '7', viewValue: 'OTROS' }
  ]

  selectAll=new FormControl(false);

  checkcuotas=new FormControl('');

  secondFormGroup = this._formBuilder.group({
    monto: ['', [Validators.required, Validators.pattern(/^(?=.*[1-9])\d+(\.\d{1,2})?$/)]],
    operacion: ['', Validators.required],
  })


  identificarOperacion() {
        const operacion = this.secondFormGroup.value.operacion
        const cuentaAhorros = this.cuentas.find(cuenta => cuenta.i_TYPE_ACCOUNT_ID === 1)
        const cuentaAportes = this.cuentas.find(cuenta => cuenta.i_TYPE_ACCOUNT_ID === 3)
        const cuentaCredito = this.cuentas.find(cuenta => cuenta.i_TYPE_ACCOUNT_ID === 2)

        let saldo = Number(cuentaAhorros?.i_SALDO)
        const monto = Number(this.secondFormGroup.value.monto)

        if (operacion) {
          const operaciones: { [key: string]: () => void } = {
            '1': () => this.crearOperacion(cuentaAhorros!, monto, operacion),
            '2': () => this.crearOperacion(cuentaAhorros!, monto, operacion),
            '3': () => this.crearOperacion(cuentaAportes!, monto, operacion),
            '4': () => this.crearOperacion(cuentaCredito!, monto, operacion),
            '6': () => this.crearOperacion(cuentaAhorros!, monto, operacion),
            '7': () => this.crearOperacion(cuentaAhorros!, monto, operacion)
          }

          if (operacion in operaciones) {
            operaciones[operacion]()
          }
        }
  }

  crearOperacion(cuenta: Cuenta, monto: number, operacion: string) {
    const Operacion = {
      v_ID_ACCOUNT: String(cuenta.i_ACCOUNT_ID),
      v_ID_CUOTA: operacion === '4' ? `${this.cuota.i_ID_INSTALLMENT}` : '',
      v_ID_TYPE_OPERATION: this.subCuotaChecked ? '5' : operacion,
      v_AMOUNT: String(monto)
    }

    this.operacionService.crearOperacion(Operacion).subscribe({
      next: (data) => {
        this.toastrService.success("Operación exitosa.", 'Éxito', { timeOut: 3000 });
      }, error: (e: HttpErrorResponse) => {
        const valueError = e.error
        this.toastrService.error(`${valueError.value[0].message}`, 'Error', {
          timeOut: 3000,
        });
      }
    })
  }

  onOperacionChange(selectedValue: string) {
    if (selectedValue === '4') {
      this.cuotaFlag = true;
      this.cuota = this.filtrarCuotaPago();
    } else {
      this.secondFormGroup.patchValue({
        monto: ''
      })
      this.cuotaFlag = false
    }
  }

  filtrarCuotaPago() {
    const cuotaActual = this.cuotas.filter(cuota => cuota.b_STATE === '1')
    return cuotaActual[0]
  }

  onChangeCheck(event:any) {
    if (event.value==='subcuota') {
      this.subCuotaChecked=true;
      this.subCuotas = [];
      this.secondFormGroup.patchValue({
        monto: ''
      })
      this.verificarSubCuota();

      return;
    }
  }

  verificarSubCuota() {
    this.subCuotaService.getSubCuotaFiltered('ID_CUOTA', Number(`${this.cuota.i_ID_INSTALLMENT}`)).subscribe({
      next: (data) => {
        if (data.value.data) {
          data.value.data.forEach(data => this.subCuotas.unshift(data));
        }
      }
    })
  }

  actualizarCuotas(){
    const idObject = this.cuotasPagar.map(objeto => objeto.id);
    const montoObject = this.cuotasPagar.map(objeto => objeto.monto);
    const data: Partial<OperacionNew> = {
      v_ID_ACCOUNT: String(this.cuotas[0].i_ID_ACCOUNT),
      v_ID_CUOTA: String(idObject.join(',').trim()),
      v_ID_TYPE_OPERATION:"4",
      v_AMOUNT: String(montoObject[0]),
    }
    this.operacionService.crearOperacion(data).subscribe({
      next: () => {
        this.obtenerCuotas('ID_CREDIT', this.creditoActual);
        this.toastrService.success("La operación fue exitosa.", 'Éxito', { timeOut: 3200 });
      },
      error: (error) => {
        this.toastrService.error(error.error.value[0].message, 'Error', { timeOut: 3200 });
      }
    });
  }
  selectAllCuotas(event: any) {
    const isChecked = event.checked;

    if (isChecked) {
        this.checkcuotas.setValue('true');
    }
    if(!isChecked){
        this.totalmonto=0;
        this.cuotasPagar=[];
        this.allComplete=false;
        // Desmarcar todas las cuotas
        this.checkcuotas.reset();
    }
  }

  allComplete:boolean=false;
  valuesCuotas(event:any,idCuota:number,numCuota:number,montoTotal:number,){
    const idObject = this.cuotasPagar.map(objeto => objeto.id);
    const valor = idObject.includes(idCuota);
    if(event && !valor){
      this.totalmonto +=montoTotal;
      const showCuotas={
        id:idCuota,num:numCuota,monto:montoTotal
      }
      this.cuotasPagar.push(showCuotas);
    }
    if(!event && valor){
      this.allComplete=true,
      this.totalmonto -=montoTotal;
      const showCuotas={
        id:idCuota,num:numCuota,monto:montoTotal
      }
      const index = this.cuotasPagar.findIndex(objeto => objeto.id === showCuotas.id);
      if (index !== -1) {
        this.cuotasPagar.splice(index, 1);
      }
    }
  }

  // Cancelacion de la mora
  faSave = faSave;
  faCircleDollarToSlot = faCircleDollarToSlot;
  faCircleExclamation = faCircleExclamation;

  mora: Mora[] = [];
  listaTiposCancMora: TipoCancMora[] = [];
  selectedTipoCancId: number | null = null;
  listaCancMora: CancelacionMora[] = [];

  formUpdateMora = this._formBuilder.group({
    v_tipo_canc: ['', [Validators.required]],
    v_monto: ['', [Validators.required, Validators.pattern(/^([0-9]*\.?[0-9]+)?$/)]],
  });

  get tipoCancField() {
    return this.formUpdateMora.get('v_tipo_canc');
  }

  get isMontoMoraFieldInvalidForm() {
    return this.montoMoraField?.touched && this.montoMoraField?.invalid;
  }
  get montoMoraField() {
    return this.formUpdateMora.get('v_monto');
  }

  displayedColumnsMora: string[] = [
    'i_MORA_ID',
    'v_TYPE_MORA',
    'i_MORA_AMOUNT',
    'i_NUMBER_DAYS',
    'b_STATE',
    'ACTIONS',
  ];

  displayedColumnsCancMora: string[] = [
    'v_TYPE_CANC_MORA',
    'i_AMOUNT_CANC_MORA',
    'i_START_AMOUNT_MORA',
    'i_END_AMOUNT_MORA',
    'd_CREATE_DATE'
  ];

  deshabilitarBtn(state: string) {
    const estado= state;
    if (estado == '0' || estado == '2'){
      return true;
    }
    return false;
  }

  onChangeTipoCanc(event: any): void {
    this.selectedTipoCancId = event.value;
  }

  idCuota: number = 0;
  openDialogMora(template: TemplateRef<any>, idCuota: number) {
    this.idCuota = idCuota;
    if (this.idCuota !== 0) {
      this.getMora();
    }
    this.matDialogRef = this.dialogService.openDialogCustom({
      template
    })
    this.matDialogRef
      .afterClosed().subscribe(res => {
        this.formUpdateMora.reset();
        this.mora = [];
        this.isEditable = false;
      });
  }

  getMora() {
    this.moraService.getMora(this.idCuota).subscribe(data => {
      if (data.hasSucceeded) {
        this.mora = data.value;
      } else {
        this.mora = [];
      }
    });
  }

  getTiposCancMora() {
    this.moraService.getListTiposCancMora().subscribe((data: ListTiposCancMora) => {
      if (data.hasSucceeded) {
        this.listaTiposCancMora = data.value;
      }
    })
  }

  idMora: number = 0;
  isEditable: boolean = false;

  onEdit(idMora: number) {
    this.listaCancMora = [];
    this.idMora = idMora;
    if (this.idMora !== 0) {
      this.isEditable = true;
      this.getCancMora();
      this.getTiposCancMora();
    }
  }

  getCancMora() {
    this.formUpdateMora.reset();
    this.selectedTipoCancId = null;
    this.moraService.getListCancMora(this.idMora).subscribe((data: ListCancMora) => {
      if (data.hasSucceeded) {
        this.listaCancMora = data.value;
      } else {
        this.listaCancMora = [];
      }
    });
  }

  updateMora() {
    const dataMora : Partial<UpdateMora> = {
      i_MORA_ID: this.idMora,
      i_TYPE_CANC_MORA_ID: String(this.selectedTipoCancId),
      i_AMOUNT_MORA: this.formUpdateMora.value.v_monto!
    }
    this.moraService.updateMora(dataMora)
    .subscribe({
      next: () => {
        this.getMora();
        this.getCancMora();
        this.toastrService.success("Registro exitoso.", 'Éxito', { timeOut: 3000 });
      },
      error: (error) => {
        this.toastrService.error("El monto ingresado excede sus límites aceptados.", 'Error', { timeOut: 3000 });
      }
    });
  }
}

interface Operacion {
  value: string
  viewValue: string
}
