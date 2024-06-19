export interface AppRolMenuPag {
    value:        ArmPag;
    statusCode:   number;
    hasSucceeded: boolean;
}

export interface ArmPag {
    total_paginas:   number;
    total_registros: number;
    data:            AppRolMenu[];
}

export interface AppRolMenu {
    i_ID_APP_ROLE_MENU: number;
    v_ROLE:             string;
    v_MENU:             string;
    v_DESCRIPTION:      string;
    d_DATE_CREATE:      Date | null;
    b_STATE:            string;
}

export interface GetAppRolMenu {
    value:        MenuRol[];
    statusCode:   number;
    hasSucceeded: boolean;
}

export interface MenuRol {
    i_APP_ROL_MENU_ID: number;
    i_APP_ID:          number;
    i_MENU_ID:         number;
    i_ROL_ID:          number;
    i_PERMISSION_ID:   number;
    v_DESCRIPTION:     string;
    b_STATE:           string;
    i_USER_CREATE:     number;
    i_USER_MODIF:      number;
    d_CREATE_DATE:     Date;
    d_MODIF_DATE:      Date;
}

export interface ListadoApps {
    value:        App[];
    statusCode:   number;
    hasSucceeded: boolean;
}

export interface App {
    i_APPLICATION_ID: number;
    v_APPLICATION:    string;
    v_ACRONYM:        string;
    v_DESCRIPTION:    string | null;
    v_URL:            string | null;
    b_STATE:          string;
    i_USER_CREATE:    number | null;
    i_USER_MODIF:     number | null;
    d_CREATE_DATE:    Date | null;
    d_MODIF_DATE:     Date | null;
}

// Menus y permisos
export interface ListadoMenusPermisos {
    value:        MenuPermiso[];
    statusCode:   number;
    hasSucceeded: boolean;
}

export interface MenuPermiso {
    i_MENU_ID:         number;
    i_APPLICATION_ID:  number;
    v_NAME:            string;
    v_DESCRIPTION:     string | null;
    v_ICON:            string | null;
    v_ROUTE:           string | null;
    v_URL:             string | null;
    v_RELATIONSHIP_ID: string;
    v_RELATIONSHIP:    string | null;
    b_STATE:           string;
    i_USER_CREATE:     number | null;
    i_USER_MODIF:      number | null;
    d_CREATE_DATE:     Date | null;
    d_MODIF_DATE:      Date | null;
}

export interface ListaTotalMenus {
    value:        Menu[];
    statusCode:   number;
    hasSucceeded: boolean;
}

export interface Menu {
    id_menu:   number;
    nameMenu:  string;
    icon:      string | null;
    ruta:      string | null;
    url:       string | null;
    orden:     number;
    permiso:   null;
    sub_menu: Submenu[];
}

export interface Submenu {
    id_menu:   number;
    name:      string;
    icon:      string | null;
    ruta:      string | null;
    url:       string | null;
    orden:     number;
    permiso:   null;
}

// Permisos
export interface ListaTotalPermisos {
    value:        GetPermiso[];
    statusCode:   number;
    hasSucceeded: boolean;
}

export interface GetPermiso {
    i_PERMISSION_ID: number;
    i_C:             number;
    i_R:             number;
    i_U:             number;
    i_D:             number;
    v_DESCRIPTION:   string;
    b_STATE:         string;
    i_USER_CREATE:   number | null;
    i_USER_MODIF:    number | null;
    d_CREATE_DATE:   Date | null;
    d_MODIF_DATE:    Date | null;
}

export interface CreateAppRolMenu {
    i_ROLE_ID:       string;
    i_MENU_ID:       string;
    i_PERMISSION_ID: string;
    v_DESCRIPTION:   string;
}

export interface UpdateAppRolMenu {
    i_APPLICATION_ROLE_MENU_ID: number;
    i_PERMISSION_ID:            string;
}

export interface DeleteAppRolMenu {
  value:        Object;
  statusCode:   number;
  hasSucceeded: boolean;
}
