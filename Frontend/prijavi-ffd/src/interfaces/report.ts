
import { User } from './user';
import { Comment } from './comment';
import { Media } from './media';

export interface Report {
  id: string;
  title: string | null;
  description: string | null;
  dateOfPost: Date;
  username: string | null;
  commentIds: string[] | null;
  mediaIds: string[] | null;
  regionName: string | null;
  severityLevel: string | null;
  resolutionStatus: string | null;
  pinId: string | null;
  tagNames: string[] | null;
  followerUsernames: string[] | null;
}