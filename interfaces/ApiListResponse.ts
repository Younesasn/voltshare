export interface ApiListResponse<T> {
  "@context": string;
  "@id": string;
  "@type": string;
  member: T[];
}

export interface ApiResponse {
  "@context"?: string;
  "@id"?: string;
  "@type"?: string;
}