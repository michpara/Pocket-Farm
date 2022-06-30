// imports
import * as document from "document";
import * as fs from "fs";
import { today } from "user-activity";
import { me as appbit } from "appbit";

// retrieving important components
let selectScreen = document.getElementById("myList");
let plant = document.getElementById("plant");
let items = selectScreen.getElementsByClassName("items");
let goBackButton = document.getElementById("goBack");

// global variables, used to keep the state of the app
let currentPlant;
let gameState;

// holds plant names and steps needed for them to grow a level
let plants = {0: {"name": "beet", "stepsPerLevel": 833}, 1: {"name": "cabbage", "stepsPerLevel": 526}, 2: {"name": "carrot", "stepsPerLevel": 666}, 3: {"name": "corn", "stepsPerLevel": 526}, 4: {"name": "cucumber", "stepsPerLevel": 526}, 5: {"name": "eggplant", "stepsPerLevel": 1250}, 6: {"name": "onion", "stepsPerLevel": 2000}, 7: {"name": "peas", "stepsPerLevel": 1428}, 8: {"name": "pepper", "stepsPerLevel": 909}, 9: {"name": "potato", "stepsPerLevel": 1666}, 10: {"name": "pumpkin", "stepsPerLevel": 526}, 11: {"name": "radish", "stepsPerLevel": 1428}, 12: {"name": "salad", "stepsPerLevel": 1666}, 13: {"name": "spinach", "stepsPerLevel": 2500}, 14: {"name": "tomat", "stepsPerLevel": 526}, 15: {"name": "watermelon", "stepsPerLevel": 555}, 16: {"name": "wheat", "stepsPerLevel": 1666}};


// plant selection menu
function selectMenu(){
  items.forEach((element, index) => {
    let touch = element.getElementById("touch");
    touch.onclick = function(evt) {
      gameState = "plantScreen";
      hideMenu();
      currentPlant = plants[index];
      saveData(currentPlant, gameState);
      plantMenu();
    };
  });
}

// plant screen
function plantMenu(){
  // goes back to the plant selection menu
  goBackButton.addEventListener("click", (evt) => {
    fs.unlinkSync("json.txt");
    openApp();
  })
  
  // displays the plant
  displayPlant(currentPlant);
}

// calcuate the plants current level according to the total steps that day
function calculateLevel(currentPlant){
  let totalSteps = calculateTotalSteps();
  if(totalSteps >= 10000){
    totalSteps = 10000;
  }
  return Math.floor(totalSteps/currentPlant['stepsPerLevel']) + 1;
}

// calculate the total steps taken in a day
function calculateTotalSteps(){
  if (appbit.permissions.granted("access_activity")) {
    return 100;
    //return today.adjusted.steps;
  }
}


// display the plant
function displayPlant(currentPlant){
  let currentLevel = calculateLevel(currentPlant);
  plant.href = currentPlant["name"] + "/" + currentPlant["name"] + "_" + currentLevel + ".png";
}

// hide the select menu
function hideMenu(){
  selectScreen.style.display = "none";
  goBackButton.style.display = "inline";
  plant.style.display = "inline";
}

// show the select menu
function showMenu(){
  selectScreen.style.display = "inline";
  plant.style.display = "none";
  goBackButton.style.display = "none";
}

// save data
function saveData(currentPlant, gameState){
    let json_data = {
    "currentPlant": currentPlant,
    "gameState": gameState,
  };
  fs.writeFileSync("json.txt", json_data, "json");
}

// load data
function loadData(defaults){
  try{
    let json_object = fs.readFileSync("json.txt", "json");
  } catch(e){
    let json_object = defaults;
    fs.writeFileSync("json.txt", json_object, "json");
  }
  return json_object;
}

// called when the app is opened
function openApp(){
  
  // receives save data if it exists, otherwise uses defaults
  let json_object = loadData({"currentPlant": null, "gameState": "selectScreen"});
  
  // assign save data to variables
  currentPlant = json_object.currentPlant;
  gameState = json_object.gameState;
  
  // check if there is already a plant selected, or if the user needs to be shown the select menu to select a plant 
  if(gameState == "selectScreen"){
    showMenu();
    selectMenu();
  } else {
    hideMenu();
    plantMenu();
  }
}

openApp();