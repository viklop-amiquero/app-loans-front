import { Injectable } from '@angular/core'
import { ApiResponseSubCuota } from '../../models/rapidiario/subcuota.model'
import { HttpClient } from '@angular/common/http'
import { environment } from '@environments/environment'
import { Observable } from 'rxjs'
import { TokenService } from "@services/token.service";

@Injectable({
  providedIn: 'root'
})
export class SubCuotaService {
  private endpoint: string = environment.url_api
  private apiUrl: string = this.endpoint + '/SubCuota'

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  getSubCuotaFiltered(type: string, value: number): Observable<ApiResponseSubCuota> {
    const token: string = this.tokenService.getToken() ?? '';

    return this.http.get<ApiResponseSubCuota>(`${this.apiUrl}/Get_pagina_sub_cuota?V_FILTER_TYPE=${type}&V_FILTER_VALUE=${value}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}
