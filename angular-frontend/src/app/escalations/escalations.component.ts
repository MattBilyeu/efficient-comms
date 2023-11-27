import { Component } from '@angular/core';

interface advanceEscalationObject {
  escalationId: string,
  note: string[],
  files: File[]
}

@Component({
  selector: 'app-escalations',
  templateUrl: './escalations.component.html',
  styleUrls: ['./escalations.component.css']
})
export class EscalationsComponent {

}
