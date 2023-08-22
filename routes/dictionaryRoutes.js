import express from "express";
import { handleLetters } from "../models/dictionaryLogic.js";
const router = express.Router();

router.get("/dictionary", async function (req, res) {
  let letters = await handleLetters(req.query.letters);
  res.json({ message: "letters recieved", letters: { letters } });
});

export default router;
