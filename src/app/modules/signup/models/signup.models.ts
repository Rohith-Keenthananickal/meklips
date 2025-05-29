export class Signup {
    email: string
    password: string
}

export class Candidate {
    id : string;
    userId : any;
    firstName: string
    lastName: string
    email: string
    currentAddress: CurrentAddress
    phone: string
    mobile: string
    dob: string
    gender: string
    dpId : any;
    videoId : number;
    likes : number;
    experienceSummary: string
    technicalSummary: string
    educationalDegrees: EducationalDegree[]
    socialMediaLinks: SocialMediaLink[]
    workExperiences: WorkExperience[]
    candidateSkills: CandidateSkill[]
    candidateHighlights: CandidateHighlight[];

    streetAddress : string;
    streetAddress2 : string;
    city : string;
    state : string;
    country : string;
    zipCode : string;
    professionInfo : string;
  }
  
  export class CurrentAddress {
    candidateId: number
    streetAddress: string
    state: string
    city: string
    pincode: string
    isCurrentAddress: boolean
  }
  
  export class EducationalDegree {
    candidateId: number
    degree: string
    university: string
    graduationDate: string
    graduationMonth: string
    graduationYear: number
    location : string;
    notes : string
    id: string;
    fieldOfStudy: string;
  }
  
  export class SocialMediaLink {
    id: string
    candidateId: number
    type: string
    url: string
  }
  
  export class WorkExperience {
    candidateId: number
    designation: string
    companyName: string
    startDate: string
    currentJob: boolean = false;
    endDate: string
    responsibilities: string;
    contactNumber: string
    location: string;
    id : string

  }
  
  export class CandidateSkill {
    candidateId: number
    skillName: string
    skillLevel: number
    id : string
  }

  export class Video{
    FileContent : File;
  }

  export class CandidateSummaryPayload{
    candidateId : number;
    experienceSummary : string;
    technicalSummary : string;
  }

  export class CandidateHighlight{
    id : string;
    candidateId : number;
    highlightKey : string;
    highlightValue : string;
  }