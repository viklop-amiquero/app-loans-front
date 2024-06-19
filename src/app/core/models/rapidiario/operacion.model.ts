export interface OperacionNew {
    v_ID_ACCOUNT: string
    v_ID_CUOTA: string
    v_ID_TYPE_OPERATION: string
    v_AMOUNT: string
}


export interface ApiResponseOperacion {
    value: Value
    statusCode: number
    hasSucceeded: boolean
}

export interface Value {
    total_paginas: number
    total_registros: number
    data: Datum[]
}

export interface Datum {
    i_ID_OPERATION: number
    i_ID_ACCOUNT: number
    i_ID_INSTALLMENT: number
    i_ID_SUB_INSTALLMENT: number | null
    v_TYPE_OPERATION: string
    v_NUMBER_OPERATION: string
    i_AMOUNT: number
    v_NUMBER_ACCOUNT: string
    v_REVERSE: string | null
    b_STATE: string
    d_DATE_CREATE: string
    formattedDate: string
    formattedTime: string
    formattedMonth: string
}

export interface DatumFormat {
    i_ID_OPERATION: number
    fecha: string
    hora: string
    fechaFormateada: string
    v_TYPE: string
    v_NUMBER_OPERATION: string
    i_AMOUNT: number
    v_NUMBER_ACCOUNT: string
    b_STATE: string
    d_DATE_CREATE: string
}

