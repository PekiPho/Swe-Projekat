

export interface Comment {
  id: string;
  reportId?: string; 
  content: string;
  username?: string; 
  isDeleted: boolean;
  dateOfComment: string;
}