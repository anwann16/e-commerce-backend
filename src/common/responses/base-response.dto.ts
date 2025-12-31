export class BaseResponseDto<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  total?: number;
  page?: number;
  limit?: number;

  constructor(params: {
    success: boolean;
    statusCode: number;
    message: string;
    data: T | null;
    total?: number;
    page?: number;
    limit?: number;
  }) {
    this.success = params.success;
    this.statusCode = params.statusCode;
    this.message = params.message;
    this.data = params.data;
    this.total = params.total;
    this.page = params.page;
    this.limit = params.limit;
  }
}
