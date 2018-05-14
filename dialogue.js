
// Gränsnittet för kod under stationen
// Frågorna fylls i under stationsaktivitet
// TODO: bestäm startmallformat för stationen + konsekens och samma språk igenom denna sida + övriga förbättringar vi hinner med.

var introText = "Här skrivs en hälsning";
var otydligText = "Här skrivs svar på okänd fråga %s";

var intents = [

  {
    intent: "enkel fråga",
    response: "Direkt svar"
  },

  {
    intent: "fråga med svar",
    response: "Prompt för input",
    action: (results) => `Svar med input: ${results.response}`
  }

];

module.exports = {
  introText,
  otydligText,
  intents
};
