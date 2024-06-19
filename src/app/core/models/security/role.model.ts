export interface ListaRoles {
    value:        Rol[];
    statusCode:   number;
    hasSucceeded: boolean;
}

export interface Rol {
    i_ROLE_ID:     number;
    v_ROLE:        string;
    v_DESCRIPTION: string;
    b_STATE:       string;
    i_USER_CREATE: number | null;
    i_USER_MODIF:  number | null;
    d_CREATE_DATE: Date | null;
    d_MODIF_DATE:  Date | null;
}

export interface RolePag {
    value:        Value;
    statusCode:   number;
    hasSucceeded: boolean;
}

export interface Value {
    total_paginas:   number;
    total_registros: number;
    data:            Data[];
}

export interface Data {
    i_ROLE_ID:     number;
    v_ROLE:        string;
    v_DESCRIPTION: string;
    d_CREATE_DATE: Date | null;
    b_STATE:       string;
}

export interface CreateRol {
  v_ROLE: string;
  v_DESCRIPTION: string;
}

export interface UpdateRol {
  i_ROLE_ID:     number;
  v_ROLE:        string;
  v_DESCRIPTION: string;
}

export interface DeleteRol {
  value:        Object;
  statusCode:   number;
  hasSucceeded: boolean;
}
