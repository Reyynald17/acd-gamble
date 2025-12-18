const user = localStorage.getItem("user");
if (!user) location = "index.html";

const userSpan = document.getElementById("user");
const balanceSpan = document.getElementById("balance");
const betInput = document.getElementById("bet");
const result = document.getElementById("result");
const leader = document.getElementById("leader");
const game = document.getElementById("game");
const visualContainer = document.getElementById("visual-container");

let data, balance;

(async () => {
  data = await getData();
  balance = data.users[user].balance;
  userSpan.innerText = user;
  balanceSpan.innerText = balance;
  updateLeaderboard();
})();

async function play() {
  const bet = Number(betInput.value);
  if (bet <= 0 || bet > balance) return alert("Bet tidak valid");

  result.innerText = "Rolling...";
  let win = false;
  const gameType = game.value;

  if (gameType === "coin") {
    visualContainer.innerHTML = `<div class="spinning">🟡</div>`;
    await new Promise(r => setTimeout(r, 600));
    const outcome = Math.random() < 0.5 ? "heads" : "tails";
    const userChoice = document.getElementById("coin-side").value;
    win = outcome === userChoice;
    visualContainer.innerHTML = `<div>${outcome === "heads" ? "🟡" : "⚪"}</div>`;
  } 
  
  else if (gameType === "dice") {
    visualContainer.innerHTML = `<div class="dice-visual spinning">?</div>`;
    await new Promise(r => setTimeout(r, 800));
    const side = Math.floor(Math.random() * 6) + 1;
    win = side === 6;
    visualContainer.innerHTML = `<div class="dice-visual">${side}</div>`;
  } 
  
  else if (gameType === "slot") {
    visualContainer.innerHTML = `
      <div class="slot-machine">
        <div class="slot-reel spinning">❓</div>
        <div class="slot-reel spinning">❓</div>
        <div class="slot-reel spinning">❓</div>
      </div>`;
    await new Promise(r => setTimeout(r, 1000));
    const symbols = ["🍒", "🍋", "💎", "🔔"];
    const res = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];
    win = res[0] === res[1] && res[1] === res[2];
    visualContainer.innerHTML = `
      <div class="slot-machine">
        <div class="slot-reel">${res[0]}</div>
        <div class="slot-reel">${res[1]}</div>
        <div class="slot-reel">${res[2]}</div>
      </div>`;
  }

  balance += win ? bet : -bet;
  data.users[user].balance = balance;
  await saveData(data);

  balanceSpan.innerText = balance;
  result.innerText = win ? "WIN" : "LOSE";
  result.style.color = win ? "#00ff00" : "#ff8080";
  updateLeaderboard();
}

function updateLeaderboard() {
  leader.innerHTML = "";
  Object.entries(data.users)
    .sort((a,b) => b[1].balance - a[1].balance)
    .slice(0,5)
    .forEach(([u,v]) => {
      leader.innerHTML += `<li>${u}: ${v.balance} ACD</li>`;
    });
}

function logout() {
  localStorage.removeItem("user");
  location = "index.html";
}
