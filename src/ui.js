// Define UI elements
let ui = {
	fmsDebugMsg: document.getElementById('fmsDebugMsg'),
	robotCodeBuild: document.getElementById('robotCodeBuild'),
	robotScanTime: document.getElementById('robotScanTime'),
	
	// auton selectors
	openChooserWindowBtn: document.getElementById('openChooserWindowBtn'),
	
	// chassis
	leftChassisWheelTargetVel: document.getElementById('leftChassisWheelTargetVel'),
	leftChassisWheelActualVel: document.getElementById('leftChassisWheelActualVel'),
	rightChassisWheelTargetVel: document.getElementById('rightChassisWheelTargetVel'),
	rightChassisWheelActualVel: document.getElementById('rightChassisWheelActualVel'),
	
	// infeed arm diagram
	robotDiagram: {
        infeedRightArm: document.getElementById('infeed-right-arm'),
		infeedLeftArm: document.getElementById('infeed-left-arm'),
		cube: document.getElementById('cube-gamepiece'),
		carriageSqueezeSide: document.getElementById('carriage-squeeze-side'),
		carriageBack: document.getElementById('carriage-back-side'),
		elevatorMovingStage: document.getElementById('elevator-moving-stage'),
		carriage: document.getElementById('carriage'),
		carriageMotor: document.getElementById('carriage-motor'),
		elevatorCube: document.getElementById('elevator-cube'),
	},
		
	// elevator
	elevatorHeightInches: document.getElementById('elevatorHeightInches'),
	elevatorHeightNU: document.getElementById('elevatorHeightNU'),
	elevatorState: document.getElementById('elevatorState'),
	elevatorInPosition: document.getElementById('elevatorInPosition'),
	climberServerOpen: document.getElementById('climberServerOpen'),
	robotPose: document.getElementById('robotPose'),
	chassisAngle: document.getElementById('chassisAngle'),
	//chassisRemainingPathLength: document.getElementById('chassisRemainingPathLength'),
	
	// carriage
	carriageInfeedPercentVBus: document.getElementById('carriageInfeedPercentVBus'),
	carriageOutfeedPercentVBus: document.getElementById('carriageOutfeedPercentVBus'),
	carriageState: document.getElementById('carriageState'),
	carriageSqueezed: document.getElementById('carriageSqueezed'),
	cubeInCarriage: document.getElementById('cubeInCarriage'),
	
	// infeed
	leftArmCurrentAngle: document.getElementById('leftArmCurrentAngle'),
	rightArmCurrentAngle: document.getElementById('rightArmCurrentAngle'),
	leftArmCurrentAngleNU: document.getElementById('leftArmCurrentAngleNU'),
	rightArmCurrentAngleNU: document.getElementById('rightArmCurrentAngleNU'),
	infeedArmsState: document.getElementById('infeedArmsState'),
	infeedArmsTargetSqueezeAngle: document.getElementById('infeedArmsTargetSqueezeAngle'),
	infeedWheelsPercentVBus: document.getElementById('infeedWheelsPercentVBus'),
	infeedArmsInPosition: document.getElementById('infeedArmsInPosition'),
	infeedWheelsState: document.getElementById('infeedWheelsState'),
	infeedArmsSafe: document.getElementById('infeedArmsSafe'),
	infeedArmsLeftHomed: document.getElementById('infeedArmsLeftHomed'),
	infeedArmsRightHomed: document.getElementById('infeedArmsRightHomed'),
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
// Chassis
// =======================================================================================
NetworkTables.addKeyListener('/SmartDashboard/Chassis: Left Wheel Target Velocity', (key, value) => {
    ui.leftChassisWheelTargetVel.value = value;
});

NetworkTables.addKeyListener('/SmartDashboard/Chassis: Left Velocity', (key, value) => {
    ui.leftChassisWheelActualVel.value = value;
});

NetworkTables.addKeyListener('/SmartDashboard/Chasiss: Right Wheel Target Velocity', (key, value) => {
    ui.rightChassisWheelTargetVel.value = value;
});

NetworkTables.addKeyListener('/SmartDashboard/Chassis: Right Velocity', (key, value) => {
    ui.rightChassisWheelActualVel.value = value;
});

NetworkTables.addKeyListener('/SmartDashboard/Chassis: Robot Pose', (key, value) => {
    ui.robotPose.value = value;
});

NetworkTables.addKeyListener('/SmartDashboard/Chassis: Angle', (key, value) => {
    ui.chassisAngle.value = value;
});

//NetworkTables.addKeyListener('/SmartDashboard/Chassis: Robot Pose', (key, value) => {
//    ui.chassisRemainingPathLength.value = value;
//});

// ========================================================================================
// Elevator Group Box
// ========================================================================================

NetworkTables.addKeyListener('/SmartDashboard/Elevator:Position(in)', (key, value) => {
	ui.elevatorHeightInches.value = value;
	
	//Calculate Relative Transformation Height
	var transformHeight = Math.round(value * (81/85)) //Total travel height of elevator [in] /
	//									    			total image travel distance [pixels]
	//Transform Elevator to match actual elevator
	ui.robotDiagram.elevatorMovingStage.setAttribute('y', 325 - transformHeight);
	ui.robotDiagram.carriage.setAttribute('y', 410 - 2 * transformHeight);
	ui.robotDiagram.carriageMotor.setAttribute('y', 403 - 2 * transformHeight);
	ui.robotDiagram.elevatorCube.setAttribute('y', 405 - 2 * transformHeight);
});

NetworkTables.addKeyListener('/SmartDashboard/Elevator:Position', (key, value) => {
    ui.elevatorHeightNU.value = value;
});

NetworkTables.addKeyListener('/SmartDashboard/Elevator:State', (key, value) => {
    ui.elevatorState.value = value;
});

NetworkTables.addKeyListener('/SmartDashboard/Elevator:IsInPosition', (key, value) => {
    //ui.elevatorInPosition.value = value;
	
	if (value == false)	{
		ui.elevatorInPosition.style = "background-color:red;";
	} else {
		ui.elevatorInPosition.style = "background-color:green;";
	}
});

NetworkTables.addKeyListener('/SmartDashboard/Is Climber Servo Open?:', (key, value) => {
    //ui.climberServerOpen.value = value;
	
	if (value == false)	{
		ui.climberServerOpen.style = "background-color:red;";
	} else {
		ui.climberServerOpen.style = "background-color:green;";
	}
});

// ========================================================================================
// Infeed Group Box
// ========================================================================================
NetworkTables.addKeyListener('/SmartDashboard/InfeedArms:Left Current Angle', (key, value) => {
    ui.leftArmCurrentAngle.value = value;
	
	
    // Calculate visual rotation of arm
    var armAngle = value - 90;
    // Rotate the arm in diagram to match real arm
	ui.robotDiagram.infeedLeftArm.style.transform = `rotate(${armAngle}deg)`;
});

NetworkTables.addKeyListener('/SmartDashboard/InfeedArms:Right Current Angle:', (key, value) => {
    ui.rightArmCurrentAngle.value = value;
	
    // Calculate visual rotation of arm
    var armAngle = -value + 90;
    // Rotate the arm in diagram to match real arm
	ui.robotDiagram.infeedRightArm.style.transform = `rotate(${armAngle}deg)`;
});

NetworkTables.addKeyListener('/SmartDashboard/InfeedArms:Left Current PositionNU', (key, value) => {
    ui.leftArmCurrentAngleNU.value = value;
});

NetworkTables.addKeyListener('/SmartDashboard/InfeedArms:Right Current PositionNU:', (key, value) => {
    ui.rightArmCurrentAngleNU.value = value;
});

NetworkTables.addKeyListener('/SmartDashboard/InfeedArms:State', (key, value) => {
    ui.infeedArmsState.value = value;
});

NetworkTables.addKeyListener('/SmartDashboard/InfeedArms:Target Squeeze Angle', (key, value) => {
    ui.infeedArmsTargetSqueezeAngle.value = value;
});

NetworkTables.addKeyListener('/SmartDashboard/InfeedWheels:%VBus', (key, value) => {
    ui.infeedWheelsPercentVBus.value = value;
});

NetworkTables.addKeyListener('/SmartDashboard/InfeedArms:InPosition?', (key, value) => {
    //ui.infeedArmsInPosition.value = value;
	
	if (value == false)
	{
		ui.infeedArmsInPosition.style = "background-color:red;";
	}
	else
	{
		ui.infeedArmsInPosition.style = "background-color:green;";
	}
});

NetworkTables.addKeyListener('/SmartDashboard/InfeedWheels:State', (key, value) => {
    ui.infeedWheelsState.value = value;
});

NetworkTables.addKeyListener('/SmartDashboard/InfeedArms:Are Safe?', (key, value) => {
    //ui.infeedArmsInPosition.value = value;
	
	if (value == false)
	{
		ui.infeedArmsSafe.style = "background-color:red;";
	}
	else
	{
		ui.infeedArmsSafe.style = "background-color:green;";
	}
});

NetworkTables.addKeyListener('/SmartDashboard/InfeedArms:Left Homed?', (key, value) => {
    //ui.infeedArmsInPosition.value = value;
	
	if (value == false)
	{
		ui.infeedArmsLeftHomed.style = "background-color:red;";
	}
	else
	{
		ui.infeedArmsLeftHomed.style = "background-color:green;";
	}
});

NetworkTables.addKeyListener('/SmartDashboard/InfeedArms:Right Homed?', (key, value) => {
    //ui.infeedArmsInPosition.value = value;
	
	if (value == false)
	{
		ui.infeedArmsRightHomed.style = "background-color:red;";
	}
	else
	{
		ui.infeedArmsRightHomed.style = "background-color:green;";
	}
});
// ========================================================================================
// Carriage Group Box
// ========================================================================================
NetworkTables.addKeyListener('/SmartDashboard/Carriage: Wheels Feed In %VBus', (key, value) => {
    ui.carriageInfeedPercentVBus.value = value;
});

NetworkTables.addKeyListener('/SmartDashboard/Carriage: Wheels Feed Out %VBus', (key, value) => {
    ui.carriageOutfeedPercentVBus.value = value;
});

NetworkTables.addKeyListener('/SmartDashboard/State: Carriage', (key, value) => {
    ui.carriageState.value = value;
});

NetworkTables.addKeyListener('/SmartDashboard/Carriage: Is Squeezed', (key, value) => {
	if (value == false) {
		ui.carriageSqueezed.style = "background-color:red;";

		ui.robotDiagram.carriageSqueezeSide.setAttribute('x', 176);
		ui.robotDiagram.carriageBack.setAttribute('width', 49);
		ui.robotDiagram.cube.setAttribute('width', 35);
	} else {
		ui.carriageSqueezed.style = "background-color:green;";

		ui.robotDiagram.carriageSqueezeSide.setAttribute('x', 176 - 5);
		ui.robotDiagram.carriageBack.setAttribute('width', 49 - 5);
		ui.robotDiagram.cube.setAttribute('width', 35 - 5);
	}
});

NetworkTables.addKeyListener('/SmartDashboard/Carriage: Is Cube In Carriage?', (key, value) => {
	if (value == false)	{
		ui.cubeInCarriage.style = "background-color:red;";
		ui.robotDiagram.cube.style = "fill:#222";
		ui.robotDiagram.elevatorCube.style = "fill:#222";
	} else {
		ui.cubeInCarriage.style = "background-color:green;";
		ui.robotDiagram.cube.style = "fill:yellow";
		ui.robotDiagram.elevatorCube.style = "fill:yellow";
	}
});

NetworkTables.addKeyListener('/SmartDashboard/Carriage: Is Flapped Up', (key, value) => {
	if (value == false)	{
		ui.robotDiagram.carriage.style.transform = `rotate(${0}deg)`;
		ui.robotDiagram.carriageMotor.style.transform = `rotate(${0}deg)`;
		ui.robotDiagram.elevatorCube.style.transform = `rotate(${0}deg)`;
	} else {
		ui.robotDiagram.carriage.style.transform = `rotate(${-30}deg)`;
		ui.robotDiagram.carriageMotor.style.transform = `rotate(${-30}deg)`;
		ui.robotDiagram.elevatorCube.style.transform = `rotate(${-30}deg)`;
	}
});
// ========================================================================================
// misc 
// ========================================================================================
addEventListener('error',(ev)=>{
    ipc.send('windowError',{mesg:ev.message,file:ev.filename,lineNumber:ev.lineno})
})