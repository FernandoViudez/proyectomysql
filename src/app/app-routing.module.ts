import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserGuard } from './guards/user.guard';
import { AltampComponent } from './components/altamp/altamp.component';
import { ListformComponent } from './components/listform/listform.component';
import { AltaenvComponent } from './components/altaenv/altaenv.component';
import { ListenvComponent } from './components/listenv/listenv.component';
import { AltaprodComponent } from './components/altaprod/altaprod.component';
import { ListprodComponent } from './components/listprod/listprod.component';
import { RecepmpComponent } from './components/recepmp/recepmp.component';
import { CorrecComponent } from './components/correc/correc.component';
import { PlanifiComponent } from './components/planifi/planifi.component';
import { EmisionComponent } from './components/emision/emision.component';
import { LoggedComponent } from './components/logged/logged.component';
import { ListmpComponent } from './components/listmp/listmp.component';
import { AltaformComponent } from './components/altaform/altaform.component';



const routes: Routes = [
  
  {
    path: "inicio", loadChildren: () => import("./components/inicio/inicio.module").then(m => m.InicioModule)
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
  { path: "correc", canActivate: [UserGuard], component: CorrecComponent },
  { path: "planifi", canActivate: [UserGuard], component: PlanifiComponent },
  { path: "ordenp", canActivate: [UserGuard], component: EmisionComponent },
  { path: "control", canActivate: [UserGuard], loadChildren: () => import('./components/control/control.module').then(m => m.ControlModule) },
  { path: "controlpt", canActivate: [UserGuard], loadChildren: () => import('./components/controlpt/controlpt.module').then(m => m.ControlptModule) },


  { path: "", redirectTo: "inicio", pathMatch: "full" },
  { path: "**", redirectTo: "inicio", pathMatch: "full" },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
