import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-video-player-modal',
  templateUrl: './video-player-modal.component.html',
  styleUrls: ['./video-player-modal.component.scss']
})
export class VideoPlayerModalComponent implements OnInit{
  @Input() videoId : string;
  public videoUrl : string;
  
  ngOnInit(): void {
    this.videoUrl = (environment.url+'media/profile_videos/' + this.videoId);
  }
}
