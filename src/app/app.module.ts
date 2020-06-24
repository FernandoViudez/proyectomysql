import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//MODULES
import { ControlModule } from './components/control/control.module';
import { ControlptModule } from './components/controlpt/controlpt.module';

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
    
    LoggedComponent,
    DatePipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    DragDropModule,
    //MODULOS ESPECÍFICOS

    ControlModule,
    ControlptModule,

    //CARGAMOS TODAS LAS RUTAS
    AppRoutingModule,


  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
