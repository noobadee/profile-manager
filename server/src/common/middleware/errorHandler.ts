import { ZodError } from "zod";
import { AppError, ValidationError } from "../errors/index.ts";
import type { Request, Response, NextFunction } from "express";
import type { ValidationFieldError } from "../types/index.ts";

interface ErrorResponse {
  status: "error";
  code: string;
  message: string;
  errors?: ValidationFieldError[];
}

function buildErrorResponse(err: AppError): ErrorResponse {
  const response: ErrorResponse = {
    status: "error",
    code: err.errorCode,
    message: err.message,
  };

  if (err.details !== undefined) {
    // Add 'errors' property
    response.errors = err.details as ValidationFieldError[];
  }

  return response;
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  let appError: AppError;

  if (err instanceof ZodError) {
    // In case using .parse() method instead of .safeParse()
    const fieldErrors: ValidationFieldError[] = err.issues.map((issue) => ({
      field: issue.path.join(".") || "root",
      message: issue.message,
    }));
    appError = new ValidationError("Validation failed", fieldErrors);
  } else if (err instanceof AppError) {
    appError = err;
  } else if (err instanceof Error) {
    console.error("[Unhandled Error]", {
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
    });
    appError = new AppError(
      "An unexpected error occurred",
      500,
      "INTERNAL_SERVER_ERROR",
      false,
    );
  } else {
    console.error("[Unknown Thrown Value]", {
      value: err,
      url: req.url,
      method: req.method,
    });
    appError = new AppError(
      "An unexpected error occurred",
      500,
      "INTERNAL_SERVER_ERROR",
      false,
    );
  }

  // Log operational errors only
  if (appError.isOperational) {
    console.warn("[Operational Error]", {
      code: appError.errorCode,
      message: appError.message,
      url: req.url,
      method: req.method,
    });
  }

  // Send response
  if (!appError.isOperational) {
    res.status(500).json({
      status: "error",
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong. Please try again later.",
    });
    return;
  }

  res.status(appError.statusCode).json(buildErrorResponse(appError));
}
