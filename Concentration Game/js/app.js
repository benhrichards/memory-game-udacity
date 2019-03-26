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


let openCards = []; 
let moves = 0;
let clockOff = true;
let time = 0;
let matched = 0;
let clockId; 
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

/*document.querySelector('.modal_cancel').addEventListener('click', () => {
	toggleModal();
});

document.querySelector('.modal_replay').addEventListener('click', () => {
	console.log('replay', resetGame()); // call reset here
});

document.querySelector(".restart").addEventListener("click", () => {
  resetGame();
  console.log('clicked');
  });
*/

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
		if (matched === TOTAL_PAIRS) {
		gameOver();
		}
	}


	else { 
		setTimeout ( function (){
		toggleCard(openCards[0]);
		toggleCard(openCards[1]); 
		openCards = [];
	}, 1000);
	}
};





// scoring 

function checkScore () { 
	if (moves === 16 || moves === 24 ) {
		hideStar();
	}

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

function hideStar () { 
	const starList = document.querySelectorAll('.stars li');
	for (star of starList) {
		if (star.style.display !== 'none') {
			star.style.display = 'none';
			break;
		} 
	}
}

// clock functions 

function startClock () {
	clearclockId = setInterval(() => {
		time++;
		displayTime();
	}, 1000);
}

function displayTime() {
	const clock = document.querySelector(".clock");
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


function stopClock() {
	clearInterval(clockId);
	clockOff = true;
}


// modal functions 

function toggleModal() {
	const modal = document.querySelector('.modal_background');
	modal.classList.toggle('hide');
}


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

// evt listener for modal buttons 

document.querySelector('.modal_close').addEventListener('click', toggleModal);

document.querySelector('.modal_replay').addEventListener('click', modalReplay);

document.querySelector(".restart").addEventListener("click", resetGame);



function modalReplay() {
	mathced = 0;
	resetGame();
    toggleModal();
    resetCards();
    resetStars();
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

function resetCards() {
	const cardz = document.querySelectorAll('.deck li');
	for (let card of cardz) {
		card.classList = 'card';
	}
}


function resetGame() {
	resetClockAndTime();
	resetMoves();
	resetStars();
	deckShuffle();
	resetCards();
}


function gameOver() {
	stopClock();
	writeModalStats();
	toggleModal();
}
