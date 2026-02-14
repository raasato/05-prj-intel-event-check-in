// Grab the form and inputs we will read from
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// Track total check-ins and attendance goal
let count = 0;
const maxCount = 50;
// Only show confetti once after the goal is reached
let hasShownConfetti = false;
// Use a single key to store data in localStorage
const storageKey = "attendanceData";
// Store team member names in memory
let teamMembers = {
  water: [],
  zero: [],
  power: [],
};

// Save attendance data to localStorage
function saveAttendance(data) {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

// Load saved attendance data (if it exists)
function loadAttendance() {
  const stored = localStorage.getItem(storageKey);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch (error) {
    return null;
  }
}

// Update the progress bar and total count text
function updateProgressBar(total) {
  const percentage = Math.round((total / maxCount) * 100) + "%";
  console.log(`Progress: ${percentage}`); // log the progress percentage to the console
  const attendance = document.getElementById("attendeeCount");
  attendance.textContent = `${total}`;
  const progressWidth = document.getElementById("progressBar");
  progressWidth.style.width = percentage;
}

// Figure out which team is leading and show the message
function updateTopTeamMessage(waterCount, zeroCount, powerCount) {
  const topTeamMessage = document.getElementById("topTeam");

  if (count < maxCount) {
    topTeamMessage.textContent = "";
    return;
  }

  const topCount = Math.max(waterCount, zeroCount, powerCount);
  const topTeams = [];

  if (waterCount === topCount) {
    topTeams.push("Team Water Wise");
  }

  if (zeroCount === topCount) {
    topTeams.push("Team Net Zero");
  }

  if (powerCount === topCount) {
    topTeams.push("Team Renewables");
  }

  if (topTeams.length === 1) {
    topTeamMessage.textContent = `Top team: ${topTeams[0]} (${topCount})`;
  } else {
    topTeamMessage.textContent = `Tie: ${topTeams.join(", ")} (${topCount} each)`;
  }
}

function updateTeamList(teamKey, names) {
  const list = document.getElementById(teamKey + "List");
  list.textContent = "";

  for (let i = 0; i < names.length; i++) {
    const listItem = document.createElement("li");
    listItem.textContent = names[i];
    list.appendChild(listItem);
  }
}

// Apply saved counts to the page when the app starts
function applyStoredAttendance(data) {
  const total = Number(data.total) || 0;
  const water = Number(data.water) || 0;
  const zero = Number(data.zero) || 0;
  const power = Number(data.power) || 0;
  const storedMembers = data.members || {};

  count = total;
  document.getElementById("waterCount").textContent = `${water}`;
  document.getElementById("zeroCount").textContent = `${zero}`;
  document.getElementById("powerCount").textContent = `${power}`;

  teamMembers = {
    water: storedMembers.water || [],
    zero: storedMembers.zero || [],
    power: storedMembers.power || [],
  };

  updateTeamList("water", teamMembers.water);
  updateTeamList("zero", teamMembers.zero);
  updateTeamList("power", teamMembers.power);

  updateProgressBar(total);
  updateTopTeamMessage(water, zero, power);

  if (total >= maxCount) {
    hasShownConfetti = true;
  }
}

// Create simple confetti using DOM elements and CSS animation
function launchConfetti() {
  const container = document.createElement("div");
  container.className = "confetti-container";
  document.body.appendChild(container);

  const colors = ["#00aeef", "#0071c5", "#00c7fd", "#7cc576", "#f5b041"];
  const confettiCount = 80;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("span");
    confetti.className = "confetti";
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.backgroundColor = colors[i % colors.length];
    confetti.style.animationDelay = `${Math.random() * 0.4}s`;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    container.appendChild(confetti);
  }

  setTimeout(function () {
    container.remove();
  }, 3000);
}

// Handle form submission for a new check-in
form.addEventListener("submit", function (event) {
  event.preventDefault(); // prevent form from submitting normally

  // grab form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text; // get the text of the selected option
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

  console.log(name, teamName); // for demonstration, log the values to the console

  // Increment total check-ins
  count++;
  console.log("Total check-ins: ", count);

  // Update the progress bar and count
  updateProgressBar(count);

  // Update the selected team's counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent, 10) + 1;
  teamMembers[team].push(capitalizedName);
  updateTeamList(team, teamMembers[team]);

  // Read all team counts and update the top team message
  const waterCount = parseInt(
    document.getElementById("waterCount").textContent,
    10,
  );
  const zeroCount = parseInt(
    document.getElementById("zeroCount").textContent,
    10,
  );
  const powerCount = parseInt(
    document.getElementById("powerCount").textContent,
    10,
  );
  updateTopTeamMessage(waterCount, zeroCount, powerCount);

  // Show the welcome or goal message
  const welcomeMessage = document.getElementById("greeting");
  let message = `Welcome, ${capitalizedName}! You are on ${teamName}!`;

  if (count >= maxCount) {
    message =
      "Congratulations! Team Sustainability has reached its attendance goal!";

    if (!hasShownConfetti) {
      launchConfetti();
      hasShownConfetti = true;
    }
  }

  welcomeMessage.textContent = message;
  console.log(message); // log the welcome message to the console

  // Save updated totals to localStorage
  saveAttendance({
    total: count,
    water: waterCount,
    zero: zeroCount,
    power: powerCount,
    members: {
      water: teamMembers.water,
      zero: teamMembers.zero,
      power: teamMembers.power,
    },
  });

  form.reset(); // reset the form for the next check-in
});

// Load and apply any saved attendance on page load
const savedAttendance = loadAttendance();

if (savedAttendance) {
  applyStoredAttendance(savedAttendance);
}
