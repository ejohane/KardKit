var playerNames = ["P1","P2","P3"];
var playerPoints = ["10","20","30"];

var completeActionlistNames = ["play","slap","draw","takeCard"];
var completeActionlistLabels = ["PLAY","SLAP","DRAW","TAKE CARD"];
var completeActionlistKeyCodes = [112,32,100,116];
var completeActionlistKeyLabels = ["Key: P","Spacebar","Key: D","Key: T"];
var actionsToGive = [1,0,1,1];

var hand_0 = [];
var hand_1 = [["5","spades"],[null,null]];
var hand_2 = [[null,null],["3","spades"]];
var hands = [hand_0,hand_1,hand_2];


// lets begin the demo of UI functions called from the server.....


/*   should be called first to ensure all HTML that is not specific to players is taken care of, right now it only takes the actionbar stuff
     but I called it "setUIFramework" so we/end-user can know this is high priority... 
     
     this is the only thing I would make sure to call first before adding the first player/host player
------------------------------------------------------------------------------------------------------*/     
clientInterface.setUIFramework(completeActionlistNames,completeActionlistLabels,completeActionlistKeyCodes,completeActionlistKeyLabels);


/*the order from here is completely interchangable and can be done whenever you want/however many times you want
-----------------------------------------------------------------*/

clientInterface.setActions(actionsToGive); // see how we remove action "slap" by setting the flags? 

clientInterface.receiveInboxMessage("this is a regular inbox message");             
clientInterface.receivePrivateMessage("this was sent as a private inbox message");  
clientInterface.receiveOutboxConfirmation("this is an outbox message");             

clientInterface.addPlayer(playerNames[0]); //notice that we do not need to call "setHand" or any other function after adding a player. 

clientInterface.addPlayer(playerNames[1]); 
clientInterface.setHand(1,hands[1]);            
clientInterface.setPoints(1,playerPoints[1]);

clientInterface.addPlayer(playerNames[2]);
clientInterface.setHand(2,hands[2]);
clientInterface.setPoints(2,playerPoints[2]);

clientInterface.removePlayer(1); //simulate P2 leaving the game, notice that the UI can work just fine and retain player position on table

/*  let's demo the rest of the functions that can be called on a player, I keep using playerId = 0 for convenience...
-------------------------------------------------------------------------------------------------------------------------------*/
//  addCard     , give P1 a card
clientInterface.addCard(0,["7","hearts"]); //notice that P1 has an empty hand, you can either say "setHand" or "addCard" to accomplish same thing!
// 2. draw        , P1 requested Draw
//    draw        , P1 requested Draw again, now has three cards
clientInterface.draw(0,["2","diamonds"]);
clientInterface.draw(0,["2","clubs"]);


// 3. removeCard  , remove third card from P1
clientInterface.removeCard(0,2);

// 4. discard     , P1 requested Discard on second card
clientInterface.discard(0,1);

// 5. takeCard , P3 requested takeCard action,  taking from P1 , P1 has no cards now
clientInterface.takeCard(0,0,2,["7","hearts"]);

//  P1 requested takeCard action to get his card back. test that takeCard action can work with empty hand
clientInterface.takeCard(2,2,0,["7","hearts"]);
clientInterface.setHandCount(0,1);
