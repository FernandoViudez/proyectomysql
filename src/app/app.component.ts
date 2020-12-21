import { Component, OnInit } from '@angular/core';
import { GenericService } from './services/generic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

    constructor(private genericService: GenericService) { 
      genericService.changeTittle.subscribe( this.onTittleChange.bind(this) )
    }

    private onTittleChange(newTittle: string): void {
      const tittle = document.getElementsByTagName("title")[0];
      tittle.innerHTML = newTittle;
    }

}
