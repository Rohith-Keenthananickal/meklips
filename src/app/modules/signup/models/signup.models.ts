export class Signup {
    email: string
    password: string
}

export class Candidate {
    firstName: string
    lastName: string
    email: string
    currentAddress: CurrentAddress
    phone: string
    mobile: string
    dob: string
    gender: string
    dpId : number;
    videoId : number;
    experienceSummary: string
    technicalSummary: string
    educationalDegrees: EducationalDegree[]
    socialMediaLinks: SocialMediaLink[]
    workExperiences: WorkExperience[]
    candidateSkills: CandidateSkill[]
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
  }
  
  export class SocialMediaLink {
    candidateId: number
    type: string
    url: string
  }
  
  export class WorkExperience {
    candidateId: number
    designation: string
    companyName: string
    startDate: string
    currentJob: boolean
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