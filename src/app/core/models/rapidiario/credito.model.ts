export interface Credito {
  i_ID_CREDIT:         number;
  v_ACCOUNT:           string;
  i_ID_ACCOUNT:        string;
  v_TYPE_ACCOUNT:      string;
  v_TYPE_CREDIT:       string;
  i_AMOUNT_LOAN:       number;
  v_PAY_FREQUENCY:     string;
  i_TERM_QUANTITY:     number;
  i_INTEREST_RATE:     number;
  d_DISBURSEMENT_DATE: Date;
  i_FINANCIAL_EXPENSE: number;
  i_AMOUNT_ACTUAL:     number;
  d_DATE_CREATE:       Date;
  b_STATE:             string;
}

export interface ApiResponseCredito {
  value: Value
  statusCode: number
  hasSucceeded: boolean
}


export interface Value {
  total_paginas: number
  total_registros: number
  data: Credito[]
}

export interface CreditoNew {
    i_PERSON_ID: number
    i_INTEREST_CREDIT_ID: string
    v_ID_TYPE_CREDIT: string
    v_ID_PAYMENT_FREQUENCY: string
    v_LOAN_AMOUNT: string
    v_TERM_QUANTITY: string
    d_DISBURSEMENT_DATE: string
}
