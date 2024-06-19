//Interes credito
export interface TotalInteresCredito {
    value:        InteresCredito[];
    statusCode:   number;
    hasSucceeded: boolean;
}

export interface InteresCredito {
    i_INTEREST_CREDIT_ID: number;
    v_NAME:               string;
    i_INTEREST:           number;
    v_FREQUENCY:          string;
    v_DESCRIPTION:        string;
    b_STATE:              string;
}
//Interes ahorro
export interface TotalInteresAhorro {
    value:        InteresAhorro[];
    statusCode:   number;
    hasSucceeded: boolean;
}

export interface InteresAhorro {
    i_INTEREST_SAVING_ID: number;
    v_NAME:               string;
    i_INTEREST:           number;
    v_FREQUENCY:          string;
    v_DESCRIPTION:        string;
    b_STATE:              string;
}

//Get Id
export interface InteresId {
    value:        Interes;
    statusCode:   number;
    hasSucceeded: boolean;
}

export interface Interes {
    i_INTEREST_CREDIT_ID: number;
    v_NAME:               string;
    i_INTEREST:           number;
    v_FREQUENCY:          string;
    v_DESCRIPTION:        string;
    b_STATE:              string;
}

//Create Interes
export interface CreateInteres {
    i_INTEREST:    string;
    v_NAME:        string;
    v_FREQUENCY:   string;
    v_DESCRIPTION: string;
}

//Editar interes
export interface UpdateInteres {
    i_INTEREST_ID: number;
    v_NAME:        string;
    i_INTEREST:    string;
    v_FREQUENCY:   string;
    v_DESCRIPTION: string;
}

/**Delete Interes**/
export interface DeleteInteres {
    value:        Deleteinteres;
    statusCode:   number;
    hasSucceeded: boolean;
  }
  
  export interface Deleteinteres {
  }

/* Activate Interés */

export interface ActivateInteres {
    value:        Activateinteres;
    statusCode:   number;
    hasSucceeded: boolean;
  }
  
  export interface Activateinteres {
  }

//Modelo para frecuencia 
export interface Frecuencia {
    value: string;
    frecuencia: string;
}