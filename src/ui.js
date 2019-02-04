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
		robot: document.getElementById('robot')
	},
		
	// elevator
	
	// carriage
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
    ui.robotScanTime.value = value;
});
// ========================================================================================
// auton mode
// ========================================================================================
// Load list of prewritten autonomous modes
NetworkTables.addKeyListener('/SmartDashboard/AUTON MODE: /options', (key, value) => {
//function loadTestAutons() {
	openChooserWindowBtn.disabled = false;
	openChooserWindowBtn.textContent = '= Click to Open Chooser Window =';
	
    // load list of available auton options
	//availableAutons = ["DoNothing", "Auton1", "Auton2", "Auton3", "Auton4", "Auton5", "Auton6"];

	clearAutonButtons();

    // dynamically build list of auton options
    for (let i = 0; i < value.length; i++) {
        addButton(value[i]);           
	}

	selectedAuton.value = "** Not selected **"
});

// ========================================================================================
// auton starting side
// ========================================================================================
NetworkTables.addKeyListener('/SmartDashboard/AUTON STARTING SIDE: /options', (key, value) => {
//function loadTestAutonSides() {
	openChooserWindowBtn.disabled = false;
	openChooserWindowBtn.textContent = '= Click to Open Chooser Window =';
	
    // load list of available auton side options
	//availableSides = ["LEFT", "RIGHT"];

	clearAutonSideButtons();

    // dynamically build list of auton options	
	for (let i = 0; i < value.length; i++) {
        addSideButton(value[i]);           
    }

	selectedSide.value = "** Not selected **"
});

NetworkTables.addKeyListener('/SmartDashboard/AUTON STARTING SIDE: /default', (key, value) => {
	setSideDefault(value.toString());
	selectedSide.value = value;
});

// ========================================================================================
// Robot Vision Diagram
// ========================================================================================
NetworkTables.addKeyListener('/SmartDashboard/Angle1FromLL', (key, value) => {
	ui.robotDiagram.robot.value = value;
	
    // Calculate visual rotation of arm
    var robotAngle1 = value;
    // Rotate the arm in diagram to match real arm
	ui.robotDiagram.robot.style.transform = `rotate(${robotAngle1}deg)`;
});

NetworkTables.addKeyListener('/SmartDashboard/Angle2', (key, value) => {	
    // Calculate visual rotation of arm
    var robotAngle2 = value*Math.PI/180;
	// Rotate the arm in diagram to match real arm
	var x = 240 - 
	Math.sqrt((240-ui.robotDiagram.robot.getAttribute('x'))^2 + 
	(27-ui.robotDiagram.robot.getAttribute('y'))^2)*Math.cos(robotAngle2);

	var y = 27 - 
	Math.sqrt((240-ui.robotDiagram.robot.getAttribute('x'))^2 + 
	(27-ui.robotDiagram.robot.getAttribute('y'))^2)*Math.sin(robotAngle2);

	ui.robotDiagram.robot.setAttribute('x', x);
	ui.robotDiagram.robot.setAttribute('y', y);
});

NetworkTables.addKeyListener('/SmartDashboard/DistanceFromLL', (key, value) => {	
	var robotDistance = value;

});
// ========================================================================================
// Chassis
// =======================================================================================

// ========================================================================================
// Carriage Group Box
// ========================================================================================

// ========================================================================================
// misc 
// ========================================================================================
NetworkTables.addKeyListener('/SmartDashboard/DistanceFromLL', (key, value) => {	
	if(value == true){

	}
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