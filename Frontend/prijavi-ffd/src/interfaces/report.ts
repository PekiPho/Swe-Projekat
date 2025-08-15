import { Media } from "./media"
export interface Report {
    id:string;
    communityname:string;
    title:string;
    description:string;
    mediaIds:Media[] | null;
    commnets:string;
    username:string;
    vote:number;
    dateOfPost:string;
}
