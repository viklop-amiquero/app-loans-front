export interface GetUser {
  value:        User[];
  statusCode:   number;
  hasSucceeded: boolean;
}

export interface GetUserPers {
  value:        User[];
  statusCode:   number;
  hasSucceeded: boolean;
}

export interface User {
  i_USER_ID:     number;
  i_PERSON_ID:   number;
  v_USER:        string;
  b_STATE:       string;
  i_USER_CREATE: number | null;
  i_USER_MODIF:  number | null;
  d_CREATE_DATE: Date | null;
  d_MODIF_DATE:  Date | null;
}

// Paginado User_App
export interface UserRolAppPag {
  value:        Value;
  statusCode:   number;
  hasSucceeded: boolean;
}

export interface Value {
  total_paginas:   number;
  total_registros: number;
  data:            Datos[];
}

export interface Datos {
  i_ID_USER:    number;
  v_USER:           string;
  v_FIRST_NAME:     string;
  v_FIRST_SURNAME:  string;
  v_SECOND_SURNAME: string;
  v_ROLE:           string;
  d_START_DATE:     Date | null;
  d_END_DATE:       Date | null;
  b_STATE:          string;
}

// Sirve para obtener un registro de User_App y para listar los usuarios asignados a un rol
export interface GetUserRole {
  value:        UserRole[];
  statusCode:   number;
  hasSucceeded: boolean;
}

export interface GetUserApp {
    value:        UserRole;
    statusCode:   number;
    hasSucceeded: boolean;
}

export interface UserRole {
    i_USER_ID:     number;
    i_ROLE_ID:     number;
    i_PERSON_ID:   number;
    v_USER:        string;
    d_START_DATE:  Date;
    d_END_DATE:    Date | string;
    b_STATE:       string;
    i_USER_CREATE: number | null;
    i_USER_MODIF:  number | null;
    d_CREATE_DATE: Date | null;
    d_MODIF_DATE:  Date | null;
}

export interface CreateUser {
    i_PERSON_ID:  string;
    i_ROLE_ID:    string;
    d_START_DATE: string;
    d_END_DATE:   string | null;
}

export interface CreateUserApp {
  i_ROLE_ID: string;
}

export interface UpdateUserApp {
  i_USER_ID: number;
  i_ROLE_ID: string;
  d_START_DATE: string;
  d_END_DATE: string | null;
}

export interface UpdateUserAccess {
  i_USER_ID:  number;
  d_END_DATE: string;
}

export interface DeleteUser {
  value:        Object;
  statusCode:   number;
  hasSucceeded: boolean;
}
