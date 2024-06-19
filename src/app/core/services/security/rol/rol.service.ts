import { HttpClient, HttpResponse } from "@angular/common/http";
import { TokenService } from '@services/token.service';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { MatDialog } from '@angular/material/dialog';
import { DialogCustomData } from '@models/dialog.model';
import { DialogcustomComponent } from '../../../../admin/components/dialogcustom/dialogcustom.component';
import { CreateRol, DeleteRol, ListaRoles, RolePag, UpdateRol } from "@models/security/role.model";
import { Observable } from "rxjs";
import { GetUserRole } from "@models/security/user.model";

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private http = inject(HttpClient);
  private matDialog = inject(MatDialog);
  private tokenService = inject(TokenService);

  //Para almacenar Id
  private selectedId: number = 0;

  setSelectedId(id: number): void {
    this.selectedId = id;
  }

  getSelectedId(): number {
    return this.selectedId;
  }

  openDialogCustom(data: DialogCustomData) {
    return this.matDialog.open(DialogcustomComponent, {
      data,
      disableClose: true,
      autoFocus: false,
      width: '700px',
    })
  }

  getRol(id: number): Observable<ListaRoles> {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<ListaRoles>(`${environment.url_api}/Rol/Get_rol?I_ROLE_ID=${id}`
    , {
      headers: {
        Authorization: `Bearer ${token}`
        }
      }
    );
  }

  getPagRole(type: string, filtro: string, index: number, pagezise: number, sortField: number, sortOrder: string) {
    const token: string = this.tokenService.getToken() ?? '';
    const page: number = index + 1;
    return this.http.get<RolePag>(`${environment.url_api}/Rol/Get_pagina_rol?I_PAGE_NUMBER=${page}&I_PAGE_SIZE=${pagezise}&V_FILTER_TYPE=${type}&V_FILTER_VALUE=${filtro}&I_SORT_BY_FIELD=${sortField}&V_SORT_ORDER=${sortOrder}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getListRole() {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<ListaRoles>(`${environment.url_api}/Rol/Get_lista_total_roles`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getUsersRol(id: string): Observable<GetUserRole> {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<GetUserRole>(`${environment.url_api}/Rol/Get_lista_usuario_rol?I_ROLE_ID=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  createRol(data: Partial<CreateRol>): Observable<HttpResponse<CreateRol>> {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.post<CreateRol>(`${environment.url_api}/Rol/Post_new_rol`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      observe : 'response',
    });
  }

  updateRol(data: Partial<UpdateRol>) {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.patch<UpdateRol>(`${environment.url_api}/Rol/Patch_update_rol`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  deleteRole(id: string): Observable<DeleteRol> {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.put<DeleteRol>(`${environment.url_api}/Rol/Put_delete_rol?I_ID_ROLE=${id}`, { withCredentials: true }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  activateRole(id: string): Observable<DeleteRol> {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.patch<DeleteRol>(`${environment.url_api}/Rol/Patch_activate_rol?I_ID_ROLE=${id}`, { withCredentials: true }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
