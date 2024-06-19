import { BreakpointObserver } from '@angular/cdk/layout';
import { STEPPER_GLOBAL_OPTIONS, StepperOrientation } from '@angular/cdk/stepper';
import { AsyncPipe, CommonModule, DatePipe, NgIf } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';
import { Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder,FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
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
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet} from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CreateCliente, Department, District, Document, Nrodocumento, Parentesco, Province, Sex, UpdateCliente } from '@models/colaborador/colaborador.model';
import { ColaboradorService } from '@services/colaborador/colaborador.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith } from 'rxjs';

export const MY_FORMATS = {
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-colaborador-form',
  standalone: true,
  imports: [
    CommonModule,MatCardModule, MatSidenavModule, MatStepperModule,
    ReactiveFormsModule, MatFormFieldModule, MatDatepickerModule,
    MatInputModule, MatButtonModule,MatSelectModule, MatPaginatorModule,
    MatTableModule, MatSortModule,MatIconModule,
    MatChipsModule, RouterLink, MatAutocompleteModule, AsyncPipe, FormsModule,
    NgIf, DatePipe, HttpClientModule,
    RouterModule,
    MatToolbarModule, MatMenuModule, RouterOutlet, FontAwesomeModule,
    MatDialogModule, MatDialogActions,
    MatDialogClose, MatDialogContent, MatDialogTitle,MatNativeDateModule
  ],
  templateUrl: './colaborador-form.component.html',
  styleUrl:'./colaborador-form.component.scss',
  providers: [DatePipe,
      {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
      {
        provide: STEPPER_GLOBAL_OPTIONS,
        useValue: {displayDefaultIndicatorType: false},
      },

    ],
})
export class ColaboradorFormComponent implements OnInit {

  parentesco:Parentesco[] =
  [
  {value:'PADRE',viewValue:'PADRE'},
  {value:'MADRE',viewValue:'MADRE'},
  {value:'HERMANO',viewValue:'HERMANO'},
  {value:'HERMANA',viewValue:'HERMANA'},
  {value:'HIJO',viewValue:'HIJO'},
  {value:'HIJA',viewValue:'HIJA'},
  {value:'OTRO',viewValue:'OTRO'}
  ];

  stepperOrientation: Observable<StepperOrientation>;
  tipodocumento: string="";

  //disableInput = true;
  disableSiguiente = true;
  disableReiniciar = true;
  desabilitarCreate= true;
  texto:string="";

  accion ='Agregar';
  id:number | undefined;
  docSeleccionado:number=0;

  countDni=0;
  isEditable = true;
  idPersona = 0;
  clienteId: string ="";

  codeDep: string ="";
  codeProv: string ="";
  idUbigeo:string ="";

  //para edad
  fechaNacimiento:string|undefined;
  edad =0;
  maxDate:Date;
  minDate:Date;

  constructor(
    private colaboradorService: ColaboradorService,
    private builderForm: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private breakpointObserver: BreakpointObserver
  ) {
    //mediaquery de steps
    this.stepperOrientation = breakpointObserver
    .observe('(min-width: 570px)')
    .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));

    this.buildForm();
    this.maxDate = new Date();
    this.minDate= new Date(1960, 0, 1);

    this.getCliente();

  }
  @ViewChild('autoSex') tipoSexAutocomplete!: MatAutocomplete;
  @ViewChild('autoDepartment') departmentAutocomplete!: MatAutocomplete;
  @ViewChild('autoProvince') provinceAutocomplete!: MatAutocomplete;
  @ViewChild('autoDistrict') districtAutocomplete!: MatAutocomplete;
  @ViewChild('autoTipoDoc') tipoDocServAutocomplete!: MatAutocomplete;

  optionTipoDoc: Document[] = [];
  optionSex: Sex[] = [];
  optionDepartment: Department[] = [];
  optionProvince: Province[] = [];
  optionDistrict: District[] = [];
  nroDocumento: Nrodocumento[]=[];


  tipoSex!: Observable<Sex[]>;
  tipoDeparment!: Observable<Department[]>;
  tipoProvince!: Observable<Province[]>;
  tipoDistrict!: Observable<District[]>;
  tipoDoc!: Observable<Document[]>;

  pipe = new DatePipe('es');

  ngOnInit(): void {

    this.colaboradorService.getAllDocument().subscribe(resp => {
      this.optionTipoDoc = resp.value;
      this.docSeleccionado =this.optionTipoDoc[0].i_DOC_TYPE_ID;
    })
    this.colaboradorService.getAllSex().subscribe(resp => {
      this.optionSex = resp.value;
      if (this.sexField) {
          this.tipoSex = this.sexField.valueChanges.pipe(
            startWith(''),
            map(value => this._filterSexServ(value || ''))
          );
        };
        this.tipoSexAutocomplete.displayWith = (option: number) => {
          let selected = this.optionSex.find( (tds) => tds.i_SEX_ID === option );
          return selected ? selected.v_NAME : '';
        };
      })
    this.colaboradorService.getAllDepartment().subscribe(resp => {
      this.optionDepartment = resp.value;
      if (this.departmentField) {
          this.tipoDeparment= this.departmentField.valueChanges.pipe(
            startWith(''),
            map(value => this._filterDepartmentServ(value || ''))
          );
        };
        this.departmentAutocomplete.displayWith = (option: number) => {
          let selected = this.optionDepartment.find( (tds) => parseInt(tds.v_DEPARTAMENT_CODE)== option );
          let newCodeDep='';
          if (selected) {
            newCodeDep = selected.v_DEPARTAMENT_CODE;
          }
          this.codeDep =newCodeDep;
          return selected ? selected.v_DEPARTAMENT : '';
        };
    })
    this.colaboradorService.getNroDocumentoCliente().subscribe(data=>{
      this.nroDocumento = data.value;
    })
    if(this.clienteId){
      this.disableReiniciar=false;
    }
  }

  _filterSexServ(value: string): Sex[] {
    const filterValue = value;
    return this.optionSex.filter(option => option.v_NAME.toLowerCase().includes(filterValue));
  }
  _filterDepartmentServ(value: string): Department[] {
    const filterValue = value.toLowerCase();
    return this.optionDepartment.filter(option => option.v_DEPARTAMENT.toLowerCase().includes(filterValue));
  }
  _filterProvinceServ(value: string): Province[] {
    const filterValue = value.toLowerCase();
    return this.optionProvince.filter(option => option.v_PROVINCE.toLowerCase().includes(filterValue));
  }
  _filterDistrictServ(value: string): District[] {
    const filterValue = value.toLowerCase();
    return this.optionDistrict.filter(option => option.v_DISTRICT.toLowerCase().includes(filterValue));
  }


  formStepper01!: FormGroup;
  formStepper02!: FormGroup ;

  private buildForm(){
    this.formStepper01 = this.builderForm.group({

      tipodocumento: ['',[Validators.required]],
      sex: ['',[Validators.required]],
      dni: ['', []],
      carnet: ['', []],
      pass: ['', []],
      firstname: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(/^([Aa-zA-ZáéíóúÁÉÍÓÚÑñ]{2,}\s){0,3}[Aa-zA-ZáéíóúÁÉÍÓÚÑñ]{2,}$/)]],
      secondname: ['',[Validators.pattern(/^([Aa-zA-ZáéíóúÁÉÍÓÚÑñ]{2,}\s){0,3}[Aa-zA-ZáéíóúÁÉÍÓÚÑñ]{2,}$/)]],
      lastnamepaternal: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(/^([Aa-zA-ZáéíóúÁÉÍÓÚÑñ]{2,}\s){0,3}[Aa-zA-ZáéíóúÁÉÍÓÚÑñ]{2,}$/)]],
      lastnamemothers: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(/^([Aa-zA-ZáéíóúÁÉÍÓÚÑñ]{2,}\s){0,3}[Aa-zA-ZáéíóúÁÉÍÓÚÑñ]{2,}$/)]],

      datebrith: ['',[Validators.required]],
      age : [{ value:this.ageCalculator(), disabled: false}],

    });

    this.formStepper02 = this.builderForm.group({
      department: ['', [Validators.required]],
      province: [{ value: '', disabled: true }, [Validators.required]],
      district: [{ value: '', disabled: true }, [Validators.required]],
      addreshome: ['', [Validators.required]],
      addreswork: [''],

      namerelationship: [''],
      relationship: [''],
      movilphonerelationship: [{ value: '', disabled: true },[Validators.pattern(/^\d{9}$/)]],
      phonerelationship: [{ value: '', disabled: true },[Validators.pattern(/^\d{9}$/)]],
      phone: ['',[Validators.pattern(/^\d{9}$/)]],
      movilphone: ['',[Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: ['',[Validators.email]]
    });

    //Para que se vuelva ejecutar la función ageCalculator()
    this.formStepper01.get('datebrith')!.valueChanges.subscribe(() => {
      this.formStepper01.get('age')!.setValue(this.ageCalculator());
    });

    //Validando Dni
    this.formStepper01.get('dni')?.valueChanges.subscribe((dni: string) => {
      const personaEditadaId = Number(this.clienteId); // Asegúrate de obtener el ID de la persona que estás editando
      const validationResult = this.validandoDni(dni, personaEditadaId);

      if (validationResult.error) {
        this.toastr.error(validationResult.message || 'Error insertar dato', 'Error insertar dato', { timeOut: 3200 });
        this.disableSiguiente = true;
      } else {
        this.disableSiguiente = false;
      }
    });

    //Llamando a las validaciones de la seleccion
    this.subscribeToDocumentChanges();
}


  //Steep 1
  get tipodocumentField() {
    return this.formStepper01?.get('tipodocumento');
  }
  get nrodniField() {
    return this.formStepper01.get('dni');
  }
  get isNrodniFieldValidForm() {
    return this.formStepper01.get('dni')?.touched && this.formStepper01.get('dni')?.valid;
  }
  get nrocarnetField() {
    return this.formStepper01.get('carnet');
  }
  get isNrocarnetFieldValidForm() {
    return this.formStepper01.get('carnet')?.touched && this.formStepper01.get('carnet')?.valid;
  }
  get nropasField() {
    return this.formStepper01.get('pass');
  }
  get isNropasFieldValidForm() {
    return this.formStepper01.get('pass')?.touched && this.formStepper01.get('pass')?.valid;
  }
  get sexField() {
    return this.formStepper01.get('sex');
  }
  get isSexFieldValidForm() {
    return this.formStepper01.get('sex')?.touched && this.formStepper01.get('sex')?.valid;
  }
  get firstnameField() {
    return this.formStepper01.get('firstname');
  }
  get isFirstnameFieldValidForm() {
    return this.formStepper01.get('firstname')?.touched && this.formStepper01.get('firstname')?.valid;
  }
  get isFirstnameFieldInvalidForm() {
    return this.formStepper01.get('firstname')?.touched && this.formStepper01.get('firstname')?.invalid;
  }
  get secondnameField() {
    return this.formStepper01.get('secondname');
  }
  get isSecondnameFieldValidForm() {
    return this.formStepper01.get('secondname')?.touched && this.formStepper01.get('secondname')?.valid;
  }
  get lastnamepaternalField() {
    return this.formStepper01.get('lastnamepaternal');
  }
  get isLastnamepaternalFieldValidForm() {
    return this.formStepper01.get('lastnamepaternal')?.touched && this.formStepper01.get('lastnamepaternal')?.valid;
  }
  get isLastnamepaternalFieldInvalidForm() {
    return this.formStepper01.get('lastnamepaternal')?.touched && this.formStepper01.get('lastnamepaternal')?.invalid;
  }
  get lastnamemothersField() {
    return this.formStepper01.get('lastnamemothers');
  }
  get isLastnamemothersFieldValidForm() {
    return this.formStepper01.get('lastnamemothers')?.touched && this.formStepper01.get('lastnamemothers')?.valid;
  }
  get edadField() {
    return this.formStepper01.get('age');
  }
  get datebrithField() {
    return this.formStepper01.get('datebrith');
  }
  get isDatebrithFieldValidForm() {
    return this.formStepper01.get('datebrith');
  }

  //Steep 2
  get ubigeoField(){
    return this.formStepper02.get('ubigeo');
  }
  get isUbigeoFieldValidForm() {
    return this.formStepper02.get('ubigeo')?.touched && this.formStepper01.get('ubigeo')?.valid;
  }
  get departmentField() {
    return this.formStepper02.get('department');
  }
  get isDepartmentFieldValidForm() {
    return this.formStepper02.get('department')?.touched && this.formStepper02.get('department')?.valid;
  }
  get provinceField() {
    return this.formStepper02.get('province');
  }
  get isProvinceFieldValidForm() {
    return this.formStepper02.get('province')?.touched && this.formStepper02.get('province')?.valid;
  }
  get districtField() {
    return this.formStepper02.get('district');
  }
  get isDistrictFieldValidForm() {
    return this.formStepper02.get('district')?.touched && this.formStepper02.get('district')?.valid;
  }
  get addresHomeField() {
    return this.formStepper02.get('addreshome');
  }
  get isAddreshomeFieldValidForm() {
    return this.formStepper01.get('addreshome')?.touched && this.formStepper01.get('addreshome')?.valid;
  }
  get addresWorkField() {
    return this.formStepper02.get('addreswork');
  }

  //Steep 3
  get nameRelationshipField() {
    return this.formStepper02.get('namerelationship');
  }
  get relationshipField() {
    return this.formStepper02.get('relationship');
  }
  get movilPhoneRelationshipField() {
    return this.formStepper02.get('movilphonerelationship');
  }
  get isMovilphonerelationshipFieldValidForm() {
    return this.formStepper02.get('movilphonerelationship')?.touched && this.formStepper02.get('movilphonerelationship')?.valid;
  }
  get phoneRelationshipField() {
    return this.formStepper02.get('phonerelationship');
  }
  get isPhonerelationshipFieldValidForm() {
    return this.formStepper02.get('phonerelationship')?.touched && this.formStepper02.get('phonerelationship')?.valid;
  }
  get phoneField() {
    return this.formStepper02.get('phone');
  }
  get isPhoneFieldValidForm() {
    return this.formStepper02.get('phone')?.touched && this.formStepper02.get('phone')?.valid;
  }
  get movilPhoneField() {
    return this.formStepper02.get('movilphone');
  }
  get isMovilphoneFieldValidForm() {
    return this.formStepper02.get('movilphone')?.touched && this.formStepper02.get('movilphone')?.valid;
  }
  get emailField() {
    return this.formStepper02.get('email');
  }
  get isEmailFieldValidForm() {
    return this.formStepper02.get('email')?.touched && this.formStepper02.get('email')?.valid;
  }

  changeTipoDoc (){
    this.tipodocumento = this.tipodocumentField?.value ?? '';
  }

  filtro :  string | null | undefined ;
  //Select tipo documento
  getTipoDocumenteTable() {
    if (this.tipodocumentField?.value === "1") {
      this.filtro = this.nrodniField?.value;
    }if (this.tipodocumentField?.value === "3") {
      this.filtro = this.nropasField?.value;
    }if (this.tipodocumentField?.value === "2"){
      this.filtro = this.nrocarnetField?.value;
    }
  }
  //Limite de ingresar solo numeros en un input
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

  convertirAMayusculas() {
    this.texto = this.texto.toUpperCase();
  }
  saveStep1() {
    if (this.formStepper01.valid){
      if (this.clienteId) {
      }else{
      }
    }else {
      this.formStepper01.markAllAsTouched();
    }
  }

  saveStep2() {
    if (this.formStepper02.valid){
      if (this.clienteId) {
        this.updateClienteSteps();
      }else{
        this.createClienteSteps();
      }
    }else {
      this.formStepper02.markAllAsTouched();
    }
  }

  getCliente() {
    if(sessionStorage.getItem('clienteEdit') != ""){
      this.clienteId = sessionStorage.getItem('clienteEdit') ?? "";
      this.colaboradorService.getClienteId(this.clienteId)
      .subscribe(data => {

        //Steep 1
        this.sexField!.setValue(data.value.i_SEX_ID);
        this.tipodocumentField!.setValue(data.value.document_persona[0].i_TYPE_DOCUMENT_ID)
        this.nrodniField!.setValue(String(data.value.document_persona[0].v_NRO_DOCUMENT) )
        this.nrocarnetField!.setValue(String(data.value.document_persona[0].v_NRO_DOCUMENT) )
        this.nropasField!.setValue(String(data.value.document_persona[0].v_NRO_DOCUMENT) )
        this.firstnameField!.setValue(data.value.v_FIRST_NAME);
        this.secondnameField!.setValue(String(data.value.v_SECOND_NAME) === 'null' ? '' : data.value.v_SECOND_NAME);
        this.lastnamepaternalField!.setValue(String(data.value.v_PATERNAL_LAST_NAME) === 'null' ? '' : data.value.v_PATERNAL_LAST_NAME);
        this.lastnamemothersField!.setValue(String(data.value.v_MOTHER_LAST_NAME) === 'null' ? '' : data.value.v_MOTHER_LAST_NAME);
        this.edadField!.setValue(String(data.value.i_AGE));
        this.datebrithField!.setValue(data.value.d_BIRTHDATE == null ? '' : data.value.d_BIRTHDATE);

        //Steep 2
        this.getUbigeo(String(data.value.i_UBIGEO_ID))
        this.addresHomeField!.setValue(String(data.value.v_ADDRESS_HOME) === 'null' ? '' : data.value.v_ADDRESS_HOME);
        this.addresWorkField!.setValue(String(data.value.v_ADDRESS_WORK) === 'null' ? '' : data.value.v_ADDRESS_WORK);

        this.nameRelationshipField!.setValue(String(data.value.contact_emergency[0].v_NAME_RELATIONSHIP) === 'null' ? '' : data.value.contact_emergency[0].v_NAME_RELATIONSHIP);
        this.relationshipField!.setValue(String(data.value.contact_emergency[0].v_RELATIONSHIP) === 'null' ? '' : data.value.contact_emergency[0].v_RELATIONSHIP);
        this.movilPhoneRelationshipField!.setValue(String(data.value.contact_emergency[0].v_MOVIL_PHONE_RELATIONSHIP) === 'null' ? '' : data.value.contact_emergency[0].v_MOVIL_PHONE_RELATIONSHIP);
        this.phoneRelationshipField!.setValue(String(data.value.contact_emergency[0].v_PHONE_RELATIONSHIP) === 'null' ? '' : data.value.contact_emergency[0].v_PHONE_RELATIONSHIP);
        this.movilPhoneField!.setValue(String(data.value.contact[0].v_MOVIL_PHONE) === 'null' ? '' : data.value.contact[0].v_MOVIL_PHONE);
        this.emailField!.setValue(String(data.value.contact[0].v_EMAIL) === 'null' ? '' : data.value.contact[0].v_EMAIL);
        this.phoneField!.setValue(String(data.value.contact[0].v_PHONE) === 'null' ? '' : data.value.contact[0].v_PHONE);

      });
    }
  }
  updateClienteSteps(){
    const data : Partial<UpdateCliente> = {
      i_STEP: (1),
      i_PERSON_ID:Number(this.clienteId),

      v_SEX_ID: String(this.sexField?.value),
      i_TYPE_DOC_ID: this.tipodocumentField?.value,
      v_NUMBER_DOCUMENT: this.getNrodoc(),
      v_FIRST_NAME: String(this.formStepper01.value.firstname),
      v_SECOND_NAME: this.formStepper01.value.secondname== ""?"":String(this.formStepper01.value.secondname).trim(),
      v_PATERNAL_LAST_NAME: String(this.formStepper01.value.lastnamepaternal).trim(),
      v_MOTHER_LAST_NAME: String(this.formStepper01.value.lastnamemothers).trim(),
      d_BIRTH_DATE: String(this.formStepper01.value.datebrith) === "" ? "" : (this.datePipe.transform(this.formStepper01.value.datebrith, 'dd/MM/yyyy') || undefined),

      v_UBIGEO_ID: String(this.idUbigeo).trim(),
      v_ADDRESS_HOME: String(this.formStepper02.value.addreshome),
      v_ADDRESS_WORK: this.formStepper02.value.addreswork==""?"":String(this.formStepper02.value.addreswork).trim(),
      v_NAME_RELATIONSHIP:this.formStepper02.value.namerelationship==""?"":String(this.formStepper02.value.namerelationship).trim(),
      v_RELATIONSHIP: this.formStepper02.value.relationship==""?"":String(this.formStepper02.value.relationship).trim(),
      v_MOVIL_PHONE_RELATIONSHIP:this.formStepper02.value.movilphonerelationship==null?"":String(this.formStepper02.value.movilphonerelationship),
      v_PHONE_RELATIONSHIP: this.formStepper02.value.phonerelationship==null?"":String(this.formStepper02.value.phonerelationship),
      v_PHONE: String(this.formStepper02.value.phone),
      v_MOVIL_PHONE: this.formStepper02.value.movilphone==""?"":String(this.formStepper02.value.movilphone).trim(),
      v_EMAIL: this.formStepper02.value.email==""?"":String(this.formStepper02.value.email).trim()

    }
    this.colaboradorService.updateCliente(data)
    .subscribe({next: () => {
      this.toastr.success("Se guardaron los datos correctamente.", 'Actualización exitosa', { timeOut: 3200 });
      this.router.navigate(["rapidiario/colaborador"]);
    },
    error: (error) => {
      this.toastr.error(error.error.value[0].message, 'Error en actualizar', { timeOut: 3200 });
    }
    });

  }

  private createClienteSteps() {
    const data : Partial<CreateCliente> = {
      i_STEP: (1),
      i_TYPE_DOC_ID: this.tipodocumentField?.value,
      v_NUMBER_DOCUMENT: this.getNrodoc(),
      i_SEX_ID: String(this.sexField?.value).trim(),
      v_FIRST_NAME: String(this.formStepper01.value.firstname).trim(),
      v_SECOND_NAME:String(this.formStepper01.value.secondname)===""?"": String(this.formStepper01.value.secondname).trim(),
      v_PATERNAL_LAST_NAME: String(this.formStepper01.value.lastnamepaternal).trim(),
      v_MOTHER_LAST_NAME: String(this.formStepper01.value.lastnamemothers).trim(),
      d_BIRTH_DATE: String(this.formStepper01.value.datebrith) === "" ? "" : (this.datePipe.transform(this.formStepper01.value.datebrith, 'dd/MM/yyyy') || undefined),

      i_UBIGEO_ID: String(this.idUbigeo).trim(),
      v_ADDRESS_HOME: String(this.formStepper02.value.addreshome).trim(),
      v_ADDRESS_WORK: String(this.formStepper02.value.addreswork)===""?"":String(this.formStepper02.value.addreswork),

      v_NAME_RELATIONSHIP:String(this.formStepper02.value.namerelationship)===""?"":String(this.formStepper02.value.namerelationship),
      v_RELATIONSHIP: String(this.formStepper02.value.relationship)===""?"":String(this.formStepper02.value.relationship),
      v_MOVIL_PHONE_RELATIONSHIP:String(this.formStepper02.value.movilphonerelationship)===""?String(this.formStepper02.value.movilphonerelationship):'',
      v_PHONE_RELATIONSHIP: String(this.formStepper02.value.phonerelationship)===""?String(this.formStepper02.value.phonerelationship):'',
      v_PHONE: String(this.formStepper02.value.phone)===""?"":(this.formStepper02.value.phone),
      v_MOVIL_PHONE: String(this.formStepper02.value.movilphone),
      v_EMAIL: String(this.formStepper02.value.email)
    }

    this.colaboradorService.createCliente(data)
    .subscribe({next: () => {
      this.toastr.success("Se guardaron los datos correctamente.", 'Exitoso', { timeOut: 3200 });
      this.router.navigate(["rapidiario/colaborador"]);
    },
    error: (error) => {
      this.toastr.error(error.error.value[0].message, 'Error en guardar', { timeOut: 3200 });
    }
    });
  }

  getUbigeo(idUbigeo:string){
    this.colaboradorService.getUbigeoId(idUbigeo).subscribe(data=>{
      if (this.optionDepartment.length > 0 ||this.optionProvince.length > 0 ) {
        this.codeDep=data.value.v_DEPARTMENT_CODE.trim();
        this.codeProv=data.value.v_PROVINCE_CODE.trim();
        this.idUbigeo=String(data.value.i_UBIGEO_ID).trim();
      }
      this.departmentField!.setValue(data.value.v_DEPARTMENT_CODE);
      this.provinceField!.setValue(data.value.v_PROVINCE);
      this.districtField!.setValue(data.value.v_DISTRICT);
    })
  }

  //Calculando edad
  ageCalculator() {
    if (this.formStepper01 && this.formStepper01.get('datebrith')) {
      this.fechaNacimiento = this.formStepper01.get('datebrith')!.value;

      if (this.fechaNacimiento === "" || this.fechaNacimiento === undefined) {
        return "";
      } else {
        var convertAge = new Date(this.fechaNacimiento!);
        var timeDiff = Math.abs(Date.now() - convertAge.getTime());
        return Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
      }
    }
    return "";
  }


  validandoDni(nroDocumento: string, personaEditadaId?: number): { error: boolean, message?: string } {
    const existeDni = this.nroDocumento.some(data => data.v_NRO_DOCUMENTO === nroDocumento && data.i_PERSONA_ID !== personaEditadaId);

    if (existeDni) {
      return { error: true, message: 'Existe una persona con ese DNI, corrige el dni' };
    }

    return { error: false };
  }

  //Obteniendo datos NroDocumento
  getNrodoc():string{
    if(this.formStepper01.get('tipodocumento')?.value=='1'){
      return String(this.formStepper01.value.dni)
    }
    if(this.formStepper01.get('tipodocumento')?.value=='2'){
      return String(this.formStepper01.value.carnet)
    }
      return String(this.formStepper01.value.pass)

  }

  //Validar segun el tipo de selección realizado
  private subscribeToDocumentChanges() {
    this.formStepper01.get('tipodocumento')?.valueChanges.subscribe(selectedDocument => {
      // Limpiar las validaciones actuales
      this.formStepper01.get('dni')?.setValidators([]);
      this.formStepper01.get('carnet')?.setValidators([]);
      this.formStepper01.get('pass')?.setValidators([]);

      // Aplicar las nuevas validaciones según el documento seleccionado
      if (selectedDocument == '1') {
        this.formStepper01.get('dni')?.setValidators([Validators.required, Validators.pattern(/^[0-9]{8}$/)]);
      } else if (selectedDocument == '2') {
        this.formStepper01.get('carnet')?.setValidators([Validators.required, Validators.pattern(/^[0-9]{12}$/)]);
      } else if (selectedDocument == '3') {
        this.formStepper01.get('pass')?.setValidators([Validators.required, Validators.pattern(/^[0-9]{12}$/)]);
      }

      // Actualizar las validaciones
      this.formStepper01.get('dni')?.updateValueAndValidity();
      this.formStepper01.get('carnet')?.updateValueAndValidity();
      this.formStepper01.get('pass')?.updateValueAndValidity();
    });
  }
  onInputChangePro(event: any) {
    const departamento = event.target.value;
    if(departamento.length<=2){
      this.formStepper02.get('province')!.setValue('');
      this.formStepper02.get('district')!.setValue('');
    }
  }
  onInputChangeDis(event: any){
    const provincia = event.option.value;
    if(provincia.length<=2){
      this.formStepper02.get('district')!.setValue('');
    }
  }
  //Hablitar y desabilitar input
  habilitarInputProv(){
    const input1= this.formStepper02.get('department')?.value;
    if (input1 !== null && input1.trim() !== "") {
      this.formStepper02.get('province')?.enable();

      this.colaboradorService.getAllProvincia(this.codeDep).subscribe(resp => {
        this.optionProvince = resp.value;
        if (this.optionProvince.length > 0) {
            let firstOption = this.optionProvince[0]; // o cualquier lógica que necesites para obtener el primer elemento
            this.codeProv = String(firstOption.v_CODE_PROVINCE);
        }
        if (this.provinceField) {
            this.tipoProvince = this.provinceField.valueChanges.pipe(
              startWith(''),
              map(value => this._filterProvinceServ(value || ''))
            );
          };
          this.provinceAutocomplete.displayWith = (option: number) => {
            let selected = this.optionProvince.find( (tds) => parseInt(tds.v_CODE_PROVINCE.trim()) == option );
            let newCodeProv='';
          if (selected) {
            newCodeProv = selected.v_CODE_PROVINCE;
          }
          this.codeProv =newCodeProv;
          return selected ? selected.v_PROVINCE : '';
        };
       })

    } else {
      this.formStepper02.get('province')?.disable();
    }
  }
  habilitarInputDist(){

    const input2= this.formStepper02.get('province')?.value;
    if (input2 !== null && input2.trim() !== "") {
     this.formStepper02.get('district')?.enable();

     this.colaboradorService.getAllDistrito(this.codeProv).subscribe(resp => {
      this.optionDistrict = resp.value;
      if (this.districtField) {
          this.tipoDistrict = this.districtField.valueChanges.pipe(
            startWith(''),
            map(value => this._filterDistrictServ(value || ''))
          );
        };
        this.districtAutocomplete.displayWith = (option: number) => {
          let selected = this.optionDistrict.find( (tds) => parseInt(tds.v_DISTRICT_CODE.trim()) == option );
          let newIdUbigeo='';
          if (selected) {
            newIdUbigeo= String(selected.i_UBIGEO_ID);
          }
          this.idUbigeo =newIdUbigeo;
          return selected ? selected.v_DISTRICT : '';
        };
      })

    } else {
      this.formStepper02.get('district')?.disable();
    }
  }
  // Habilitando y desabilitando input
  habilitarInput(){
    const input1= this.formStepper02.get('namerelationship')?.value;
    const input2= this.formStepper02.get('relationship')?.value;
    if ( (input1 !== null &&input1.trim() !== "" )&& (input2 !== null && input2.trim() !== "")) {
      this.formStepper02.get('movilphonerelationship')?.enable();
      this.formStepper02.get('phonerelationship')?.enable();
    } else {
      this.formStepper02.get('movilphonerelationship')?.disable();
      this.formStepper02.get('phonerelationship')?.disable();
    }

  }
}
