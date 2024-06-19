export interface ApiResposeTipoCredito {
    value: Value[];
    statusCode: number;
    hasSucceeded: boolean;
}

export interface Value {
    i_TYPE_CREDIT_ID: number;
    v_TYPE_CREDIT: string;
    b_STATE: string;
}
