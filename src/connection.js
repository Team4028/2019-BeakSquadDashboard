let usbConnect = document.getElementById('usbConnectBtn'),
  radioConnect = document.getElementById('radioConnectBtn'),
  buttonConnect = document.getElementById('reconnectBtn'),
  camera = document.getElementById('camera'),
  robotState = document.getElementById('robot-state');
let loginShown = true;
var address = 'Not Connected';
var radioRequest = new XMLHttpRequest();
var usbRequest = new XMLHttpRequest();

// Set function to be called on NetworkTables connect. Not implemented.
//NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);

// Set function to be called when robot dis/connects
NetworkTables.addRobotConnectionListener(onRobotConnection, false);

// Sets function to be called when any NetworkTables key/value changes
//NetworkTables.addGlobalListener(onValueChanged, true);

// Function for hiding the connect box
onkeydown = key => {
  if (key.key === 'Escape') {
    document.body.classList.toggle('login', false);
    loginShown = false;
  }
};

/**
 * Function to be called when robot connects
 * @param {boolean} connected
 */
function onRobotConnection(connected) {
  var state = connected ? 'Robot connected!' : 'Robot disconnected.';
  console.log(state);
  robotState.textContent = state;
  
  if (connected == false)	{
    robotState.style.backgroundColor = "red";
    usbConnect.disabled = radioConnect.disabled = buttonConnect.disabled = false;
    buttonConnect.textContent = "Connect";
	}	else {
    robotState.style.backgroundColor = "green";
    buttonConnect.disabled = true;
    buttonConnect.textContent = "Connected to " + address;
	}
  
  buttonConnect.onclick = () => {
    document.body.classList.toggle('login', true);
    loginShown = true;
  };
  if (connected) {
    // On connect hide the connect popup
    document.body.classList.toggle('login', false);
    loginShown = false;
  } else if (loginShown) {
    setLogin();
  }
}
function setLogin() {
  // Enable the USB and Radio Connection buttons
  usbConnect.disabled = radioConnect.disabled = false;
}

// On click try to connect and disable the input and the button
usbConnect.onclick = () => {
  ipc.send('connect', '172.22.11.2');
  address = "172.22.11.2";
  usbConnect.disabled = true;
  camera.setAttribute('src', 'http://172.22.11.2:1180/stream.mjpg');
  usbConnect.textContent = 'Connecting...';
};
radioConnect.onclick = () => {
  ipc.send('connect', '10.40.28.2');
  address = "10.40.28.2";
  radioConnect.disabled = true;
  camera.setAttribute('src', 'http://10.40.28.11:5800/'); //Limelight
  //camera.setAttribute('src', 'http://10.40.28.13:1181/stream.mjpg'); //Camera #1 w/ Rasberry PI
  //camera.setAttribute('src', 'http://10.40.28.13:1182/stream.mjpg'); //Camera #2 w/ Rasberry PI
  radioConnect.textContent = 'Connecting...';
};

// Show login when starting
document.body.classList.toggle('login', true);
setLogin();

// Set Up grabbing Camera Frames
usbRequest.open("GET", 'http://172.22.11.2:1180/stream.mjpg', true); // true for asynchronous 
//radioRequest.open("GET", 'http://10.40.28.2:1180/stream.mjpg', true); // true for asynchronous 
radioRequest.open("GET", 'http://10.40.28.11:5800/', false); // true for asynchronous 
usbRequest.send();
usbRequest.send();
radioRequest.send();
