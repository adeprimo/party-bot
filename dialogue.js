var introText = "Hej! Jag är PartyBoten, sugen på fest? Fråga då efter min Hjälp.";

var otydligText = "Jag förstår inte vad du menar med: %s";

var intents = [
  {intent: 'hjälp', response: "Okej... du vill ha min hjälp. Hur många vill du bjuda till festen? Skriv: 'Boka'... eller 'Hejdå'"},
  {intent: 'boka', response: "", action: "ticketsDialog"},
  {intent: 'ok', response: "Du kan vara... ok!"},
  {intent: 'hejdå', response: "Okej... See you later aligator."}
]

module.exports = {
  introText,
  otydligText,
  intents
};
