export interface UrlDetails {
  url: string;
  name: string;
}
export interface NewsDetails {
  title: string;
  urldetails: UrlDetails;
  author: string;
  commentsCount: number;
  points: number;
  createdAt: string;
  id: string;
  hide: boolean;
}
