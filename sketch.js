let inputName, mealCount, eaterType, mood, dineOption, dishInput, calorieEstimate, poemOutput, dishTitle;
let canvas;
let generatedName = "", generatedPoem = "", calorieRange = "";
let patternGenerated = false;
let yValues = []; // Global array to store y-coordinates for audio


function setup() {
  inputName = select("#name");
  dishInput = select("#dish");  
  mealCount = select("#mealCount");
  eaterType = select("#eaterType");
  mood = select("#mood");
  dineOption = select("#dineOption");
  calorieEstimate = select("#calorieCount");
  poemOutput = select("#poemOutput");
  dishTitle = select("#dishTitle");

  // Set fields to be empty and slider to 0 initially
  resetFields();

  mealCount.input(updateMealDisplay);

  // Adjust the canvas to fit the larger output height
  canvas = createCanvas(600, 1000);
  canvas.parent("patternCanvas");
  noLoop();
}

function draw() {
  clear();
  background(255);
    yValues = []; // Reset y-values for each frame


  if (!patternGenerated) return;
  
  

  const nameLength = inputName.value().length || 1;
  const mealValue = mealCount.value();
  const calories = mealValue * 300;
  calorieEstimate.html(calories);

  let patternColor, strokeW;
  switch (eaterType.value()) {
    case "Vegan": patternColor = color(120, 200, 80); strokeW = 1; break;
    case "Vegetarian": patternColor = color(60, 255, 60); strokeW = 2; break;
    case "Eggitarian": patternColor = color(255, 200, 0); strokeW = 3; break;
    case "Chicketerian": patternColor = color(255, 150, 80); strokeW = 4; break;
    case "Seafood": patternColor = color(60, 120, 220); strokeW = 5; break;
    case "Omnivore": patternColor = color(220, 60, 60); strokeW = 6; break;
  }

  stroke(patternColor);
  strokeWeight(strokeW);
  fill(255);

  let steps = 20 + mealValue * 10;
  let entangleFactor = dineOption.value() === "Cooking" ? 0.5 : 1.5;

 for (let i = 4; i < steps; i++) {
    const y = map(i, -1.5, steps, 1.5, height - 200);
    yValues.push(y); // Store each y-value for audio

    beginShape();
    for (let j = 0; j <= steps; j++) {
      const x = map(j, 0, steps, nameLength, width);
      const distanceToCenter = abs(x - width / 2);
      const variance = max((width / 2 - distanceToCenter) / 5 - 30, nameLength);
      const r = lerp(-variance, 1, random()) * entangleFactor;
      curveVertex(x, y + r);
      ellipse(x, y, abs(r) * 0.5);
    }
    endShape();
  
  }

  noStroke();
  fill(0);
  textAlign(LEFT);
  textSize(20);
  textStyle(BOLD);
//  text(generatedName, 30, height - 140); // Positioned higher for more space below

  textSize(16);
 // text(calorieRange, 30, height - 110);

  textSize(16);
  //text(generatedPoem, 30, height - 80, width - 60, 200); // Extended height for four-line poem
}


function generateSignature() {
  patternGenerated = true;
  updateGeneratedName();
  updateGeneratedPoem();
  updateCalorieRange();
  
  // Set the generated text to the elements
  select("#dishTitle").html(generatedName); // Update dish title
  select("#poemOutput").html(generatedPoem); // Update poem output
  
  redraw();
  document.getElementById("saveBtn").disabled = false;
    document.getElementById("restartBtn").disabled = false;
    document.getElementById("playBurpSoundBtn").disabled = false;

}
function updateMealDisplay() {
  const mealValue = mealCount.value();
  select("#mealCountDisplay").html(mealValue);
  updateMealComment();
}

function updateMealComment() {
  const mealValue = mealCount.value();
  const comment = select("#mealComment");

  if (mealValue == 0) {
    comment.html("Fasting, are we?");
  } else if (mealValue <= 2) {
    comment.html("Keeping it light!");
  } else if (mealValue <= 4) {
    comment.html("Balanced diet, nice!");
  } else if (mealValue == 5) {
    comment.html("Big appetite, huh?");
  } else if (mealValue >= 6) {
    comment.html("Wow, going all out!");
  }
}

function updateGeneratedName() {
  const name = inputName.value();
  const dishChoice = dishInput.value() || "Delight";
  
  // Combine and clean inputs, extracting only alphabetic characters
  const letters = (name + dishChoice).toLowerCase().replace(/[^a-z]/g, "").split("");

  // Separate vowels and consonants
  const vowels = "aeiou";
  let consonantsArray = letters.filter(letter => !vowels.includes(letter));
  let vowelsArray = letters.filter(letter => vowels.includes(letter));

  // Ensure we alternate between consonants and vowels for phonetic balance
  let resultName = "";
  let useVowel = true;
  
  while (resultName.length < 6 && (consonantsArray.length || vowelsArray.length)) {
    if (useVowel && vowelsArray.length) {
      resultName += vowelsArray.shift(); // Use a vowel
    } else if (!useVowel && consonantsArray.length) {
      resultName += consonantsArray.shift(); // Use a consonant
    }
    useVowel = !useVowel; // Alternate
  }

  // Capitalize the result and add a random dish type
  resultName = resultName.charAt(0).toUpperCase() + resultName.slice(1);
  const dishTypes = ["Delight", "Feast", "Bite", "Treat", "Crave"];
  generatedName = `${resultName} ${random(dishTypes)}`;
}



// function updateGeneratedPoem() {
//   const userName = inputName.value() || "Foodie";
//   const dishName = dishInput.value() || "the chosen dish";
//   const mealValue = mealCount.value();
//   const moodChoice = mood.value();

//   let poemOptions = [
//     `${userName}, your ${dishName} awaits,\n${mealValue} plates in ${moodChoice} states,\nA journey of taste, calories in tow,\nMapping hunger as flavors flow.`,

//     `Oh ${userName}, with ${dishName} in hand,\nThe city’s cravings are grand,\nEach bite a line on this map of feast,\nDrawing a journey, north to east.`,

//     `${userName}'s day, in ${moodChoice} mood,\n${dishName} fuels this caloric interlude,\nFrom ${mealValue} courses to flavors anew,\nMapping the cravings, tried and true.`,

//     `In ${moodChoice} mode, with ${dishName} to dine,\n${userName}'s path is quite divine,\nEach calorie adds a tale so sweet,\nIn a city of flavors, hard to beat.`
//   ];

//   generatedPoem = poemOptions[Math.floor(Math.random() * poemOptions.length)];
// }


function updateGeneratedPoem() {
  const userName = inputName.value() || "Foodie";
  const dishName = dishInput.value() || "the chosen dish";
  const mealValue = mealCount.value();
  const calories = mealValue * 300; // Calories calculation based on meal count
  const moodChoice = mood.value();

  // Three-line poem options incorporating calorie count
  let poemOptions = [
    `${userName}, your ${dishName} awaits,\nWith ${calories} calories to savor, no debates,\nIn a ${moodChoice} mood, as hunger inflates.`,
    
    `Oh ${userName}, ${dishName} is here,\nWith ${calories} calories, nothing to fear,\nIn a ${moodChoice} moment, flavors appear.`,
    
    `${userName}'s ${dishName} delight,\nPacked with ${calories} calories tonight,\nIn a ${moodChoice} state, appetite in sight.`
  ];

  generatedPoem = poemOptions[Math.floor(Math.random() * poemOptions.length)];
}


// function playMelodiousWaveform() {
//   const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
//   // Define the C Major scale frequencies in Hertz
//   const scaleFrequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // C4 to C5
  
//   // Normalize yValues to fit within the range of scale frequencies
//   const maxY = Math.max(...yValues);
//   const minY = Math.min(...yValues);
  
//   // Function to map y values to the nearest scale frequency
//   const mapYtoFrequency = (y) => {
//     const normalizedY = (y - minY) / (maxY - minY); // Normalize y to a 0-1 range
//     const index = Math.floor(normalizedY * (scaleFrequencies.length - 1)); // Map to scale index
//     return scaleFrequencies[index];
//   };

//   // Sequentially play each frequency for a short duration
//   yValues.forEach((y, index) => {
//     const frequency = mapYtoFrequency(y);
//     const oscillator = audioContext.createOscillator();
//     const gainNode = audioContext.createGain();

//     oscillator.type = "sine"; // Use a sine wave for a smoother sound
//     oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + index * 0.2); // Set frequency
//     gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + index * 0.2); // Set volume

//     oscillator.connect(gainNode);
//     gainNode.connect(audioContext.destination);

//     oscillator.start(audioContext.currentTime + index * 0.2); // Start each note slightly after the previous
//     oscillator.stop(audioContext.currentTime + index * 0.2 + 0.2); // Short note duration for melody
//   });
// }


function playBurpSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Fetch values from inputs to determine burp characteristics
  const foodPersona = eaterType.value();
  const mealCountValue = parseInt(mealCount.value());
  const moodValue = mood.value();

  // Adjust burp properties based on inputs
  let baseFrequency = 80; // Default base frequency for burp
  let duration = 0.3; // Default short duration
  let maxVolume = 0.4; // Default lower volume

  // Modify properties based on "Food Persona"
  if (foodPersona === "Omnivore" || foodPersona === "Chicketerian" || foodPersona === "Seafood") {
    baseFrequency += 20; // Increase frequency for non-veg
    maxVolume += 0.3; // Louder for non-veg options
  }

  // Modify duration and volume based on "Meal Count"
  if (mealCountValue >= 5) {
    duration = 0.5; // Longer burp for higher meal count
    maxVolume += 0.3; // Increase volume for high meal count
  } else if (mealCountValue === 0) {
    duration = 0.2; // Shorter burp for fasting
    maxVolume = 0.2; // Lower volume for fasting
  }

  // Modify frequency or texture based on "Mood"
  if (moodValue === "Indulgent" || moodValue === "Stress? More Food!") {
    baseFrequency += 10; // Slightly higher frequency for indulgent or stressed mood
  } else if (moodValue === "Feeling Fit and Fresh") {
    baseFrequency -= 10; // Slightly lower frequency for a healthy mood
  }

  // Play a sequence of burp sounds based on the yValues array
  yValues.forEach((y, index) => {
    const frequency = baseFrequency + (y % 50); // Small variations per y value

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sawtooth"; // Sawtooth for burp texture
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + index * 0.1); // Frequency set by calculated value
    gainNode.gain.setValueAtTime(maxVolume, audioContext.currentTime + index * 0.1); // Initial volume

    // Adjust volume with an exponential decay for each "burp"
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime + index * 0.1); // Start each burp
    oscillator.stop(audioContext.currentTime + index * 0.1 + duration); // Stop after duration
  });

  // Disable the "Burp It" button after clicking
  document.getElementById("playBurpSoundBtn").disabled = true;
}




function updateCalorieRange() {
  const mealValue = mealCount.value();
  const baseCalories = mealValue * 300;
  const rangeLow = baseCalories - 100;
  const rangeHigh = baseCalories + 200;
  calorieRange = `Estimated Calorie Intake: ${rangeLow} - ${rangeHigh} kcal`;
}
function resetFields() {
  // Clear text inputs and dropdowns
  inputName.value("");
  dishInput.value("");
  mealCount.value(0); // Set slider to 0
  updateMealDisplay(); // Update display for slider
  
  eaterType.selectedIndex = -1; // Reset dropdowns to no selection
  mood.selectedIndex = -1;
  dineOption.selectedIndex = -1;

  // Clear generated outputs
  calorieEstimate.html("");
  poemOutput.html("");
  dishTitle.html("");
  patternGenerated = false;
}

function restartCanvas() {
  clear();
  patternGenerated = false;
  generatedName = "";
  generatedPoem = "";
  calorieRange = "";
  
  // Resetting all inputs to their default blank states
  select("#name").value('');
  select("#dish").value('');
  select("#mealCount").value(0);
  select("#mealCountDisplay").html(0);
  select("#mealComment").html("Looks moderate!");

  // Resetting dropdowns to placeholder
  select("#eaterType").selected('');
  select("#mood").selected('');
  select("#dineOption").selected('');

  // Clear the output text and canvas
  select("#calorieEstimate").html("Estimated Calories: 0 kcal");
  select("#dishTitle").html("");
  select("#poemOutput").html("");
  
  // Disable the Save button
  document.getElementById("saveBtn").disabled = true;
   document.getElementById("playBurpSoundBtn").disabled = true;
   document.getElementById("restartBtn").disabled = true;
  // Redraw canvas (optional)
  redraw();
}

function captureSignature() {
  saveCanvas("Caloric_Signature", "png");
}
