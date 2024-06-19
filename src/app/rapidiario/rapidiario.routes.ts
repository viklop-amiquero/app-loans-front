import { Routes } from "@angular/router"
import { CuentaComponent } from "./cuenta/components/cuenta/cuenta.component"
import { CreditoCreateComponent } from "./credito/credito-create/credito-create.component"
import { InfoCuentaComponent } from "./cuenta/components/info-cuenta/info-cuenta.component"
import { OperacionCreateComponent } from "./operacion/operacion-create/operacion-create.component"

export const routes: Routes = [
  {
    path: 'cuentas', children:[
      {
      path:'',
      component: CuentaComponent
      },
      {
        path:'informacion',
      component: InfoCuentaComponent
      }
    ]
  },
  {
    path: 'credito', children: [{
      path: '',
      component: CreditoCreateComponent
    }
    ]
  },
  {
    path: 'operacion', children: [
      {
        path: '',
        component: OperacionCreateComponent
      },
      // {
      //   path:'modal',
      // component: ModalNewOperacionComponent
      // }
    ]
  },
]
