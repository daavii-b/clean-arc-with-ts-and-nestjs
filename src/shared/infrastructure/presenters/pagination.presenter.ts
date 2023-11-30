import { Transform } from 'class-transformer';

export type PaginationPresenterProps = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  totalPage: number;
};

export class PaginationPresenter {
  @Transform(({ value }) => parseInt(value))
  currentPage: number;
  @Transform(({ value }) => parseInt(value))
  lastPage: number;
  @Transform(({ value }) => parseInt(value))
  perPage: number;
  @Transform(({ value }) => parseInt(value))
  totalPage: number;

  constructor(props: PaginationPresenterProps) {
    this.currentPage = props.currentPage;
    this.lastPage = props.lastPage;
    this.perPage = props.perPage;
    this.totalPage = props.totalPage;
  }
}
