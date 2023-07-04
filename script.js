var words = ["VERMELHO", "AZUL", "VERDE", "AMARELO", "ROXO", "LARANJA", "ROSA", "MARROM", "CINZA"];
var colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown", "gray"];
var level = 1;

var countdown;
var timerElement = document.getElementById("timer");
var colorGrid = document.getElementById("colorGrid");
var restartButton = document.getElementById("restartButton");
var score = 0; // Variável global para a pontuação
var levelElement = document.getElementById("level");

function generateRandomWord() {
    var randomIndex = Math.floor(Math.random() * words.length);
    var randomWord = words[randomIndex];
    var randomColorIndex = Math.floor(Math.random() * colors.length);
    var randomColor = colors[randomColorIndex];
  
    if (level >= 3) {
      shuffleColors();
    }
  
    var randomWordElement = document.getElementById("randomWord");
    randomWordElement.textContent = randomWord;
    randomWordElement.style.color = randomColor;
  
    levelElement.textContent = "Nível " + level; // Exibe o nível ao lado esquerdo da randomWord
}

function shuffleColors() {
    if (level > 2) {
      var colorSquares = Array.from(document.getElementsByClassName("colorSquare"));
      colorSquares.forEach(function(square) {
        var randomOrder = Math.floor(Math.random() * colorSquares.length);
        square.style.order = randomOrder;
      });
    }
  }
function getTimeLimit() {
    switch (level) {
      case 1:
        return 3000; // 3 seconds
      case 2:
        return 2000; // 2 seconds
      case 3:
      case 4:
        return 1700; // 1.7 seconds
      case 5:
        return 1500; // 1.5 seconds
      case 6:
        return 1000; // 1 second
      default:
        return 1000; // Default to 3 seconds
    }
  }

function startCountdown() {
    var startTime = Date.now(); // Obtains the current time in milliseconds
    var timeLimit = getTimeLimit(); // Get the time limit based on the current level
    updateTimerDisplay(timeLimit); // Display the initial time
  
    countdown = setInterval(function() {
      var elapsedTime = Date.now() - startTime; // Calcula o tempo decorrido em milissegundos
      var timeLeft = timeLimit - elapsedTime; // Calcula o tempo restante em milissegundos
  
      if (timeLeft <= 0) {
        clearInterval(countdown);
        timeLeft = 0;
        endGame();
      }
  
      updateTimerDisplay(timeLeft);
    }, 1); // Executa a cada milissegundo
  }

  function updateTimerDisplay(time) {
    var seconds = Math.floor(time / 1000); // Calcula os segundos
    var milliseconds = time % 1000; // Calcula os milissegundos
  
    timerElement.textContent = seconds + "." + milliseconds.toString().padStart(3, "0");
  }

  function checkAnswer(selectedColor) {
    var randomWordElement = document.getElementById("randomWord");
    var randomColor = randomWordElement.style.color;
  
    if (selectedColor === randomColor) {
      // Correct answer
      score += 10; // Increment the score by 10
      document.getElementById("score").textContent = score; // Update the score display
  
      if (score % 10 === 0) {
        level++; // Increment the level every 10 points
      }
  
      generateRandomWord(); // Generate new random target and word
      clearInterval(countdown); // Stop the countdown
      startCountdown(); // Start a new countdown
    } else {
      // Wrong answer
      restartButton.style.display = "block";
      endGame();
    }
  }
  

  function startGame() {
    var startButton = document.getElementById("startButton");
    startButton.removeEventListener("click", startGame);
    startButton.addEventListener("click", resetGame);
    startButton.classList.add("hide"); // Adiciona a classe CSS para esconder o botão "Iniciar"
  
    score = 0; // Reinicia a pontuação
    document.getElementById("score").textContent = score; // Atualiza o elemento de exibição da pontuação
    generateRandomWord();
    startCountdown();
  
    colorGrid.style.display = "block"; // Exibe o grid de cores
    restartButton.style.display = "none"; // Oculta o botão "Reiniciar"
  }

function resetGame() {
  clearInterval(countdown);
  timerElement.textContent = "3";
  generateRandomWord();
  startCountdown();
}

function endGame() {
    clearInterval(countdown);
    timerElement.textContent = "0";
  
    // Salvar o score atual em algum lugar antes de zerá-lo
    var scoreAtual = score;
  
    score = 0; // Zera o score
    document.getElementById("score").textContent = score; // Atualiza o elemento de exibição do score
    restartButton.classList.remove("hide");
    restartButton.style.display = "block"; // Exibe o botão "Reiniciar"
    // Lógica para encerrar o jogo, exibir pontuação, etc.
    alert("Você perdeu! Seu score atual foi: " + scoreAtual);
  
    level = 1; // Redefine o nível para 1
    levelElement.textContent = "Nível " + level; // Atualiza o elemento de exibição do nível
  }
  

document.getElementById("rankingButton").addEventListener("click", function() {
  // Lógica para mostrar o ranking
});
