let populations;
let groups = [];
let titleX, titleY, TitleXSize, TitleYSize;
let statueImg, statueX, statueY;
let prevY, yPos, barHeight;

function preload() {
  populations = loadTable("statue-data.csv", "csv", "header");
}

function setup() {
  //set gloal size variables
  cvX = windowHeight; //shorten the variable name, provide customization
  cvY = windowHeight; //create a square aspect ratio
  createCanvas(cvX, cvY); // make canvas with the dimensions
  colorMode(HSB);
  textAlign(CENTER);
  statueX = 0;
  statueY = 0;
  statueSizeX = cvX;
  statueSizeY = cvY*0.95;
  TitleX = cvX / 2;
  TitleY = cvY * 0.15;
  statueImg = loadImage('statue-background.png');
  // put setup code here
  console.log(populations.getRowCount() + " total rows in table");
  console.log(populations.getColumnCount() + " total columns in table");

  // how do we want to work with our Table Data?
  console.log(populations.getObject());

  console.log(populations.getArray());

  console.log(populations.getRows());

  // What if we want to work with an Array of Objects - let's create that
  // Create an array of objects - declare it globally to access it in draw function too

  for (let i = 0; i < populations.getRowCount(); i++) {

    // get the object from each CSV row - country, estimate, margin of error
    //console.log(populations.getRow(i));
    let oldObj = populations.getRow(i).obj;

    let newObj = {};
    newObj.country = oldObj.country;
    // interpret as a number instead of a string with parseInt
    newObj.estimate = parseInt(oldObj.estimate);
    newObj.percentage = parseFloat(oldObj.percentage);
    // put the object into the array
    groups.push(newObj);
  }
    console.log(groups);
}

function draw() {
  // put drawing code here
	prevY = 0;
  for (let i = 0; i < groups.length; i++) {
    	fill((i*10)+80,35,255);
    	barHeight = (groups[i].percentage)*statueSizeY;
      yPos = prevY + barHeight;
      rect(0, yPos - barHeight, cvX, yPos);
      //console.log(barHeight);
    	prevY = yPos;
    	fill(0);
    	if(i>=3 && i<groups.length-1) {
    	textSize(4+barHeight*0.06);
    	text(groups[i].country,cvX/2, yPos-barHeight/2+2);
    }}
     	//custom labels for edge listers
  		textSize(7);
    	text("Latin",cvX/2.65,cvY*0.08);
  		text("America",cvX/2.65,cvY*0.1);
    	text(groups[1].country,cvX/2.25,cvY*0.3);
    	text(groups[2].country,cvX/2.15,cvY*0.38);
  		text("...and 137",cvX/2.1,cvY*0.8);
  		text("more places!",cvX/2.1,cvY*0.82);

  image(statueImg, statueX, statueY, statueSizeX, statueSizeY);
}
