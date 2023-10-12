//api call

export async function checkDefinition(word) {
  console.log("Looking up definition of: " + word);

  const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${process.env.API_KEY}`;
  const response = await fetch(url);
  const wordInfo = await response.json();
  const definition = wordInfo[0].shortdef;
  console.log("Definition of '" + word + "' is: " + definition);

  return definition;
}

// checkDefinition("test");
