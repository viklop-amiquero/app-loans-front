import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { TokenService } from '@services/token.service';
import { CreateUser, UpdateUserApp, DeleteUser, GetUserPers, GetUserApp, UserRolAppPag, CreateUserApp, UpdateUserAccess } from "@models/security/user.model";
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { MatDialog } from '@angular/material/dialog';
import { DialogCustomData } from '@models/dialog.model';
import { DialogcustomComponent } from '../../../../admin/components/dialogcustom/dialogcustom.component';

@Injectable({
  providedIn: 'root'
})
export class UserService {
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

  getPagUser(type: string, filtro: string, index: number, pagezise: number, sortField: number, sortOrder: string) {
    const token: string = this.tokenService.getToken() ?? '';
    const page: number = index + 1;
    return this.http.get<UserRolAppPag>(`${environment.url_api}/Application/Get_pagina_usuario_app?I_PAGE_NUMBER=${page}&I_PAGE_SIZE=${pagezise}&V_FILTER_TYPE=${type}&V_FILTER_VALUE=${filtro}&I_SORT_BY_FIELD=${sortField}&V_SORT_ORDER=${sortOrder}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getUserPers(name: string){
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<GetUserPers>(`${environment.url_api}/Usuario/Get_usuario_pers?V_USER_NAME=${name}`
    , {
      headers: {
        Authorization: `Bearer ${token}`
        }
      }
    );
  }

  getUsuarioRole(id: number): Observable<GetUserApp> {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<GetUserApp>(`${environment.url_api}/Application/Get_user_rol_app?I_USER_ID=${id}`
    , {
      headers: {
        Authorization: `Bearer ${token}`
        }
      }
    );
  }

  createUser(data: Partial<CreateUser>): Observable<HttpResponse<CreateUser>> {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.post<CreateUser>(`${environment.url_api}/Usuario/Post_new_usuario`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      observe : 'response',
    });
  }

  createUserApp(data: Partial<CreateUserApp>): Observable<HttpResponse<CreateUserApp>> {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.post<CreateUserApp>(`${environment.url_api}/Application/Post_new_usuario_app`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      observe : 'response',
    });
  }

  updateUserApp(data: Partial<UpdateUserApp>) {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.patch<UpdateUserApp>(`${environment.url_api}/Application/Patch_update_usuario_app`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  updateAccessUser(data: Partial<UpdateUserAccess>) {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.patch<UpdateUserAccess>(`${environment.url_api}/Usuario/Patch_update_access_usuario`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  deleteUser(id: string): Observable<DeleteUser> {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.put<DeleteUser>(`${environment.url_api}/Usuario/Put_delete_usuario?I_ID_USER=${id}`, { withCredentials: true }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  activateUser(id: string): Observable<DeleteUser> {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.patch<DeleteUser>(`${environment.url_api}/Usuario/Patch_activate_usuario?I_ID_USER=${id}`, { withCredentials: true }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
