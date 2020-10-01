import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//COMPONENTS
import { AltampComponent } from './components/altamp/altamp.component';
import { ListformComponent } from './components/listform/listform.component';
import { AltaenvComponent } from './components/altaenv/altaenv.component';
import { ListenvComponent } from './components/listenv/listenv.component';
import { AltaprodComponent } from './components/altaprod/altaprod.component';
import { ListprodComponent } from './components/listprod/listprod.component';
import { RecepmpComponent } from './components/recepmp/recepmp.component';
import { CorrecComponent } from './components/correc/correc.component';
import { PlanifiComponent } from './components/planifi/planifi.component';
import { NavbarComponent } from './components/navbar/navbar.component';

//PIPES
import { DatePipe } from './pipes/date.pipe';
import { EmisionComponent } from './components/emision/emision.component';
import { LoggedComponent } from './components/logged/logged.component';
import { ListmpComponent } from './components/listmp/listmp.component';
import { AltaformComponent } from './components/altaform/altaform.component';
import { NumeralPipe } from './pipes/numeral.pipe';
import { AnulacionComponent } from './components/anulacion/anulacion.component';
import { ControlptComponent } from './components/controlpt/controlpt.component';
import { ControlComponent } from './components/control/control.component';
import { CertificadosComponent } from './components/certificados/certificados.component';
import { ListadosComponent } from './components/listados/listados.component';
import { ListaFuncionalComponent } from './components/listados/lista-funcional/lista-funcional.component';
import { FichasComponent } from './components/listados/fichas/fichas.component';
import { RolodexComponent } from './components/listados/rolodex/rolodex.component';
import { VerificacionComponent } from './components/verificacion/verificacion.component';
import { VerificacionListadosComponent } from './components/verificacion-listados/verificacion-listados.component';
import { TimePipe } from './pipes/time.pipe';
import { EliminarDatosComponent } from './components/eliminar-datos/eliminar-datos.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,

    AltampComponent,
    AltaenvComponent,
    AltaprodComponent,
    AltaformComponent,

    ListformComponent,
    ListenvComponent,
    ListprodComponent,
    ListmpComponent,

    RecepmpComponent,
    CorrecComponent,
    PlanifiComponent,
    EmisionComponent,
    ControlptComponent,
    ControlComponent,
    
    LoggedComponent,
    DatePipe,
    NumeralPipe,
    TimePipe,
    AnulacionComponent,
    CertificadosComponent,
    ListadosComponent,
    ListaFuncionalComponent,
    FichasComponent,
    RolodexComponent,
    VerificacionComponent,
    VerificacionListadosComponent,
    EliminarDatosComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    DragDropModule,
    //CARGAMOS TODAS LAS RUTAS
    AppRoutingModule,


  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
