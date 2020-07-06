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

export interface ChartData{
  ids: number[];
  votes: number[];
}
