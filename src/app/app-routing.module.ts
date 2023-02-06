import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserGuard } from "./guards/user.guard";
import { AltampComponent } from "./components/altamp/altamp.component";
import { ListformComponent } from "./components/listform/listform.component";
import { AltaenvComponent } from "./components/altaenv/altaenv.component";
import { ListenvComponent } from "./components/listenv/listenv.component";
import { AltaprodComponent } from "./components/altaprod/altaprod.component";
import { ListprodComponent } from "./components/listprod/listprod.component";
import { RecepmpComponent } from "./components/recepmp/recepmp.component";
import { CorrecComponent } from "./components/correc/correc.component";
import { PlanifiComponent } from "./components/planifi/planifi.component";
import { EmisionComponent } from "./components/emision/emision.component";
import { LoggedComponent } from "./components/logged/logged.component";
import { ListmpComponent } from "./components/listmp/listmp.component";
import { AltaformComponent } from "./components/altaform/altaform.component";
import { AnulacionComponent } from "./components/anulacion/anulacion.component";
import { ControlptComponent } from "./components/controlpt/controlpt.component";
import { ControlComponent } from "./components/control/control.component";
import { CertificadosComponent } from "./components/certificados/certificados.component";
import { ListaFuncionalComponent } from "./components/listados/lista-funcional/lista-funcional.component";
import { FichasComponent } from "./components/listados/fichas/fichas.component";
import { RolodexComponent } from "./components/listados/rolodex/rolodex.component";
import { VerificacionComponent } from "./components/verificacion/verificacion.component";
import { VerificacionListadosComponent } from "./components/verificacion-listados/verificacion-listados.component";
import { EliminarDatosComponent } from "./components/eliminar-datos/eliminar-datos.component";
import { ModificarPreciosComponent } from "./components/costos/modificar-precios/modificar-precios.component";
import { RealizarCalculosComponent } from "./components/costos/realizar-calculos/realizar-calculos.component";
import { CostosComponent } from "./components/costos/costos.component";
import { MantenimientoComponent } from "./components/mantenimiento/mantenimiento.component";
import { MantenimientoListadoComponent } from "./components/mantenimiento-listado/mantenimiento-listado.component";

const routes: Routes = [
  {
    path: "inicio",
    loadChildren: () =>
      import("./components/inicio/inicio.module").then((m) => m.InicioModule),
  },

  { path: "app", canActivate: [UserGuard], component: LoggedComponent },

  { path: "altamp", canActivate: [UserGuard], component: AltampComponent },
  { path: "listmp", canActivate: [UserGuard], component: ListmpComponent },

  { path: "altafor", canActivate: [UserGuard], component: AltaformComponent },
  { path: "listfor", canActivate: [UserGuard], component: ListformComponent },

  { path: "altaenv", canActivate: [UserGuard], component: AltaenvComponent },
  { path: "listenv", canActivate: [UserGuard], component: ListenvComponent },

  { path: "altaprod", canActivate: [UserGuard], component: AltaprodComponent },
  { path: "listprod", canActivate: [UserGuard], component: ListprodComponent },

  //PROCESOS
  { path: "recepmp", canActivate: [UserGuard], component: RecepmpComponent },
  {
    path: "mantenimiento",
    canActivate: [UserGuard],
    component: MantenimientoComponent,
  },
  {
    path: "mantenimiento-listado",
    canActivate: [UserGuard],
    component: MantenimientoListadoComponent,
  },
  { path: "correc", canActivate: [UserGuard], component: CorrecComponent },
  { path: "planifi", canActivate: [UserGuard], component: PlanifiComponent },
  { path: "ordenp", canActivate: [UserGuard], component: EmisionComponent },
  {
    path: "anulacion",
    canActivate: [UserGuard],
    component: AnulacionComponent,
  },
  {
    path: "controlpt",
    canActivate: [UserGuard],
    component: ControlptComponent,
  },
  { path: "control", canActivate: [UserGuard], component: ControlComponent },
  {
    path: "certificados",
    canActivate: [UserGuard],
    component: CertificadosComponent,
  },
  {
    path: "verificacion",
    canActivate: [UserGuard],
    component: VerificacionComponent,
  },
  {
    path: "verificacionListados",
    canActivate: [UserGuard],
    component: VerificacionListadosComponent,
  },
  {
    path: "eliminarDatos",
    canActivate: [UserGuard],
    component: EliminarDatosComponent,
  },

  {
    path: "listados",
    canActivate: [UserGuard],
    children: [
      { path: "lista-funcional", component: ListaFuncionalComponent },
      { path: "rolodex", component: RolodexComponent },
      { path: "fichas", component: FichasComponent },
    ],
  },

  // Costos
  {
    path: "costos",
    component: CostosComponent,
    canActivate: [UserGuard],
    children: [
      {
        path: "modificarPrecios",
        component: ModificarPreciosComponent,
      },
      {
        path: "realizarCalculos",
        component: RealizarCalculosComponent,
      },
    ],
  },

  // Any
  { path: "", redirectTo: "inicio", pathMatch: "full" },
  { path: "**", redirectTo: "inicio", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
