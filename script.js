// get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

let count = 0;
const maxCount = 50;

// handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); // prevent form from submitting normally

  // grab form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text; // get the text of the selected option

  console.log(name, teamName); // for demonstration, log the values to the console

  // increment the count
  count++;
  console.log("Total check-ins: ", count);

  // update progress bar
  const percentage = Math.round((count / maxCount) * 100) + "%";
  console.log(`Progress: ${percentage}`); // log the progress percentage to the console
  const attendance = document.getElementById("attendeeCount");
  attendance.textContent = `${count}`;
  const progressWidth = document.getElementById("progressBar");
  progressWidth.style.width = percentage;

  // update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  // show welcome message
  const welcomeMessage = document.getElementById("greeting");
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  const message = `Welcome, ${capitalizedName}! You are on ${teamName}!`;
  welcomeMessage.textContent = message;
  console.log(message); // log the welcome message to the console

  form.reset(); // reset the form for the next check-in
});
