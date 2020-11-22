import { ApiErrorDetails } from '@baw-api/api.interceptor.service';
import { apiReturnCodes } from '@baw-api/baw-api.service';

type HTTPStatus =
  | 'Unauthorized'
  | 'Not Found'
  | 'Bad Request'
  | 'Unprocessable Entity'
  | 'Custom';

export function generateApiErrorDetails(
  type: HTTPStatus = 'Unauthorized',
  custom?: Partial<ApiErrorDetails>
): ApiErrorDetails {
  let status: number;
  let message: string;

  switch (type) {
    case 'Unauthorized':
      status = apiReturnCodes.unauthorized;
      message = type;
      break;
    case 'Not Found':
      status = apiReturnCodes.notFound;
      message = type;
      break;
    case 'Bad Request':
      status = apiReturnCodes.badRequest;
      message = type;
      break;
    case 'Unprocessable Entity':
      status = apiReturnCodes.unprocessableEntity;
      message = 'Record could not be saved';
      break;
  }

  return {
    status: custom?.status ?? status ?? apiReturnCodes.unknown,
    message: custom?.message ?? message ?? 'Unknown',
    info: custom?.info ?? undefined,
  };
}
