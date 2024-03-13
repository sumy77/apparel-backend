import request from "supertest";

import app from "../../src/index";

describe("Create Apparel route", () => {
  it("should throw 400 error if no request parameters passed", async () => {
    const res = await request(app).post("/create-apparel");
    expect(res.body).toHaveProperty("errors");
    expect(res.status).toBe(400);
  });

  it("should throw 400 error if invalid request parameters passed", async () => {
    const apparelData = {
      title: "New Apparel",
      sizes: {
        small: {
          quantity: "25",
          price: 50,
        },
      },
    };
    const res = await request(app).post("/create-apparel").send(apparelData);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
  });

  it("should create apparel successfully", async () => {
    const apparelData = {
      title: "New Apparel",
      sizes: {
        small: {
          quantity: 25,
          price: 50,
        },
      },
    };
    const res = await request(app).post("/create-apparel").send(apparelData);
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("New apparel added");
    expect(res.body.result).toHaveProperty("uCode");
    expect(res.body.result.title).toEqual("New Apparel");
  });
});

describe("Update Apparel route", () => {
  it("should throw 400 error if no request parameters passed", async () => {
    const res = await request(app).patch(
      "/update-apparel/bi10mi9n3cv0j44ijkf9/small",
    );
    expect(res.body).toHaveProperty("errors");
    expect(res.status).toBe(400);
  });

  it("should throw 400 error if invalid request parameters passed", async () => {
    const apparelData = {
      quantity: 20,
      price: "80",
    };
    const res = await request(app)
      .patch("/update-apparel/bi10mi9n3cv0j44ijkf9/small")
      .send(apparelData);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
  });

  it("should throw 400 error if invalid size passed in url parameters", async () => {
    const apparelData = {
      quantity: 20,
      price: 80,
    };
    const res = await request(app)
      .patch("/update-apparel/bi10mi9n3cv0j44ijkf9/smalll")
      .send(apparelData);
    expect(res.status).toBe(400);
    expect(res.body.error).toEqual("Invalid size parameter");
  });

  it("should throw 400 error if invalid unique code passed in url parameters", async () => {
    const apparelData = {
      quantity: 20,
      price: 80,
    };
    const res = await request(app)
      .patch("/update-apparel/bi10mi9n3cv0j44ijkf/small")
      .send(apparelData);
    expect(res.status).toBe(404);
    expect(res.body.error).toEqual("Apparel with specified code was not found");
  });

  it("should update apparel successfully", async () => {
    const apparelData = {
      quantity: 20,
      price: 70,
    };
    const res = await request(app)
      .patch("/update-apparel/bi10mi9n3cv0j44ijkf9/small")
      .send(apparelData);
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("Apparel updated successfully");
    expect(res.body.result).toHaveProperty("uCode");
    expect(res.body.result.sizes.small.price).toEqual(70);
    expect(res.body.result.sizes.small.quantity).toEqual(20);
  });
});

describe("Update Bulk Apparels route", () => {
  it("should throw 400 error if no request parameters passed", async () => {
    const res = await request(app).patch("/update-apparels");
    expect(res.body).toHaveProperty("errors");
    expect(res.status).toBe(400);
  });

  it("should throw 404 error if invalid unique code passed", async () => {
    const apparelData = [
      {
        uCode: "bi10mi9n3cv0j44ijkf99",
        size: "small",
        quantity: 20,
        price: 89,
      },
    ];
    const res = await request(app).patch("/update-apparels").send(apparelData);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual(
      "Apparel with specified code bi10mi9n3cv0j44ijkf99 was not found",
    );
  });

  it("should throw 400 error if invalid request paramter passed", async () => {
    const apparelData = [
      {
        uCode: "bi10mi9n3cv0j44ijkf9",
        size: "small",
        quantity: "20",
        price: 89,
      },
    ];
    const res = await request(app).patch("/update-apparels").send(apparelData);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
  });

  it("should bulk update apparels successfully", async () => {
    const apparelData = [
      {
        uCode: "bi10mi9n3cv0j44ijkf9",
        size: "small",
        quantity: 20,
        price: 79,
      },
    ];
    const res = await request(app).patch("/update-apparels").send(apparelData);
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("Apparels updated sucessfully");
  });
});

describe("Validate Order route", () => {
  it("should throw 400 error if no request parameters passed", async () => {
    const res = await request(app).post("/validate-order");
    expect(res.body).toHaveProperty("errors");
    expect(res.status).toBe(400);
  });

  it("should throw 404 error if invalid unique code passed", async () => {
    const apparelData = [
      {
        uCode: "bi10mi9n3cv0j44ijkf99",
        size: "small",
        quantity: 20,
      },
    ];
    const res = await request(app).post("/validate-order").send(apparelData);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual(
      "Apparel with specified code bi10mi9n3cv0j44ijkf99 is not found",
    );
  });

  it("should throw 400 error if invalid request paramter passed", async () => {
    const apparelData = [
      {
        uCode: "bi10mi9n3cv0j44ijkf9",
        size: "small",
        quantity: "20",
      },
    ];
    const res = await request(app).post("/validate-order").send(apparelData);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
  });

  it("should throw 400 error if invalid request paramter passed", async () => {
    const apparelData = [
      {
        uCode: "bi10mi9n3cv0j44ijkf9",
        size: "small",
        quantity: 200,
      },
    ];
    const res = await request(app).post("/validate-order").send(apparelData);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual(
      "Order cannot be fulfilled for apparel bi10mi9n3cv0j44ijkf9",
    );
  });

  it("should fulfill the order successfully as requested quantity of product is less than it is there in inventory", async () => {
    const apparelData = [
      {
        uCode: "bi10mi9n3cv0j44ijkf9",
        size: "small",
        quantity: 2,
      },
    ];
    const res = await request(app).post("/validate-order").send(apparelData);
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("Order fulfilled");
  });
});
