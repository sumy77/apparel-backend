export interface SizeT {
  quantity: number;
  price: number;
}

interface Sizes {
  small?: SizeT;
  medium?: SizeT;
  large?: SizeT;
  xLarge?: SizeT;
}

export interface ApparelT {
  title: string;
  uCode: string;
  sizes: Sizes;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface ValidateApparelT {
  uCode: string;
  size: string;
  quantity: number;
}

export interface BulkApparelT extends ValidateApparelT {
  price: number;
}

export interface TitleSizeT {
  title: string;
  sizes: Sizes;
}

interface ErrorBodyI {
  instancePath: string;
  schemaPath: string;
  keyword: string;
  params: {
    type: string;
  };
  message: string;
}

export interface ErrorResponseI {
  errors: {
    body: ErrorBodyI[];
  };
}

export interface ApparelRequestI {
  type: "object";
  properties: {
    title: { type: "string" };
    sizes: {
      type: "object";
      patternProperties: {
        "^[a-zA-Z]+$": {
          type: "object";
          properties: {
            quantity: { type: "number" };
            price: { type: "number" };
          };
          required: ["quantity", "price"];
        };
      };
      additionalProperties: false;
    };
  };
  required: ["title", "sizes"];
}

export interface UpdateApparelI {
  type: "object";
  properties: {
    quantity: { type: "number" };
    price: { type: "number" };
  };
  required: ["quantity", "price"];
  additionalProperties: false;
}

export interface UpdateBulkApparelI {
  type: "array";
  items: {
    type: "object";
    properties: {
      uCode: { type: "string" };
      size: { type: "string" };
      quantity: { type: "integer" };
      price: { type: "number" };
    };
    required: ["uCode", "size", "quantity", "price"];
  };
}

export interface ValidateOrderI {
  type: "array";
  items: {
    type: "object";
    properties: {
      uCode: { type: "string" };
      size: { type: "string" };
      quantity: { type: "integer" };
    };
    required: ["uCode", "size", "quantity"];
  };
}
