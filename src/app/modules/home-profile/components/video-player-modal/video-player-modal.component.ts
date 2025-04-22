import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-video-player-modal',
  templateUrl: './video-player-modal.component.html',
  styleUrls: ['./video-player-modal.component.scss']
})
export class VideoPlayerModalComponent implements OnInit{
  @Input() videoId : string;
  public videoUrl : string;

  constructor(private activeModal : NgbActiveModal){

  }
  
  ngOnInit(): void {
    this.videoUrl = (environment.url+'media/profile_videos/' + this.videoId);
  }

  dismissModal(){
    this.activeModal.dismiss();
  }
}
