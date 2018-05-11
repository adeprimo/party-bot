var dialogue = require('./dialogue');
var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
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
var bot = new builder.UniversalBot(connector, function(session) {
  session.send(dialogue.otydligText, session.message.text);
});


bot.on('conversationUpdate', function(message) {
  if (message.membersAdded) {
    const hello = new builder.Message()
      .address(message.address)
      .text(dialogue.introText);
    bot.send(hello);
  }
});


// Simple dialogues
dialogue.intents.forEach(function(intentItem) {
  bot.dialog(intentItem.intent + 'Dialog', function(session) {
    if (intentItem.action) {
      // Dialogue with waterfall
      session.beginDialog(intentItem.action);
    } else {
      // Simple response dialogue
      session.endDialog(intentItem.response);
    }
  }).triggerAction({ matches: intentItem.intent });
});


// Prompts
bot.dialog('ticketsDialog', [
  function(session) {
    builder.Prompts.text(session, 'Hur många biljetter vill du reservera?');
  },
  function(session, results) {
    var amount = results.response;
    var isNum = /^\d+$/.test(amount);

    if (isNum) {
      session.endDialog(`Perfekt! Nu har jag reserverat: ${amount} biljetter`);
    } else {
      session.endDialog(`Mäh! ${amount} är ingen siffra... Inga problem, vi försöker igen!`);
      session.beginDialog('ticketsDialog');
    }
  }
]);


bot.recognizer({
  recognize: function(context, done) {
    var intent = { score: 0.0 };

    if (context.message.text) {
      dialogue.intents.forEach(function(intentItem) {
        if (context.message.text.toLowerCase() === intentItem.intent) {
          intent = { score: 1.0, intent: intentItem.intent };
        }
      });

    }
    done(null, intent);
  }
});
