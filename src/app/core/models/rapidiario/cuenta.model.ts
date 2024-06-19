// Paginado cuenta
export interface PaginadoCuenta {
  value:        ListaCuenta;
  statusCode:   number;
  hasSucceeded: boolean;
}

export interface ListaCuenta {
  total_paginas:   number;
  total_registros: number;
  data:            CuentaLista[];
}

export interface CuentaLista {
  i_ACCOUNT_ID:         string;
  i_PERSON_ID:          number;
  i_TYPE_ACCOUNT_ID:    string;
  v_NUMBER_DOC:         string;
  v_NUMBER_ACCOUNT:     string;
  v_FIRST_NAME:         string;
  v_SECOND_NAME:        null;
  v_PATERNAL_LAST_NAME: string;
  v_MOTHER_LAST_NAME:   string;
  i_SALDO:              string;
  b_STATE:              string;
}

//Obteniendo una cuenta por idPersona

export interface CuentaIdClient {
  value:        ClientData[];
  statusCode:   number;
  hasSucceeded: boolean;
}

export interface ClientData {
  i_PERSON_ID:          number;
  v_NRO_DOCUMENT:       string;
  v_FIRST_NAME:         string;
  v_SECOND_NAME:        null;
  v_PATERNAL_LAST_NAME: string;
  v_MOTHER_LAST_NAME:   string;
  cuentas_cliente:      CuentasCliente[];
}

export interface CuentasCliente {
  i_ACCOUNT_ID:      number;
  i_ACCOUNT_TYPE_ID: number;
  v_ACCOUNT_NUMBER:  string;
  i_BALANCE:         number;
  v_USER_CREATE:     string;
  v_USER_MODIF:      string;
  d_CREATE_DATE:     Date;
  d_MODIF_DATE:      null;
  b_STATE:           string;
}

//Obtener todas las cuentas
export interface AllTipoCuenta {
  value: TipoCuenta[];
  statusCode: number;
  hasSucceeded: boolean;
}

export interface TipoCuenta {
  i_TYPE_CUENTA_ID: number;
  v_TYPE_CUENTA: string;
  b_STATE: string;
}

//Create cuenta
export interface CreateCuenta {
  i_PERSON_ID: number;
  v_TYPE_ACCOUNT_ID: string;
}



// Api response cuenta
export interface ApiResponseCuenta {
  value: Value
  statusCode: number
  hasSucceeded: boolean
}

export interface Value {
  total_paginas: number
  total_registros: number
  data: Cuenta[]
}

export interface Cuenta {
  v_FIRST_NAME: string
  v_SECOND_NAME: null | string
  v_PATERNAL_LAST_NAME: string
  v_MOTHER_LAST_NAME: string
  v_NUMBER_DOC: string
  v_NUMBER_ACCOUNT: string
  i_ACCOUNT_ID: number
  i_PERSON_ID: number
  v_ACCOUNT_NUMBER: string
  i_TYPE_ACCOUNT_ID: number
  i_SALDO: number
  b_STATE: string
}
