// Define UI elements
let ui = {
	fmsDebugMsg: document.getElementById('fmsDebugMsg'),
	robotCodeBuild: document.getElementById('robotCodeBuild'),
	robotScanTime: document.getElementById('robotScanTime'),
	
	// auton selectors
	openChooserWindowBtn: document.getElementById('openChooserWindowBtn'),
	
	// chassis

	//climber
	
	// infeed arm diagram
	robotDiagram: {
		robot: document.getElementById('robot'),
		elevatorLevel2: document.getElementById('elevator2'),
		elevatorLevel3: document.getElementById('elevator3'),
		carriage: document.getElementById('carriage'),
		climber: document.getElementById('climber'),
		bucket: document.getElementById('bucket'),
		beak: document.getElementById('beak'),
		beakTop: document.getElementById('beakTop'),
		beakSide: document.getElementById('beakSide'),
		robotSansClimber: document.getElementById('everything-but-climber'),
		climbMessage: document.getElementById('climb-message'),
	},

	//vision
	visionTargetIndicator: document.getElementById('visionTargetIndicator'),
	visionAngle1Indicator: document.getElementById('visionAngle1Indicator'),
	visionConnectionIndicator: document.getElementById('visionConnectionIndicator'),
	visionDistanceIndicator: document.getElementById('visionDistanceIndicator'),
		
	// elevator
	elevatorPosition: document.getElementById('elevatorPosition'),

	// bucket
	gamepiece: document.getElementById('gamepiece'),
	hatchcenter: document.getElementById('hatch-center'),

	// camera
	camera: document.getElementById('camera')
};

// Key Listeners
// ========================================================================================
// header
// ========================================================================================
// robotState is in connection.js

NetworkTables.addKeyListener('/SmartDashboard/FMS Debug Msg', (key, value) => {
    ui.fmsDebugMsg.value = value;
});

NetworkTables.addKeyListener('/SmartDashboard/Robot Build', (key, value) => {
    ui.robotCodeBuild.value = value;
});

NetworkTables.addKeyListener('/SmartDashboard/Scan Time (2 sec roll avg)', (key, value) => {
    //ui.robotScanTime.value = value;
});
// ========================================================================================
// auton mode
// ========================================================================================
// Load list of prewritten autonomous modes
NetworkTables.addKeyListener('/SmartDashboard/Auton/options', (key, value) => {
	openChooserWindowBtn.disabled = false;
	openChooserWindowBtn.textContent = '= Click to Open Chooser Window =';
	
	clearAutonButtons();

    // dynamically build list of auton options
    for (let i = 0; i < value.length; i++) {
        addButton(value[i]);           
	}

	selectedAuton.value = "** Not selected **"
});

NetworkTables.addKeyListener('/SmartDashboard/Auton/default', (key, value) => {
	setAutonDefault(value.toString());
	selectedAuton.value = value;
});

NetworkTables.addKeyListener('/SmartDashboard/Auton/selected', (key, value) => {
	setAutonDefault(value.toString());
	selectedAuton.value = value;
});

// ========================================================================================
// auton starting side
// ========================================================================================
NetworkTables.addKeyListener('/SmartDashboard/Side Start/options', (key, value) => {
//function loadTestAutonSides() {
	openChooserWindowBtn.disabled = false;
	openChooserWindowBtn.textContent = '= Click to Open Chooser Window =';

	clearAutonSideButtons();

    // dynamically build list of auton options	
	for (let i = 0; i < value.length; i++) {
        addSideButton(value[i]);           
    }

	selectedSide.value = "** Not selected **"
});

NetworkTables.addKeyListener('/SmartDashboard/Side Start/default', (key, value) => {
	setSideDefault(value.toString());
	selectedSide.value = value;
});

NetworkTables.addKeyListener('/SmartDashboard/Side Start/selected', (key, value) => {
	setSideDefault(value.toString());
	selectedSide.value = value;
});

// ========================================================================================
// Vision
// =======================================================================================
NetworkTables.addKeyListener('/SmartDashboard/Vision:IsTargetInFOV', (key, value) => {
	if (value)	{
		ui.visionTargetIndicator.style = "background-color:green;";
		ui.visionAngle1Indicator.style = "background-color:green;";
	} else {
		ui.visionTargetIndicator.style = "background-color:red;";
		ui.visionAngle1Indicator.style = "background-color:red;";
	}
});

NetworkTables.addKeyListener('/SmartDashboard/Vision:Angle1InDegrees', (key, value) => {	
	ui.visionAngle1Indicator.textContent = value + "\u00B0";
});

NetworkTables.addKeyListener('/SmartDashboard/Vision:Angle2InDegrees', (key, value) => {	
	ui.visionAngle2Indicator.textContent = value + "\u00B0";
});

NetworkTables.addKeyListener('/SmartDashboard/Vision:ActualDistance', (key, value) => {	
	if(value < 100 && value != 0) {
		ui.visionDistanceIndicator.textContent = Math.round(value) + "in";
		if (value <= 20) {
			ui.visionDistanceIndicator.style = "background-color:green;";
		} 
		else if(value <= 60) {
			ui.visionDistanceIndicator.style = "background-color:yellow;";
		} else {
			ui.visionDistanceIndicator.style = "background-color:red;";
		}
	} else {
		ui.visionDistanceIndicator.style = "background-color:red;";
		ui.visionDistanceIndicator.textContent = "NO";
	}	
});

NetworkTables.addKeyListener('/SmartDashboard/Vision:IsPingable', (key, value) => {	
	if(value) {
		ui.visionConnectionIndicator.style = "background-color:#2B3A42;";
	} else {
		ui.visionConnectionIndicator.style = "background-color:red;";
	}
});

// ========================================================================================
// Robot Diagram
// ========================================================================================
NetworkTables.addKeyListener('/SmartDashboard/NavX:Pitch', (key, value) => {
	if(Math.abs(value) > 20){	
		ui.robotDiagram.robot.style.transform = `rotate(${value}deg)`;
	}

	if(Math.abs(value) > 45){
		ui.robotDiagram.climbMessage.style.visibility = "visible";
	} else {
		ui.robotDiagram.climbMessage.style.visibility = "hidden";
	}
});

// ========================================================================================
// Climber
// ========================================================================================
NetworkTables.addKeyListener('/SmartDashboard/Climber: Position', (key, value) => {	
	var transformHeight = Math.round(value * (3/1)); //[pixels]/[in] conversion
	//Transform Robot to match actual Climber
	if(Math.abs(value) > 3){
		ui.robotDiagram.robotSansClimber.style.transform = `translateY(${transformHeight}px)`;
		ui.robotDiagram.robot.setAttribute('transform-origin', "72px 292px");
	}
});

// ========================================================================================
// Elevator
// ========================================================================================
NetworkTables.addKeyListener('/SmartDashboard/Elevator: Position', (key, value) => {
	if (value == "LEVEL_1"){
		ui.elevatorPosition.style.fill = "green";
		ui.elevatorPosition.textContent = "1";
	}
	else if (value == "LEVEL_2"){
		ui.elevatorPosition.style.fill = "yellow";
		ui.elevatorPosition.textContent = "2";
	}
	else if (value == "LEVEL_3"){
		ui.elevatorPosition.style.fill = "red";
		ui.elevatorPosition.textContent = "3";
	} else {
		ui.elevatorPosition.style.fill = "cornsilk";
		ui.elevatorPosition.textContent = "F";
	}
});

NetworkTables.addKeyListener('/SmartDashboard/Elevator: CurrentPosition', (key, value) => {
	//Calculate Relative Transformation Height
	var transformHeight = Math.round(value * (3/1)); //[pixels]/[in] conversion
	//Transform Elevator to match actual elevator
	ui.robotDiagram.elevatorLevel2.style.transform = `translate(112px , ${162-transformHeight/3}px)`;
	ui.robotDiagram.elevatorLevel3.style.transform = `translate(118px , ${157-2*transformHeight/3}px)`;
	ui.robotDiagram.carriage.style.transform = `translate(103px , ${199-transformHeight}px)`;
});
// ========================================================================================
// Bucket Group Box
// ========================================================================================
NetworkTables.addKeyListener('/SmartDashboard/Cargo:HasHatch', (key, value) => {	
	if (value) {
		ui.gamepiece.style.fill = "yellow";
		ui.gamepiece.style.stroke = "darkgrey";
		ui.hatchcenter.style.visibility = "visible";
		ui.robotDiagram.beakTop.style.fill = "yellow";
		ui.robotDiagram.beakSide.style.fill = "yellow";
	} else {
		ui.gamepiece.style.fill = "darkorange";
		ui.gamepiece.style.stroke = "orange";
		ui.hatchcenter.style.visibility = "hidden";
		ui.robotDiagram.beakTop.style.fill = "purple";
		ui.robotDiagram.beakSide.style.fill = "purple";
	}
});

NetworkTables.addKeyListener('/SmartDashboard/Cargo:IsBucketOut', (key, value) => {	
	if (value) {
		ui.robotDiagram.bucket.style.transform = `translateX(${28}px)`;
	} else {
		ui.robotDiagram.bucket.style.transform = `translateX(${10}px)`;
	}
});

NetworkTables.addKeyListener('/SmartDashboard/Cargo:IsBeakOut', (key, value) => {	
	if (value) {
		ui.robotDiagram.beak.style.transform = `translateX(${9}px)`;
	} else {
		ui.robotDiagram.beak.style.transform = `translateX(${0}px)`;
	}
});

NetworkTables.addKeyListener('/SmartDashboard/Cargo:IsBeakOpen', (key, value) => {	
	if (value) {
		ui.robotDiagram.beakTop.style.transform = `rotate(${-130}deg)`;
		ui.robotDiagram.beakSide.setAttribute('width', 6);
		ui.robotDiagram.beakTop.style.fill = "yellow";
		ui.robotDiagram.beakSide.style.fill = "yellow";
	} else {
		ui.robotDiagram.beakTop.style.transform = `rotate(${0}deg)`;
		ui.robotDiagram.beakSide.setAttribute('width', 9);
		ui.robotDiagram.beakTop.style.fill = "purple";
		ui.robotDiagram.beakSide.style.fill = "purple";
	}
});

// ========================================================================================
// misc 
// ========================================================================================
NetworkTables.addKeyListener('/SmartDashboard/CurrentCameraAddress', (key, value) => {	
	camera.setAttribute('src', value);
});

addEventListener('error',(ev)=>{
    ipc.send('windowError',{mesg:ev.message,file:ev.filename,lineNumber:ev.lineno})
})