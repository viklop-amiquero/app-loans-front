import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../environments/environment'
import { TokenService } from "@services/token.service"
import { ApiResposeTipoCredito } from '@models/rapidiario/tipoCredito.model'

@Injectable({
    providedIn: 'root'
})
export class TipoCreditoService {
    private endpoint: string = environment.url_api
    private apiUrl: string = this.endpoint + '/TipoCredito'

    constructor(
        private http: HttpClient,
        private tokenService: TokenService) { }


    getAllTipoCredito() {
        const token: string = this.tokenService.getToken() ?? ''
        return this.http.get<ApiResposeTipoCredito>(`${this.apiUrl}/Get_lista_tipos_credito`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
}
