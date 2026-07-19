import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import ApiError from "../utils/ApiError";

const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed: any = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsed?.body) {
        req.body = parsed.body;
      }

      next();
    } catch (err: any) {
      const issues = err.issues || [];

      const message =
        issues[0]?.message || "Validation Error";

      next(
        new ApiError(
          400,
          message,
          issues.map((issue: any) => issue.message)
        )
      );
    }
  };

export default validate;