import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environment/environment';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-qr-code-modal',
  templateUrl: './qr-code-modal.component.html',
  styleUrls: ['./qr-code-modal.component.scss']
})
export class QrCodeModalComponent implements OnInit{
  @ViewChild(QRCodeComponent) qrcode: QRCodeComponent;
  @Input() id: string;
  public url: string;

  constructor(private activeModal: NgbActiveModal){}

  ngOnInit(): void {
    this.url = 'https://demo.meklips.com/profile/candidate/' + this.id;
  }

  dismissModal(){
    this.activeModal.dismiss();
  }

  downloadQRCode() {
    if (this.qrcode) {
      const canvas = this.qrcode.qrcElement.nativeElement.querySelector('canvas');
      if (canvas) {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'meklips-qr-code.png';
        link.href = image;
        link.click();
      }
    }
  }
}
