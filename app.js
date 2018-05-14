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
  if (message.membersAdded[0].name == 'Bot') {
    console.log(message);
    const hello = new builder.Message()
      .address(message.address)
      .text(dialogue.introText);
    bot.send(hello);
  }
});


dialogue.fragor.forEach(function(fragaItem) {
  if (fragaItem.action) {
    // Question dialogue with value returned in response
    bot.dialog(fragaItem.fraga + 'Dialog', [
      function(session) {
        builder.Prompts.text(session, fragaItem.svar)
      },
      function(session, results) {
        session.endDialog(fragaItem.action(results));
      }
    ]).triggerAction({ matches: fragaItem.fraga });
  } else {
    // Simple response dialogue.
    bot.dialog(fragaItem.fraga + 'Dialog', function(session) {
      session.endDialog(fragaItem.svar);
    }).triggerAction({ matches: fragaItem.fraga });
  }
});


bot.recognizer({
  recognize: function(context, done) {
    var fraga = { score: 0.0 };

    if (context.message.text) {
      dialogue.fragor.forEach(function(fragaItem) {
        if (context.message.text.toLowerCase() === fragaItem.fraga) {
          fraga = { score: 1.0, intent: fragaItem.fraga };
        }
      });

    }
    done(null, fraga);
  }
});
