import { type Request, type Response } from "express";
import generateUniqueId from "generate-unique-id";
import {
  type BulkApparelT,
  type ApparelT,
  type ValidateApparelT,
  type SizeT,
} from "../models/types";
import JSONdb from "simple-json-db";
import _ from "lodash";
const db = new JSONdb("./src/database/apparel.json");

export const createApparel = (req: Request, res: Response): void => {
  try {
    const { title, sizes } = req.body;
    const uCode = generateUniqueId();
    const newApparel: ApparelT = {
      title,
      uCode,
      sizes,
      createdAt: new Date(),
      updatedAt: null,
    };

    db.set(uCode, newApparel);

    res.send({ message: "New apparel added", result: newApparel });
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const updateApparel = (req: Request, res: Response): Response => {
  try {
    const { uCode, size } = req.params;
    const apparelToUpdate = db.get(uCode);

    if (apparelToUpdate == null) {
      return res
        .status(404)
        .send({ error: "Apparel with specified code was not found" });
    }
    apparelToUpdate.sizes[size] = req.body;
    apparelToUpdate.updatedAt = new Date();
    db.set(uCode, apparelToUpdate);
    return res.send({
      message: "Apparel updated successfully",
      result: apparelToUpdate,
    });
  } catch (e) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export const updateApparels = (req: Request, res: Response): Response => {
  try {
    for (const i in req.body) {
      const obj: BulkApparelT = req.body[i];
      const apparelToUpdate = db.get(obj.uCode);
      if (!apparelToUpdate) {
        return res.status(404).send({
          error: `Apparel with specified code ${obj.uCode} was not found`,
        });
      }
      if (!apparelToUpdate.sizes[obj.size]) {
        apparelToUpdate.sizes[obj.size] = {};
      }
      apparelToUpdate.sizes[obj.size].quantity = obj.quantity;
      apparelToUpdate.sizes[obj.size].price = obj.price;
      apparelToUpdate.updatedAt = new Date();
      db.set(obj.uCode, apparelToUpdate);
    }
    return res.send({ message: "Apparels updated sucessfully" });
  } catch (e) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export const validateOrder = (req: Request, res: Response): Response => {
  try {
    for (const i in req.body) {
      const obj: ValidateApparelT = req.body[i];

      const apparelToUpdate: ApparelT = db.get(obj.uCode);
      if (!apparelToUpdate) {
        return res.status(404).send({
          error: `Apparel with specified code ${obj.uCode} is not found`,
        });
      }
      const sizeObj = _.get(apparelToUpdate.sizes, obj.size);
      if (!sizeObj) {
        return res
          .status(404)
          .send({ error: `Size for apparel ${obj.uCode} not found` });
      }
      if (sizeObj.quantity < obj.quantity) {
        return res.status(400).send({
          error: `Order cannot be fulfilled for apparel ${obj.uCode}`,
        });
      }
    }
    return res.send({ message: "Order fulfilled" });
  } catch (e) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export const getMinPrice = (req: Request, res: Response): Response => {
  try {
    const data = db.JSON();
    if (_.isEmpty(data)) {
      return res.status(404).send({
        message: `No apparel found`,
      });
    }
    const prices: number[] = [];
    for (const code in data) {
      const obj: ApparelT = data[code];
      for (const size in obj.sizes) {
        const parseSize: SizeT = _.get(obj.sizes, size);
        if (parseSize.quantity > 0) {
          prices.push(parseSize.price);
        }
      }
    }
    const minPrice = Math.min(...prices);
    return res.send({
      message: `Minimum product price is ${minPrice}`,
      result: minPrice,
    });
  } catch (e) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};
