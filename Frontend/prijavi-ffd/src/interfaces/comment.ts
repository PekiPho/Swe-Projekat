import { User } from "./user";
import { Report } from "./report"

export interface Comment {
  id: string;
  report?: Report | null;
  user?: User | null;
  isDeleted: boolean;
  dateOfComment: string;
  content: string; 
}
