import { ApiResponseCuota } from '../../models/rapidiario/cuota.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '@environments/environment'
import { Observable } from 'rxjs'
import { TokenService } from "@services/token.service";

@Injectable({
  providedIn: 'root'
})

export class CuotaService {
  private endpoint: string = environment.url_api
  private apiUrl: string = this.endpoint + '/Cuota'

  private cuotas: any[] = [];

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  setListCuotas(object: any[]) {
    this.cuotas = object;
  }

  getListCuotas(): any[] {
    return this.cuotas;
  }

  getCuotasFiltered(type: string, value: number): Observable<ApiResponseCuota> {
    const token: string = this.tokenService.getToken() ?? '';

    return this.http.get<ApiResponseCuota>(`${this.apiUrl}/Get_pagina_cuota?V_FILTER_TYPE=${type}&V_FILTER_VALUE=${value}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}
