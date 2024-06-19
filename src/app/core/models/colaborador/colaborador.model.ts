//Modelo de listado de clientes
export interface ClienteTotal{
    value:        Value;
    statusCode:   number;
    hasSucceeded: boolean;
}

export interface Value {
  total_paginas:   number;
  total_registros: number;
  data:            DateCliente[];
}
export interface DateCliente {
  i_PERSON_ID:          number;
  v_DNI:                string;
  v_PATERNAL_LAST_NAME: string;
  v_MOTHER_LAST_NAME:   string;
  v_FIRST_NAME:         string;
  v_ADDRESS:            string;
  v_PROVINCE:           string;
  v_DISTRICT:           string;
  v_MOVIL_PHONE:        string;
  d_DATE_CREATE:        Date;
  b_STATE:              string;
}

// Editar datos Persona
export interface UpdateCliente {
  i_STEP:                     number;
  i_TYPE_DOC_ID:              number;
  v_NUMBER_DOCUMENT:          string;
  i_PERSON_ID:                number;
  v_UBIGEO_ID:                string;
  v_SEX_ID:                   string;
  v_FIRST_NAME:               string;
  v_SECOND_NAME:              string;
  v_PATERNAL_LAST_NAME:       string;
  v_MOTHER_LAST_NAME:         string;
  d_BIRTH_DATE:               string;
  v_ADDRESS_HOME:             string;
  v_ADDRESS_WORK:             string;
  v_NAME_RELATIONSHIP:        string;
  v_RELATIONSHIP:             string;
  v_MOVIL_PHONE_RELATIONSHIP: string;
  v_PHONE_RELATIONSHIP:       string;
  v_PHONE:                    string;
  v_MOVIL_PHONE:              string;
  v_EMAIL:                    string;

}
export interface CreateCliente {

  i_STEP:                     number;
  i_TYPE_DOC_ID:              number;
  v_NUMBER_DOCUMENT:          string;
  i_SEX_ID:                   string;
  v_FIRST_NAME:               string;
  v_SECOND_NAME:              string;
  v_PATERNAL_LAST_NAME:       string;
  v_MOTHER_LAST_NAME:         string;
  d_BIRTH_DATE:               string;

  i_UBIGEO_ID:                string;
  v_ADDRESS_HOME:             string;
  v_ADDRESS_WORK:             string;

  v_NAME_RELATIONSHIP:        string;
  v_RELATIONSHIP:             string;
  v_MOVIL_PHONE_RELATIONSHIP: string;
  v_PHONE_RELATIONSHIP:       string;
  v_PHONE:                    string;
  v_MOVIL_PHONE:              string;
  v_EMAIL:                    string;

}
/**Delete Persona**/
export interface DeletePersona {
  value:        Deletepersona;
  statusCode:   number;
  hasSucceeded: boolean;
}

export interface Deletepersona {
}

/* Activate Persona */

export interface ActivatePersona {
  value:        Activatepersona;
  statusCode:   number;
  hasSucceeded: boolean;
}

export interface Activatepersona {
}

 /**Obtener cliente por Id**/

export interface ClienteId {
  value:        SubClienteId;
  statusCode:   number;
  hasSucceeded: boolean;
}

export interface SubClienteId {
  i_PERSON_ID:          number;
  i_UBIGEO_ID:          number;
  i_SEX_ID:             number;
  v_FIRST_NAME:         string;
  v_SECOND_NAME:        string | null;
  v_PATERNAL_LAST_NAME: string;
  v_MOTHER_LAST_NAME:   string;
  i_AGE:                number;
  d_BIRTHDATE:          Date;
  v_ADDRESS_HOME:       string;
  v_ADDRESS_WORK:       string | null;
  b_STATE:              string;
  v_DEPARTMENT:         string;
  v_PROVINCE:           string;
  v_DISTRICT:           string;
  document_persona:     DocumentPersona[];
  contact:              Contact[];
  contact_emergency:    ContactEmergency[];
  i_POSITION_ID:        number | null;
}

export interface Contact {
  v_PHONE:       string | null;
  v_MOVIL_PHONE: string;
  v_EMAIL:       string | null;
}

export interface ContactEmergency {
  v_NAME_RELATIONSHIP: string | null;
  v_RELATIONSHIP:      string | null;
  v_MOVIL_PHONE_RELATIONSHIP: string | null;
  v_PHONE_RELATIONSHIP: string | null;
}
export interface DocumentPersona {
  i_TYPE_DOCUMENT_ID: number;
  v_NRO_DOCUMENT:     string;
}

export interface ListaPersonas {
    value:        Pers[];
    statusCode:   number;
    hasSucceeded: boolean;
}

export interface Pers {
  i_PERSON_ID:          number;
  v_NRO_DOCUMENT:       string;
  v_FIRST_NAME:         string;
  v_PATERNAL_LAST_NAME: string;
  v_MOTHER_LAST_NAME:   string;
  b_STATE:              string;
}
/**Obtener cliente por Numero de documento**/
export interface ClienteXDocumento {
  value:        ClienteDoc;
  statusCode:   number;
  hasSucceeded: boolean;
}

export interface ClienteDoc {
  v_NRO_DOCUMENT:       string;
  i_PERSON_ID:          number;
  v_FIRST_NAME:         string;
  v_SECOND_NAME:        null;
  v_PATERNAL_LAST_NAME: string;
  v_MOTHER_LAST_NAME:   string;
}
//Modelo para listar documentos
export interface DocumentTotal {
  value:        Document[];
  statusCode:   number;
  hasSucceeded: boolean;
  }
  export interface Document {
    i_DOC_TYPE_ID:  number;
    v_ABBREVIATION: string;
    v_DOC_NAME:     string;
    i_NUMBER_DIGIT: number;
    b_STATE:        string;
  }

//Modelo para listar sexo
export interface SexTotal {
  value:        Sex[];
  statusCode:   number;
  hasSucceeded: boolean;
  }
  export interface Sex {
    i_SEX_ID: number;
    v_NAME:   string;
    b_STATE:  string;
  }
//Modelo para listar dni persona
export interface NroDocumentoTotal {
  value:        Nrodocumento[];
  statusCode:   number;
  hasSucceeded: boolean;
}

export interface Nrodocumento {
  i_TIPO_DOC_ID:   number;
  i_PERSONA_ID:    number;
  v_NRO_DOCUMENTO: string;
  b_STATE:         string;
}

//Modelo para Ubigeo por Id
export interface UbigeoId {
  value:        Ubigeo;
  statusCode:   number;
  hasSucceeded: boolean;
}

export interface Ubigeo {
  i_UBIGEO_ID:       number;
  v_DEPARTMENT_CODE: string;
  v_DEPARTMENT:      string;
  v_PROVINCE_CODE:   string;
  v_PROVINCE:        string;
  v_DISTRICT_CODE:   string;
  v_DISTRICT:        string;
  v_CAPITAL:         string;
  v_ALTITUDE:        string;
  v_LATITUDE:        string;
  v_LONGITUDE:       string;
  b_STATE:           string;
}

//Modelo para listar Departamentos
export interface ListDepartment {
  value:        Department[];
  statusCode:   number;
  hasSucceeded: boolean;
}

export interface Department {
  i_UBIGEO_ID:        number;
  v_DEPARTAMENT_CODE: string;
  v_DEPARTAMENT:      string;
  v_CAPITAL:          string;
  v_ALTITUDE:         string;
  v_LATITUDE:         string;
  v_LONGITUDE:        string;
  b_STATE:            string;
}
//Modelo para listar Provincia
export interface ListProvince {
  value:        Province[];
  statusCode:   number;
  hasSucceeded: boolean;
}

export interface Province {
  i_UBIGEO_ID:        number;
  v_DEPARTAMENT_CODE: string;
  v_CODE_PROVINCE:    string;
  v_PROVINCE:         string;
  v_CAPITAL:          string;
  v_ALTITUDE:         string;
  v_LATITUDE:         string;
  v_LONGITUDE:        string;
  b_STATE:            string;
}
//Modelo para listar Distrito

export interface ListDistrict {
  value:        District[];
  statusCode:   number;
  hasSucceeded: boolean;
}

export interface District {
  i_UBIGEO_ID:        number;
  v_DEPARTAMENT_CODE: string;
  v_PROVINCE_CODE:    string;
  v_DISTRICT_CODE:    string;
  v_DISTRICT:         string;
  v_CAPITAL:          string;
  v_ALTITUDE:         string;
  v_LATITUDE:         string;
  v_LONGITUDE:        string;
  b_STATE:            string;
}
//Modelo para parentesco
export interface Parentesco {
  value: string;
  viewValue: string;
}
