import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../environments/environment'
import { TokenService } from "@services/token.service"
import { ApiResposeTipoCredito } from '@models/rapidiario/tipoCredito.model'
import { ApiResponseInteresCredito } from '@models/rapidiario/tasaInteres.model';

@Injectable({
    providedIn: 'root'
})
export class InteresCreditoService {
    private endpoint: string = environment.url_api
    private apiUrl: string = this.endpoint + '/InteresCredito'

    constructor(
        private http: HttpClient,
        private tokenService: TokenService
    ) { }

    getAllInteresCredito() {
        const token: string = this.tokenService.getToken() ?? ''
        return this.http.get<ApiResponseInteresCredito>(`${this.apiUrl}/Get_lista_interes_credito`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
}
