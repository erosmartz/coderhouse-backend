import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8080/api/products");
    const products = response.data;

    // Render home.handlebars
    res.render("home", {
      products,
      style: "home.css",
    });
  } catch (err) {
    console.error("Error retrieving products:", err);
    res.status(500).json({ error: "Error retrieving products" });
  }
});

export default router;
