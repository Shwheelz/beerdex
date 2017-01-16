'use strict';

var Alexa = require('alexa-sdk');
var APP_ID = "amzn1.ask.skill.98813fb5-42a4-461f-837e-8a4bf4b01759";
var items = require('./items');

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
    'ItemIntent': function () {
        var itemSlot = this.event.request.intent.slots.item;
        var itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }

        var cardTitle = this.t("DISPLAY_CARD_TITLE", this.t("SKILL_NAME"), itemName);
        var items = this.t("ITEMS");
        var item = items[itemName];

        if (item) {
            this.attributes['speechOutput'] = item;
            this.emit(':tellWithCard', this.attributes['speechOutput'], cardTitle, item);
        } else {
            var speechOutput = this.t("ITEM_NOT_FOUND_MESSAGE");
            var repromptSpeech = this.t("ITEM_NOT_FOUND_REPROMPT");
            if (itemName) {
                speechOutput += this.t("ITEM_NOT_FOUND_WITH_ITEM_NAME", itemName);
            } else {
                speechOutput += this.t("ITEM_NOT_FOUND_WITHOUT_ITEM_NAME");
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
            "ITEMS" : items.items,
            "SKILL_NAME" : "Item Dex",
            "WELCOME_MESSAGE": "Welcome to %s. You can ask a question like, what\'s a hyper potion? ... Now, what can I help you with.",
            "WELCOME_REPROMT": "For instructions on what you can say, please say help me.",
            "DISPLAY_CARD_TITLE": "%s  -  %s.",
            "HELP_MESSAGE": "You can ask for the description of an item by saying, what\'s a max revive, or, you can say exit...Now, what can I help you with?",
            "HELP_REPROMT": "You also ask for more rare items, for example, say, what\'s a power anklet, or you can say exit...Now, what can I help you with?",
            "STOP_MESSAGE": "Goodbye!",
            "ITEM_REPEAT_MESSAGE": "Try saying repeat.",
            "ITEM_NOT_FOUND_MESSAGE": "I\'m sorry, I currently do not know ",
            "ITEM_NOT_FOUND_WITH_ITEM_NAME": "the item %s. ",
            "ITEM_NOT_FOUND_WITHOUT_ITEM_NAME": "that item. ",
            "ITEM_NOT_FOUND_REPROMPT": "What else can I help with?"
        }
    }
};