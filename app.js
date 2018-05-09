var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: null,
    appPassword: null
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("Jag förstår inte vad du menar med: %s", session.message.text);
});


bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        const hello = new builder.Message()
            .address(message.address)
            .text("Hej! Jag är PartyBoten, sugen på fest? Fråga då efter min Hjälp.");
        bot.send(hello);
    }
});

// Text messages
bot.dialog('helpDialog', function (session) {
    session.endDialog("Okej... du vill ha min hjälp. Hur många vill du bjuda till festen? Skriv: 'Boka'... eller 'Hejdå' för att lämna mig :(");
}).triggerAction({ matches: 'Hjälp' });

// bot.dialog('bokaDialog', function (session) {
//     session.endDialog("Hur många vill du att jag bjuder in?");
// }).triggerAction({ matches: 'Boka' });

bot.dialog('okDialog', function (session) {
    session.endDialog("Du kan vara... ok!");
}).triggerAction({ matches: 'Ok' });

// Prompts
bot.dialog('ticketsDialog', [
    function (session) {
        builder.Prompts.text(session, 'Hur många biljetter vill du reservera?');
    },
    function (session, results) {
        console.log(results);
        session.endDialog(`Perfekt! Nu har jag reserverat: ${results.response} biljetter`);
    }
]).triggerAction({ matches: 'Boka' });

bot.endConversationAction('goodbyeAction', "Okej... See you later aligator.", { matches: 'Hejdå' });

bot.recognizer({
    recognize: function (context, done) {
        var intent = { score: 0.0 };

        if (context.message.text) {
            switch (context.message.text.toLowerCase()) {
                case 'hjälp' :
                    intent = { score: 1.0, intent: 'Hjälp' };
                    break;
                case 'boka' :
                    intent = { score: 1.0, intent: 'Boka' };
                    break;
                case 'ok' :
                    intent = { score: 1.0, intent: 'Ok' };
                    break;
                case 'hejdå' :
                    intent = { score: 1.0, intent: 'Hejdå' };
                    break;
            }
        }
        done(null, intent);
    }
});