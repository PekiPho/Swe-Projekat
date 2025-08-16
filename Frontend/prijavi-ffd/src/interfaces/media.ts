export interface Media {
    id:string;
    url:string;
    reportId:string;
}
export interface Pin {
  id?: string;
  latitude: number;
  longitude: number;
  report?: Report | null;
}
export interface Region {
    id: number;
  name: string;
}
export interface Tag {
  id: number;
  name: string;
  reports?: Report[];
}
export interface ResolutionStatus {
  id: number;
  status: string;
  reports?: Report[];
}
export interface Severity {
  id: number;
  level: string;
  reports?: Report[];
}
