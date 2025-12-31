import { BaseResponseDto } from './base-response.dto';

export const ResponseHelper = {
  success: <T>(data: T, message = 'Success', statusCode = 200) => {
    return new BaseResponseDto<T>({
      success: true,
      statusCode,
      message,
      data,
    });
  },

  list: <T>(
    data: T[],
    total: number,
    page?: number,
    limit?: number,
    message = 'Success',
    statusCode = 200,
  ) => {
    return new BaseResponseDto<T[]>({
      success: true,
      statusCode,
      message,
      data,
      total,
      page,
      limit,
    });
  },
};
