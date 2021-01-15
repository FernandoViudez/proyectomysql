import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormService } from 'src/app/services/form.service';
import { GenericService } from 'src/app/services/generic.service';
import { MatprimService } from 'src/app/services/matprim.service';
import { ListadosService } from '../../listados/listados.service';

@Component({
  selector: 'app-realizar-calculos',
  templateUrl: './realizar-calculos.component.html',
  styleUrls: ['./realizar-calculos.component.css']
})
export class RealizarCalculosComponent implements OnInit {

  private _datosParaExcel: any[] = []

  constructor(
    private readonly formService: FormService,
    private readonly matPriService: MatprimService,
    private readonly genericService: GenericService,
    private readonly listadosService: ListadosService,
  ) { }

  ngOnInit(): void {

  }

    public _btnClick() {
    this._showSpinner()
    this._obtenerFormulas('semielaborado')
    this._obtenerFormulas('otros')
  }

  private _showSpinner(): void {
    console.log("Showing spinner");
  }
  
  private _hideSpinner(): void {
    console.log("Hidding spinner");
  }

  private _obtenerFormulas(tipoDeProducto: string) {
    let _observable: Observable<any>
    switch (tipoDeProducto) {
      case 'semielaborado': {
        _observable = this.formService.obtenerFormulasPorRango({
          atributoAComparar: 'idprod',
          tabla: 'proasoc',
          mayorQue: 50000
        })
        break
      }
      case 'otros': {
        _observable = this.formService.obtenerFormulasPorRango({
          atributoAComparar: 'idprod',
          tabla: 'proasoc',
          mayorQue: 10000,
          menorQue: 49999
        })
        break
      }
      default: {
        alert("Valor incorrecto para la funcion 'obtener formulas'")
        break
      }
    }

    _observable.subscribe(this.afterSubscribeMain.bind(this))
  }

  private afterSubscribeMain(data: { response: any }) {
    this._organizarFormulas(data.response)
    .subscribe(this._recorrerYCalcular.bind(this))
  }

  private _organizarFormulas(vectorDesordenado: any[]): Observable<any> {
    return new Observable<any>((observer) => {
      let formulasPorProducto = {}
      
      if(!vectorDesordenado) {
        this._hideSpinner()
        return
      }
  
      for (let item of vectorDesordenado) {
        
        if(!formulasPorProducto[item.idprod]) {
          formulasPorProducto[item.idprod] = []
        }
  
        formulasPorProducto[item.idprod].push(item)
      }

      return observer.next(formulasPorProducto)
    })
  }

  private _recorrerYCalcular(formulas: {}): void {
    Object.values(formulas).forEach((formula: any) => {
      this._calcular(formula)
    })
  }

  private _calcular(formula: any[]): void {
    const sumaTotal = this._calcularTotales(formula)

    this.formService.calcular(sumaTotal, formula).subscribe((data: { prodData: any, tpr: number }) => {
      this._modificarPrecioEnProducto(data.tpr, formula[0].idprod)
    })
  }
  
  private _modificarPrecioEnProducto(_precio: number, prodId: number) {
    this.matPriService.modificarAlgo({
      tabla: 'prodterm',
      atributo: 'precio',
      nuevoValor: _precio
    }, prodId)
    .subscribe((data: any) => {
        this._datosParaExcel.push(data.response)
      })
  }

  private _calcularTotales(array: {
    cantidad: number
  }[]): number {
    let total = 0
    for (let item of array) {
      total += item.cantidad
    }
    return total
  }

  public _enviarAExcel() {
    if(!this._datosParaExcel) return;
    this.listadosService.generarExcel(this._datosParaExcel, 'Calculos', 'Sheet1', [
      "id",
      "descripcion",
      "precio",
    ]) 
    .subscribe( (data: any) => {
      this.genericService.downloadExcel(data.url)
    })
  }

}
