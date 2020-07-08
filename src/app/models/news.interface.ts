export class UrlDetails {
  constructor(
   public url = '',
   public name = ' - '
  ){}
}
export interface NewsDetails {
  title: string;
  urldetails: string;
  author: string;
  commentsCount: number;
  points: number;
  createdAt: string;
  id: string;
}

export class ChartData{
  constructor(
    public ids = [],
    public votes = []
  ){}
}
