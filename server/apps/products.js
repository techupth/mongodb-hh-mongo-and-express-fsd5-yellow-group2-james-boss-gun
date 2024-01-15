import { Router } from "express";

import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

// productRouter.get("/", async (req, res) => {
//   const collection = db.collection("products");

//   const products = await collection.find({}).limit(10).toArray();
//   console.log(products);
//   return res.json({ data: products });
// });

productRouter.get("/", async (req, res) => {
  const category = req.query.category;
  const keywords = req.query.keywords;

  const query = {};

  if (category) {
    query.category = new RegExp(category, "i");
  }

  if (keywords) {
    query.name = new RegExp(keywords, "i");
  }

  const collection = db.collection("products");

  const products = await collection
    .find(query)
    .limit(10)
    .sort({ createdTime: -1 })
    .toArray();

  return res.json({ data: products });
});

productRouter.get("/:id", async (req, res) => {
  const collection = db.collection("products");

  const productId = new ObjectId(req.params.id);

  const product = await collection.findOne({ _id: productId });
  return res.json({
    data: product,
  });
});

productRouter.post("/", async (req, res) => {
  const collection = db.collection("products");

  const productData = { ...req.body };

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Bangkok",
  };

  productData.createdTime = new Date().toLocaleString("en-US", options);
  const products = await collection.insertOne(productData);

  return res.json({
    message: `Product has been created successfully`,
  });
});

productRouter.put("/:id", async (req, res) => {
  const collection = db.collection("products");

  const productId = new ObjectId(req.params.id);

  const newProductData = { ...req.body };

  await collection.updateOne(
    {
      _id: productId,
    },
    {
      $set: newProductData,
    }
  );
  return res.json({
    message: `Product has been updated successfully`,
  });
});

productRouter.delete("/:id", async (req, res) => {
  const collection = db.collection("products");

  const productId = new ObjectId(req.params.id);

  await collection.deleteOne({
    _id: productId,
  });
  return res.json({
    message: `Product has been deleted successfully`,
  });
});

export default productRouter;
