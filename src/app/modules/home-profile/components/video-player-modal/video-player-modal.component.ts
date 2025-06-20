import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-video-player-modal',
  templateUrl: './video-player-modal.component.html',
  styleUrls: ['./video-player-modal.component.scss']
})
export class VideoPlayerModalComponent implements OnInit, AfterViewInit {
  @Input() videoId : string;
  public videoUrl : string;
  @ViewChild('videoPlayer') videoPlayer: ElementRef<HTMLVideoElement>;
  public videoWidth: number | null = null;
  public videoHeight: number | null = null;

  constructor(private activeModal : NgbActiveModal){

  }
  
  ngOnInit(): void {
    this.videoUrl = (environment.url+'media/profile_videos/' + this.videoId);
  }

  ngAfterViewInit(): void {
    // Wait for videoUrl to be set and video element to be available
    setTimeout(() => {
      if (this.videoPlayer && this.videoPlayer.nativeElement) {
        this.videoPlayer.nativeElement.play();
        this.videoPlayer.nativeElement.onloadedmetadata = () => {
          this.videoWidth = this.videoPlayer.nativeElement.videoWidth;
          this.videoHeight = this.videoPlayer.nativeElement.videoHeight;
        };
      }
    }, 0);
  }

  dismissModal(){
    this.activeModal.dismiss();
  }
}
