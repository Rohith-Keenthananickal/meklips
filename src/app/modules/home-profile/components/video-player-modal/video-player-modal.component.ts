import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-video-player-modal',
  templateUrl: './video-player-modal.component.html',
  styleUrls: ['./video-player-modal.component.scss']
})
export class VideoPlayerModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() videoId : string;
  public videoUrl : string;
  @ViewChild('videoPlayer') videoPlayer: ElementRef<HTMLVideoElement>;
  public videoWidth: number | null = null;
  public videoHeight: number | null = null;
  public isFullscreen: boolean = false;

  // Store bound event handlers for proper cleanup
  private fullscreenChangeHandler = () => this.handleFullscreenChange();

  constructor(private activeModal : NgbActiveModal, private cdr: ChangeDetectorRef){

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
        
        // Add fullscreen event listeners to document
        document.addEventListener('fullscreenchange', this.fullscreenChangeHandler);
        document.addEventListener('webkitfullscreenchange', this.fullscreenChangeHandler);
        document.addEventListener('mozfullscreenchange', this.fullscreenChangeHandler);
        document.addEventListener('MSFullscreenChange', this.fullscreenChangeHandler);
        
        console.log('Fullscreen event listeners added');
      }
    }, 0);
  }

  ngOnDestroy(): void {
    // Clean up event listeners
    document.removeEventListener('fullscreenchange', this.fullscreenChangeHandler);
    document.removeEventListener('webkitfullscreenchange', this.fullscreenChangeHandler);
    document.removeEventListener('mozfullscreenchange', this.fullscreenChangeHandler);
    document.removeEventListener('MSFullscreenChange', this.fullscreenChangeHandler);
  }

  handleFullscreenChange(): void {
    const wasFullscreen = this.isFullscreen;
    this.isFullscreen = !!(document.fullscreenElement || 
                           (document as any).webkitFullscreenElement || 
                           (document as any).mozFullScreenElement || 
                           (document as any).msFullscreenElement);
    
    // Force change detection
    if (wasFullscreen !== this.isFullscreen) {
      console.log('Fullscreen state changed:', this.isFullscreen);
      this.cdr.detectChanges();
    }
  }

  toggleFullscreen(): void {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      if (!this.isFullscreen) {
        // Enter fullscreen
        if (this.videoPlayer.nativeElement.requestFullscreen) {
          this.videoPlayer.nativeElement.requestFullscreen();
        } else if ((this.videoPlayer.nativeElement as any).webkitRequestFullscreen) {
          (this.videoPlayer.nativeElement as any).webkitRequestFullscreen();
        } else if ((this.videoPlayer.nativeElement as any).mozRequestFullScreen) {
          (this.videoPlayer.nativeElement as any).mozRequestFullScreen();
        } else if ((this.videoPlayer.nativeElement as any).msRequestFullscreen) {
          (this.videoPlayer.nativeElement as any).msRequestFullscreen();
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
      }
    }
  }

  dismissModal(){
    this.activeModal.dismiss();
  }
}
