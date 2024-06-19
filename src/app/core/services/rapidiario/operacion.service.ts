import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { ApiResponseOperacion, OperacionNew } from '../../models/rapidiario/operacion.model'
import { environment } from '../../../../environments/environment'
import { TokenService } from "@services/token.service";

@Injectable({
  providedIn: 'root'
})

export class OperacionService {
  private endpoint: string = environment.url_api
  private apiUrl: string = this.endpoint + '/Operacion'

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  crearOperacion(data: Partial<OperacionNew>) {
    const token: string = this.tokenService.getToken() ?? '';

    return this.http.post<OperacionNew>(`${this.apiUrl}/Post_new_operacion`, data, {
      headers: {
        observe: 'response',
        Authorization: `Bearer ${token}`
      }
    })

  }

  getOperacionByType(type: string, value: number): Observable<ApiResponseOperacion> {
    const token: string = this.tokenService.getToken() ?? '';

    return this.http.get<ApiResponseOperacion>(`${this.apiUrl}/Get_pagina_operacion?V_FILTER_TYPE=${type}&V_FILTER_VALUE=${value}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}
