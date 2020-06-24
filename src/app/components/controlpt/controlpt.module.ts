import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlptRoutingModule } from './controlpt-routing.module';
import { ControlComponent } from './control.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ControlComponent],
  imports: [
    CommonModule,
    FormsModule,
    ControlptRoutingModule
  ]
})
export class ControlptModule { }
