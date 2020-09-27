const Discord = require('discord.js');
const fetch = require("node-fetch");
const fs = require('fs') //importing file save
var moment = require('moment');

const bot = new Discord.Client();

const token = '';

const PREFIX = '!';



function saveUserData(authorId, bet) {
    var xpPath = './datafile.json'
    var xpRead = fs.readFileSync(xpPath);
    var xpFile = JSON.parse(xpRead); //ready for use
    var userId = authorId //user id here
    if (!xpFile[userId]) { //this checks if data for the user has already been created       
        return "Type \"!greendragon\" to get started.";
    } else {
        var currencyVar = Number(xpFile[userId].currency) + Number(bet) //add 50 to their original xp
        xpFile[userId] = { currency: currencyVar, lastClaim: xpFile[userId].lastClaim };
        fs.writeFileSync(xpPath, JSON.stringify(xpFile, null, 2));
    }
}

function slayGreenDragons(authorId) {
    var xpPath = './datafile.json'
    var xpRead = fs.readFileSync(xpPath);
    var xpFile = JSON.parse(xpRead); //ready for use
    var userId = authorId //user id here
    if (!xpFile[userId]) {        //this checks if data for the user has already been created
        xpFile[userId] = { currency: 1000, lastClaim: moment() }; //if not, create it
        fs.writeFileSync(xpPath, JSON.stringify(xpFile, null, 2));
        return "Added 1000 coins.";
    }
    else {
        if (moment().diff(xpFile[userId].lastClaim >= 3600000)) {
            console.log(moment().diff(xpFile[userId].lastClaim));
            var currencyVar = Number(xpFile[userId].currency) + Number(bet) //add 50 to their original xp
            xpFile[userId] = { currency: currencyVar, lastClaim: moment() }; //if not, create it
            fs.writeFileSync(xpPath, JSON.stringify(xpFile, null, 2));
            return "Added 1000 coins.";
        }
        else {
            var minutes = 60 - (moment().diff(xpFile[userId].lastClaim) / 60000).toFixed(0);
            console.log(minutes);

            return "You need to wait for " + {minutes} + "before you can go kill Green Dragons again.";
        }
    }
}

function fetchUserCurrency(authorId, bet, command) {
    var xpPath = './datafile.json'
    var xpRead = fs.readFileSync(xpPath);
    var xpFile = JSON.parse(xpRead); //ready for use
    var userId = authorId //user id here
    if (!xpFile[userId]) { //this checks if data for the user has already been created
        return false;
    } else {
        if (command) {
                return (Number(xpFile[userId].currency));          
        }
        else {
            if (Number(xpFile[userId].currency) >= bet) {
                return true;
            }
            else {
                return false;
            }
        }
    }
}
bot.on('ready', () => {
    bot.user.setActivity('!rules', { type: '' });
})
bot.on('message', msg => {
    let args = msg.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case 'flower':
            try {
                msg.reply(hotOrCold(args[1], msg.author.id, args[2]));
                break;
            } catch (error) {
                console.error(error);
                break;
            }
        case 'rules':
            msg.reply(rules());
            break;
        case 'currency':
            msg.reply(fetchUserCurrency(msg.author.id, 0, true));
            break;
        case 'greendragon':
            msg.reply(slayGreenDragons(msg.author.id));
            break;
    }
})

function hotOrCold(guess, authorId, bet) {
    let roll = (Math.random() * 10001);
    let odds = [1382, 1381, 1598, 1543, 1516, 1016, 1533, 11, 20];
    let calculatedOdds = [2763, 4361, 5904, 7420, 8436, 9969, 9980, 10000]
    let hot = odds[0] + odds[1] + odds[2];
    let cold = odds[3] + odds[4] + odds[5];
    let flowerColor;
    let flowerId = 0;
    let flowerImageArray = [
        "https://runescape.wiki/images/8/8d/Red_flowers.png?7adc5",
        "https://runescape.wiki/images/f/f9/Orange_flowers.png?d1811",
        "https://runescape.wiki/images/b/b8/Yellow_flowers.png?08e5f",
        "https://runescape.wiki/images/5/59/Blue_flowers.png?89175",
        "https://runescape.wiki/images/c/c3/Purple_flowers.png?3d596",
        "https://runescape.wiki/images/7/7b/Flowers_%28pastel%29.png?3d6b7",
        "https://runescape.wiki/images/9/9a/Flowers_%28mixed%29.png?66e3f",
        "https://runescape.wiki/images/c/c3/White_flowers.png?ed15f",
        "https://runescape.wiki/images/f/f1/Black_flowers.png?b58ad"];
    let isHot = false;
    let isCold = false;

    if (guess === 'hot' || guess === 'cold') {
        if (!isNaN(bet)) {
            if (bet > 0) {
                if (fetchUserCurrency(authorId, bet, false)) {
                    if (roll <= odds[0]) {
                        flowerColor = 'red';
                        flowerId = 0;
                    }
                    if (roll > odds[0] && roll <= calculatedOdds[0]) {
                        flowerColor = 'orange';
                        flowerId = 1;
                    }
                    if (roll > calculatedOdds[0] && roll <= calculatedOdds[1]) {
                        flowerColor = 'yellow';
                        flowerId = 2;
                    }
                    if (roll > calculatedOdds[1] && roll <= calculatedOdds[2]) {
                        flowerColor = 'blue';
                        flowerId = 3;
                    }
                    if (roll > calculatedOdds[2] && roll <= calculatedOdds[3]) {
                        flowerColor = 'purple';
                        flowerId = 4;
                    }
                    if (roll > calculatedOdds[3] && roll <= calculatedOdds[4]) {
                        flowerColor = 'pastel';
                        flowerId = 5;
                    }
                    if (roll > calculatedOdds[4] && roll <= calculatedOdds[5]) {
                        flowerColor = 'rainbow';
                        flowerId = 6;
                    }
                    if (roll > calculatedOdds[5] && roll <= calculatedOdds[6]) {
                        flowerColor = 'white';
                        flowerId = 7;
                    }
                    if (roll > calculatedOdds[6] && roll <= calculatedOdds[7]) {
                        flowerColor = 'black';
                        flowerId = 8;
                    }

                    if (roll <= hot) {
                        isHot = true;
                    }
                    if (roll > hot && roll <= hot + cold) {
                        isCold = true;
                    }
                    function InitializeEmbed(results) {
                        const exampleEmbed = new Discord.MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle('**Flower game, player guess: ' + guess + '**')
                            .setDescription(results ? 'Results: player loses! \n Your new balance is: ' + fetchUserCurrency(authorId, 0, true) + 'gp' : 'Results: player wins! \n Your new balance is: ' + fetchUserCurrency(authorId, 0, true) + 'gp')
                            .setImage(flowerImageArray[flowerId])
                            .setTimestamp()
                            .setFooter('Flower game made by https://github.com/Akulappis');

                        return exampleEmbed;
                    }

                    if (guess == 'hot' && isHot == true) {
                        saveUserData(authorId, bet, false);
                        return InitializeEmbed(false);
                    }
                    if (guess == 'hot' && isHot == false) {
                        saveUserData(authorId, -bet, false);

                        return InitializeEmbed(true);
                    }
                    if (guess == 'cold' && isCold == true) {
                        saveUserData(authorId, bet, false);

                        return InitializeEmbed(false);
                    }
                    if (guess == 'cold' && isCold == false) {
                        saveUserData(authorId, -bet, false);

                        return InitializeEmbed(true);
                    }
                }
                else {
                    return 'Insufficient funds';
                }
            }
            else {
                return 'Bet needs to be bigger than 0';
            }
        }
        else {
            return 'Please submit guess in form of "hot" or "cold"';
        }
    }
    else {
        return 'Please submit guess in form of "hot" or "cold"';
    }
}
function rules() {
    let flowerImageArray = [
        "https://runescape.wiki/images/8/8d/Red_flowers.png?7adc5",
        "https://runescape.wiki/images/f/f9/Orange_flowers.png?d1811",
        "https://runescape.wiki/images/b/b8/Yellow_flowers.png?08e5f",
        "https://runescape.wiki/images/5/59/Blue_flowers.png?89175",
        "https://runescape.wiki/images/c/c3/Purple_flowers.png?3d596",
        "https://runescape.wiki/images/7/7b/Flowers_%28pastel%29.png?3d6b7",
        "https://runescape.wiki/images/9/9a/Flowers_%28mixed%29.png?66e3f",
        "https://runescape.wiki/images/c/c3/White_flowers.png?ed15f",
        "https://runescape.wiki/images/f/f1/Black_flowers.png?b58ad"];

    const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('**Flower game rules**')
        .setDescription('**!flower hot/cold + bet** to play.\n**!currency** to view currency.\n**!greendragon** to get coins.\n')
        .setImage('https://puu.sh/FBShM/ba6286498c.png')
        .setTimestamp()
        .setFooter('Flower game made by https://github.com/Akulappis');

    return exampleEmbed;

}
bot.login(token);