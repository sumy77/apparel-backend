import {
  type ApparelRequestI,
  type UpdateApparelI,
  type UpdateBulkApparelI,
  type ValidateOrderI,
} from "../models/types";

export const createApparelSchema: ApparelRequestI = {
  type: "object",
  properties: {
    title: { type: "string" },
    sizes: {
      type: "object",
      patternProperties: {
        "^[a-zA-Z]+$": {
          type: "object",
          properties: {
            quantity: { type: "number" },
            price: { type: "number" },
          },
          required: ["quantity", "price"],
        },
      },
      additionalProperties: false,
    },
  },
  required: ["title", "sizes"],
};

export const updateApparelSchema: UpdateApparelI = {
  type: "object",
  properties: {
    quantity: { type: "number" },
    price: { type: "number" },
  },
  required: ["quantity", "price"],
  additionalProperties: false,
};

export const bulkUpdateApparelSchema: UpdateBulkApparelI = {
  type: "array",
  items: {
    type: "object",
    properties: {
      uCode: { type: "string" },
      size: { type: "string" },
      quantity: { type: "integer" },
      price: { type: "number" },
    },
    required: ["uCode", "size", "quantity", "price"],
  },
};

export const validateOrderSchema: ValidateOrderI = {
  type: "array",
  items: {
    type: "object",
    properties: {
      uCode: { type: "string" },
      size: { type: "string" },
      quantity: { type: "integer" },
    },
    required: ["uCode", "size", "quantity"],
  },
};
