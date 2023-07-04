var words = ["VERMELHO", "AZUL", "VERDE", "AMARELO", "ROXO", "LARANJA", "ROSA", "MARROM", "CINZA"];
var colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown", "gray"];
var level = 1;
var isGameRunning = false;

var countdown;
var timerElement = document.getElementById("timer");
var colorGrid = document.getElementById("colorGrid");
var restartButton = document.getElementById("restartButton");
var score = 0; // Variável global para a pontuação
var levelElement = document.getElementById("level");

// Função para gerar uma palavra aleatória com sua cor correspondente
function generateRandomWord() {
  var randomIndex = Math.floor(Math.random() * words.length);
  var randomWord = words[randomIndex];
  var randomColorIndex = Math.floor(Math.random() * colors.length);
  var randomColor = colors[randomColorIndex];

  // Em níveis maiores ou iguais a 3, embaralha as cores no grid
  if (level >= 3) {
    shuffleColors();
  }

  var randomWordElement = document.getElementById("randomWord");
  randomWordElement.textContent = randomWord;
  randomWordElement.style.color = randomColor;

  levelElement.textContent = "Nível " + level; // Exibe o nível ao lado esquerdo da randomWord
}

// Função para embaralhar as cores no grid
function shuffleColors() {
  if (level > 2) {
    var colorSquares = Array.from(document.getElementsByClassName("colorSquare"));
    colorSquares.forEach(function(square) {
      var randomOrder = Math.floor(Math.random() * colorSquares.length);
      square.style.order = randomOrder;
    });
  }
}

// Função para obter o limite de tempo com base no nível atual
function getTimeLimit() {
  switch (level) {
    case 1:
      return 3000; // 3 segundos
    case 2:
      return 2000; // 2 segundos
    case 3:
    case 4:
      return 1700; // 1.7 segundos
    case 5:
      return 1500; // 1.5 segundos
    case 6:
      return 1000; // 1 segundo
    default:
      return 1000; // padrão 1 segundo
  }
}

// Função para iniciar a contagem regressiva
function startCountdown() {
  var startTime = Date.now(); // Obtém o tempo atual em milissegundos
  var timeLimit = getTimeLimit(); // Obtém o limite de tempo com base no nível atual
  updateTimerDisplay(timeLimit); // Exibe o tempo inicial
  restartButton.style.display = "none";

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

// Função para atualizar a exibição do timer
function updateTimerDisplay(time) {
  var seconds = Math.floor(time / 1000); // Calcula os segundos
  var milliseconds = time % 1000; // Calcula os milissegundos

  timerElement.textContent = seconds + "." + milliseconds.toString().padStart(3, "0");
}

// Função para verificar a resposta selecionada pelo jogador
function checkAnswer(selectedColor) {
  if (!isGameRunning) {
    return; // Retorna se o jogo não estiver em execução
  }

  var randomWordElement = document.getElementById("randomWord");
  var randomColor = randomWordElement.style.color;

  if (selectedColor === randomColor) {
    // Resposta correta
    score += 10; // Incrementa a pontuação em 10
    document.getElementById("score").textContent = score; // Atualiza a exibição da pontuação

    if (score % 10 === 0) {
      level++; // Incrementa o nível a cada 10 pontos
    }

    generateRandomWord(); // Gera uma nova palavra aleatória
    clearInterval(countdown); // Para a contagem regressiva atual
    startCountdown(); // Inicia uma nova contagem regressiva
  } else {
    // Resposta incorreta
    restartButton.style.display = "block";
    endGame();
  }
}

// Função para iniciar o jogo
function startGame() {
  isGameRunning = true;
  var startButton = document.getElementById("startButton");
  startButton.removeEventListener("click", startGame);
  startButton.addEventListener("click", resetGame);
  startButton.classList.add("hide"); // Adiciona a classe CSS para esconder o botão "Iniciar"

  score = 0; // Reinicia a pontuação
  document.getElementById("score").textContent = score; // Atualiza a exibição da pontuação
  generateRandomWord();
  startCountdown();

  colorGrid.style.display = "block"; // Exibe o grid de cores
  restartButton.style.display = "none"; // Oculta o botão "Reiniciar"
}

// Função para reiniciar o jogo
function resetGame() {
  isGameRunning = true;
  clearInterval(countdown);
  timerElement.textContent = "3";
  generateRandomWord();
  startCountdown();
}

// Função para encerrar o jogo
function endGame() {
  isGameRunning = false;
  clearInterval(countdown);
  timerElement.textContent = "0";

  // Salva a pontuação atual em algum lugar antes de zerá-la
  var scoreAtual = score;

  score = 0; // Zera a pontuação
  document.getElementById("score").textContent = score; // Atualiza a exibição da pontuação
  restartButton.classList.remove("hide");
  restartButton.style.display = "block"; // Exibe o botão "Reiniciar"
  
  // Lógica para encerrar o jogo, exibir pontuação, etc.
  alert("Você perdeu! Seu score atual foi: " + scoreAtual);

  // Atualiza o ranking com a nova pontuação
  updateRanking(scoreAtual);

  level = 1; // Redefine o nível para 1
  levelElement.textContent = "Nível " + level; // Atualiza a exibição do nível
}

// Função para atualizar o ranking
function updateRanking(score) {
  var ranking = JSON.parse(localStorage.getItem("ranking")) || []; // Obtém o ranking do localStorage ou cria um array vazio
  var playerName = prompt("Digite seu nome:"); // Solicita ao jogador que digite seu nome

  var newScore = {
    name: playerName,
    score: score
  };

  ranking.push(newScore); // Adiciona a nova pontuação ao ranking
  ranking.sort((a, b) => b.score - a.score); // Ordena o ranking em ordem decrescente de pontuação

  if (ranking.length > 10) {
    ranking.splice(10); // Limita o ranking a 10 pontuações
  }

  localStorage.setItem("ranking", JSON.stringify(ranking)); // Salva o ranking atualizado no localStorage
}

// Função para exibir o ranking
function showRanking() {
  var ranking = JSON.parse(localStorage.getItem("ranking")) || [];

  var rankingList = document.getElementById("rankingList");
  rankingList.innerHTML = ""; // Limpa a lista antes de atualizá-la

  ranking.forEach(function(score, index) {
    var listItem = document.createElement("li");
    listItem.textContent = score.name + ": " + score.score;
    listItem.classList.add("list-group-item"); 
    listItem.classList.add("d-flex");
    listItem.classList.add("justify-content-center");
    listItem.classList.add("align-items-center");
    rankingList.appendChild(listItem);
  });

  // Exibe o ranking em algum elemento HTML adequado, como uma lista não ordenada <ul>
}


// Event listener para o botão de ranking
document.getElementById("rankingButton").addEventListener("click", showRanking);

