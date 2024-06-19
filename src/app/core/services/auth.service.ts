import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { tap } from 'rxjs/operators';
import { TokenService } from '@services/token.service';
import { ResponseLogin, UpdateUser, ListMenuUserRol, DetailMenuRol } from '@models/auth.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.url_api;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) { }

  private menuAccessAll: DetailMenuRol[] = [];
  private menuAccessRol: DetailMenuRol[] = [];
  private selectedMenuId: number = 0;
  private permiso: number[] = [];

  login(v_user: string, v_password: string
    ) {

     return this.http.post<ResponseLogin>(`${this.apiUrl}/Authentication/PostLogin`, {
       v_user,
       v_password
     })
     .pipe(
       tap(response => {
         this.tokenService.saveToken(response.value);
       })
     );
  }

  setListMenusRol(object: DetailMenuRol[]) {
    this.menuAccessAll = object;
  }

  setMenuAccess(ruta: string) {
    this.menuAccessRol = this.menuAccessAll.filter(x => x.ruta === ruta);
    this.selectedMenuId = this.menuAccessRol[0].id_menu;
    this.permiso = [this.menuAccessRol[0].permiso.create,
      this.menuAccessRol[0].permiso.read,
      this.menuAccessRol[0].permiso.update,
      this.menuAccessRol[0].permiso.delete];
  }

  getSelectedMenuId(): number {
    return this.selectedMenuId;
  }

  getPermiso(): number[] {
    return this.permiso;
  }

  getProfile() {
    const token: string = this.tokenService.getToken() ?? '';
    const helper = new JwtHelperService();
    const decoded = helper.decodeToken(token);
    const profile = of({id : Number(String(decoded.IDUser)),
                    id_person : String(decoded.IDPerson),
                    user_name : String(decoded.User_name),
                    name:  String(decoded.Name),
                    paternal_surname :  String(decoded.Paternal_surname),
                    maternal_surname :  String(decoded.Maternal_surname),
                    id_role : String(decoded.IDRole),
                    role :  String(decoded.role),
                    changepassword :  String(decoded.Change_password),
                    state :  String(decoded.State)})

    return profile;
  }

  getMenuUserRol(idUser: string, idRol: string) {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<ListMenuUserRol>(`${environment.url_api}/Application/Get_lista_app_menu?V_ID_USER=${idUser}&V_ID_ROL=${idRol}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  updateUser(dto: UpdateUser) {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.post<UpdateUser>(`${this.apiUrl}/Authentication/Post_change_password`, dto, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  logout() {
    this.tokenService.removeToken();
  }
}
