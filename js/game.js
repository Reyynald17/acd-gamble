const user = localStorage.getItem("user");
if (!user) location = "index.html";

const userSpan = document.getElementById("user");
const balanceSpan = document.getElementById("balance");
const betInput = document.getElementById("bet");
const result = document.getElementById("result");
const leader = document.getElementById("leader");
const game = document.getElementById("game");

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

  let win = false;
  if (game.value === "coin") win = Math.random() < 0.5;
  if (game.value === "dice") win = Math.random() < 1/6;
  if (game.value === "slot") win = Math.random() < 0.2;

  balance += win ? bet : -bet;
  data.users[user].balance = balance;
  await saveData(data);

  balanceSpan.innerText = balance;
  result.innerText = win ? "WIN" : "LOSE";
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
