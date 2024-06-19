export interface ApiResponseInteresCredito {
    value: Value[];
    statusCode: number;
    hasSucceeded: boolean;
}

export interface Value {
    i_INTEREST_CREDIT_ID: number;
    v_NAME: string;
    i_INTEREST: number;
    v_FREQUENCY: string;
    v_DESCRIPTION: string;
    b_STATE: string;
}
