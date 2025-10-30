// game settings
let numOfTrys = 6;
let numOfletters = 5;
let currentTry = 1;
let numOfHints = 2;


//Generate Random Word
let wordle = '';
let words = [ "holly", "Loves", "Hater", "Unity", "Games" ,"Sight" , "Glare", "Giant"];
wordle = words[Math.floor(Math.random() * words.length)].toUpperCase();


function generateInputs() {
  let inputsContainer = document.querySelector('.inputs-container');
  for(let i = 1; i <= numOfTrys; i++) {
    let letters = document.createElement('div');
    let label = document.createElement('p');
    let word = document.createElement('div');
    
    letters.classList.add('letters');
    letters.classList.add(`try-${i}`);
    if(i !== currentTry ) letters.classList.add('disabled');
    word.className = 'word';
    label.textContent = `Try ${i}`
    
    for(let l = 1; l <= numOfletters; l++) {
      let input = document.createElement('input');
      input.type = 'text';
      input.id = `guess-${i}-letter-${l}`;
      input.maxLength = 1;
      word.append(input);
    }
    letters.append(label, word);
    inputsContainer.appendChild(letters);
  }
  // focus On First Input In First Try
  inputsContainer.children[0].children[1].children[0].focus();

  // Disable All Inputs Expect Current Try
  let disWords = document.querySelectorAll('.disabled .word input');
  disWords.forEach((input) => input.disabled = true);

  // Navigate In Letters
  let inputs = document.querySelectorAll('.letters .word input');
  navigateInInputs(inputs);
}

let guessButton = document.querySelector('.guess');

window.onload = function(){
  generateInputs();
  guessButton.addEventListener('click',checkWord);
  hints();
}

// Function To Navigate In Inputs
function navigateInInputs(inputs){
  inputs.forEach((input, index) => {
    
    input.addEventListener('input', function() {
      if(input.value.length > 0 && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    })

    input.addEventListener('keydown', function(e) {
      // Handel Backspace
      if(e.key === 'Backspace' && input.value === '' && index > 0) {
        inputs[index - 1].focus();
        return;
      } 
      // Handel ArrowRight
      if(e.key === 'ArrowRight') {
        let nextInput = index + 1;
        if(nextInput < inputs.length){
          inputs[nextInput].focus();
          return;
        } 
      }
      // Handel ArrowLeft
      if(e.key === 'ArrowLeft') {
        let pervInput = index - 1;
        if(pervInput >= 0) {
          inputs[pervInput].focus();
          return;
        } 
      }
    });
  });
}

function hints(){
  let hints = document.querySelector('.hint');
  let counter = hints.children[0];

  let current = numOfHints;
  counter.textContent = current;
  
  hints.addEventListener('click', function(){
    if(current > 0) {
      current--;
      counter.textContent = current;
      
      let hintWord = '';
      if (window.localStorage.getItem('hintWord')){
        hintWord = window.localStorage.getItem('hintWord');
      } else {
        hintWord = wordle;
      }

      // Generate Random Letter As Hint
      let randomNum = Math.floor(Math.random() * hintWord.length);
      let hintLetter = hintWord[randomNum];
      hintWord = hintWord.slice(0, randomNum) + hintWord.slice(randomNum + 1);
      window.localStorage.setItem('hintWord', hintWord);
      // Generate It In UI
      let hintDiv = document.querySelector('.hint-div');
      let h2 = document.createElement('h2');
      let span = document.createElement('span');

      h2.textContent = 'The Word Have Letter: ';
      span.textContent = hintLetter;
      
      h2.append(span);
      hintDiv.append(h2);
    }

    if (current === 0) {
      counter.textContent = 'Don\'t Have';
      window.localStorage.removeItem('hintWord');
      hints.disabled = true;
    }
  });
}

function checkWord(){
  //ُ Ensure All Input Fields In The Current Try Are Filled
  for(let i = 1; i <= numOfletters; i++) {
    let inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
    if(inputField.value.trim() === "") {
      inputField.focus();
      return;
    }
  }

  // Check Word
  let successGuess = true;
  for(let i = 1; i <= numOfletters; i++) {
    let inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
    let letter = inputField.value.toUpperCase();
    let acctualLetter = wordle[i - 1];
    if(letter === acctualLetter) {
      inputField.classList.add('in-place');
    } else if (wordle.includes(letter) && letter !== ''){
      inputField.classList.add('not-in-place')
      successGuess = false;
    } else {
      inputField.classList.add('no');
      successGuess = false;
    }
  }

  if(successGuess) {
    // Generate Message When Won
    let content = document.querySelector('.content');
    let won = document.createElement('div');
    let h2 = document.createElement('h2');
    let h3 = document.createElement('h3');
  
    won.className = 'won';
    h2.textContent = 'Congratulation.';
    h3.textContent = 'You Won.';
    
    won.append(h2, h3);
    content.append(won);
    
    // Disable All tries When Won
    let allTrys = document.querySelectorAll('.word input');
    allTrys.forEach((trys) => trys.disabled = true);
    // Disable The Guess Button
    guessButton.disabled = true;
  } else {
    if(numOfTrys > 1) {
      let prevTryInputs = document.querySelector(`.try-${currentTry}`).children[1].childNodes;
      // Disable Previous Try Inputs
      prevTryInputs.forEach((input) => input.disabled = true);
      numOfTrys--;
      currentTry++;
      
      // Enabel Next Try
      let nextTry = document.querySelector(`.try-${currentTry}`).classList.remove('disabled');
      // Enabel Next Try Inputs
      let nextTryInputs = document.querySelector(`.try-${currentTry}`).children[1].childNodes;
      nextTryInputs.forEach((input) => input.disabled= false);
      // Focus On First Input In Next Try
      nextTryInputs[0].focus();
    } else {
      // Generate Message When Won
      let content = document.querySelector('.content');
      let lose = document.createElement('div');
      let h2 = document.createElement('h2');
      let h3 = document.createElement('h3');
      let h4 = document.createElement('h4');
      let span = document.createElement('span');
    
      lose.className = 'lose';
      h2.textContent = 'Unfortunately.';
      h3.textContent = 'You Lose.';
      h4.textContent = 'The Word Is ';
      span.textContent = `${wordle}.`;
      h4.append(span);
      lose.append(h2, h3, h4);
      content.append(lose);

      // Disable All tries When lose
      let allTrys = document.querySelectorAll('.word input');
      allTrys.forEach((trys) => trys.disabled = true);
      // Disable The Guess Button
      guessButton.disabled = true;
    }
  }
}
