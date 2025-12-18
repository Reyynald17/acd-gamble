const user = localStorage.getItem("user");
if (!user) location = "index.html";

const userSpan = document.getElementById("user");
const balanceSpan = document.getElementById("balance");
const betInput = document.getElementById("bet");
const result = document.getElementById("result");
const leader = document.getElementById("leader");
const game = document.getElementById("game");
const visual = document.getElementById("visual-element");
const coinSideContainer = document.getElementById("coin-side-container");
const coinSideSelect = document.getElementById("coin-side");

let data, balance;

(async () => {
  data = await getData();
  balance = data.users[user].balance;
  userSpan.innerText = user;
  balanceSpan.innerText = balance;
  updateLeaderboard();
  toggleCoinSide();
})();

function toggleCoinSide() {
  coinSideContainer.style.display = game.value === "coin" ? "block" : "none";
}

async function play() {
  const bet = Number(betInput.value);
  if (bet <= 0 || bet > balance) return alert("Bet tidak valid");

  visual.classList.add("spinning");
  result.innerText = "Processing...";
  
  await new Promise(r => setTimeout(r, 800));

  let win = false;
  let icon = "";

  if (game.value === "coin") {
    const outcome = Math.random() < 0.5 ? "heads" : "tails";
    const userChoice = coinSideSelect.value;
    win = outcome === userChoice;
    icon = outcome === "heads" ? "🟡 (HEADS)" : "⚪ (TAILS)";
  } else if (game.value === "dice") {
    const side = Math.floor(Math.random() * 6) + 1;
    win = side === 6;
    icon = `🎲 ${side}`;
  } else if (game.value === "slot") {
    const slots = ["🍒", "🍋", "💎"];
    const res = [slots[Math.floor(Math.random()*3)], slots[Math.floor(Math.random()*3)], slots[Math.floor(Math.random()*3)]];
    win = res[0] === res[1] && res[1] === res[2];
    icon = res.join("");
  }

  visual.classList.remove("spinning");
  visual.innerText = icon;

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
