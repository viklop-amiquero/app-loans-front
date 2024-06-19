export interface ApiResponseSubCuota {
    value: Value;
    statusCode: number;
    hasSucceeded: boolean;
}

export interface Value {
    total_paginas: number;
    total_registros: number;
    data: subCuota[];
}

export interface subCuota {
    i_ID_SUB_INSTALLMENT: null;
    i_ID_INSTALLMENT: number;
    i_AMOUNT: number;
    i_BALANCE_INSTALLMENT: number;
    d_CREATE_DATE: Date;
    formattedDate: string;
    b_STATE: string;
}
