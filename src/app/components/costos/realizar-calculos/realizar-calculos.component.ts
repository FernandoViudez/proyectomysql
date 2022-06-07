import { Component, OnInit } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { GenericService } from 'src/app/services/generic.service';
import { ProdtermService } from 'src/app/services/prodterm.service';
import { ListadosService } from '../../listados/listados.service';
import { Router } from '@angular/router';
declare let alertify

@Component({
  selector: 'app-realizar-calculos',
  templateUrl: './realizar-calculos.component.html',
  styleUrls: ['./realizar-calculos.component.css']
})
export class RealizarCalculosComponent implements OnInit {

  usuario: string;

  constructor(
    private readonly formService: FormService,
    private readonly prodTermService: ProdtermService,
    private readonly listadosService: ListadosService,
    private readonly genericService: GenericService,
    private route: Router,
  ) {
    this.usuario = localStorage.getItem("username");
    if (this.usuario != "ADMIN_ROL") {
      alert("Acceso no autorizado !")
      route.navigate(['inicio'])
    }
  }


  public isLoading: boolean
  public mayorQue: number
  public menorQue: number
  public descripcion: string
  public color: string
  public componente: string

  ngOnInit(): void {
  }

  public async _btnClick() {
    this._showSpinner()
    this._realizarCalculos()
  }

  private _realizarCalculos() {

    let data = {};
    ["mayorQue", "menorQue", "descripcion", "color", "componente"].forEach(item => {
      if (this[item]) {
        if (item == "mayorQue" || item == "menorQue") {
          data[item] = this[item]
        } else {
          data = {
            atributo: item,
            info: this[item],
          }
        }
      }
    })

    if (JSON.stringify(data) == "{}") {
      this._hideSpinner()
      return alertify.error("Ingrese al menos un dato")
    }

    if (this.mayorQue && !this.menorQue || !this.mayorQue && this.menorQue) {
      this._hideSpinner()
      return alertify.error("Rango invalido")
    }

    this.formService.realizarCalculos(data)
      .subscribe(data => {
        this._hideSpinner()
      }, err => {
        this._hideSpinner()
        alertify.error(err.error.message)
      })
  }

  private _showSpinner(): void {
    this.isLoading = true
  }

  private _hideSpinner(): void {
    this.isLoading = false
    this.resetear()
  }

  public _enviarAExcel() {
    this._showSpinner()
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
            this._hideSpinner()
          })
      })
  }

  resetear() {
    this.isLoading = null;
    this.mayorQue = null;
    this.menorQue = null;
    this.descripcion = null;
    this.color = null;
    this.componente = null;
  }

}
