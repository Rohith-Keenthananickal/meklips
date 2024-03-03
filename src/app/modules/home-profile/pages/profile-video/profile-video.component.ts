import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProfileService } from '../../service/profile.service';
import { Candidate } from 'src/app/modules/signup/models/signup.models';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-video',
  templateUrl: './profile-video.component.html',
  styleUrls: ['./profile-video.component.scss']
})
export class ProfileVideoComponent implements OnInit{
  @ViewChild('videoPlayer') videoPlayer: ElementRef;
  videoAspectRatio: number;
  public candidate : Candidate;
  video: string;
  videoUrl: SafeUrl;
  public videoId


  constructor(private profileService : ProfileService,
    private router:Router,
    private sanitizer:DomSanitizer){

  }

  ngOnInit(): void {
    let localData = localStorage.getItem('formData');
    let parsedData = JSON.parse(localData)
    this.videoId = parsedData.videoId;
    console.log(this.videoId);
    this.getVideo()
    
  };

  ngAfterViewInit() {
    // Check if videoPlayer is defined before accessing nativeElement
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      this.calculateVideoAspectRatio();
      // this.setVideoHeight();
    }
  }

  calculateVideoAspectRatio() {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
      this.videoAspectRatio = videoElement.videoWidth / videoElement.videoHeight;
    }
  }

  // setVideoHeight() {
  //   if (this.videoPlayer && this.videoPlayer.nativeElement) {
  //     const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
  //     const calculatedHeight = videoElement.offsetWidth / this.videoAspectRatio;
  //     videoElement.style.height = `${calculatedHeight}px`;
  //   }
  // }

  getVideo() {
    this.profileService.getVideo(this.videoId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.video = URL.createObjectURL(res);
        console.log(this.video);
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.video as string);
      },
      error: (err: any) => {
        console.error(err);
      }
    });
    
  }

  backToProfile(){
    this.router.navigate(['profile']);
  }
}
