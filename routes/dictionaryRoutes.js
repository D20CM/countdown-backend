import express from "express";
const router = express.Router();

/* GET users listing. */
// router.get("/", function (req, res, next) {
//   res.json({ message: "I wish we had some information to give you ☹️" });
// });

// router.get("/dictionary", async function (req, res) {
//   // let allSongs = await getAllSongs();
//   // res.json(allSongs);
//   // call a function and res.json the response
//   res.send({ message: "connected somehow" });
// });

router.get("/dictionary", async function (req, res) {
  let letters = req.query.letters;
  let lettersArray = letters.split("");
  console.log(typeof lettersArray);
  res.json({ message: "letters recieved", letters: { lettersArray } });
  // let id = Number(req.params.id);
  // let selectedSong = await getSongByID(id);
  // res.json(selectedSong);
  // call a function with parameters and res.json the response
});

export default router;
