const user = localStorage.getItem("user");
if (!user) location = "index.html";

const userSpan = document.getElementById("user");
const balanceSpan = document.getElementById("balance");
const betInput = document.getElementById("bet");
const result = document.getElementById("result");
const leader = document.getElementById("leader");
const game = document.getElementById("game");
const visualBox = document.getElementById("visual-container");
const selectionContainer = document.getElementById("selection-container");

let data, balance;

(async () => {
  data = await getData();
  balance = data.users[user].balance;
  userSpan.innerText = user;
  balanceSpan.innerText = balance;
  updateLeaderboard();
  updateUI();
})();

function updateUI() {
  const mode = game.value;
  selectionContainer.innerHTML = "";
  
  if (mode === "coin") {
    visualBox.innerHTML = `<div class="coin" id="v-obj">COIN</div>`;
    selectionContainer.innerHTML = `
      <select id="user-choice">
        <option value="heads">Heads (🟡)</option>
        <option value="tails">Tails (⚪)</option>
      </select>`;
  } else if (mode === "dice") {
    visualBox.innerHTML = `<div class="dice-box" id="v-obj">?</div>`;
    selectionContainer.innerHTML = `
      <select id="user-choice">
        ${[1,2,3,4,5,6].map(n => `<option value="${n}">${n}</option>`).join('')}
      </select>`;
  } else if (mode === "slot") {
    visualBox.innerHTML = `
      <div class="slot-container">
        <div class="reel" id="r1">?</div>
        <div class="reel" id="r2">?</div>
        <div class="reel" id="r3">?</div>
      </div>`;
  }
}

async function play() {
  const bet = Number(betInput.value);
  if (bet <= 0 || bet > balance) return alert("Bet tidak valid");

  const mode = game.value;
  let win = false;

  if (mode === "coin") {
    const obj = document.getElementById("v-obj");
    obj.classList.add("spinning");
    await new Promise(r => setTimeout(r, 1000));
    const outcome = Math.random() < 0.5 ? "heads" : "tails";
    win = outcome === document.getElementById("user-choice").value;
    obj.classList.remove("spinning");
    obj.innerText = outcome === "heads" ? "🟡" : "⚪";
  } 
  
  else if (mode === "dice") {
    const obj = document.getElementById("v-obj");
    obj.classList.add("rolling");
    await new Promise(r => setTimeout(r, 1000));
    const outcome = Math.floor(Math.random() * 6) + 1;
    win = outcome === Number(document.getElementById("user-choice").value);
    obj.classList.remove("rolling");
    obj.innerText = outcome;
  } 
  
  else if (mode === "slot") {
    const r1 = document.getElementById("r1"), r2 = document.getElementById("r2"), r3 = document.getElementById("r3");
    r1.classList.add("spinning"); r2.classList.add("spinning"); r3.classList.add("spinning");
    await new Promise(r => setTimeout(r, 1200));
    const sym = ["🍒", "💎", "7️⃣"];
    const res = [sym[Math.floor(Math.random()*3)], sym[Math.floor(Math.random()*3)], sym[Math.floor(Math.random()*3)]];
    win = res[0] === res[1] && res[1] === res[2];
    r1.classList.remove("spinning"); r2.classList.remove("spinning"); r3.classList.remove("spinning");
    r1.innerText = res[0]; r2.innerText = res[1]; r3.innerText = res[2];
  }

  balance += win ? (mode === "slot" ? bet * 5 : bet) : -bet;
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
