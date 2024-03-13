import express, { type Request, type Response } from "express";
import { Validator } from "express-json-validator-middleware";
import {
  createApparel,
  getMinPrice,
  updateApparel,
  updateApparels,
  validateOrder,
} from "../controllers/apparels";
import {
  bulkUpdateApparelSchema,
  createApparelSchema,
  updateApparelSchema,
  validateOrderSchema,
} from "../utils/validationSchema";
import { validateUpdateApparelParams } from "../middleware/validationError";
const router = express.Router();

const validator = new Validator({ allErrors: true });
const validate = validator.validate.bind(validator);

router.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

/**
 * Create Apparel endpoint
 * 
 * @body {
    "title": "String",
    "sizes": {
        "small": {
            "quantity": number,
            "price": number
        },
        "medium": {
          "quantity": number,
          "price": number
        }
    }
  }
 * @return {Object} the created apparel
 */
router.post(
  "/create-apparel",
  validate({ body: createApparelSchema }),
  createApparel,
);

/**
 * Update Apparel endpoint
 * @param {String} uCode the unique code of apparel
 * @param {String} size the size of apparel
 * @body {
    "quantity": number,
    "price": number
  }
 * @return {Object} the updated apparel
 */
router.patch(
  "/update-apparel/:uCode/:size",
  validate({ body: updateApparelSchema }),
  validateUpdateApparelParams,
  updateApparel,
);

/**
 * Update Bulk Apparels endpoint
 * @body [{
    "uCode": string,
    "size": string, // small/medium/large/xLarge
    "quantity": number,
    "price": number
}]
 * @return {Object} the success message if updated successfully
 */
router.patch(
  "/update-apparels",
  validate({ body: bulkUpdateApparelSchema }),
  updateApparels,
);

/**
 * Validate an order if it can be fulfilled.
 * @body [{
    "uCode": string,
    "size": string, // small/medium/large/xLarge
    "quantity": number
}]
 * @return {Object} the success message if order can be fulfilled
 */
router.post(
  "/validate-order",
  validate({ body: validateOrderSchema }),
  validateOrder,
);

/**
 * Lowest cost at which an order can be fullfilled. Minimum priced product
 * @return {Object} the minimum price at which an order can be fulfilled
 */
router.get("/get-min-price", getMinPrice);

export default router;
