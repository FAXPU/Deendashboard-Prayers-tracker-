// Load saved data
let coins = parseInt(localStorage.getItem("coins")) || 0;
let streak = parseInt(localStorage.getItem("streak")) || 0;
let freeze = parseInt(localStorage.getItem("freeze")) || 0;
let prayersToday = JSON.parse(localStorage.getItem("prayersToday")) || {
  fajr: false,
  dhuhr: false,
  asr: false,
  maghrib: false,
  isha: false
};

// DOM elements
const coinsEl = document.getElementById("coins");
const streakEl = document.getElementById("streak");
const freezeEl = document.getElementById("freeze");
const prayerButtons = document.querySelectorAll(".prayer-buttons button");

// Update UI
function updateUI() {
  coinsEl.textContent = coins;
  streakEl.textContent = streak;
  freezeEl.textContent = freeze;

  prayerButtons.forEach(btn => {
    const prayer = btn.dataset.prayer;
    btn.disabled = prayersToday[prayer];
    btn.style.opacity = prayersToday[prayer] ? 0.6 : 1;
  });
}

// Save data
function save() {
  localStorage.setItem("coins", coins);
  localStorage.setItem("streak", streak);
  localStorage.setItem("freeze", freeze);
  localStorage.setItem("prayersToday", JSON.stringify(prayersToday));
}

// Handle prayer click
prayerButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const prayer = btn.dataset.prayer;
    if (!prayersToday[prayer]) {
      prayersToday[prayer] = true;
      coins += 10; // earn 10 coins per prayer
      save();
      updateUI();
    }
  });
});

// Shop: Buy streak freeze
document.getElementById("buy-freeze").addEventListener("click", () => {
  if (coins >= 50) {
    coins -= 50;
    freeze += 1;
    save();
    updateUI();
  } else {
    alert("Not enough coins!");
  }
});

// Daily reset check (simple version: resets if user closes site after midnight)
function resetDaily() {
  const lastDate = localStorage.getItem("lastDate");
  const today = new Date().toDateString();

  if (lastDate !== today) {
    const missed = Object.values(prayersToday).some(done => !done);
    if (missed) {
      if (freeze > 0) {
        freeze -= 1; // use streak freeze
      } else {
        streak = 0;
        coins = Math.max(0, coins - 20); // penalty for missing prayers
      }
    } else {
      streak += 1; // completed all prayers, increase streak
    }
    prayersToday = { fajr:false, dhuhr:false, asr:false, maghrib:false, isha:false };
    localStorage.setItem("lastDate", today);
    save();
  }
}

// Initial setup
resetDaily();
updateUI();
