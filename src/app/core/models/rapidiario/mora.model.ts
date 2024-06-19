export interface ListMora {
  value:        Mora[];
  statusCode:   number;
  hasSucceeded: boolean;
}

export interface Mora {
  i_MORA_ID:     number;
  i_CUOTA_ID:    number;
  v_TYPE_MORA:   string;
  i_MORA_AMOUNT: number;
  i_NUMBER_DAYS: number;
  b_STATE:       string;
}

export interface UpdateMora {
  i_MORA_ID:        number;
  i_TYPE_CANC_MORA_ID: string;
  i_AMOUNT_MORA:       string;
}

export interface ListTiposCancMora {
    value:        TipoCancMora[];
    statusCode:   number;
    hasSucceeded: boolean;
}

export interface TipoCancMora {
    i_TYPE_CANC_MORA_ID: number;
    v_NAME:              string;
    b_STATE:             string;
    i_USER_CREATE:       number | null;
    i_USER_MODIF:        number | null;
    d_CREATE_DATE:       Date | null;
    d_MODIF_DATE:        Date | null;
}

export interface ListCancMora {
    value:        CancelacionMora[];
    statusCode:   number;
    hasSucceeded: boolean;
}

export interface CancelacionMora {
    i_CANC_MORA_ID:      number;
    v_TYPE_CANC_MORA:      string;
    i_AMOUNT_CANC_MORA:  number;
    i_START_AMOUNT_MORA: number;
    i_END_AMOUNT_MORA:   number;
    b_STATE:             string;
    d_CREATE_DATE:       Date | null;
}
