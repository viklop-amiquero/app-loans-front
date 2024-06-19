import { Component, ViewChild } from '@angular/core'
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatButtonModule } from '@angular/material/button'
import { CuentaService } from '@services/rapidiario/cuenta.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { CreditoNew } from '@models/rapidiario/credito.model'
import { CreditoService } from '@services/rapidiario/credito.service'
import { CreditoTableComponent } from '../credito-table/credito-table.component'
import { MatSelectModule } from '@angular/material/select'
import { Cuenta } from '@models/rapidiario/cuenta.model'
import { ToastrService } from 'ngx-toastr'
import { CommonModule } from '@angular/common'
import { BreakpointObserver } from '@angular/cdk/layout'
import { STEPPER_GLOBAL_OPTIONS, StepperOrientation } from '@angular/cdk/stepper'
import { Observable, map } from 'rxjs'
import { MatCardModule } from '@angular/material/card'
import { ClienteDoc } from '@models/colaborador/colaborador.model'
import { ColaboradorService } from '@services/colaborador/colaborador.service'
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'
import { TipoCreditoService } from '@services/rapidiario/tipo-credito.service'
import { InteresCreditoService } from '@services/rapidiario/interes-credito.service'
import { MatSelectChange } from '@angular/material/select'
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { DetailMenuRol } from '@models/auth.model'
import { AuthService } from '@services/auth.service'
import { AppRolMenuService } from '@services/security/approlmenu/approlmenu.service'
/**
 * @title Stepper overview
 */

let idCuenta: number

@Component({
    selector: 'app-credito-create',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        CreditoTableComponent,
        MatSelectModule,
        MatCardModule,
        FontAwesomeModule
    ],
    templateUrl: './credito-create.component.html',
    styleUrls: ['./credito-create.component.scss'],
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { displayDefaultIndicatorType: false },
        },
    ],
})

export class CreditoCreateComponent {
  faSquarePlus= faSquarePlus;
    stepperOrientation: Observable<StepperOrientation>;

    pagos: Pago[] = [
        { value: '1', viewValue: 'DIARIO' },
        { value: '2', viewValue: 'SEMANAL' },
        { value: '3', viewValue: 'MENSUAL' }
    ]

    creditos: any[] = []
    intereses: any[] = []
    mesesFlag: boolean = false
    plazoFlag: boolean = true

    meses: any[] = [
        { value: '3', viewValue: '3 meses' },
        { value: '6', viewValue: '6 meses' },
        { value: '9', viewValue: '9 meses' },
        { value: '12', viewValue: '12 meses' },
        { value: '18', viewValue: '18 meses' },
        { value: '24', viewValue: '24 meses' },
        { value: 'otro', viewValue: 'Otros' },
    ]

    personExist: boolean = false;
    isSimulated: boolean = false;

    //Para los permisos
    idMenu: number = 0;
    permisos: number[] = [];

    idRole: number = 0;
    accessMenu: DetailMenuRol[] = [];

    idUser: number = 0;

    @ViewChild(CreditoTableComponent) creditoTableComponent!: CreditoTableComponent

    firstFormGroup = this._formBuilder.group({
        numeroDoc: ['', [Validators.required, Validators.pattern(/^[0-9]{8,12}$/)]]
    })

    secondFormGroup = this._formBuilder.group({
        tipoCredito: ['', [Validators.required]],
        montoPrestamo: ['', [Validators.required, Validators.pattern(/^(?=.*[1-9])\d+(\.\d{1,2})?$/)]],
        frecuenciaPago: ['', Validators.required],
        plazo: ['', [Validators.required, Validators.pattern(/^\d{1,6}$/)]],
        tasaInteres: ['', [Validators.required, Validators.pattern(/^\d{1,2}(?:\.\d{1,2})?$/)]],
        fechaDesembolso: ['', Validators.required]
    })

    idCliente: number = 0
    documento: Cuenta = {

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

    clienteDoc: ClienteDoc = {
        v_NRO_DOCUMENT: '',
        i_PERSON_ID: 0,
        v_FIRST_NAME: '',
        v_SECOND_NAME: null,
        v_PATERNAL_LAST_NAME: '',
        v_MOTHER_LAST_NAME: ''
    }

    constructor(
        private _formBuilder: FormBuilder,
        private authService: AuthService,
        private appRolMenuService: AppRolMenuService,
        private _creditoServicio: CreditoService,
        private _snackBar: MatSnackBar,
        private toastrService: ToastrService,
        private cuentaService: CuentaService,
        private breakpointObserver: BreakpointObserver,
        private colaboradorService: ColaboradorService,
        private tipoCreditoService: TipoCreditoService,
        private interesCredito: InteresCreditoService,
        private router: Router) {
        //mediaquery de steps
        this.stepperOrientation = breakpointObserver.observe('(min-width: 570px)')
            .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    }

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
        this.obtenerTiposCredito()
        this.obtenerInteresCredito()
      });
    });
  }

    get nroDocumentoField() {
        return this.firstFormGroup?.get('numeroDoc');
    }
    get isNrodocumentValidForm() {
        return this.firstFormGroup.get('numeroDoc')?.touched && this.firstFormGroup.get('numeroDoc')?.valid;
    }
    onNextButtonClick() {
      this.isSimulated = true;
      this.creditoTableComponent.calcularCuotas();
    }

    obtenerTiposCredito() {
        this.tipoCreditoService.getAllTipoCredito().subscribe({
            next: (data) => {
                this.creditos = data.value.map((item: any) => {
                    return { value: item.i_TYPE_CREDIT_ID.toString(), viewValue: item.v_TYPE_CREDIT };
                })

            }, error: (e: HttpErrorResponse) => {
                this.toastrService.error("Error de conexión con el servidor", "Error", { timeOut: 3200 });
            }
        })
    }

    obtenerInteresCredito() {
        this.interesCredito.getAllInteresCredito().subscribe({
            next: (data) => {
                this.intereses = data.value.map((item: any) => {
                    return { value: item.i_INTEREST_CREDIT_ID, viewValue: item.v_DESCRIPTION + ' ' + item.i_INTEREST };
                })
            }, error: (e: HttpErrorResponse) => {
                this.toastrService.error("Error de conexión con el servidor", "Error", { timeOut: 3200 });
            }
        })
    }

    onNumeroDoc() {
        const numeroDoc = this.firstFormGroup.value.numeroDoc

        if (numeroDoc !== undefined && numeroDoc !== null) {
            this.colaboradorService.getClienteXDocumento(numeroDoc).subscribe({
                next: (data) => {
                    this.idCliente = data.value.i_PERSON_ID
                    this.clienteDoc = data.value
                    this.personExist = true;

                }, error: (e: HttpErrorResponse) => {
                    this.personExist = false;
                    this.toastrService.error(e.error.value[0].message, "Error", { timeOut: 3200 });
                    this.router.navigate(['/rapidiario/colaborador/create'])
                }
            })
        }
    }

    addEditCredito() {
        const modelo: CreditoNew = {
            i_PERSON_ID: this.idCliente,
            i_INTEREST_CREDIT_ID: this.secondFormGroup.value.tasaInteres ?? '',
            v_ID_TYPE_CREDIT: this.secondFormGroup.value.tipoCredito ?? '',
            v_ID_PAYMENT_FREQUENCY: this.secondFormGroup.value.frecuenciaPago ?? '',
            v_LOAN_AMOUNT: this.secondFormGroup.value.montoPrestamo ?? '',
            v_TERM_QUANTITY: this.secondFormGroup.value.plazo ?? '',
            d_DISBURSEMENT_DATE: this.secondFormGroup.value.fechaDesembolso ?? ''
        }

        this._creditoServicio.crearCredito(modelo).subscribe({
            next: (data) => {
                this.toastrService.success("Crédito fue creado exitosamente", "Éxito", { timeOut: 3200 });
            }, error: (e) => {
                this.toastrService.error("No se pudo crear", "Error", { timeOut: 3200 });
            }
        })

    }

    onSelectionChange(event: MatSelectChange): void {
        if (event.value === '3') {
            this.mesesFlag = true
            this.plazoFlag = false
            return
        }
        this.mesesFlag = false
        this.plazoFlag = true
    }

    onSelectionChangeMes(event: MatSelectChange): void {
        if (event.value === 'otro') {
            this.plazoFlag = true
            this.mesesFlag = false
            return
        }
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
}

export const MY_DATE_FORMATS = {
    parse: {
        dateInput: 'DD/MM/YYYY'
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY'
    }
}

interface Pago {
    value: string
    viewValue: string
}
