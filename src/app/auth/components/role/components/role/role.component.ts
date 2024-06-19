import { NgIf, DatePipe, CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faTrash, faPencil, faArrowUp, faArrowDown, faSquarePlus, faBolt } from '@fortawesome/free-solid-svg-icons';
import { DetailMenuRol, MenuUserRol } from '@models/auth.model';
import { CreateRol, ListaRoles, Rol } from '@models/security/role.model';
import { AuthService } from '@services/auth.service';
import { DialogService } from '@services/dialog/dialog.service';
import { PaginatorService } from '@services/paginator.service';
import { AppRolMenuService } from '@services/security/approlmenu/approlmenu.service';
import { RolService } from '@services/security/rol/rol.service';
import { ToastrService } from 'ngx-toastr';
import { DialogcustomComponent } from 'src/app/admin/components/dialogcustom/dialogcustom.component';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatPaginatorModule,
    MatChipsModule, NgIf, DatePipe, FontAwesomeModule, MatDialogModule, MatCardModule, MatFormFieldModule,
    MatSelectModule, ReactiveFormsModule, MatInputModule, MatDatepickerModule, CommonModule, RouterLink, RouterModule, RouterOutlet, MatListModule],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss',
  providers: [{provide: MatPaginatorIntl, useClass: PaginatorService}]
})
export class RoleComponent implements OnInit{
  faEye= faEye;
  faTrash = faTrash;
  faPencil = faPencil;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faSquarePlus=faSquarePlus;
  faBolt=faBolt;

  public router = inject(Router);
  private authService = inject(AuthService);
  private dialogService = inject(DialogService);
  private toastrService = inject(ToastrService);
  private formBuilder = inject(FormBuilder);
  private matDialogRef!: MatDialogRef<DialogcustomComponent>

  listaRoles: Rol[] = [];

  formRol = this.formBuilder.group({
    v_rol: ['', [Validators.required]],
    v_descripcion: ['', [ Validators.required]]
  });

  constructor(public dialog: MatDialog, private rolService: RolService, private appRolMenuService: AppRolMenuService) {}

  openDialog(template: TemplateRef<any>) {
    this.matDialogRef = this.dialogService.openDialogCustom({
      template
    })
    this.matDialogRef
      .afterClosed().subscribe(res => { this.formRol.reset() });
  }

  get isRolFieldInvalidForm() {
    return this.rolField?.touched && this.rolField?.invalid;
  }
  get rolField() {
    return this.formRol.get('v_rol');
  }
  get isDescrFieldInvalidForm() {
    return this.descrField?.touched && this.descrField?.invalid;
  }
  get descrField() {
    return this.formRol.get('v_descripcion');
  }

  // CREA EL ROL
  onSave() {
    const dataRol : Partial<CreateRol> = {
      v_ROLE: this.rolField?.value ?? '',
      v_DESCRIPTION: this.descrField?.value ?? '',
    }

    this.rolService.createRol(dataRol).subscribe({
      next: () => {
        this.getListadoRolTable();
        this.matDialogRef.close();
        this.toastrService.success("Registro exitoso.", 'Éxito', { timeOut: 3000 });
      },
      error: (error) => {
        this.matDialogRef.close();
        this.toastrService.error("No se pudo obtener respuesta.", 'Error', { timeOut: 3000 });
      }
    });
  }

  onAddRol() {
    this.rolService.setSelectedId(0);
    this.router.navigate(['rapidiario/roles/create']);
  }

  onEditRol (rolId: any): void {
    this.rolService.setSelectedId(rolId);
    this.router.navigate(['rapidiario/roles/edit']);
  }

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

        const rutaRol ='/'+ this.router.url.split('/')[2];

        this.authService.setMenuAccess(rutaRol);
        this.idMenu = this.authService.getSelectedMenuId();
        this.permisos = this.authService.getPermiso();
        this.getListadoRolTable();
      });
    });

    this.rolService.getListRole().subscribe((data: ListaRoles) => {
      if (data.hasSucceeded) {
        this.listaRoles = data.value;
      }
    });
  }

  //VISUALIZACION DETALLE
  dataDetailCliente: MenuUserRol = {
    id_menu: 0,
    nameMenu: '',
    icon: '',
    ruta: '',
    url: '',
    orden: 0,
    permiso: { idPermission: 0, create: 0, read: 0, update: 0, delete: 0, description: '' },
    sub_menu: [{
      id_menu: 0,
      name: '',
      icon: '',
      ruta: '',
      url: '',
      orden: 0,
      permiso: { idPermission: 0, create: 0, read: 0, update: 0, delete: 0, description: '' },
    }],
  };

  //PAGINADO
  idUser: number = 0;
  idRol: number = 0;

  filtro_v_selected: string = "";
  rol: string = "";
  filtro: string = "";

  formFiltrarTable = this.formBuilder.group({
    filtro_v: [''],
    rol: [''],
    estado: [''],
  });

  orderAscRol: boolean = true;
  orderDescRol: boolean = false;
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
        this.orderAscRol = false;
        this.orderDescRol = true;
        break;
      case 3 :
        this.orderAscEstado = false;
        this.orderDescEstado = true;
        break;
    }

    this.sortField = indexColumn;
    this.sortOrder = 'ASC'
    this.getListadoRolTable();
  }

  clickDesc(indexColumn: number) {
    switch(indexColumn){
      case 2 :
        this.orderAscRol = true;
        this.orderDescRol = false;
        break;
      case 3 :
        this.orderAscEstado = true;
        this.orderDescEstado = false;
        break;
    }

    this.sortField = indexColumn;
    this.sortOrder = 'DESC'
    this.getListadoRolTable();
  }

  displayedColumns: string[] = [
    'i_ROLE_ID',
    'v_ROLE',
    'v_DESCRIPTION',
    'd_CREATE_DATE',
    'b_STATE',
    'ACTIONS'
  ];

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getListadoRolTable()
  }

  get getTipoFiltroFieldForm() {
    return this.formFiltrarTable.get('filtro_v');
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
    this.getRolFieldForm?.reset();
    this.getEstadoFieldForm?.reset();
    this.pageIndex = 0;
  }

  getListadoRolTable() {
    if (this.filtro_v_selected === "NAME") {
      this.filtro = this.getRolFieldForm?.value ?? "";
    }

    if (this.filtro_v_selected === "STATE") {
      this.filtro = this.getEstadoFieldForm?.value ?? "";
    }
    this.rolService.getPagRole(this.filtro_v_selected, this.filtro, this.pageIndex, this.pageSize, this.sortField, this.sortOrder)
      .subscribe(resp => {
        this.dataSource = new MatTableDataSource(resp.value.data);
        this.length = resp.value.total_registros;
      });
  }

  deshabilitarBtn(state:string) {
    const estado= state;
    if (estado=='0'){
      return true;
    }
    return false;
  }

  openDeleteRol(template: TemplateRef<any>, idRol: number) {
    this.idRol = idRol;
    this.matDialogRef = this.dialogService.openDialogCustom({
      template
    })
  }

  openDetailRol(template: TemplateRef<any>, idRolDetalle: number){
    this.idRol = idRolDetalle;
  }

  rolView: Rol = {
    i_ROLE_ID: 0,
    v_ROLE: '',
    v_DESCRIPTION: '',
    b_STATE: '',
    i_USER_CREATE: 0,
    i_USER_MODIF: 0,
    d_CREATE_DATE: new Date(),
    d_MODIF_DATE: new Date() };
  listaMenuUserRol: DetailMenuRol[] = [];
  getDetalleRol(template: TemplateRef<any>, idRolDetalle: number) {
    this.idRol = idRolDetalle;
    this.rolService.getRol(this.idRol).subscribe(res => {
      this.rolView = res.value[0];

      this.appRolMenuService.getDetailMenuRol(this.idRol).subscribe(data => {
        this.listaMenuUserRol = data.value;
        });

        this.matDialogRef = this.dialogService.openDialogCustom({
          template
        });
      });
  }

  deleteRol(){
    this.rolService.deleteRole(String(this.idRol)).subscribe({
      next: () => {
        this.getListadoRolTable();
        this.matDialogRef.close();
        this.toastrService.success("Se anuló correctamente el rol.", 'Éxito', { timeOut: 3000 });
      },
      error: (error) => {
        this.matDialogRef.close();
        this.toastrService.error("No se pudo obtener respuesta.", 'Error', { timeOut: 3000 });
      }
    });
  }

  activateRol(idRol: number){
    this.rolService.activateRole(String(idRol))
        .subscribe({next:() => {
          this.getListadoRolTable()
          this.toastrService.success("Se activó correctamente el rol.", 'Éxito', { timeOut: 3000 });
        },error: (error) => {
          this.toastrService.error("No se pudo obtener respuesta.", 'Error', { timeOut: 3000 });
        }
    });
  }
}
