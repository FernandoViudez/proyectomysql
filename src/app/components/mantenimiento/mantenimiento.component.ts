import { Component, OnInit } from '@angular/core';
import { GenericService } from '../../services/generic.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
declare let alertify: any;

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css']
})
export class MantenimientoComponent implements OnInit {

  // Fecha (Generated by the backend)
  public equipo: string;
  public nroequipo: string;
  public motivo: string;
  public correas: string;
  public limpieza: string;
  public mangueras: string;
  public engrase: string;
  public lubricacion: string;
  public accesorios: string;
  public conexiones: string;
  public tableros: string;
  public cortes: string;
  public observaciones: string;
  public fecha: any;
  public proxrevision: any;
  public usuario: string;

  constructor(private genericService: GenericService, private route: Router,) {
    let user_role = localStorage.getItem("user_role");
    if (user_role != "ADMIN_ROL" && user_role != "MANTENIMIENTO") {
      alert("Acceso no autorizado !")
      route.navigate(['inicio'])
    }
  }

  ngOnInit(): void {
  }

  enviarMant() {

    let Hoy = new Date()                                  // para que no ingresen fecha menor al dia de trabajo
    let Hoy2 = Hoy.toISOString().split('T')[0];           // armo diferentes rangos de fechas para asignar
    let mensual = this.sumarDias(Hoy, 30);
    let unMes = mensual.toISOString().split('T')[0];
    let trimestre = this.sumarDias(Hoy, 90);
    let tresMeses = trimestre.toISOString().split('T')[0];
    let semestre = this.sumarDias(Hoy, 180);
    let seisMeses = semestre.toISOString().split('T')[0];
    let anual = this.sumarDias(Hoy, 360);
    let unAnio = anual.toISOString().split('T')[0];

    if (this.equipo == 'BAL') {
      this.proxrevision = seisMeses;
    }

    if (this.nroequipo == 'Homomixer' || this.nroequipo.includes('Doble Z', 0)) {
      this.proxrevision = seisMeses;
    } else if (this.equipo == 'DIS' && (this.nroequipo == 'Ponimixer' || this.nroequipo == 'Mezcladora Inertes')) {
      this.proxrevision = unAnio;
    } else if (this.equipo == 'DIS') {
      this.proxrevision = tresMeses;
    }

    if (this.equipo == 'ELE') {
      if (this.nroequipo.includes('Apilador', 0)) {
        this.proxrevision = unMes;
      } else {
        this.proxrevision = tresMeses;
      }
    }

    if (this.equipo == 'MOL') {
      if (this.nroequipo.includes('rodillos', 9)) {
        this.proxrevision = unAnio;
      } else {
        this.proxrevision = tresMeses;
      }
    }

    if ((this.equipo == 'ZAR' || this.equipo == 'ZOR') && !this.nroequipo.includes('bascula', 10)) {
      this.proxrevision = unAnio;
    } else if (this.equipo == 'ZOR' && this.nroequipo.includes('bascula', 10)) {
      this.proxrevision = seisMeses;
    }

    if (this.equipo == 'VAR') {
      if (this.nroequipo.includes('Compresor', 0) || this.nroequipo.includes('Shaker', 0) || this.nroequipo == 'Extractor polvo') {
        this.proxrevision = tresMeses;
      } else if (this.nroequipo.includes('Envasadora', 0) || this.nroequipo.includes('Tapadora', 0) || this.nroequipo == 'Enfriador agua' ||
        this.nroequipo.includes('Dispenser', 0)) {
        this.proxrevision = seisMeses;
      } else if (this.nroequipo == 'Paletizadora' || this.nroequipo == 'Flejadora' || this.nroequipo == 'Destilador'
        || this.nroequipo.includes('Termotanque', 0)) {
        this.proxrevision = unAnio;
      }
    }


    if ((!this.observaciones && this.equipo == 'BAL') || (!this.limpieza && this.equipo != 'BAL')) {
      return alertify.error("HAY QUE COMPLETAR ALGUNOS DATOS");
    }


    let data = {
      equipo: this.equipo,
      nroequipo: this.nroequipo,
      motivo: this.motivo,
      correas: this.correas,
      limpieza: this.limpieza,
      mangueras: this.mangueras,
      engrase: this.engrase,
      lubricacion: this.lubricacion,
      accesorios: this.accesorios,
      conexiones: this.conexiones,
      tableros: this.tableros,
      cortes: this.cortes,
      observaciones: this.observaciones,
      fecha: this.fecha,
      proxrevision: this.proxrevision,
      usuario: localStorage.getItem("username"),
    };

    this.genericService.agregarMantenimiento(data)
      .subscribe((data: any) => {
        this.resetear();
        return alertify.success("¡ Mantenimiento registrado correctamente !");
      }, err => {
        console.log(err);
      })
  }

  resetear() {
    this.equipo = null;
    this.nroequipo = null;
    this.motivo = null;
    this.correas = null;
    this.limpieza = null;
    this.mangueras = null;
    this.engrase = null;
    this.lubricacion = null;
    this.accesorios = null;
    this.conexiones = null;
    this.tableros = null;
    this.cortes = null;
    this.observaciones = null;
    this.fecha = null;
    this.proxrevision = null;
    this.usuario = null;

  }

  /* Función que suma o resta días a una fecha, si el parámetro
 días es negativo restará los días*/
  sumarDias(date, days) {
    var res = new Date(date);
    res.setDate(res.getDate() + days);
    return res;
  }

}
