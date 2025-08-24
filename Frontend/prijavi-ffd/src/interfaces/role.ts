import { Region } from "./media";
import { User } from "./user";

export interface Role {
    id:number;
    name:string;
    region?:Region|null;
    user:User[];
}
