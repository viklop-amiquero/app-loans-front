import { HttpClient, HttpResponse } from "@angular/common/http";
import { TokenService } from '@services/token.service';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { MatDialog } from '@angular/material/dialog';
import { DialogCustomData } from '@models/dialog.model';
import { DialogcustomComponent } from '../../../../admin/components/dialogcustom/dialogcustom.component';
import { Observable } from "rxjs";
import { AppRolMenuPag, CreateAppRolMenu, DeleteAppRolMenu, GetAppRolMenu, ListaTotalMenus, ListaTotalPermisos, ListadoApps, ListadoMenusPermisos, UpdateAppRolMenu } from "@models/security/approlmenu.model";
import { ListDetailMenuRol } from "@models/auth.model";

@Injectable({
  providedIn: 'root'
})
export class AppRolMenuService {
  private http = inject(HttpClient);
  private matDialog = inject(MatDialog);
  private tokenService = inject(TokenService);

  openDialogCustom(data: DialogCustomData) {
    return this.matDialog.open(DialogcustomComponent, {
      data,
      disableClose: true,
      autoFocus: false,
      width: '700px',
    })
  }

  getPagAppRoleMenu(type: string, filtro: string, index: number, pagezise: number, sortField: number, sortOrder: string) {
    const token: string = this.tokenService.getToken() ?? '';
    const page: number = index + 1;
    return this.http.get<AppRolMenuPag>(`${environment.url_api}/Application/Get_pagina_app_rol_menu?I_PAGE_NUMBER=${page}&I_PAGE_SIZE=${pagezise}&V_FILTER_TYPE=${type}&V_FILTER_VALUE=${filtro}&I_SORT_BY_FIELD=${sortField}&V_SORT_ORDER=${sortOrder}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getAppRolMenu(id: number): Observable<GetAppRolMenu> {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<GetAppRolMenu>(`${environment.url_api}/Application/Get_app_rol_menu?I_APP_ROL_MENU_ID=${id}`
    , {
      headers: {
        Authorization: `Bearer ${token}`
        }
      }
    );
  }

  getMenuRol(id: number): Observable<GetAppRolMenu> {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<GetAppRolMenu>(`${environment.url_api}/Rol/Get_lista_menu_rol?I_ROLE_ID=${id}`
    , {
      headers: {
        Authorization: `Bearer ${token}`
        }
      }
    );
  }

  getDetailMenuRol(id: number): Observable<ListDetailMenuRol> {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<ListDetailMenuRol>(`${environment.url_api}/Rol/Get_detalle_menu_rol?I_ROLE_ID=${id}`
    , {
      headers: {
        Authorization: `Bearer ${token}`
        }
      }
    );
  }

  getListApp() {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<ListadoApps>(`${environment.url_api}/Application/Get_lista_total_app`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getListMenu(): Observable<ListaTotalMenus> {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<ListaTotalMenus>(`${environment.url_api}/Application/Get_lista_total_menu`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getListPermiso(): Observable<ListaTotalPermisos> {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<ListaTotalPermisos>(`${environment.url_api}/Application/Get_lista_total_permisos`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getMenusPermisos(): Observable<ListadoMenusPermisos> {
        const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<ListadoMenusPermisos>(`${environment.url_api}/Application/Get_lista_menus_permisos`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  createAppRolMenu(data: Partial<CreateAppRolMenu>): Observable<HttpResponse<CreateAppRolMenu>> {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.post<CreateAppRolMenu>(`${environment.url_api}/Application/Post_new_app_rol_menu`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      observe : 'response',
    });
  }

  updateAppRolMenu(data: Partial<UpdateAppRolMenu>) {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.patch<UpdateAppRolMenu>(`${environment.url_api}/Application/Patch_update_app_rol_menu`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  deleteAppRoleMenu(id: string): Observable<DeleteAppRolMenu> {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.put<DeleteAppRolMenu>(`${environment.url_api}/Application/Put_delete_app_rol_menu?I_APPLICATION_ROLE_MENU_ID=${id}`, { withCredentials: true }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

}
