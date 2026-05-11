let pokemonData = [];
let isAnomalyActive = false;
let finalNature = "";
let lockedRegion = "";
let natureQuestions = [];
let currentPokemon = null;

fetch('masterlist.json')
    .then(response => response.json())
    .then(data => {
        pokemonData = data;
        console.log("Masterlist loaded:", pokemonData);
    })
    .catch(err => console.error("Fetch error:", err));
	
const bgmNormal = new Audio('bgm.mp3');
const bgmAnomaly = new Audio('bgmano.mp3');

bgmNormal.loop = true;
bgmAnomaly.loop = true;

let activeBGM = bgmNormal;
	
const introDialogue = [
    "So, you are the next one to wander into a world of Enlightenment, hm?",
    "Who am I? You can call me a freelance detective of sorts.",
    "It seems that I have managed to catch you at the perfect time. One of my specialties is 'reading hearts', you see.",
    "Now, allow me to test the frequency of your heart.",
    "Answer these questions honestly."
];

const regionQuestions = [
    {
        question: "Tell me... In your ideal home, when you close your eyes, what do you hear?",
        options: [
            { text: "The hustle and bustle of a city that never sleeps.", regionWeight: { Unova: 2, Kalos: 1 } },
            { text: "The ceaseless crashing of waves against a jagged cliff.", regionWeight: { Alola: 2, Hoenn: 1 } },
            { text: "The silence of nature in all of its glory.", regionWeight: { Sinnoh: 2, Kanto: 1 } },
            { text: "Wind whistling through tall, golden grass.", regionWeight: { Paldea: 2, Johto: 1 } }
        ]
    },
    {
        question: "You are walking alone in the dark and see a flicker of movement in the corner of your eye... what is it?",
        options: [
            { text: "Something airborne, vanishing into the fog before it's noticed.", regionWeight: { Galar: 2, Johto: 1 } },
            { text: "A pair of hunting eyes glowing from within a hollow tree.", regionWeight: { Sinnoh: 2, Paldea: 1 } },
            { text: "The shimmer of a colorful wing under a dull streetlamp.", regionWeight: { Kalos: 2, Alola: 1 } },
            { text: "Just a trick of the light. There is nothing there.", regionWeight: { Kanto: 2, Hoenn: 1 } }
        ]
    },
    {
        question: "If you were to find a relic from a lost era, what would it most likely be?",
        options: [
            { text: "A rusted tool that bears the marks of much use.", regionWeight: { Unova: 2, Paldea: 1 } },
            { text: "A sun-bleached stone carved with forgotten runes.", regionWeight: { Galar: 2, Kalos: 1 } },
            { text: "An ornate tapestry depicting a crimson rose.", regionWeight: { Hoenn: 2, Johto: 1 } },
            { text: "A compass that seems to only point toward the sea.", regionWeight: { Alola: 2, Kanto: 1 } }
        ]
    },
    {
        question: "Feel the air around you. How should it feel against your skin?",
        options: [
            { text: "Crisp, cold, and smelling of distant pine needles.", regionWeight: { Sinnoh: 2, Unova: 1 } },
            { text: "Heavy and humid, thick with the scent of rain.", regionWeight: { Hoenn: 2, Galar: 1 } },
            { text: "Dry and warm, carrying an aroma of herbs and dust.", regionWeight: { Kanto: 2, Paldea: 1 } },
            { text: "Cool and still, like the inside of a stone cathedral.", regionWeight: { Johto: 2, Kalos: 1 } }
        ]
    },
    {
        question: "What is the one thing you could never leave behind?",
        options: [
            { text: "Ambition. The world taught me strength in looking forward.", regionWeight: { Unova: 2, Alola: 1 } },
            { text: "Tradition. I am nothing without my history and roots.", regionWeight: { Johto: 2, Sinnoh: 1 } },
            { text: "Freedom. I belong to no one and nowhere, no matter where I tread.", regionWeight: { Paldea: 2, Hoenn: 1 } },
            { text: "My heart. I follow the beauty in everything.", regionWeight: { Kalos: 2, Kanto: 1 } }
        ]
    }
];

const pmdQuestionPool = [
{
		question: "Have you ever accidentally revealed a personal secret that someone shared with you?",
		options: [
			{ text: "Yes.", natureWeight: { Rash: 4, Impish: 2 } },
			{ text: "No.", natureWeight: { Careful: 4, Serious: 2 } },
		]
	},
	{
		question: "What do you do with your allowance?",
		options: [
			{ text: "Save it!", natureWeight: { Docile: 4, Serious: 2 } },
			{ text: "Spend it!", natureWeight: { Quirky: 4, Impish: 2 } },
			{ text: "Spend half, save half.", natureWeight: { Calm: 4, Gentle: 2 } },
			{ text: "I don\'t get an allowance!", natureWeight: { Lonely: 4, Bashful: 2 } },
		]
	},
	{
		question: "Would you even consider sticking to a plan to do ten sit-ups a day?",
		options: [
			{ text: "Yes! That\'s easy!", natureWeight: { Impish: 4, Lax: 2 } },
			{ text: "Yes. Hard work, though.", natureWeight: { Hardy: 4, Serious: 2 } },
			{ text: "No! Who\'d want to do that?!", natureWeight: { Quirky: 4, Lax: 2 } },
		]
	},
	{
		question: "If you don\'t know something, do you come clean and admit it?",
		options: [
			{ text: "Of course.", natureWeight: { Modest: 4, Gentle: 2 } },
			{ text: "That\'s not easy to admit!", natureWeight: { Calm: 4, Bashful: 2 } },
		]
	},
	{
		question: "A fortune-teller says that you have a bad future ahead of you. How do you react?",
		options: [
			{ text: "Worry about it!", natureWeight: { Timid: 4, Careful: 2 } },
			{ text: "Forget about it.", natureWeight: { Jolly: 4, Relaxed: 2 } },
		]
	},
	{
		question: "You hear a rumor that might make you rich! What do you do?",
		options: [
			{ text: "Keep it all to myself.", natureWeight: { Lax: 4, Adamant: 2 } },
			{ text: "Share it with friends.", natureWeight: { Naive: 4, Jolly: 2 } },
			{ text: "Spread a different rumor!", natureWeight: { Impish: 4, Rash: 2 } },
		]
	},
	{
		question: "How do you blow up a balloon?",
		options: [
			{ text: "As close to breaking as possible!", natureWeight: { Brave: 4, Docile: 2 } },
			{ text: "Big...but not too big!", natureWeight: { Quiet: 4, Careful: 2 } },
			{ text: "I don\'t...it could pop!", natureWeight: { Timid: 4, Relaxed: 2 } },
		]
	},
	{
		question: "Do you state your opinion even when it\'s not what everyone else thinks?",
		options: [
			{ text: "Yes!", natureWeight: { Lonely: 4, Bold: 2 } },
			{ text: "No.", natureWeight: { Bashful: 4, Quiet: 2 } },
			{ text: "It depends on the situation.", natureWeight: { Calm: 4, Careful: 2 } },
		]
	},
	{
		question: "You want to reveal that you like someone a whole bunch! What do you do?",
		options: [
			{ text: "Show it a little by playing together.", natureWeight: { Jolly: 4, Gentle: 2 } },
			{ text: "Make it obvious...by playing a prank!", natureWeight: { Jolly: 4, Impish: 2 } },
			{ text: "State it clearly for all to hear!", natureWeight: { Bold: 4, Brave: 2 } },
			{ text: "Keep it to myself! It\'s too risky!", natureWeight: { Timid: 4, Bashful: 2 } },
		]
	},
	{
		question: "You\'re on a stroll when a TV crew pounces on you for an interview. What do you do?",
		options: [
			{ text: "Run away! How embarrassing!", natureWeight: { Timid: 4, Mild: 2 } },
			{ text: "Answer questions properly.", natureWeight: { Serious: 4, Hardy: 2 } },
			{ text: "Yuck it up! Woo-hoo! I\'m on TV!", natureWeight: { Naive: 4, Jolly: 2 } },
		]
	},
	{
		question: "You feel a burst of happiness! How about expressing it with a little dance?",
		options: [
			{ text: "Yes!", natureWeight: { Jolly: 4, Naughty: 2 } },
			{ text: "No.", natureWeight: { Calm: 4, Adamant: 2 } },
		]
	},
	{
		question: "You see a parade coming down the street. What do you do?",
		options: [
			{ text: "Stay on the sidelines.", natureWeight: { Quiet: 4, Mild: 2 } },
			{ text: "Join the parade!", natureWeight: { Naive: 4, Jolly: 2 } },
			{ text: "Walk away.", natureWeight: { Sassy: 4, Naughty: 2 } },
		]
	},
	{
		question: "Your friend tells a joke that\'s horribly corny! How do you react?",
		options: [
			{ text: "Roll around the floor laughing!", natureWeight: { Jolly: 4, Modest: 2 } },
			{ text: "Just let it go by...", natureWeight: { Docile: 4, Gentle: 2 } },
			{ text: "Slap my forehead and groan.", natureWeight: { Brave: 4, Sassy: 2 } },
		]
	},
	{
		question: "Can you strike up conversations with new people easily?",
		options: [
			{ text: "Yes!", natureWeight: { Impish: 4, Serious: 2 } },
			{ text: "No.", natureWeight: { Gentle: 4, Modest: 2 } },
		]
	},
	{
		question: "Do you get injured a lot?",
		options: [
			{ text: "Yes!", natureWeight: { Rash: 4, Gentle: 2 } },
			{ text: "No.", natureWeight: { Calm: 4, Hardy: 2 } },
		]
	},
	{
		question: "You see a ball on the ground. What do you do?",
		options: [
			{ text: "Kick it!", natureWeight: { Hasty: 4, Sassy: 2 } },
			{ text: "Throw it!", natureWeight: { Impish: 4, Serious: 2 } },
			{ text: "Spiff it up, shiny and new!", natureWeight: { Lonely: 4, Gentle: 2 } },
		]
	},
	{
		question: "What do you think of jungle exploration?",
		options: [
			{ text: "Sounds fun!", natureWeight: { Impish: 4, Careful: 2 } },
			{ text: "Not interested.", natureWeight: { Quirky: 4, Modest: 2 } },
		]
	},
	{
		question: "You discover a secret passage in a basement. What do you do?",
		options: [
			{ text: "Go through it!", natureWeight: { Brave: 4, Rash: 2 } },
			{ text: "Stay away from it.", natureWeight: { Timid: 4, Careful: 2 } },
		]
	},
	{
		question: "Your friend takes a spectacular fall! What do you do?",
		options: [
			{ text: "Help my friend up!", natureWeight: { Gentle: 4, Careful: 2 } },
			{ text: "Laugh! It\'s too funny!", natureWeight: { Naive: 4, Impish: 2 } },
		]
	},
	{
		question: "Have you ever wanted to communicate with aliens from another planet?",
		options: [
			{ text: "Yes!", natureWeight: { Naive: 4, Naughty: 2 } },
			{ text: "No.", natureWeight: { Quiet: 4, Mild: 2 } },
		]
	},
	{
		question: "Have you ever upset a friend when you were just kidding around?",
		options: [
			{ text: "Yes.", natureWeight: { Naive: 4, Impish: 2 } },
			{ text: "No.", natureWeight: { Relaxed: 4, Mild: 2 } },
		]
	},
	{
		question: "Hey, what\'s that? There\'s someone behind you! So...did you look just now?",
		options: [
			{ text: "Don\'t do that! It scared me!", natureWeight: { Timid: 4, Bashful: 2 } },
			{ text: "OK, I admit it. You tricked me.", natureWeight: { Lax: 4, Mild: 2 } },
			{ text: "No way, I didn\'t fall for it.", natureWeight: { Sassy: 4, Bold: 2 } },
			{ text: "Huh? What?", natureWeight: { Relaxed: 4, Quirky: 2 } },
		]
	},
	{
		question: "Someone who works at a store suggests an item that isn\'t quite what you\'re looking for. But you like this person. What do you do?",
		options: [
			{ text: "Say you don\'t want it.", natureWeight: { Brave: 4, Adamant: 2 } },
			{ text: "Say thanks...but say no.", natureWeight: { Modest: 4, Gentle: 2 } },
			{ text: "Cave in and buy it.", natureWeight: { Bashful: 4, Lonely: 2 } },
		]
	},
	{
		question: "You run into a new person that you haven\'t talked to very much before. What do you do?",
		options: [
			{ text: "Make small talk.", natureWeight: { Calm: 4, Modest: 2 } },
			{ text: "Say nothing!", natureWeight: { Quiet: 4, Bashful: 2 } },
			{ text: "Make an excuse to get away!", natureWeight: { Calm: 4, Careful: 2 } },
		]
	},
	{
		question: "You think you hear someone call your name. But no one\'s around...so what was it?",
		options: [
			{ text: "Just my imagination.", natureWeight: { Relaxed: 4, Lonely: 2 } },
			{ text: "Someone fooling around.", natureWeight: { Serious: 4, Modest: 2 } },
			{ text: "A ghost!", natureWeight: { Timid: 4, Naive: 2 } },
		]
	},
	{
		question: "Do you find yourself jumping to the wrong conclusion a lot of the time?",
		options: [
			{ text: "Yes.", natureWeight: { Lax: 4, Rash: 2 } },
			{ text: "No.", natureWeight: { Serious: 4, Careful: 2 } },
		]
	},
	{
		question: "Do you change the channels often while watching TV?",
		options: [
			{ text: "Yes!", natureWeight: { Hasty: 4, Quirky: 2 } },
			{ text: "No.", natureWeight: { Rash: 4, Careful: 2 } },
		]
	},
	{
		question: "You find something at a great bargain! What do you do?",
		options: [
			{ text: "Buy it right away!", natureWeight: { Hasty: 4, Rash: 2 } },
			{ text: "Think about whether you need it.", natureWeight: { Careful: 4, Mild: 2 } },
			{ text: "Demand an even bigger discount!", natureWeight: { Bold: 4, Docile: 2 } },
		]
	},
	{
		question: "You\'re packing your classroom\'s snacks for a picnic when you get hungry. What do you do?",
		options: [
			{ text: "Eat just a tiny bit.", natureWeight: { Hasty: 4, Naughty: 2 } },
			{ text: "Hold myself back and pack it all up.", natureWeight: { Hardy: 4, Serious: 2 } },
			{ text: "What snacks? They\'re in my belly!", natureWeight: { Rash: 4, Impish: 2 } },
		]
	},
	{
		question: "Are you a rebel at heart?",
		options: [
			{ text: "Totally!", natureWeight: { Adamant: 4, Naughty: 2 } },
			{ text: "Of course not.", natureWeight: { Lax: 4, Docile: 2 } },
		]
	},
	{
		question: "When walking in a group, do you tend to be the one at the front?",
		options: [
			{ text: "Of course!", natureWeight: { Gentle: 4, Mild: 2 } },
			{ text: "No.", natureWeight: { Docile: 4, Adamant: 2 } },
		]
	},
	{
		question: "Do you think that you might be a genius?",
		options: [
			{ text: "Certainly!", natureWeight: { Sassy: 4, Relaxed: 2 } },
			{ text: "Well, not really...", natureWeight: { Serious: 4, Docile: 2 } },
		]
	},
	{
		question: "Would you feel comfortable stating your opinion to a very important person?",
		options: [
			{ text: "Of course!", natureWeight: { Brave: 4, Mild: 2 } },
			{ text: "Not really.", natureWeight: { Mild: 4, Bashful: 2 } },
		]
	},
	{
		question: "Are you a city person or a country person?",
		options: [
			{ text: "I like the city!", natureWeight: { Sassy: 4, Mild: 2 } },
			{ text: "I like the country!", natureWeight: { Calm: 4, Gentle: 2 } },
			{ text: "I like them both!", natureWeight: { Quirky: 4, Mild: 2 } },
		]
	},
	{
		question: "You\'re about to take the last cookie when your friend wolfs it down! What do you do?",
		options: [
			{ text: "Whatever. It\'s just a cookie.", natureWeight: { Calm: 4, Modest: 2 } },
			{ text: "I unleash my cookie fury!", natureWeight: { Adamant: 4, Rash: 2 } },
			{ text: "I weep for my lost cookie.", natureWeight: { Lonely: 4, Mild: 2 } },
		]
	},
	{
		question: "You\'ve spent forever stacking dominoes...One more and you\'re done...OH, NO! You\'ve knocked them over! What do you do?",
		options: [
			{ text: "I\'m too crushed to start again.", natureWeight: { Hardy: 4, Bashful: 2 } },
			{ text: "I unleash my full fury!", natureWeight: { Adamant: 4, Rash: 2 } },
			{ text: "I set up the dominoes again...", natureWeight: { Careful: 4, Naughty: 2 } },
		]
	},
	{
		question: "Do you get bothered by noise and ruckus around you?",
		options: [
			{ text: "Yes!", natureWeight: { Bold: 4, Mild: 2 } },
			{ text: "Not at all.", natureWeight: { Relaxed: 4, Adamant: 2 } },
		]
	},
	{
		question: "You\'ve just stuffed yourself with a good meal when a great dessert arrives. What do you do?",
		options: [
			{ text: "Eat it. Who cares if I\'m stuffed?", natureWeight: { Hasty: 4, Bold: 2 } },
			{ text: "Turn it down. It\'s too fattening!", natureWeight: { Hardy: 4, Careful: 2 } },
			{ text: "Yummy! I love dessert the most!", natureWeight: { Jolly: 4, Sassy: 2 } },
		]
	},
	{
		question: "You have a really important test tomorrow! What do you do?",
		options: [
			{ text: "Study all night long.", natureWeight: { Hardy: 4, Serious: 2 } },
			{ text: "Wing it! I\'m sure it will be fine!", natureWeight: { Modest: 4, Hardy: 2 } },
			{ text: "Test?! I think I have a fever...", natureWeight: { Brave: 4, Bashful: 2 } },
		]
	},
	{
		question: "You\'re eating at a restaurant when you abruptly realize that everyone\'s gone! What do you do?",
		options: [
			{ text: "Alone?! I look for an employee!", natureWeight: { Hardy: 4, Docile: 2 } },
			{ text: "Who\'s worried? I keep eating.", natureWeight: { Naughty: 4, Relaxed: 2 } },
			{ text: "I swipe food from other tables!", natureWeight: { Bold: 4, Naughty: 2 } },
		]
	},
	{
		question: "Do you find yourself humming or singing often?",
		options: [
			{ text: "All the time!", natureWeight: { Relaxed: 4, Mild: 2 } },
			{ text: "Never.", natureWeight: { Quiet: 4, Adamant: 2 } },
		]
	},
	{
		question: "The phone\'s ringing! What do you do?",
		options: [
			{ text: "Answer right away!", natureWeight: { Adamant: 4, Lax: 2 } },
			{ text: "Wait a bit before answering.", natureWeight: { Naughty: 4, Modest: 2 } },
			{ text: "Ignore it and let it ring.", natureWeight: { Bold: 4, Bashful: 2 } },
		]
	},
	{
		question: "Your friend seems to be having a fun chat out of earshot. What do you do?",
		options: [
			{ text: "Join them and chat along!", natureWeight: { Lax: 4, Jolly: 2 } },
			{ text: "Nothing...I\'m not interested.", natureWeight: { Lonely: 4, Mild: 2 } },
			{ text: "Eavesdrop from a distance!", natureWeight: { Naughty: 4, Careful: 2 } },
		]
	},
	{
		question: "Do you like being the center of attention?",
		options: [
			{ text: "Yes.", natureWeight: { Sassy: 4, Careful: 2 } },
			{ text: "No.", natureWeight: { Relaxed: 4, Calm: 2 } },
		]
	},
	{
		question: "You\'re told to wait in a big, empty room. What do you do?",
		options: [
			{ text: "Wait quietly.", natureWeight: { Docile: 4, Quiet: 2 } },
			{ text: "Search for something to do.", natureWeight: { Naive: 4, Quirky: 2 } },
			{ text: "Wander outside.", natureWeight: { Rash: 4, Hasty: 2 } },
			{ text: "Cradle my knees and sit in the corner!", natureWeight: { Lonely: 4, Bashful: 2 } },
		]
	},
	{
		question: "Do you have lots of stuff you bought, thinking it was all cool, but don\'t use anymore?",
		options: [
			{ text: "Yes.", natureWeight: { Quirky: 4, Sassy: 2 } },
			{ text: "No.", natureWeight: { Quiet: 4, Adamant: 2 } },
		]
	},
	{
		question: "Have you had any hobbies for a long time?",
		options: [
			{ text: "Yes.", natureWeight: { Hardy: 4, Serious: 2 } },
			{ text: "No.", natureWeight: { Lonely: 4, Hasty: 2 } },
		]
	},
	{
		question: "Do you cancel plans to meet others at the last second?",
		options: [
			{ text: "Yes.", natureWeight: { Quirky: 4, Careful: 2 } },
			{ text: "No.", natureWeight: { Calm: 4, Gentle: 2 } },
		]
	},
	{
		question: "Do you like to do things according to plan?",
		options: [
			{ text: "Of course!", natureWeight: { Hardy: 4, Serious: 2 } },
			{ text: "I\'m not good at planning.", natureWeight: { Adamant: 4, Bashful: 2 } },
			{ text: "Plans? Who needs plans?", natureWeight: { Relaxed: 4, Lax: 2 } },
		]
	},
	{
		question: "Do you think that lies are sometimes necessary?",
		options: [
			{ text: "Yes.", natureWeight: { Quiet: 4, Bold: 2 } },
			{ text: "No.", natureWeight: { Brave: 4, Adamant: 2 } },
			{ text: "I don\'t know.", natureWeight: { Docile: 4, Mild: 2 } },
		]
	},
	{
		question: "You spot a deserted ship on the high seas! What do you think the ship holds?",
		options: [
			{ text: "Precious loot!", natureWeight: { Naive: 4, Bashful: 2 } },
			{ text: "Ghosts!", natureWeight: { Timid: 4, Bashful: 2 } },
			{ text: "Nothing! The ship is merely a mirage!", natureWeight: { Modest: 4, Adamant: 2 } },
		]
	},
	{
		question: "Do you think that anything goes when it comes to winning?",
		options: [
			{ text: "Of course!", natureWeight: { Sassy: 4, Naughty: 2 } },
			{ text: "No way!", natureWeight: { Lax: 4, Adamant: 2 } },
		]
	},
	{
		question: "Your friend is crying right in front of you! What made that happen?",
		options: [
			{ text: "Someone bullied my friend!", natureWeight: { Hasty: 4, Brave: 2 } },
			{ text: "My friend fell down, no doubt!", natureWeight: { Quiet: 4, Serious: 2 } },
			{ text: "I wonder if it\'s my fault?", natureWeight: { Impish: 4, Bashful: 2 } },
		]
	},
	{
		question: "Do you often forget to lock the door when you go out?",
		options: [
			{ text: "Yes.", natureWeight: { Rash: 4, Gentle: 2 } },
			{ text: "No.", natureWeight: { Gentle: 4, Quiet: 2 } },
		]
	},
	{
		question: "You attend a fine dinner at a friend\'s house. How do you behave?",
		options: [
			{ text: "Devour the food heartily!", natureWeight: { Serious: 4, Mild: 2 } },
			{ text: "Enjoy the meal in polite moderation.", natureWeight: { Modest: 4, Gentle: 2 } },
			{ text: "Ask to take the leftovers home!", natureWeight: { Naughty: 4, Quiet: 2 } },
		]
	},
	{
		question: "You have to move a heavy suitcase. What will you do?",
		options: [
			{ text: "Carry it by myself.", natureWeight: { Hardy: 4, Brave: 2 } },
			{ text: "Ask someone to help.", natureWeight: { Docile: 4, Gentle: 2 } },
			{ text: "Make someone else do it!", natureWeight: { Bold: 4, Naughty: 2 } },
		]
	},
	{
		question: "You muster your courage and go to a graveyard at night...and see a woman soaked to the skin just standing there! What do you do?",
		options: [
			{ text: "Run away at full speed!", natureWeight: { Timid: 4, Hasty: 2 } },
			{ text: "So what? It\'s just a lady.", natureWeight: { Quirky: 4, Sassy: 2 } },
			{ text: "Drop down and play dead!", natureWeight: { Lonely: 4, Quirky: 2 } },
		]
	},
	{
		question: "You see a cake that is past its expiration date, but only by one day. What do you do?",
		options: [
			{ text: "Not a problem! Chow time!", natureWeight: { Lax: 4, Relaxed: 2 } },
			{ text: "Think about it briefly, then decide.", natureWeight: { Modest: 4, Careful: 2 } },
			{ text: "Get someone to try it first.", natureWeight: { Bold: 4, Naughty: 2 } },
		]
	},
	{
		question: "Your friend says that your shirt is inside out. What do you do?",
		options: [
			{ text: "Get embarrassed!", natureWeight: { Mild: 4, Bashful: 2 } },
			{ text: "Laugh out loud!", natureWeight: { Rash: 4, Jolly: 2 } },
			{ text: "Say that it\'s the latest fashion!", natureWeight: { Jolly: 4, Sassy: 2 } },
		]
	},
	{
		question: "You\'re daydreaming...when your friend sprays you with water! What do you do?",
		options: [
			{ text: "Get mad!", natureWeight: { Hasty: 4, Rash: 2 } },
			{ text: "Get sad.", natureWeight: { Lonely: 4, Bashful: 2 } },
			{ text: "Woo-hoo! Water fight!", natureWeight: { Naive: 4, Impish: 2 } },
		]
	},
	{
		question: "You\'re in a play with friends. What kind of role do you prefer?",
		options: [
			{ text: "Starring role!", natureWeight: { Bold: 4, Sassy: 2 } },
			{ text: "Supporting role.", natureWeight: { Jolly: 4, Modest: 2 } },
			{ text: "Just a bit part.", natureWeight: { Lax: 4, Bashful: 2 } },
		]
	},
	{
		question: "You\'re in class when you realize that you really have to go to the restroom! What do you do?",
		options: [
			{ text: "Ask for permission to leave.", natureWeight: { Brave: 4, Docile: 2 } },
			{ text: "Sneak out.", natureWeight: { Hasty: 4, Naughty: 2 } },
			{ text: "Hold on until class ends!", natureWeight: { Timid: 4, Mild: 2 } },
		]
	},
	{
		question: "You\'re in the final mile of a marathon, but the last stretch is exhausting! What will you do?",
		options: [
			{ text: "Hang in there and finish!", natureWeight: { Docile: 4, Sassy: 2 } },
			{ text: "Stop running.", natureWeight: { Quirky: 4, Relaxed: 2 } },
			{ text: "Find a shortcut.", natureWeight: { Hasty: 4, Bold: 2 } },
		]
	},
	{
		question: "You\'re on a walk when you smell something delicious. What do you do?",
		options: [
			{ text: "Try to imagine what it is.", natureWeight: { Naughty: 4, Quiet: 2 } },
			{ text: "Find out what it is!", natureWeight: { Naive: 4, Brave: 2 } },
			{ text: "Think about how hungry I am...", natureWeight: { Impish: 4, Lonely: 2 } },
		]
	}
];

let introIndex = 0;
let isIntroPhase = true;
let currentStep = 0;
let isNaturePhase = false;
let regionScores = { Kanto:0, Johto:0, Hoenn:0, Sinnoh:0, Unova:0, Kalos:0, Alola:0, Galar:0, Paldea:0 };
let natureScores = { 
    Brave:0, Hardy:0, Bold:0, Sassy:0, Gentle:0, Timid:0, Lonely:0, Quiet:0,
    Bashful:0, Adamant:0, Naughty:0, Jolly:0, Relaxed:0, Docile:0, Impish:0, 
    Lax:0, Quirky:0, Mild:0, Rash:0, Calm:0, Careful:0, Modest:0, Hasty:0, Serious:0, Naive:0
};

function renderQuestion() {
    const textElement = document.getElementById("callisto-text");
    const optionsContainer = document.getElementById("options-container");

    optionsContainer.innerHTML = ""; 
    textElement.innerText = "";

    if (isIntroPhase) {
        typeWriter(introDialogue[introIndex], () => {
            const nextBtn = document.createElement("button");
            nextBtn.innerText = "...";
            nextBtn.style.width = "auto";
            nextBtn.onclick = () => advanceIntro();
            optionsContainer.appendChild(nextBtn);
        });
    } else {
        const activePool = isNaturePhase ? natureQuestions : regionQuestions;
        const data = activePool[currentStep];

        typeWriter(data.question, () => {
            data.options.forEach(opt => {
                const btn = document.createElement("button");
                btn.innerText = opt.text;
                btn.onclick = () => selectOption(opt);
                optionsContainer.appendChild(btn);
            });
        });
    }
}

function typeWriter(text, callback) {
    let i = 0;
    const textElement = document.getElementById("callisto-text");
    let typingTimeout;
    let isTyping = true;

    if (textElement) textElement.innerHTML = "";

    const handleGlobalClick = (e) => {
        if (e.target.tagName === 'BUTTON') return;

        if (isTyping) {
            clearTimeout(typingTimeout);
            textElement.innerHTML = text;
            finishTyping();
        }
    };

    window.addEventListener("click", handleGlobalClick);

    function finishTyping() {
        isTyping = false;
        window.removeEventListener("click", handleGlobalClick);
        setTimeout(() => {
            if (callback) callback();
        }, 150);
    }

    function type() {
        if (i < text.length) {
            textElement.innerHTML += text.charAt(i);
            i++;
            typingTimeout = setTimeout(type, 25);
        } else {
            if (isTyping) finishTyping();
        }
    }

    type();
}

function advanceIntro() {
    introIndex++;
    if (introIndex >= introDialogue.length) {
        isIntroPhase = false; 
        natureQuestions = getRandomSubset(pmdQuestionPool, 10);
    }
    renderQuestion();
}

function selectOption(opt) {
    if (!isNaturePhase) {
        for (let region in opt.regionWeight) {
            regionScores[region] += opt.regionWeight[region];
        }
    } else {
        for (let nature in opt.natureWeight) {
            natureScores[nature] += opt.natureWeight[nature];
        }
    }

    currentStep++;

    const activePool = isNaturePhase ? natureQuestions : regionQuestions;
    if (currentStep < activePool.length) {
        renderQuestion();
    } else if (!isNaturePhase) {
        lockRegionAndStartNature();
    } else {
        calculateFinalResult();
    }
}

function lockRegionAndStartNature() {
    lockedRegion = Object.keys(regionScores).reduce((a, b) => regionScores[a] > regionScores[b] ? a : b);
    
    const quips = {
        Kanto: "The air in your heart... it feels nostalgic, yet plain. A foundational resonance.",
        Johto: "I hear the chime of ancient bells in your heart. A traditional resonance.",
        Hoenn: "Your heart dreams of the vastness of the ocean and the fire of a volcano. A balanced resonance.",
        Sinnoh: "I sense the weight of stories and celestial reverence in your heart. A profound resonance.",
        Unova: "Your frequency hums with the energy of a thousand dreams. A modern resonance.",
        Kalos: "A certain elegance clings to your soul that nothing will ever override. A beautiful resonance.",
        Alola: "Warmth... like a sun that never truly sets. That is your heart. A vibrant resonance.",
        Galar: "I detect a spark of industry and iron-clad resolve. A sturdy resonance.",
        Paldea: "The scent of wild herbs and open roads follows you. A vast resonance."
    };

    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";

typeWriter(quips[lockedRegion], () => {
        const nextBtn = document.createElement("button");
        nextBtn.innerText = "...";
        nextBtn.onclick = () => {
            optionsContainer.innerHTML = "";
            typeWriter("Now, let us peer deeper into the traits that define you...", () => {
                const nextBtn2 = document.createElement("button");
                nextBtn2.innerText = "...";
                nextBtn2.onclick = () => {
					bgmNormal.play().catch(e => console.log("Audio play deferred"));
                    optionsContainer.innerHTML = ""; 
                    typeWriter("These questions... Might seem familiar to you. ...Ready?", () => {
                        const startNatureBtn = document.createElement("button");
                        startNatureBtn.innerText = "...";
                        startNatureBtn.onclick = () => {
                            isNaturePhase = true;
                            natureQuestions = getRandomSubset(pmdQuestionPool, 10); 
                            currentStep = 0;
                            renderQuestion();
                        };
                        optionsContainer.appendChild(startNatureBtn);
                    });
                };
                optionsContainer.appendChild(nextBtn2);
            });
        };
        optionsContainer.appendChild(nextBtn);
    });

    if (Math.floor(Math.random() * 500) === 13) {
        isAnomalyActive = true;
        triggerAnomaly();
    }
}

const natureFlavors = {
    Adamant: ["I sense a stubborn resilience in your heart.", "You don't bend to the whims of the world.", "...In fact, the world seems to bend for you."],
    Bashful: ["Your heart's rhythm is quiet... Hesitant.", "You prefer the shadows within you to the spotlight.", "...And that's fine by you."],
    Bold: ["Your heart is fearless.", "You meet the gaze of the unknown without a second thought.", "And you aren't afraid of your presence attracting attention."],
    Brave: ["Your heart beats like a taiko drum, loud and clear.", "In the face of darkness, you do not falter.", "No, you are much quicker to move with purpose."],
    Calm: ["Peace flows from your heart like a still lake.", "Despite the hurricanes that swirl, you do not sway.", "You are resolute."],
    Careful: ["Meticulous... Precise... Aware...", "You watch for the twigs before you can step on and snap them.", "This attention to detail is written in your heart."],
    Docile: ["Your heart resonates with the harmony around it.", "Cooperative to a fault, even when those around you push.", "Beware, you may just bend too far..."],
    Gentle: ["Kindness is the song sung in your heart.", "Your soul glows with a soft light.", "You may not realise it, but people rely on your support."],
    Hardy: ["Your heart is made of iron and grit.", "You endure where others break...", "And I sense a steady, tireless rhythm deep inside you."],
    Hasty: ["You are humming with an impatient energy.", "Your heart is always three steps ahead of the game.", "Someone like you might run right past the horizon you're chasing."],
    Impish: ["Your smile flickers with a mischievous glint.", "You find humor in weighty situations and see games in the serious.", "A heart like yours waits for the right moments."],
    Jolly: ["Your heart glows with a vibrant, infectious cheer.", "Your smile is like a beam of sunlight amidst a gloomy day.", "And deep down, genuine or not, you've convinced yourself of this positivity."],
    Lax: ["Your heart is loose and untethered.", "You drift through the world's chaos with an unbothered grace.", "It's really quite amazing."],
    Lonely: ["A solitary note, haunting and pure.", "You walk your own path, alone with your thoughts.", "While your heart is strong, it echoes with its own silence."],
    Mild: ["Your heart is unassuming and kind.", "You seek peace and happiness in others and yourself, avoiding conflict.", "...There isn't always a middle road that satisfies everyone, but when there is, you certainly take it."],
    Modest: ["There is a certain power deep within your heart, but it's hidden under many layers.", "Humility and humbleness, to name a couple.", "These hidden depths make you a most desirable friend, indeed."],
    Naive: ["Pure and unfiltered is the way your heart beats.", "You wake up every day with wide eyes and curiosity...", "Weariness will never catch up to you because you'll never pay it any mind."],
    Naughty: ["There is a spark of rebellion in your heart.", "You dance on the edge of rules, testing boundaries.", "If they break, that's hardly your problem."],
    Quiet: ["Your heart is a sanctuary of silence.", "You observe more often than you speak, letting others do the talking for you...", "And you are deep and contemplative."],
    Quirky: ["Your heartbeat is unpredictable, yet rhythmic.", "You do not fit into any mold the world forces upon you...", "But that's the way you prefer it."],
    Rash: ["Filled with explosive energy...", "You act in the heat of the moment before the smoke of consequence reaches your heart.", "Sometimes it works out... Sometimes it doesn't."],
    Relaxed: ["Your heart beats slow and steady.", "You are keenly aware of the fact that, no matter how fast you go, the world keeps on spinning.", "...No point in rushing it."],
    Sassy: ["Sharp and confident.", "Your heart matches your silver tongue, refusing to be overlooked.", "And others appreciate you all the more for it."],
    Serious: ["Your heart is steadfast and focused.", "The soul's journey is one you cannot undo...", "So you treat it with the weight and respect it deserves."],
    Timid: ["Cautious like a butterfly afraid of being trampled...", "You pay attention to the dangers in the darkness that others ignore.", "You can't help it - Your heart is always watching."]
};

function calculateFinalResult() {
    finalNature = Object.keys(natureScores).reduce((a, b) => natureScores[a] > natureScores[b] ? a : b);
    
    const textElement = document.getElementById("callisto-text");
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";
    let flavorLines = natureFlavors[finalNature];
    let lineIndex = 0;

    function showNextFlavorLine() {
        if (lineIndex < flavorLines.length) {
            typeWriter(flavorLines[lineIndex], () => {
                const nextBtn = document.createElement("button");
                nextBtn.innerText = "...";
                nextBtn.onclick = () => {
                    lineIndex++;
                    showNextFlavorLine();
                };
                optionsContainer.innerHTML = "";
                optionsContainer.appendChild(nextBtn);
            });
        } else {
            startPokemonReveal();
        }
    }

    showNextFlavorLine();
}

function startPokemonReveal() {
    if (isAnomalyActive) {
        const anomalyPool = (pokemonData.settings && pokemonData.settings.anomaly) 
            ? pokemonData.settings.anomaly 
            : [];
            
        const anomaly = anomalyPool[Math.floor(Math.random() * anomalyPool.length)];
        
        if (!anomaly) {
            console.error("Anomaly pool is empty! Check JSON structure.");
            return;
        }

        currentPokemon = anomaly; 
        displayFinalReveal(anomaly.name, "anomaly");
        return; 
    }

    let matchedPokemon = getFinalPokemon(finalNature, lockedRegion);
    
    if (!matchedPokemon) {
        console.error("No Pokemon found!");
        return;
    }

    const rollRegional = Math.random() < (1 / 50);
    const rollParadox = Math.random() < (1 / 250);
    if (matchedPokemon.variant_data.regional && rollRegional) {
        const regionalData = matchedPokemon.variant_data.regional;
        const chosenName = Array.isArray(regionalData) ? regionalData[Math.floor(Math.random() * regionalData.length)] : regionalData;
        currentPokemon = { name: chosenName }; 
        displayFinalReveal(chosenName, "variant");
    } 
    else if (matchedPokemon.variant_data.has_paradox && rollParadox) {
        const paradoxData = matchedPokemon.variant_data.paradox_name;
        const chosenParadox = Array.isArray(paradoxData) ? paradoxData[Math.floor(Math.random() * paradoxData.length)] : paradoxData;
        currentPokemon = { name: chosenParadox }; 
        displayFinalReveal(chosenParadox, "weak_paradox");
    }
    else {
        currentPokemon = matchedPokemon; 
        displayFinalReveal(matchedPokemon.name, "standard");
    }
}

function displayFinalReveal(pokemonName, resultType) {
    const textElement = document.getElementById("callisto-text");
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";

    let teaser = `...Yes. You most certainly possess a ${finalNature} heart. The Pokemon you are deep down is...`;
    
    typeWriter(teaser, () => {
        const nextBtn = document.createElement("button");
        nextBtn.innerText = "...";
        nextBtn.onclick = () => {
            optionsContainer.innerHTML = "";

            if (resultType === "anomaly") {
                const glitchText = "Something from beyond the laws of time and space. You shouldn't exist here... yet here you are.";
                typeWriter(glitchText, () => {
                    const nextBtn2 = document.createElement("button");
                    nextBtn2.innerText = "...";
                    nextBtn2.onclick = () => {
                        optionsContainer.innerHTML = "";
                        
                        const anomalyFlavor = currentPokemon.flavor || "A ripple in the fabric of reality.";
                        typeWriter(anomalyFlavor, () => {
                            const nextBtn3 = document.createElement("button");
                            nextBtn3.innerText = "...";
                            nextBtn3.onclick = () => {
                                optionsContainer.innerHTML = "";
                                finishReveal(pokemonName, resultType); // Finally show the name
                            };
                            optionsContainer.appendChild(nextBtn3);
                        });
                    };
                    optionsContainer.appendChild(nextBtn2);
                });
            } else {
                finishReveal(pokemonName, resultType);
            }
        };
        optionsContainer.appendChild(nextBtn);
    });
}

function finishReveal(pokemonName, resultType) {
    const textElement = document.getElementById("callisto-text");
    const optionsContainer = document.getElementById("options-container");

    typeWriter(`${pokemonName}.`, () => {
        let subFlavorText = "";
        if (resultType === "variant") {
            subFlavorText = "<br><br>A Regional Variant. Your form has adapted to a different horizon, carrying the echoes of another land.";
        } else if (resultType === "weak_paradox") {
            subFlavorText = "<br><br>A Paradox... you carry a faint, impossible rhythm from a time that is not our own.";
        }

        if (subFlavorText) {
            const flavorSpan = document.createElement("span");
            flavorSpan.innerHTML = subFlavorText;
            flavorSpan.style.fontStyle = "italic";
            flavorSpan.style.color = "#a0a0ff";
            textElement.appendChild(flavorSpan);
        }

        const yesBtn = document.createElement("button");
        yesBtn.innerText = "I am satisfied.";
        yesBtn.onclick = () => rollShiny(pokemonName);
        optionsContainer.appendChild(yesBtn);

        if (resultType !== "anomaly") {
            const noBtn = document.createElement("button");
            noBtn.innerText = "This doesn't feel right...";
            noBtn.onclick = () => showAlternatives();
            optionsContainer.appendChild(noBtn);
        }
    });
}

function showAlternatives() {
    const textElement = document.getElementById("callisto-text");
    const optionsContainer = document.getElementById("options-container");
    
    const originalPokemon = currentPokemon;

    let altPool = pokemonData.filter(p => 
        p.nature === finalNature && 
        (Array.isArray(p.name) ? !p.name.includes(originalPokemon.name) : p.name !== originalPokemon.name)
    );

    altPool = altPool.sort(() => 0.5 - Math.random());
    let alternatives = altPool.slice(0, 5);

    optionsContainer.innerHTML = "";
    
    typeWriter("Are you saying I read wrong...? Hm. Maybe one of these will satisfy you, then.", () => {
        alternatives.forEach(alt => {
            const btn = document.createElement("button");
            const displayName = Array.isArray(alt.name) ? alt.name[0] : alt.name;
            btn.innerText = displayName;
            btn.onclick = () => {
                currentPokemon = alt;
                rollShiny(alt); 
            };
            optionsContainer.appendChild(btn);
        });

        const backBtn = document.createElement("button");
        backBtn.innerText = `Actually, ${originalPokemon.name} was right...`;
        backBtn.className = "back-button"; 
        backBtn.onclick = () => {
            currentPokemon = originalPokemon; 
            rollShiny(originalPokemon);
        };
        optionsContainer.appendChild(backBtn);
    });
}

function logToGoogleSheets(pokemonName, nature, isShinyStatus, region) {
    const formID = "1FAIpQLSdgZo4Ix999Jc581n06cjKc_DDcs5kBQCuPEeZrto9c4zWU5A"; 
    const baseURL = `https://docs.google.com/forms/d/e/${formID}/formResponse`;
    const formData = new FormData();
    formData.append("entry.2113001359", pokemonName);
    formData.append("entry.1480260884", nature);
	formData.append("entry.1083012498", isShinyStatus ? "Yes" : "No");
	formData.append("entry.1281508392", region);

    fetch(baseURL, {
        method: "POST",
        mode: "no-cors",
        body: formData
    })
    .catch((err) => console.error("Logging failed:", err));
}

function rollShiny(pokemon) {
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";
    const pokemonName = (typeof pokemon === 'object') ? pokemon.name : pokemon;
    const isShiny = Math.floor(Math.random() * 500) === 13;
	logToGoogleSheets(pokemonName, finalNature, isShiny, lockedRegion);
    let finalMessage = `The resonance is complete. You have manifested as ${pokemonName}.`;
    if (isShiny) {
        finalMessage = `A brilliant flash of light occurs... You have manifested as a shiny ${pokemonName}!`;
    }

    typeWriter(finalMessage);
}

function getFinalPokemon(nature, region) {
    if (!pokemonData || !pokemonData.pokemon_entries) {
        console.error("Masterlist entries not found!");
        return null;
    }

    const pool = pokemonData.pokemon_entries.filter(p => p.nature === nature && p.region === region);
    
    if (pool.length === 0) {
        console.warn(`No match for ${nature} in ${region}.`);
        return null;
    }

    return pool[Math.floor(Math.random() * pool.length)];
}

function triggerAnomaly() {
    isAnomalyActive = true;
    switchMusic(true); 
    document.body.style.filter = "invert(1) hue-rotate(180deg)";
    console.log("A Space-Time Distortion has occurred.");
}

function getRandomSubset(array, size) {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, size);
}

function switchMusic(toAnomaly) {
    const oldTrack = toAnomaly ? bgmNormal : bgmAnomaly;
    const newTrack = toAnomaly ? bgmAnomaly : bgmNormal;
    const currentTime = oldTrack.currentTime;
    oldTrack.pause();
    newTrack.currentTime = currentTime;
    newTrack.play().catch(e => console.error("Music swap failed:", e)); 
    activeBGM = newTrack;
}

window.onload = renderQuestion;
