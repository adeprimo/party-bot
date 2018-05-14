
// Gränsnittet för kod under stationen
// Frågorna fylls i under stationsaktivitet
// TODO: bestäm startmallformat för stationen + konsekens och samma språk igenom denna sida + övriga förbättringar vi hinner med.

var introText = "Hej";
var otydligText = "Va?";

var fragor = [

  {
    fraga: "",
    svar: ""
  },

  {
    fraga: "a",
    svar: "a",
    action: (bot) => `Svar: ${bot.response}`
  }

];

module.exports = {
  introText,
  otydligText,
  fragor
};
