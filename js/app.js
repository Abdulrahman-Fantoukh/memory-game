// Init Selectors 
let stars = document.getElementById("stars");
let restart = document.getElementById("restart");
let deck = document.getElementById("deck");
let counter = document.getElementById("counter");
let timerDOM = document.getElementById("timer");
const SYMBOLS = [
    "diamond", "diamond",
    "paper-plane-o", "paper-plane-o", 
    "anchor", "anchor",
    "bolt", "bolt",
    "cube", "cube",
    "leaf", "leaf",
    "bicycle", "bicycle",
    "bomb", "bomb" 
];
// Clear existing stars and replace with stars based on current number of moves.
const rating = (moves) => {
    if (moves > 25) {return 1}
    else if (moves > 18) {return 2}
    else {return 3}
}

const generateStars = (moves) => {
    let starRating = rating(moves);
    stars.innerHTML = "";
    for (let i = 0; i < starRating; i++) {
        let starContainer = document.createElement("li");
        let star = starContainer.appendChild(document.createElement("i"))
        star.className = "fa fa-star";
        stars.appendChild(starContainer); 
    }
    for (let i = 0; i < 3-starRating; i++) {
        let starContainer = document.createElement("li");
        let star = starContainer.appendChild(document.createElement("i"))
        star.className = "fa fa-star-o";
        stars.appendChild(starContainer); 
    }
}

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

// Convert a timer in seconds to a formatted timer with minutes/seconds in mm:ss format.
const convertTimer = (timer) => {
    seconds = timer % 60;
    minutes = Math.floor(timer / 60);
    return `${("0" + minutes).slice (-2)}:${("0" + seconds).slice (-2)}`;
}

const startGame = (symbols) => {
    shuffle(symbols);
    
    // Reset Game State
    let cards = [];
    let solvedCards = [];
    let currentCards = [];
    let moves = 0
    let timer = 0;

    // Clear the old deck (if any) and reset moves to 0
    deck.innerHTML = "";
    counter.innerHTML = "0";
    
    // Start the timer - simple update each second.
    timerInterval = setInterval(() => {
        timer++;
        timerDOM.innerHTML = convertTimer(timer);
    }, 1000)

    // Convert symbol names to card elements
    symbols.forEach((symbol) => {
        let card = document.createElement("li");
        card.className = "card";
        let icon = card.appendChild(document.createElement("i"));
        icon.className = `fa fa-${symbol}`;
        cards.push(card);
        deck.appendChild(card);
    })
    
    cards.forEach(card => {
        card.addEventListener("click", handleClick)
    })

    const endTurn = () => {
        moves++;
        generateStars(moves);
        counter.innerHTML = moves;
        currentCards = [];
    }

    function handleClick(e) {
        // Make sure we're not doing things if the card is already flipped over.
        if (!this.classList.contains("match")) {
            // Flip the card
            this.classList.add("match");
            let match = false;
            cardClass = this.childNodes[0].classList;
            // This array either has one card or none, so this only runs if there's a card in it.
            currentCards.forEach(card => {
                // Does our card contain the same class as the currently flipped card?
                if (`${cardClass}` == `${card.childNodes[0].classList}`) {
                    match = true;
                }
            })
            // No match.
            if (!match) {
                // First card flipped this turn
                if (currentCards.length === 0) {
                    currentCards.push(this);
                }
                // Second card flipped.
                else {
                    // Just enough time to recognize that the cards don't match.
                    setTimeout(() => {
                        // Flip card one
                        currentCards.forEach((card) => {
                            card.classList.remove("match")
                        })
                        // Reset current cards
                        
                        // Flip card two
                        this.classList.remove("match");
                        endTurn() 
                         }, 500)      
                }
            }
            // Woo! We found a match!
            else {
                // Move our cards to our solved cards array.
                currentCards.push(this);
                currentCards.forEach((card)=> {
                    solvedCards.push(card)
                })
                endTurn();
                // We got a match. Is the game over?
                if (solvedCards.length == symbols.length) {
                    clearInterval(timerInterval);
                    alert(`You did it! You finished in ${convertTimer(timer)} and you took ${moves} guesses. 
                    Your rating is ${rating(moves)} out of 3 stars!`);
                }
            }  
        }
    }
}

// Add handlers for game start conditions: 
restart.addEventListener("click", () => {
    // If the timer is already running, let's clear it out and start over.
    // Overlapping timer updates aren't great.
    if (timerInterval) {
        clearInterval(timerInterval);
    };
    startGame(SYMBOLS) }
);
document.addEventListener("DOMContentLoaded", (evt) => {
    startGame(SYMBOLS);
});
