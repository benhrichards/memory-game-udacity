/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

let openCards = []; 
let moves = 0;
let clockOff = true;
let time = 0;
let matched = 0;
const cards = document.querySelectorAll('.deck');
const TOTAL_PAIRS = 8;

//function to shuffle cards at page load 

function deckShuffle() { 
	const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
	const shuffledCards = shuffle(cardsToShuffle);
	for (card of shuffledCards) {
		for (a of cards){
			a.append(card)
		}
		//cards.appendChild(card);
	}
}

deckShuffle();



// evt listener to hear clicks on cards 
// evt listener starts timer 

cards.forEach(function(element) {
	element.addEventListener("click", function(event) {
		const clickTarget = event.target;

				if (validClick(clickTarget)) {
		if(clockOff) {
			startClock();
			clockOff = false;
		}
		}

		if (validClick(clickTarget)) {
			toggleCard(clickTarget);
			addToggleCard(clickTarget);

			if (openCards.length === 2) {
			matchCheck(clickTarget);
			addMove();
			checkScore();
					}
		};
	});
});

// evt listener for modal buttons 

document.querySelector('.modal_cancel').addEventListener('click', () => {
	toggleModal();
});

document.querySelector('.modal_replay').addEventListener('click', () => {
	console.log('replay', resetGame); // call reset here
});

if (matched === TOTAL_PAIRS) {
	gameOver();
}

function validClick(clickTarget) { 
	return (
		clickTarget.classList.contains('card') &&
		!clickTarget.classList.contains('match') &&
		openCards.length < 2 && 
		!openCards.includes(clickTarget)
		)}

function toggleCard(clickTarget) {
	clickTarget.classList.toggle('open');
	clickTarget.classList.toggle('show'); 
}

function addMove() {
	moves++;
	const movesText = document.querySelector('.moves')
	movesText.innerHTML = moves; 
}



function addToggleCard(clickTarget) {
openCards.push(clickTarget);
console.log(openCards); 
}

function matchCheck () { 
	if (openCards[0].firstElementChild.className === openCards[1].firstElementChild.className) {
		openCards[0].classList.toggle('match');
		openCards[1].classList.toggle('match');
		openCards = [];
		matched++;
	}
	else { 
		setTimeout ( function (){
		toggleCard(openCards[0]);
		toggleCard(openCards[1]); 
		openCards = [];
	}, 1000);
	}
};



function checkScore () { 
	if (moves === 16 || moves === 24 ) {
		hideStar();
	}

}


function hideStar () { 
	const starList = document.querySelectorAll('.stars li');
	for (star of starList) {
		if (star.style.display !== 'none') {
			star.style.display = 'none';
			break;
		} 
	}
}




function displayTime() {
	const clock = document.querySelector('.clock');
	const minutes = Math.floor(time / 60);
	const seconds = time % 60;
	if (seconds < 10) {
		clock.innerHTML = `${minutes}:0${seconds}`;
	} 
	else{
		clock.innerHTML = `${minutes}:${seconds}`;	
	}	
	console.log(clock);	 
}

function startClock () {
	let clockId = setInterval(() => {
		time++;
		console.log(time);
		displayTime();
	}, 1000);
}

function toggleModal() {
	const modal = document.querySelector('.modal_background');
	modal.classList.toggle('hide');
}

toggleModal() // open modal 
toggleModal() // close modal 

function writeModalStats() {
	const timeStat = document.querySelector('.modal_time');
	const clockTime = document.querySelector('.clock').innerHTML;
	const moveStat = document.querySelector('.modal_moves');
	const starsStat = document.querySelector('.modal_stars');
	const stars = getStars(); 


	timeStat.innerHTML = `Time = ${clockTime}`; 
	moveStat.innerHTML = `Moves = ${moves}`;
	starsStat.innerHTML = `Stars = ${stars}`;
}

function getStars() {
	stars = document.querySelectorAll('.stars li');
	starCount = 0;
	for (star of stars) {
		if (star.style.display !== 'none') {
			starCount++;
		}
	}
	console.log(starCount);
	return starCount;
}

function resetGame() {
	resetClockAndTime();
	resetMoves();
	resetStars();
	deckShuffle();
}

function resetClockAndTime() {
	stopClock();
	clockOff = true;
	time = 0;
	displayTime();
}

function resetMoves() {
	moves = 0;
	document.querySelector('.moves').innerHTML = moves;
}

function resetStars() {
	stars = 0;
	const starList = document.querySelectorAll('.stars li');
	for (star of starList) {
		star.style.display = 'inline';
	}
}

function gameOver() {
	stopClock();
	writeModalStats();
	toggleModal();
}