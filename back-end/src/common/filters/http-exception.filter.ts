import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    let response: any;
    
    // Check if it's a GraphQL context
    try {
      const gqlContext = GqlExecutionContext.create(host as any);
      response = gqlContext.getContext()?.res;
    } catch {
      // If not GraphQL, use HTTP context
      response = host.switchToHttp().getResponse();
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    if (response && response.status) {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        message,
      });
    }

    return exception;
  }
}

