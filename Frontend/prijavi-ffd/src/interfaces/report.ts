
import { User } from './user';
import { Comment } from './comment';
import { Media, Pin } from './media';

export interface Report {
  id: string;
  title: string | null;
  description: string | null;
  dateOfPost: Date;
  username: string | null;
  commentIds: string[] | null;
  mediaIds: string[] | null;
  region: string | null;
  severity: string | null;
  resolutionStatus: string | null;
  pinId: string | null;
  tags: string[] | null;
  followerUsernames: string[] | null;
}

export interface ReportToSend{ 
  title:string; 
  description:string; 
  tagNames:string[]; 
  severityLevel:string; 
  regionName:string; 
  pin?:Pin; }

  