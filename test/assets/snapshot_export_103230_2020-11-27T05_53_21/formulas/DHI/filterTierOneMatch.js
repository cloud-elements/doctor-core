//Does entry from loopLastNameMatches have the same phone number as entry from getUnlinkedDiceProfileById? There are 3 phone numbers returned from Bullhorn to compare to 1 from Dice
const lastNameMatches = steps.loopLastNameMatches.entry
const unlinkedDiceProfile = steps.getUnlinkedDiceProfileById.response.body
let bullhornPhone1 = lastNameMatches["phone"] ? lastNameMatches["phone"] : "0";
let bullhornPhone2 = lastNameMatches["phoneAlternate"] ? lastNameMatches["phoneAlternate"] : "0";
let bullhornPhone3 = lastNameMatches["phoneAlternate2"] ? lastNameMatches["phoneAlternate2"] : "0";
let dicePhone = unlinkedDiceProfile["phone"] ? unlinkedDiceProfile["phone"] : "1";

// Normalize phone numbers for conditional comparison
const numberPattern = /\d+/g;
bullhornPhone1 = bullhornPhone1.match( numberPattern ).join([]);
bullhornPhone2 = bullhornPhone2.match( numberPattern ).join([]);
bullhornPhone3 = bullhornPhone3.match( numberPattern ).join([]);
dicePhone = dicePhone.match( numberPattern ).join([]);

// Compare bullHorn phone numbers to Dice phone number
if (bullhornPhone1 === dicePhone || bullhornPhone2 === dicePhone || bullhornPhone3 === dicePhone) {
  done(true)
} else {
  done(false)
}