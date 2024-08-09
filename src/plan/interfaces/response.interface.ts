export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Response<T> {
  data: T[];
  meta: Meta;
}
