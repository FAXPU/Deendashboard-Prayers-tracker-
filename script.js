// Load saved data
let coins = parseInt(localStorage.getItem("coins")) || 0;
let streak = parseInt(localStorage.getItem("streak")) || 0;
let freeze = parseInt(localStorage.getItem("freeze")) || 0;
let xp = parseInt(localStorage.getItem("xp")) || 0;
let level = parseInt(localStorage.getItem("level")) || 1;
let prayersToday = JSON.parse(localStorage.getItem("prayersToday")) || {
  fajr:false, dhuhr:false, asr:false, maghrib:false, isha:false
};
let achievements = JSON.parse(localStorage.getItem("achievements")) || [];

// DOM elements
const coinsEl = document.getElementById("coins");
const streakEl = document.getElementById("streak");
const freezeEl = document.getElementById("freeze");
const xpEl = document.getElementById("xp");
const levelEl = document.getElementById("level");
const prayerButtons = document.querySelectorAll(".prayer-buttons button");
const achievementsList = document.getElementById("achievements-list");
const themeBtn = document.getElementById("toggle-theme");

// Update UI
function updateUI() {
  coinsEl.textContent = coins;
  streakEl.textContent = streak;
  freezeEl.textContent = freeze;
  xpEl.textContent = xp;
  levelEl.textContent = level;

  prayerButtons.forEach(btn => {
    const prayer = btn.dataset.prayer;
    btn.disabled = prayersToday[prayer];
    btn.style.opacity = prayersToday[prayer] ? 0.6 : 1;
  });

  achievementsList.innerHTML = achievements.map(a => `<li>${a}</li>`).join("");
}

// Save data
function save() {
  localStorage.setItem("coins", coins);
  localStorage.setItem("streak", streak);
  localStorage.setItem("freeze", freeze);
  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);
  localStorage.setItem("prayersToday", JSON.stringify(prayersToday));
  localStorage.setItem("achievements", JSON.stringify(achievements));
}

// XP & Level system
function addXP(amount) {
  xp += amount;
  if (xp >= level * 50) {
    xp -= level * 50;
    level++;
    achievements.push(`Level ${level} unlocked!`);
  }
}

// Handle prayer click
prayerButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const prayer = btn.dataset.prayer;
    if (!prayersToday[prayer]) {
      prayersToday[prayer] = true;
      coins += 10; 
      addXP(10);
      achievements.push(`Prayed ${prayer}!`);
      save();
      updateUI();
      notify(`You prayed ${prayer} and earned 10 coins + 10 XP!`);
    }
  });
});

// Shop: Buy streak freeze
document.getElementById("buy-freeze").addEventListener("click", () => {
  if (coins >= 50) {
    coins -= 50;
    freeze += 1;
    achievements.push("Bought a Streak Freeze!");
    save();
    updateUI();
  } else {
    alert("Not enough coins!");
  }
});

// Theme toggle
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

// Daily reset
function resetDaily() {
  const lastDate = localStorage.getItem("lastDate");
  const today = new Date().toDateString();

  if (lastDate !== today) {
    const missed = Object.values(prayersToday).some(done => !done);
    if (missed) {
      if (freeze > 0) {
        freeze -= 1; 
        achievements.push("Streak Freeze saved your streak!");
      } else {
        streak = 0;
        coins = Math.max(0, coins - 20); 
        achievements.push("Missed prayers! Streak and coins lost.");
      }
    } else {
      streak += 1; 
      achievements.push("All prayers done! Streak increased.");
    }
    prayersToday = { fajr:false, dhuhr:false, asr:false, maghrib:false, isha:false };
    localStorage.setItem("lastDate", today);
    save();
  }
}

// Notifications
function notify(msg) {
  if (Notification.permission === "granted") {
    new Notification(msg);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(msg);
      }
    });
  }
}

// Request notification permission
if (Notification.permission !== "granted" && Notification.permission !== "denied") {
  Notification.requestPermission();
}

// Initial setup
resetDaily();
updateUI();
