import { Injectable } from '@angular/core';
import {MatPaginatorIntl} from "@angular/material/paginator";

@Injectable({
  providedIn: 'root'
})
export class PaginatorService extends MatPaginatorIntl {

  override firstPageLabel = `Página inicial`;
  override itemsPerPageLabel = `Registros por página:`;
  override lastPageLabel = `Página final`;

  // You can set labels to an arbitrary string too, or dynamically compute
  // it through other third-party internationalization libraries.
  override nextPageLabel = 'Página siguiente';
  override previousPageLabel = 'Página anterior';

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0) {
      return `Página 1 de 1`;
    }
    return `Pagina ${page + 1} de ${Math.ceil(length/pageSize)}`

  }
}

