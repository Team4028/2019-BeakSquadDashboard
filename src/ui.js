// Define UI elements
let ui = {
	fmsDebugMsg: document.getElementById('fmsDebugMsg'),
	robotCodeBuild: document.getElementById('robotCodeBuild'),
	robotScanTime: document.getElementById('robotScanTime'),
	
	// auton selectors
	openChooserWindowBtn: document.getElementById('openChooserWindowBtn'),
	
	// chassis
	
	// infeed arm diagram
	robotDiagram: {
		robot: document.getElementById('robot'),
	},

	//vision
	visionTargetIndicator: document.getElementById('visionTargetIndicator'),
	visionAngle1Indicator: document.getElementById('visionAngle1Indicator'),
	visionAngle2Indicator: document.getElementById('visionAngle2Indicator'),
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
// Robot Vision Diagram
// ========================================================================================
NetworkTables.addKeyListener('/limelight/tx', (key, value) => {
	ui.visionAngle1Indicator.value = value;
	
    // Calculate visual rotation of arm
    //var robotAngle1 = value;
    // Rotate the arm in diagram to match real arm
	//ui.robotDiagram.robot.style.transform = `rotate(${robotAngle1}deg)`;
});

NetworkTables.addKeyListener('/SmartDashboard/DistanceFromLL', (key, value) => {	
	ui.visionDistanceIndicator.value = value + "in";

	if (value <= 48)	{
		ui.visionDistanceIndicator.style = "background-color:green;";
	} 
	else if(value <= 120) {
		ui.visionDistanceIndicator.style = "background-color:yellow;";
	} else {
		ui.visionDistanceIndicator.style = "background-color:red;";
	}
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

NetworkTables.addKeyListener('/SmartDashboard/DistanceFromLL', (key, value) => {	
	var robotDistance = value;
});
// ========================================================================================
// Chassis
// ========================================================================================

// ========================================================================================
// Elevator
// ========================================================================================
NetworkTables.addKeyListener('/SmartDashboard/Elevator: Position', (key, value) => {
	if (value = "Level 1"){
		ui.elevatorPosition.style.fill = "green";
		ui.elevatorPosition.value = "1";
	}
	else if (value = "Level 2"){
		ui.elevatorPosition.style.fill = "yellow";
		ui.elevatorPosition.value = "2";
	}
	else if (value = "Level 3"){
		ui.elevatorPosition.style.fill = "red";
		ui.elevatorPosition.value = "3";
	} else {
		ui.elevatorPosition.style.fill = "blue";
		ui.elevatorPosition.value = "F";
	}
});

// ========================================================================================
// Bucket Group Box
// ========================================================================================
NetworkTables.addKeyListener('/SmartDashboard/Cargo:HasHatch', (key, value) => {	
	if (value) {
		ui.gamepiece.style.fill = "yellow";
		ui.gamepiece.style.stroke = "darkgrey";
		ui.hatchcenter.style.visibility = "visible";
	} else {
		ui.gamepiece.style.fill = "orange";
		ui.gamepiece.style.stroke = "darkgoldenrod";
		ui.hatchcenter.style.visibility = "hidden";
	}
});

// ========================================================================================
// misc 
// ========================================================================================
NetworkTables.addKeyListener('/SmartDashboard/CurrentCameraAddress', (key, value) => {	
	camera.setAttribute('src', value);
});

NetworkTables.addKeyListener('/SmartDashboard/Nuts', (key, value) => {
	var elem = document.getElementById("myBar");   
	var width = 10;
	var id = setInterval(frame, 10);
	function frame() {
		width = value; 
		elem.style.width = width + '%'; 
		elem.innerHTML = width * 1  + '%';
	}
});

addEventListener('error',(ev)=>{
    ipc.send('windowError',{mesg:ev.message,file:ev.filename,lineNumber:ev.lineno})
})