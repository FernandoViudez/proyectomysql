import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioRoutingModule } from './inicio-routing.module';
import { FormsModule } from '@angular/forms';
import { InicioComponent } from './inicio.component';


@NgModule({
  declarations: [InicioComponent],
  imports: [
    CommonModule,
    FormsModule,
    InicioRoutingModule
  ],
})
export class InicioModule { }
