export interface Dashboard {
    value:        Content;
    statusCode:   number;
    hasSucceeded: boolean;
}

export interface Content {
    v_MAX_INCOME_DAY:          number;
    v_MAX_DISBURSEMENT_DAY:    number;
    v_SUM_INCOMES_DAY:         number;
    v_SUM_DISBURSEMENTS_DAY:   number;
    v_SUM_EXPENSES_DAY:        number;
    v_INCOMES_DAY:             any[];
    v_DISBURSEMENTS_DAY:       any[];
    v_EXPENSES_DAY:            any[];
    v_INCOMES_MONTH:           number;
    v_DISBURSEMENTS_MONTH:     number;
    v_EXPENSES_MONTH:          number;
}
