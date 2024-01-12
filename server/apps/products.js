import { Router } from "express";
import db from "./db/conn.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  const collection = await db.collection("products");
  const products = await collection.find({}).toArray();
  res.json({ data: products })
});

productRouter.get("/:id", async (req, res) => {
  const collection = await db.collection("products");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.json({ data: result }).status(200);

});

productRouter.post("/", async (req, res) => {
  const collection = await db.collection("products");
  const newProduct = req.body;
  const result = await collection.insertOne(newProduct);
  res.json({
    "message": "Product has been created successfully"
  })

});

productRouter.put("/:id", async (req, res) => {
  const collection = await db.collection("products");
  const query = { _id: new ObjectId(req.params.id) };
  const update = { $set: req.body };
  const result = await collection.updateOne(query, update);
  res.json({
    "message": "Product has been updated successfully"
  });
});

productRouter.delete("/:id", async (req, res) => {
  const collection = await db.collection("products");
  const query = { _id: new ObjectId(req.params.id) };

  let result = await collection.deleteOne(query);

  if (result.deletedCount === 1) {
    res.json(
      {
        "message": "Product has been deleted successfully"
      })
  }
  else {
    res.json({
      "message": "Nothing to delete with id: " + req.params.id
    })
  }

});

export default productRouter;
