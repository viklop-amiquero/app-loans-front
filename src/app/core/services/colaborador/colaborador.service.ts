import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ActivatePersona, ClienteId, ClienteTotal, ClienteXDocumento, CreateCliente, DeletePersona, DocumentTotal, ListDepartment, ListDistrict, ListProvince,ListaPersonas, NroDocumentoTotal, SexTotal, UbigeoId, UpdateCliente} from '@models/colaborador/colaborador.model';
import { TokenService } from '@services/token.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {

  apiUrl = environment.url_api;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  getAllCliente(type: string | null | undefined, filtro: string | null | undefined, index: number, pagezise: number, sortField: number, sortOrder: string) {
    const token: string = this.tokenService.getToken() ?? '';
    const page: number = index + 1;
    return this.http.get<ClienteTotal>(`${environment.url_api}/Persona/Get_pagina_persona?I_PAGE_NUMBER=${page}&I_PAGE_SIZE=${pagezise}&V_FILTER_TYPE=${type}&V_FILTER_VALUE=${filtro}&I_SORT_BY_FIELD=${sortField}&V_SORT_ORDER=${sortOrder}`, {
      headers: {
       Authorization: `Bearer ${token}`
      }
    });
  }

  getNroDocumentoCliente() {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<NroDocumentoTotal>(`${environment.url_api}/DocumentoPersona/Get_lista_total_documentos/`, {
      headers: {
       Authorization: `Bearer ${token}`
      }
    });
  }

  getClienteId(id: string) {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<ClienteId>(`${environment.url_api}/Persona/Get_persona?I_PERSON_ID=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getClienteXDocumento(nroDocumento: string):Observable<ClienteXDocumento> {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<ClienteXDocumento>(`${environment.url_api}/Persona/Get_persona_xndocumento?V_NRO_DOCUMENT=${nroDocumento}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }


  getTotalPersonas(){
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<ListaPersonas>(`${environment.url_api}/Persona/Get_lista_total_personas`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  updateCliente(data: Partial<UpdateCliente>) {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.patch<UpdateCliente>(`${environment.url_api}/Persona/Patch_update_persona`, data, {
         headers: {
       Authorization: `Bearer ${token}`
      }
    } );
  }
  createCliente(data: Partial<CreateCliente>) {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.post<CreateCliente>(`${environment.url_api}/Persona/Post_new_persona`, data,  {
      headers: {
        observe : 'response',
        Authorization: `Bearer ${token}`
      }
    } );
  }

  deleteCliente(id: string):Observable<DeletePersona>{
    const token: string = this.tokenService.getToken() ?? '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<DeletePersona>(`${environment.url_api}/Persona/Put_delete_persona?I_PERSON_ID=${id}`,
    null,{
      headers
      }
    );
  }


  activateCliente(id: string): Observable<ActivatePersona> {
    const token: string = this.tokenService.getToken() ?? '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.patch<ActivatePersona>(`${environment.url_api}/Persona/Patch_activate_persona?I_PERSON_ID=${id}`,
    null, {
      headers
     } );
  }

  //Lista documento
  getAllDocument() {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<DocumentTotal>(`${environment.url_api}/TipoDocumento/Get_lista_tipodocumentos/`, {
      headers: {
       Authorization: `Bearer ${token}`
      }
    });
  }

  //Lista sexo
  getAllSex() {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<SexTotal>(`${environment.url_api}/Sexo/Get_lista_total_sexo/`, {
      headers: {
       Authorization: `Bearer ${token}`
      }
    });
  }

  //Obtiene Ubigeo
  getUbigeoId(id: string) {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<UbigeoId>(`${environment.url_api}/Ubigeo/Get_ubigeo?I_UBIGEO_ID=${id}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  //Lista Departamento
  getAllDepartment(){
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<ListDepartment>(`${environment.url_api}/Ubigeo/Get_total_departamento/`,{
      headers: {
        Authorization:`Bearer ${token}`
      }
    })
  }

  //Lista Provincia
  getAllProvincia(codeDep: string){
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<ListProvince>(`${environment.url_api}/Ubigeo/Get_total_provincia?V_DEPARTAMENT_CODE=${codeDep}`,{
      headers: {
        Authorization:`Bearer ${token}`
      }
    })
  }

  //Lista Distrito
  getAllDistrito(codeProv:string){
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<ListDistrict>(`${environment.url_api}/Ubigeo/Get_total_distrito?V_PROVINCE_CODE=${codeProv}`,{
      headers: {
        Authorization:`Bearer ${token}`
      }
    })
  }
}
