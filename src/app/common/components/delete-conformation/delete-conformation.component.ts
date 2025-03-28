import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-conformation',
  templateUrl: './delete-conformation.component.html',
  styleUrls: ['./delete-conformation.component.scss']
})
export class DeleteConformationComponent {
  @Input()  warningSubject: string = '';
constructor(public modal: NgbActiveModal,){
}

warningModal(){
  this.modal.close();
}

}
