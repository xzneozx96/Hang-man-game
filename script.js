class AudioController {
    constructor() {
        this.bgMusic = new Audio('Assets/Audio/creepy.mp3');
        this.flipSound = new Audio('Assets/Audio/flip.wav');
        this.matchSound = new Audio('Assets/Audio/match.wav');
        this.victorySound = new Audio('Assets/Audio/victory.wav');
        this.gameOverSound = new Audio('Assets/Audio/gameOver.mp3');
        this.unmatchedSound = new Audio('Assets/Audio/oh-no.mp3');

        this.bgMusic.volume = 0.3;
        this.flipSound.volume = 0.3;
        this.matchSound.volume = 0.3;
        this.victorySound.volume = 0.3;
        this.gameOverSound.volume = 0.3;
        this.unmatchedSound.volume = 0.3;

        this.bgMusic.loop = true;
    }
    startMusic() {
        this.bgMusic.play();
    }
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    victory() {
        this.stopMusic();
        this.victorySound.play();
    }
    gameOver() {
        this.stopMusic();
        this.gameOverSound.play();
    }
    unmatched() {
        this.unmatchedSound.play();
    }
}

class HangMan {
    constructor() {
        this.audioController = new AudioController();
        this.secretWordsArr = [
            {id:1,
            question: "What am I?",
            answer: "Go to school",
            clue1: "If I sit down I'm high",
            clue2: "If I stand up I'm low",
            clue3: "I am very friendly and people love me"},

            {id:2,
            question: "This animal lives in Africa.What is it?",
            answer: "He is reading book",
            clue1: "It has got four legs",
            clue2: "It is big and gray",
            clue3: "It lives in the river"},

            {id:3, 
            question: "What has arms but cannot hug?",
            answer: "Stay up late",
            clue1: "It's brown",
            clue2: "It helps your when you are watching TV",
            clue3: "Kiss me then I will tell you the answer"}
        ];
        this.buttonContainer = document.getElementById("btn-container");
        this.btns = document.getElementsByClassName("letter");
        this.bodyParts = document.getElementById("hangman-body");
        this.hiddenWord = document.getElementById("secret-word"); 
        this.clues = document.getElementById("clue-display");
    }
    renderBtns() {
        let alphabet = "abcdefghijklmnopqrstuvwxyz";
        let alphabetArr = alphabet.toUpperCase().split("");
        let btn = alphabetArr.map((letter) => {
            return "<li><button class='letter' data-letter=" + letter + ">" + letter + "</button></li>"
        })
        this.buttonContainer.innerHTML = btn.join("")
    }
    resetBtns() {
        for (let k = 0; k < this.btns.length; k++) {
            this.btns[k].classList.remove('turn-red')
        }
    }
    startGame() {
        this.audioController.startMusic();
        this.randomIndex = Math.floor(Math.random() * (this.secretWordsArr.length - 1));
        this.secretWord = this.secretWordsArr[this.randomIndex].answer; // string
        this.wordToFind = this.secretWord.toUpperCase().split(""); // array

        this.clues.innerHTML = "";

        document.getElementById("question").innerHTML = this.secretWordsArr[this.randomIndex].question;

        this.generateSecretWord();
        this.resetBtns();

        this.bodyParts.src = "images/0.jpg";

        this.letterBtnToCheck = null;
        this.matchedLetterArr = [];
        this.matchedLetter = 0;
        this.unmatchedLetter = 0;
        this.whiteSpace = this.secretWord.split(" ").length - 1; // count the number of white space in a string

        document.getElementById("clue1").addEventListener("click", () => {
            this.showclue1()
        });

        document.getElementById("clue2").addEventListener("click", () => {
            this.showclue2()
        });

        document.getElementById("clue3").addEventListener("click", () => {
            this.showclue3()
        })
    }
    showclue1() {
        this.clues.innerHTML = "Clue 1: " + this.secretWordsArr[this.randomIndex].clue1;
    }
    showclue2() {
        this.clues.innerHTML = "Clue 2: " + this.secretWordsArr[this.randomIndex].clue2;
    }
    showclue3() {
        this.clues.innerHTML = "Clue 3: " + this.secretWordsArr[this.randomIndex].clue3;
    }
    generateSecretWord() {
        let secretLetters = this.wordToFind.map(letter => {
            if (letter === " ") {
                return "<li><button class='secret-letter empty-letter'><span class='empty'></span></button></li>"
            }
            else {
                return "<li><button class='secret-letter'><span class='empty hidden' data-letter=" + letter +">" + letter + "</span></button></li>"
            }                                     
        });                                       
        this.hiddenWord.innerHTML = secretLetters.join("");
    }
    canBeChecked(letterBtn) {
        let booleanValue = !this.matchedLetterArr.includes(letterBtn.dataset.letter) && letterBtn != this.letterBtnToCheck;
        if (booleanValue) {
            this.matchOrNot(letterBtn) 
        } else {
            this.letterBtnToCheck = letterBtn
        }
    }
    matchOrNot(letterBtn) {
        this.audioController.flip();
        letterBtn.classList.add("turn-red")
        if (this.wordToFind.includes(letterBtn.dataset.letter)) {
            this.match(letterBtn)
        } else {
            this.notMatch(letterBtn)
        }
        this.letterBtnToCheck = letterBtn 
    }
    match(letterBtn) {
        this.matchedLetterArr.push(letterBtn.dataset.letter)
        this.audioController.match();
        this.revealSecretLetter(letterBtn);
        this.winCondition(letterBtn);
    }
    revealSecretLetter(letterBtn) {
        let secretLetters = Array.from(document.getElementsByClassName("empty"));
        for ( let i = 0; i < secretLetters.length; i++) {
            if (secretLetters[i].dataset.letter == letterBtn.dataset.letter) {
                secretLetters[i].classList.remove("hidden")
            }
        }
    }
    winCondition(letterBtn) {
        for (let k = 0; k < this.wordToFind.length; k++) {
            if (this.wordToFind[k] == letterBtn.dataset.letter) {
                this.matchedLetter++; // by setting this, everytime there is a match, the matchedLetter variable will be added 1, even though the letter is repeated several times
            }                         // otherwise, the matchedLetter variable will be added 1 for every match and this make the formula in victory condition false
        }
        if (this.matchedLetter == this.wordToFind.length - this.whiteSpace) { // this is setup for the win condition
            this.victory() 
        }
    }
    victory() {
        this.audioController.victory();
        let victory = document.getElementById('victory-text');
        victory.classList.add('visible');
    }
    notMatch() {
        this.drawBodyParts();
        this.audioController.unmatched();
    } 
    drawBodyParts() {
        this.unmatchedLetter++;
        if (this.unmatchedLetter == 1) {
            this.bodyParts.src = "images/1.jpg"
        }
        else if (this.unmatchedLetter == 2) {
            this.bodyParts.src = "images/2.jpg"
        }
        else if (this.unmatchedLetter == 3) {
            this.bodyParts.src = "images/3.jpg"
        }
        else if (this.unmatchedLetter == 4) {
            this.bodyParts.src = "images/4.jpg"
        }
        else if (this.unmatchedLetter == 5) {
            this.bodyParts.src = "images/5.jpg"
        }
        else if (this.unmatchedLetter == 6) {
            this.bodyParts.src = "images/6.jpg"
            this.gameOver();
            
        }    
    }
    gameOver() {
        this.audioController.gameOver();
        let lost = document.getElementById('game-over-text');
        lost.classList.add('visible');
    }
    
}
    
function ready() {
    let game = new HangMan();
    game.renderBtns();

    let overlays = Array.from(document.getElementsByClassName("overlay-text"));
    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        })
    });

    let letterBtns = Array.from(document.getElementsByClassName("letter"));
    letterBtns.forEach(letterBtn => {
        letterBtn.addEventListener('click', () => {
            game.canBeChecked(letterBtn)
        });
    });
}

ready();
