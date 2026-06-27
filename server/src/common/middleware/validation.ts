import { ValidationError } from "../errors/index.ts";
import type { Request, Response, NextFunction } from "express";
import { type ZodType, ZodError, z } from "zod";
import type { ValidationFieldError } from "../types/index.ts";

interface ValidationTargets<
  TBody extends ZodType = ZodType,
  TParams extends ZodType = ZodType,
> {
  body?: TBody;
  params?: TParams;
}

interface ValidatedRequest<TBody = unknown, TParams = unknown> extends Request {
  validated: {
    body: TBody;
    params: TParams;
  };
}

// interface ValidationErrorResponse {
//   status: "error";
//   code: "VALIDATION_ERROR";
//   message: string;
//   errors: ValidationFieldError[];
// }

function formatZodErrors(
  error: ZodError,
  section: string,
): ValidationFieldError[] {
  return error.issues.map((issue) => ({
    field: [section, ...issue.path].join("."),
    message: issue.message,
  }));
}

export function validate<TBody extends ZodType, TParams extends ZodType>(
  targets: ValidationTargets<TBody, TParams>,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const allErrors: ValidationFieldError[] = [];

    const validated = {
      body: req.body as z.infer<TBody>,
      params: req.params as z.infer<TParams>,
    };

    const sections = [
      { key: "body", schema: targets.body, raw: req.body },
      { key: "params", schema: targets.params, raw: req.params },
    ] as const;

    for (const { key, schema, raw } of sections) {
      if (!schema) {
        continue;
      }

      const result = schema.safeParse(raw);

      if (!result.success) {
        allErrors.push(...formatZodErrors(result.error, key));
      } else {
        (validated as Record<string, unknown>)[key] = result.data;
      }
    }

    if (allErrors.length > 0) {
      // const body: ValidationErrorResponse = {
      //   status: "error",
      //   code: "VALIDATION_ERROR",
      //   message: `Validation failed on: ${[...new Set(allErrors.map((e) => e.field.split(".")[0]))].join(", ")}`,
      //   errors: allErrors,
      // };
      // res.status(400).json(body);
      const sections = [
        ...new Set(allErrors.map((e) => e.field.split(".")[0])),
      ].join(", ");
      next(new ValidationError(`Validation failed on: ${sections}`, allErrors));
      return;
    }

    (req as ValidatedRequest).validated = validated;
    next();
  };
}
