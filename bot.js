var SteamCommunity = require('steamcommunity');
var SteamTotp = require("steam-totp");
var steam = new SteamCommunity();
var TradeOfferManager = require('steam-tradeoffer-manager');
var manager = new TradeOfferManager({
  "domain": "xxxxxxx.net", //your domain API KEY
  "language": "en",
  "pollInterval": 30000
});

var logOnOptions = {
	'accountName': "account", //your username
	'password': "pass", //your pass
	'twoFactorCode': SteamTotp.generateAuthCode("xxxxxxxx") //your authcode
};

var identitySecret = "xxxxxxxxxx"; //your identity secret

//Login
steam.login(logOnOptions, function(err, sessionID, cookies, steamguard) {
	if (err) {
		console.log("There was an error logging in! Error details: " + err.message);
		process.exit(1); //terminates program
	} else {
		console.log("Successfully logged in as " + logOnOptions.accountName);
		steam.chatLogon();
		manager.setCookies(cookies, function(err) {
			if (err) {
				console.log(err);
				process.exit(1);
			}
		});
	}
	steam.startConfirmationChecker(10000, identitySecret); //Auto-confirmation enabled!
});

manager.on('newOffer', processTrade);

function processTrade(offer) {
	console.log("New trade from " + offer.partner);
	var toGet = offer.itemsToReceive;
	var toGive = offer.itemsToGive;
	if (toGive.length == 0 || offer.partner.getSteamID64() === "xxxxxxxxxxxx") {
		offer.accept(function(err) {
			if (err) {
				console.log("Error accepting offer: " + err.message);
			} else {
				console.log("Successfully accepted an offer.");
			}
		});
	} else {
		offer.decline(function(err) {
			if (err) {
				console.log("Error declining offer: " + err.message);
			} else {
				console.log("Declining an offer.");
			}
    });
  }
}
