import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    BadRequestException,
} from '@nestjs/common';
import { Error as MongooseError } from 'mongoose';

@Catch() // จับทุกข้อผิดพลาด
export class MongooseExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        // จัดการ Duplicate Key Error (E11000)
        if (exception.code === 11000) {
            const keyValue = exception.keyValue;
            const message = `Duplicate key error: ${keyValue
                ? Object.keys(keyValue)
                    .map((key) => `${key}: ${keyValue[key]}`)
                    .join(', ')
                : ''
                }`;

            return response.status(400).json({
                statusCode: 400,
                message,
                error: 'Bad Request',
            });
        }

        // ข้อผิดพลาดอื่นๆ
        const responseObj = exception.response && typeof exception.response === 'object'
            ? exception.response
            : {};
        response.status(responseObj?.statusCode || 500).json({
            statusCode: responseObj?.statusCode || 500,
            message: responseObj?.message || 'Internal Server Error',
            error: responseObj?.error || 'Unknown error',
        });
    }
}

