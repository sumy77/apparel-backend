import {
  type Request,
  type Response,
  type ErrorRequestHandler,
  type NextFunction,
} from "express";
import { ValidationError } from "express-json-validator-middleware";
import { validSizes } from "../utils/constants";

export function validationErrorMiddleware(
  error: ErrorRequestHandler,
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  if (response.headersSent) {
    next(error);
    return;
  }
  const isValidationError = error instanceof ValidationError;
  if (!isValidationError) {
    next(error);
    return;
  }
  response.status(400).json({
    errors: error.validationErrors,
  });
}

export const validateUpdateApparelParams = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { size } = req.params;

  // Check if the size parameter is in the validSizes array
  if (!validSizes.includes(size)) {
    res.status(400).json({ error: "Invalid size parameter" });
    return;
  }

  // If validation passes, move to the next middleware
  next();
};
