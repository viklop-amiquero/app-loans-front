import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBolt, faPencil, faSquarePlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { CreateInteres, Frecuencia, UpdateInteres } from '@models/rapidiario/interes.model';
import { DialogService } from '@services/dialog/dialog.service';
import { InteresService } from '@services/rapidiario/interes.service';
import { ToastrService } from 'ngx-toastr';
import { DialogcustomComponent } from 'src/app/admin/components/dialogcustom/dialogcustom.component';

@Component({
  selector: 'app-interes',
  standalone: true,
  imports: [
    CommonModule, MatFormFieldModule, MatInputModule, MatTableModule, FontAwesomeModule,
    MatButton,HttpClientModule, MatNativeDateModule,MatCardModule, FormsModule,
    ReactiveFormsModule, MatLabel, MatOptionModule, MatSelectModule,MatIconButton,
    RouterModule
  ],
  styleUrl: './interes.component.scss',
  templateUrl: './interes.component.html',
})
export class InteresComponent implements OnInit{
  faSquarePlus=faSquarePlus;
  faPencil = faPencil;
  faTrash = faTrash;
  faBolt = faBolt;

  constructor
  (
    private interesService : InteresService,
    private dialogService: DialogService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  )
  {
    this.buildForm();
  }
  private matDialogRef!: MatDialogRef<DialogcustomComponent>

  formInteresCredito! : FormGroup;
  formInteresAhorro! : FormGroup;

  private buildForm() {
    this.formInteresCredito = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern(/^([Aa-zA-ZáéíóúÁÉÍÓÚÑñ]{2,}\s){0,3}[Aa-zA-ZáéíóúÁÉÍÓÚÑñ]{2,}$/)]],
      tasainteres: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      frecuencia: ['',[Validators.required]],
      descripcion: [''],
    });

    this.formInteresAhorro = this.formBuilder.group({
      nombreahorro: ['', [Validators.required, Validators.pattern(/^([Aa-zA-ZáéíóúÁÉÍÓÚÑñ]{2,}\s){0,3}[Aa-zA-ZáéíóúÁÉÍÓÚÑñ]{2,}$/)]],
      tasainteresahorro: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      frecuenciaahorro: ['',Validators.required],
      descripcionahorro: [''],
    });
  }

  frecuencia:Frecuencia[] =
  [
    {value:'diario',frecuencia:'DIARIO'},
    {value:'semanal',frecuencia:'SEMANAL'},
    {value:'mensual',frecuencia:'MENSUAL'},
    {value:'anual',frecuencia:'ANUAL'}
  ];

  displayedColumns: string[] = ['ID', 'v_NAME', 'i_INTEREST','v_FREQUENCY','b_STATE','ACTION'];
  dataSource:any;
  dataSourceAhorro:any;

  idInteresCredito:number=0;
  idInteresAhorro:number=0;
  idDeleteInteres:number=0;
  idActivate:number=0;
  tipoInteres:string='';

  get nombreField() {
    return this.formInteresCredito?.get('nombre');
  }
  get tasaInteresField() {
    return this.formInteresCredito?.get('tasainteres');
  }
  get frecuenciaField() {
    return this.formInteresCredito?.get('frecuencia');
  }
  get descripcionField() {
    return this.formInteresCredito?.get('descripcion');
  }

  get nombreAhorroField() {
    return this.formInteresAhorro?.get('nombreahorro');
  }
  get tasaInteresAhorroField() {
    return this.formInteresAhorro?.get('tasainteresahorro');
  }
  get frecuenciaAhorroField() {
    return this.formInteresAhorro?.get('frecuenciaahorro');
  }
  get descripcionAhorroField() {
    return this.formInteresAhorro?.get('descripcionahorro');
  }
  changeSelectFreA() {
    this.frecuenciaAhorroField?.value ?? '';
  }
  changeSelectFreC() {
    this.frecuenciaField?.value ?? '';
  }

  ngOnInit(): void {
    this.getAllInteresCredito(); 
    this.getAllInteresAhorro();    
  }
  getAllInteresCredito(){
    this.interesService.getAllInteresCredito()
      .subscribe(data => {
        this.dataSource = new MatTableDataSource(data.value);
  
    });
  }
  getAllInteresAhorro(){
    this.interesService.getAllInteresAhorro()
      .subscribe(data => {
        this.dataSourceAhorro= new MatTableDataSource(data.value);
  
    });
  }
  
  filterCredito(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  filterAhorro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceAhorro.filter = filterValue.trim().toLowerCase();
  }

  getInteresAhorroId(idAhorro: number){
    this.idInteresAhorro=idAhorro;
    this.interesService.getInteresAhorroId(idAhorro).subscribe({next: data => {
        this.nombreAhorroField!.setValue(data.value.v_NAME);
        this.tasaInteresAhorroField!.setValue(data.value.i_INTEREST)
        this.frecuenciaAhorroField!.setValue(String(data.value.v_FREQUENCY.toLowerCase()) )
        this.descripcionAhorroField?.setValue(String(data.value.v_DESCRIPTION) )
    },
    error: (error) => {
      this.toastr.error(error.error.value[0].message, 'Error obtner datos', { timeOut: 3200 });
    }
    });
  }

  openDialogInteresAhorro(template: TemplateRef<any>) {
    this.matDialogRef = this.dialogService.openDialogCustom({
      template
    })
    this.matDialogRef
      .afterClosed()
      .subscribe(res => { 
        this.formInteresAhorro.reset();
        this.idInteresAhorro=0;
      });
  }
  private createInteresAhorro() {
    const data : Partial<CreateInteres> = {
      v_NAME: String(this.nombreAhorroField!.value).trim(),
      i_INTEREST: String(this.tasaInteresAhorroField!.value).trim(),   
      v_FREQUENCY: String(this.frecuenciaAhorroField!.value).trim(),                                   
      v_DESCRIPTION: String(this.descripcionAhorroField?.value).trim(),                              
    };
    
    this.interesService.createInteresAhorro(data)
    .subscribe({next: () => {
      this.toastr.success("Se guardaron los datos correctamente.", 'Exitoso', { timeOut: 3200 });
      this.formInteresAhorro.reset();
      this.getAllInteresAhorro(); 
    },
    error: (error) => {
      this.toastr.error(error.error.value[0].message, 'Error en guardar', { timeOut: 3200 });
    }
    });
  }
  private updateInteresAhorro(){
    const data : Partial<UpdateInteres> = {
      i_INTEREST_ID:this.idInteresAhorro,
      v_NAME: String(this.nombreAhorroField!.value),                  
      i_INTEREST: String(this.tasaInteresAhorroField!.value),
      v_FREQUENCY: String(this.frecuenciaAhorroField!.value),                   
      v_DESCRIPTION: String(this.descripcionAhorroField?.value) ===""?"": String(this.descripcionAhorroField!.value).trim()                  
    }
    this.interesService.updateInteresAhorro(data)
    .subscribe({next: () => {
      this.toastr.success("Se guardaron los datos correctamente.", 'Actualización exitosa', { timeOut: 3200 });
      this.formInteresAhorro.reset();
      this.getAllInteresAhorro(); 
    },
    error: (error) => {
      this.toastr.error(error.error.value[0].message, 'Error en actualizar', { timeOut: 3200 });
    }
    });
  
  }
  onSaveAhorro() {
    if (this.formInteresAhorro.valid) {
      if (this.idInteresAhorro) {
        this.updateInteresAhorro();
        this.idInteresAhorro=0;
        this.matDialogRef!.close();
        
      }else{
        this.createInteresAhorro();
        this.matDialogRef!.close();
      } 
      
    } else {
      this.formInteresAhorro.markAllAsTouched();
    }
  }
  openDialogInteresCredito(template: TemplateRef<any>) {
    this.matDialogRef = this.dialogService.openDialogCustom({
      template
    })
    this.matDialogRef
      .afterClosed()
      .subscribe(res => { 
        this.formInteresCredito.reset();
        this.idInteresCredito=0;  
      });
  }
  getInteresCreditoId(idCredito: number){
    this.idInteresCredito = idCredito;
    this.interesService.getInteresCreditoId(idCredito).subscribe({next: data => {
        this.nombreField!.setValue(data.value.v_NAME);
        this.tasaInteresField!.setValue(data.value.i_INTEREST)
        this.frecuenciaField!.setValue(String(data.value.v_FREQUENCY.toLowerCase()) )
        this.descripcionField?.setValue(String(data.value.v_DESCRIPTION) )
    },
    error: (error) => {
      this.toastr.error(error.error.value[0].message, 'Error obtner datos', { timeOut: 3200 });
    }
    });
  }
  private createInteresCredito() {
    const data : Partial<CreateInteres> = {
      v_NAME: String(this.nombreField!.value).trim(),
      i_INTEREST: String(this.tasaInteresField!.value).trim(),   
      v_FREQUENCY: String(this.frecuenciaField!.value).trim(),                                   
      v_DESCRIPTION: String(this.descripcionField?.value).trim(),                              
    };
    
    this.interesService.createInteresCredito(data)
    .subscribe({next: () => {
      this.toastr.success("Se guardaron los datos correctamente.", 'Exitoso', { timeOut: 3200 });
      this.formInteresCredito.reset();
      this.getAllInteresCredito();
    },
    error: (error) => {
      this.toastr.error(error.error.value[0].message, 'Error en guardar', { timeOut: 3200 });
    }
    });
  }
  private updateInteresCredito(){
    const data : Partial<UpdateInteres> = {
      i_INTEREST_ID:this.idInteresCredito,
      v_NAME: String(this.nombreField!.value).trim(),                  
      i_INTEREST: String(this.tasaInteresField!.value).trim(),
      v_FREQUENCY: String(this.frecuenciaField!.value).trim(),                   
      v_DESCRIPTION: String(this.descripcionField?.value)===""?"":String(this.descripcionField!.value).trim()                   
    }
    this.interesService.updateInteresCredito(data)
    .subscribe({next: () => {
      this.toastr.success("Se guardaron los datos correctamente.", 'Actualización exitosa', { timeOut: 3200 });
      this.formInteresCredito.reset();
      this.getAllInteresCredito();
    },
    error: (error) => {
      this.toastr.error(error.error.value[0].message, 'Error en actualizar', { timeOut: 3200 });
    }
    });
  
  }

  onSaveCredito() {
    if (this.formInteresCredito.valid) {
      if (this.idInteresCredito) {
        this.updateInteresCredito(); 
        this.matDialogRef!.close();
        this.idInteresCredito=0;
      }else{
        this.createInteresCredito();
        this.matDialogRef!.close();
      } 
    } else {
      this.formInteresCredito.markAllAsTouched();
    }
  }
  closeDialog(){
    this.matDialogRef.close();
    this.idInteresCredito=0;
    this.idInteresAhorro=0;
    this.formInteresAhorro.reset();
    this.formInteresCredito.reset();
  }
  openDeleteInteres(template: TemplateRef<any>, idInteres: number, tipoInteres:string) {
   this.idDeleteInteres=idInteres;
   this.tipoInteres=tipoInteres;
    this.matDialogRef = this.dialogService.openDialogCustom({
      template
    })
  }
  deleteInteres(){
    if(this.tipoInteres==='credito'){
      this.interesService.deleteInteresCredito(this.idDeleteInteres).subscribe({
        next: () => {
          this.getAllInteresCredito();
          this.matDialogRef.close();
          this.tipoInteres='';
          this.idDeleteInteres=0;
          this.toastr.success("Se anuló correctamente el interes crédito.", 'Eliminado correctamente', { timeOut: 3200 });
        }, error: (error) => {
          this.matDialogRef.close();
          this.tipoInteres='';
          this.idDeleteInteres=0;
          this.toastr.error(error.error.value[0].message, 'Error', { timeOut: 3200 });
        }
      });
    }
    if(this.tipoInteres==='ahorro'){
      this.interesService.deleteInteresAhorro(this.idDeleteInteres).subscribe({
        next: () => {
          this.getAllInteresAhorro();
          this.matDialogRef.close();
          this.tipoInteres='';
          this.idDeleteInteres=0;
          this.toastr.success("Se anuló correctamente el interes ahorro.", 'Eliminado correctamente', { timeOut: 3200 });
        }, error: (error) => {
          this.matDialogRef.close();
          this.tipoInteres='';
          this.idDeleteInteres=0;
          this.toastr.error(error.error.value[0].message, 'Error', { timeOut: 3200 });
        }
      });
    }
  }
  
  activarInteres(id: number, tipoInteres:string) {
    if(tipoInteres==='credito'){
      this.interesService.activateCredito(id)
      .subscribe({
        next: () => {
          this.getAllInteresCredito()
          this.tipoInteres='';
          this.toastr.success("Se activo el interés crédito.", 'Activado correctamente', { timeOut: 3200 });
          
        }, error: (error) => {
          this.tipoInteres='';
          this.toastr.error(error.error.value[0].message, 'Error', { timeOut: 3200 });
        }
      });
    }
    if(tipoInteres==='ahorro'){
      this.interesService.activateAhorro(id)
      .subscribe({
        next: () => {
          this.getAllInteresAhorro()
          this.tipoInteres='';
          this.toastr.success("Se activo el interés ahorro.", 'Activado correctamente', { timeOut: 3200 });
          
        }, error: (error) => {
          this.tipoInteres='';
          this.toastr.error(error.error.value[0].message, 'Error', { timeOut: 3200 });
        }
      });
    }
    
  }
  deshabilitarBtn(state: string):boolean {
    const estado = state;
    if (estado == '0') {
      return true;
    }
    return false;
  }
 }
