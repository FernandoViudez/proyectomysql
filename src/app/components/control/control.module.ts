import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlRoutingModule } from './control-routing.module';
import { ControlComponent } from './control.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ControlComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ControlRoutingModule,
  ]
})
export class ControlModule { }
