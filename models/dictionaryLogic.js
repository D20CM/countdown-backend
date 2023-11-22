//test that query parameters can be passed back and forth
import { dictionaryObject } from "../dictionaryObject.js";
import { checkDefinition } from "../API/dictionaryAPI.js";

export async function handleLetters(letters) {
  let lettersArray = letters.split("");

  function checkRepeats(lettersArray) {
    let repeatedLetters = [];
    for (let i = 0; i < lettersArray.length; i++) {
      if (
        lettersArray.indexOf(lettersArray[i]) !==
        lettersArray.lastIndexOf(lettersArray[i])
      ) {
        repeatedLetters.push(lettersArray[i]);
      }
    }
    return repeatedLetters;
  }

  const repeatedLetters = checkRepeats(lettersArray);
  console.log(repeatedLetters);

  //create an object of repeated letters (key) and how many times they occur (value)
  let repeatedLettersObj = {};
  for (let i = 0; i < repeatedLetters.length; i++) {
    if (repeatedLettersObj.hasOwnProperty(repeatedLetters[i])) {
      repeatedLettersObj[repeatedLetters[i]] =
        repeatedLettersObj[repeatedLetters[i]] + 1;
    } else {
      repeatedLettersObj[repeatedLetters[i]] = 1;
    }
  }
  // return repeatedLettersObj;

  //remove all words longer than 9 letters as they are irrelevant
  let words = Object.keys(dictionaryObject).filter((word) => word.length < 10);

  let definitions = [];

  async function callDictionaryAPI(word) {
    let definition = await checkDefinition(word);
    if (definition === undefined) {
      console.log("falsie log");
      return false;
    } else {
      console.log("New definitions are: ", definitions);
      // setDefinitions((definitions) => {
      //   return { ...definitions, [word]: definition };
      // });
      definitions.push({ [word]: definition });
      console.log("truthie log");

      return true;
    }
  }

  // console.log("DEFINITIONS ", definitions);

  //filter out any words that are not defined by the Mirriam-Webster dictionary

  async function filterWordsByPresenceOfDefinition(words) {
    //   //combine map and filter to achieve async filtering - https://advancedweb.hu/how-to-use-async-functions-with-array-filter-in-javascript/ (Tamas Sallai)
    //   //create an array of true/false from checkDefinition (actually promises) myUnresolvedPromises = words.map(checkDefinition)
    // Promise all to await resolutions wordsThatHaveDefinitions = await Promise.all(words.map(checkDefinition))
    //   //filter the words array by index of checked words filteredWords = words.filter((word, index) => wordsThatHaveDefinitions[index])

    console.log("INITIAL WORDS:", words);
    let definedWords = {};
    for (let i = 0; i < words.length; i++) {
      const resultOfApiCall = await callDictionaryAPI(words[i]);
      const definition = resultOfApiCall;
      if (definition) {
        definedWords[words[i]] = definition;
        console.log("new definition ", definition);
      }
    }

    console.log("WHERE ARE MY WORDS", definedWords);

    // let wordsThatHaveDefinitions = await Promise.all(
    //   words.map(async (word) => await callDictionaryAPI(word))
    // );
    // console.log("Words that have definitions: ", wordsThatHaveDefinitions);

    // const definedWords = words.filter(
    //   (word, index) => wordsThatHaveDefinitions[index]
    // );
    // console.log("Defined words are: ", definedWords);
    // return definedWords;
    return words;
  }

  async function startChecking() {
    //clear previous definitions
    definitions = [];

    //check that all 9 tiles have a letter in them
    //this will be done on front-end, but could also revalidate here??
    //todo - make this check that only letters are allowed (regex)

    //starting with 9 letter words...
    let results = words.filter(
      (word) => word.length === 9 && wordscore(word) === 9
    );

    //call function to check for definitions and filter out any words without a definition
    results = await filterWordsByPresenceOfDefinition(results);
    console.log("nine-letter filtered by definition results: ", results);
    //   //...if no valid nine letter words are present then progressively check for smaller valid words

    for (let i = 8; i > 0; i--) {
      if (results.length === 0) {
        results = words.filter(
          (word) => word.length === i && wordscore(word) === i
        );
        results = await filterWordsByPresenceOfDefinition(results);
      }
      // console.log(results);
    }
    return results;
  }

  //   //score the words taking into account repeated letters
  function wordscore(word) {
    let score = 0;

    if (repeatedLetters.length > 0) {
      for (const repeatedLetter in repeatedLettersObj) {
        //count how many times the letter is present in the word
        if (
          word.split(repeatedLetter).length - 1 ===
          repeatedLettersObj[repeatedLetter]
        ) {
          //score if all repeats are used - how best to count only partial uses of repeats?

          score += repeatedLettersObj[repeatedLetter];
        } else if (
          //this will handle up to 4 repeats of a particular letter
          word.split(repeatedLetter).length - 1 ===
            repeatedLettersObj[repeatedLetter] - 1 &&
          repeatedLettersObj[repeatedLetter] > 0
        ) {
          score += repeatedLettersObj[repeatedLetter] - 1;
        } else if (
          word.split(repeatedLetter).length - 1 ===
            repeatedLettersObj[repeatedLetter] - 2 &&
          repeatedLettersObj[repeatedLetter] > 0
        ) {
          score += repeatedLettersObj[repeatedLetter] - 2;
        } else if (
          word.split(repeatedLetter).length - 1 ===
            repeatedLettersObj[repeatedLetter] - 3 &&
          repeatedLettersObj[repeatedLetter] > 0
        ) {
          score += repeatedLettersObj[repeatedLetter] - 3;
        }
      }
    }

    //the second condition in the lines below will skip scoring of (repeated) letters that have already been scored above
    //skip scoring of letters already scored as repeated letters, otherwise score a letter
    for (let i = 0; i < letters.length; i++) {
      if (word.includes(letters[i]) && !repeatedLetters.includes(letters[i])) {
        score++;
      }
    }

    return score;
  }

  let results = await startChecking();
  console.log("Results to be sent back to frontend are: ", results);
  return results;
}
