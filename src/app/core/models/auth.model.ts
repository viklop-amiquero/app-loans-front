
// listado de aplicaciones del usuario start
export interface ResponseListaApp {
  value: valueListApp[];
  statusCode: number;
  hasSucceeded: boolean;
}
export interface valueListApp {
  aplicaciones: aplicaciones;
  token: string
}
export interface aplicaciones {

  id_app: string;
  application: string;
  acronym: string;
  url: string | null;
  rol: string;
}

// menu start
export interface ListMenuUserRol {
  value:        MenuUserRol[];
  statusCode:   number;
  hasSucceeded: boolean;
}

export interface MenuUserRol {
  id_menu:   number;
  nameMenu: string;
  icon:      string | null;
  ruta:      string | null;
  url:       string | null;
  orden:     number;
  permiso:   Permiso;
  sub_menu:  SubMenu[];
}
export interface SubMenu {
  id_menu:   number;
  name:      string;
  icon:      string | null;
  ruta:      string | null;
  url:       string | null;
  orden:     number;
  permiso:   Permiso;
}
export interface Permiso {
  idPermission: number;
  create:       number;
  read:         number;
  update:       number;
  delete:       number;
  description:  string;
}

export interface ListDetailMenuRol {
    value:        DetailMenuRol[];
    statusCode:   number;
    hasSucceeded: boolean;
}

export interface DetailMenuRol {
    id_menu:       number;
    menu:          string;
    icon:          null | string;
    ruta:          null | string;
    url:           null;
    id_parentesco: string;
    parentesco:    null | string;
    nivel:         number;
    orden:         number;
    permiso:       Permiso;
}

export interface ResponseLogin {
  value: string;
  refresh_token?: string;
}

export interface ProfileApp {
  idUser: number;
  idApp: string;
  dni: string;
  name: string;
  application: string;
  acronym: string;
  role: string;
  idRol: string;
}

export interface Profile {
  id:               number;
  id_person:        string;
  user_name:        string;
  name:             string;
  paternal_surname: string;
  maternal_surname: string;
  state:            string;
  id_role:          string;
  role:             string;
  changepassword:   string;
}

export interface UpdateUser {
  v_ID_USER?: string;
  v_PASSWORD?: string;
  v_NEW_PASSWORD?: string;
}

