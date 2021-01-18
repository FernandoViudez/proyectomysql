import { Component, OnInit } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { GenericService } from 'src/app/services/generic.service';
import { ProdtermService } from 'src/app/services/prodterm.service';
import { ListadosService } from '../../listados/listados.service';

@Component({
  selector: 'app-realizar-calculos',
  templateUrl: './realizar-calculos.component.html',
  styleUrls: ['./realizar-calculos.component.css']
})
export class RealizarCalculosComponent implements OnInit {

  constructor(
    private readonly formService: FormService,
    private readonly prodTermService: ProdtermService,
    private readonly listadosService: ListadosService,
    private readonly genericService: GenericService,
  ) { }

  ngOnInit(): void {
  }

  public async _btnClick() {
    this._showSpinner()
    this._realizarCalculos()
  }

  private _realizarCalculos() {
    this.formService.realizarCalculos()
    .subscribe( data => {
      console.log(data);
      this._hideSpinner()
    })
  }

  private _showSpinner(): void {
    console.log("Showing spinner");
  }

  private _hideSpinner(): void {
    console.log("Hidding spinner");
  }
  
  public _enviarAExcel() {
    // Obtener todos los productos terminados
    this.prodTermService.obtenerTodosLosProductos()
      .subscribe((data: { response: any }) => {
        this.listadosService.generarExcel(data.response, 'Calculos', 'Sheet1', [
          "id",
          "descripcion",
          "color",
          "componente",
          "precio",
        ])
          .subscribe((data: any) => {
            this.genericService.downloadExcel(data.url)
          })
      })
  }

}
