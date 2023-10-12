import express from "express";
import { handleLetters } from "../models/dictionaryLogic.js";
const router = express.Router();

router.get("/dictionary", async function (req, res) {
  let results = await handleLetters(req.query.letters);
  res.json({
    message: "results",
    results: { results },
  });
});

export default router;
