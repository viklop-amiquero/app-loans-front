
export interface ApiResponseCuota {
    value: Value
    statusCode: number
    hasSucceeded: boolean
}

export interface Value {
    total_paginas: number
    total_registros: number
    data: Cuota[]
}

export interface Cuota {
    i_ID_INSTALLMENT:     number;
    i_ID_ACCOUNT:         number;
    i_CREDIT_ID:          number;
    v_INSTALLMENT_NUMBER: string;
    i_INSTALLMENT_AMOUNT: number;
    i_PRINCIPAL:          number;
    i_INITIAL_BALANCE:    number;
    i_INTEREST:           number;
    i_FINAL_BALANCE:      number;
    d_PAYMENT_DATE:       string;
    d_CREATE_DATE:        string;
    i_TOTAL_AMOUNT:       number;
    formattedDate:        string;
    b_STATE:              string;
}

