'use strict';

var Alexa = require('alexa-sdk');
var APP_ID = "amzn1.ask.skill.29a71dff-d39a-4176-bbea-03900647618f";
var beers = require('./beers');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.attributes['speechOutput'] = this.t("WELCOME_MESSAGE", this.t("SKILL_NAME"));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes['repromptSpeech'] = this.t("WELCOME_REPROMT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'GetBeerIntent': function () {
        var beerSlot = this.event.request.intent.slots.beer;
        var beerName;
        if (beerSlot && beerSlot.value) {
            beerName = beerSlot.value.toLowerCase();
        }

        var cardTitle = this.t("DISPLAY_CARD_TITLE", this.t("SKILL_NAME"), beerName);
        var beers = this.t("BEERS");
        var beer = beers[beerName];

        if (beer) {
            this.attributes['speechOutput'] = beer;
            this.emit(':tellWithCard', this.attributes['speechOutput'], cardTitle, beer);
        } else {
            var speechOutput = this.t("BEER_NOT_FOUND_MESSAGE");
            var repromptSpeech = this.t("BEER_NOT_FOUND_REPROMPT");
            if (beerName) {
                speechOutput += this.t("BEER_NOT_FOUND_WITH_BEER_NAME", beerName);
            } else {
                speechOutput += this.t("BEER_NOT_FOUND_WITHOUT_BEER_NAME");
            }
            speechOutput += repromptSpeech;

            this.attributes['speechOutput'] = speechOutput;
            this.attributes['repromptSpeech'] = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
        this.attributes['repromptSpeech'] = this.t("HELP_REPROMT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest':function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    }
};

var languageStrings = {
    "en-US": {
        "translation": {
            "BEERS" : beers.beers,
            "SKILL_NAME" : "Beer Dex",
            "WELCOME_MESSAGE": "Welcome to %s. You can ask a question like, what\'s a wheat beer? ... Now, what can I help you with.",
            "WELCOME_REPROMT": "For instructions on what you can say, please say help me.",
            "DISPLAY_CARD_TITLE": "%s  -  %s.",
            "HELP_MESSAGE": "You can ask for the description of a beer by saying, what\'s a wheat beer, or, you can say exit...Now, what can I help you with?",
            "HELP_REPROMT": "You also ask for different styles of beers, for example, say, what\'s a cream beer, or you can say exit...Now, what can I help you with?",
            "STOP_MESSAGE": "Goodbye!",
            "BEER_REPEAT_MESSAGE": "Try saying repeat.",
            "BEER_NOT_FOUND_MESSAGE": "I\'m sorry, I currently do not know ",
            "BEER_NOT_FOUND_WITH_BEER_NAME": "the beer %s. ",
            "BEER_NOT_FOUND_WITHOUT_BEER_NAME": "that beer. ",
            "BEER_NOT_FOUND_REPROMPT": "What else can I help with?"
        }
    }
};