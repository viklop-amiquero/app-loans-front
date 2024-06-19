import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment.development";
import { ActivateInteres, CreateInteres, DeleteInteres, InteresId, TotalInteresAhorro, TotalInteresCredito, UpdateInteres } from "@models/rapidiario/interes.model";
import { TokenService } from "@services/token.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })

  export class InteresService {

    apiUrl = environment.url_api;

    constructor(
      private http: HttpClient,
      private tokenService: TokenService
    ) { }

    getAllInteresCredito(): Observable<TotalInteresCredito> {
        const token: string = this.tokenService.getToken() ?? '';

        return this.http.get<TotalInteresCredito>(`${environment.url_api}/InteresCredito/Get_lista_interes_credito`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
    }
    getAllInteresAhorro(): Observable<TotalInteresAhorro> {
      const token: string = this.tokenService.getToken() ?? '';

      return this.http.get<TotalInteresAhorro>(`${environment.url_api}/InteresAhorro/Get_lista_interes_ahorro`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }
    getInteresCreditoId(idCredito: number) {
      const token: string = this.tokenService.getToken() ?? '';
      return this.http.get<InteresId>(`${environment.url_api}/InteresCredito/Get_interes_credito?I_INTEREST_ID=${idCredito}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    getInteresAhorroId(idAhorro: number) {
      const token: string = this.tokenService.getToken() ?? '';
      return this.http.get<InteresId>(`${environment.url_api}/InteresAhorro/Get_interes_ahorro?I_INTEREST_ID=${idAhorro}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    createInteresCredito(data: Partial<CreateInteres>) {
        const token: string = this.tokenService.getToken() ?? '';
        return this.http.post<CreateInteres>(`${environment.url_api}/InteresCredito/Post_new_interes_credito`, data,  {
          headers: {
            observe : 'response',
            Authorization: `Bearer ${token}`
          }
        } );
    }
    updateInteresCredito(data: Partial<UpdateInteres>) {
        const token: string = this.tokenService.getToken() ?? '';
        return this.http.patch<UpdateInteres>(`${environment.url_api}/InteresCredito/Patch_update_interes_credito`, data, {
             headers: {
           Authorization: `Bearer ${token}`
          }
        } );
    }

    deleteInteresCredito(id: number):Observable<DeleteInteres>{
      const token: string = this.tokenService.getToken() ?? '';
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.put<DeleteInteres>(`${environment.url_api}/InteresCredito/Put_delete_interes_credito?I_INTEREST_ID=${id}`,
      null,{
        headers
        }
      );
    }

    activateCredito(id: number): Observable<ActivateInteres> {
      const token: string = this.tokenService.getToken() ?? '';
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.patch<ActivateInteres>(`${environment.url_api}/InteresCredito/Patch_activate_interes_credito?I_INTEREST_ID=${id}`,
      null, {
        headers
       } );
    }

    createInteresAhorro(data: Partial<CreateInteres>) {
      const token: string = this.tokenService.getToken() ?? '';
      return this.http.post<CreateInteres>(`${environment.url_api}/InteresAhorro/Post_new_interes_ahorro`, data,  {
        headers: {
          observe : 'response',
          Authorization: `Bearer ${token}`
        }
      } );
    }
    updateInteresAhorro(data: Partial<UpdateInteres>) {
      const token: string = this.tokenService.getToken() ?? '';
      return this.http.patch<UpdateInteres>(`${environment.url_api}/InteresAhorro/Patch_update_interes_ahorro`, data, {
           headers: {
         Authorization: `Bearer ${token}`
        }
      } );
    }


    deleteInteresAhorro(id: number):Observable<DeleteInteres>{
      const token: string = this.tokenService.getToken() ?? '';
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.put<DeleteInteres>(`${environment.url_api}/InteresAhorro/Put_delete_interes_ahorro?I_INTEREST_ID=${id}`,
      null,{
        headers
        }
      );
    }
    activateAhorro(id: number): Observable<ActivateInteres> {
      const token: string = this.tokenService.getToken() ?? '';
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.patch<ActivateInteres>(`${environment.url_api}/InteresAhorro/Patch_activate_interes_ahorro?I_INTEREST_ID=${id}`,
      null, {
        headers
       } );
    }

}
