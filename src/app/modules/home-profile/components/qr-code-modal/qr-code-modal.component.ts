import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-qr-code-modal',
  templateUrl: './qr-code-modal.component.html',
  styleUrls: ['./qr-code-modal.component.scss']
})
export class QrCodeModalComponent implements OnInit{
  ngOnInit(): void {
    this.url = environment.url + 'candidate/' + this.id;
  }
  @Input() id: string;
  public url : string;

  constructor(private activeModal : NgbActiveModal){}

  dismissModal(){
    this.activeModal.dismiss();
  }

}
