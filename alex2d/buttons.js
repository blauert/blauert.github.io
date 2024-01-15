// RAHEN

const rahfallIncrement = Vector.create(0, -0.3);  // negative y -> up

function createRahControls(rah) {
    let interval; // Variable to hold the interval ID
  
    function stopLoop() {
        clearInterval(interval); // Stop the interval
        document.removeEventListener("touchend", stopLoop); // Remove the touchend event listener
        document.removeEventListener("mouseup", stopLoop); // Remove the mouseup event listener
        document.removeEventListener("mouseleave", stopLoop); // Remove the mouseleave event listener
    }
  
    function startLoopUp(event) {
        if (event.button !== 0 && event.type !== "touchstart") {
            return; // Only start the event on left mouse button down or touchstart
        }
        event.preventDefault(); // Prevent default touch behavior
        interval = setInterval(function () {
            let curr_straight = Vector.rotate(rah.rack.pointB, -rah.rack.angleB);
            let new_straight = Vector.add(curr_straight, rahfallIncrement);
            let direction = Vector.sub(rah.oben, new_straight);
            if (direction.y < 0) {
                rah.rack.pointB = Vector.rotate(new_straight, rah.rack.angleB);
            } else {
                rah.rack.pointB = Vector.rotate(rah.oben, rah.rack.angleB);
                stopLoop();
            }
        }, 10); // Set interval time to 10 milliseconds (adjust as needed)
        document.addEventListener("touchend", stopLoop); // Add touchend event listener to stop the interval when the button is released
        document.addEventListener("mouseup", stopLoop); // Add mouseup event listener to stop the interval when the button is released
        document.addEventListener("mouseleave", stopLoop); // Add mouseleave event listener to stop the interval when the mouse leaves the button area
    }
  
    function startLoopDown(event) {
        if (event.button !== 0 && event.type !== "touchstart") {
            return; // Only start the event on left mouse button down or touchstart
        }
        event.preventDefault(); // Prevent default touch behavior
        interval = setInterval(function () {
            let curr_straight = Vector.rotate(rah.rack.pointB, -rah.rack.angleB);
            let new_straight = Vector.sub(curr_straight, rahfallIncrement);
            let direction = Vector.sub(rah.unten, new_straight);
            if (direction.y > 0) {
                rah.rack.pointB = Vector.rotate(new_straight, rah.rack.angleB);
            } else {
                rah.rack.pointB = Vector.rotate(rah.unten, rah.rack.angleB);
                stopLoop();
            }
        }, 10); // Set interval time to 10 milliseconds (adjust as needed)
        document.addEventListener("touchend", stopLoop); // Add touchend event listener to stop the interval when the button is released
        document.addEventListener("mouseup", stopLoop); // Add mouseup event listener to stop the interval when the button is released
        document.addEventListener("mouseleave", stopLoop); // Add mouseleave event listener to stop the interval when the mouse leaves the button area
    }
  
    return {
         startLoopUp: startLoopUp,
         startLoopDown: startLoopDown
    };
}


let obermarsrahControls = createRahControls({
    rack: obermarsrahRack,
    oben: obermarsrahOben,
    unten: obermarsrahUnten
});
document.querySelector("#obermarsrah_up").addEventListener("mousedown", obermarsrahControls.startLoopUp);
document.querySelector("#obermarsrah_up").addEventListener("touchstart", obermarsrahControls.startLoopUp);
document.querySelector("#obermarsrah_down").addEventListener("mousedown", obermarsrahControls.startLoopDown);
document.querySelector("#obermarsrah_down").addEventListener("touchstart", obermarsrahControls.startLoopDown);

let bramrahControls = createRahControls({
    rack: bramrahRack,
    oben: bramrahOben,
    unten: bramrahUnten
});
document.querySelector("#bramrah_up").addEventListener("mousedown", bramrahControls.startLoopUp);
document.querySelector("#bramrah_up").addEventListener("touchstart", bramrahControls.startLoopUp);
document.querySelector("#bramrah_down").addEventListener("mousedown", bramrahControls.startLoopDown);
document.querySelector("#bramrah_down").addEventListener("touchstart", bramrahControls.startLoopDown);

let royalrahControls = createRahControls({
    rack: royalrahRack,
    oben: royalrahOben,
    unten: royalrahUnten
});
document.querySelector("#royalrah_up").addEventListener("mousedown", royalrahControls.startLoopUp);
document.querySelector("#royalrah_up").addEventListener("touchstart", royalrahControls.startLoopUp);
document.querySelector("#royalrah_down").addEventListener("mousedown", royalrahControls.startLoopDown);
document.querySelector("#royalrah_down").addEventListener("touchstart", royalrahControls.startLoopDown);


// SEILE

function createRopeControls(ropes, min_length, max_length) {
    let interval; // Variable to hold the interval ID
  
    function stopLoop() {
        clearInterval(interval); // Stop the interval
        document.removeEventListener("touchend", stopLoop); // Remove the touchend event listener
        document.removeEventListener("mouseup", stopLoop); // Remove the mouseup event listener
        document.removeEventListener("mouseleave", stopLoop); // Remove the mouseleave event listener
    }
  
    function startLoopHolen(event) {
        if (event.button !== 0 && event.type !== "touchstart") {
            return; // Only start the event on left mouse button down or touchstart
        }
        event.preventDefault(); // Prevent default touch behavior
        interval = setInterval(function () {
            if (ropes[0].constraints[0].length > min_length) {
                for (let rope of ropes) {
                    for (let c of rope.constraints) {
                        c.length = Math.max(c.length - 0.1, min_length);
                    }
                }
            } else {
                stopLoop();
            }
        }, 10); // Set interval time to 10 milliseconds (adjust as needed)
        document.addEventListener("touchend", stopLoop); // Add touchend event listener to stop the interval when the button is released
        document.addEventListener("mouseup", stopLoop); // Add mouseup event listener to stop the interval when the button is released
        document.addEventListener("mouseleave", stopLoop); // Add mouseleave event listener to stop the interval when the mouse leaves the button area
    }
  
    function startLoopFieren(event) {
        if (event.button !== 0 && event.type !== "touchstart") {
            return; // Only start the event on left mouse button down or touchstart
        }
        event.preventDefault(); // Prevent default touch behavior
        interval = setInterval(function () {
            if (ropes[0].constraints[0].length < max_length) {
                for (let rope of ropes) {
                    for (let c of rope.constraints) {
                        c.length = Math.min(c.length + 0.1, max_length);
                    }
                }
            } else {
                stopLoop();
            }
        }, 10); // Set interval time to 10 milliseconds (adjust as needed)
        document.addEventListener("touchend", stopLoop); // Add touchend event listener to stop the interval when the button is released
        document.addEventListener("mouseup", stopLoop); // Add mouseup event listener to stop the interval when the button is released
        document.addEventListener("mouseleave", stopLoop); // Add mouseleave event listener to stop the interval when the mouse leaves the button area
    }
  
    return {
         startLoopHolen: startLoopHolen,
         startLoopFieren: startLoopFieren
    };
}


// toppnanten & obermarsniederholer

let toppnantBbControls = createRopeControls([toppnantBb], 20, 50);
document.querySelector("#toppnantBb_holen").addEventListener("mousedown", toppnantBbControls.startLoopHolen);
document.querySelector("#toppnantBb_holen").addEventListener("touchstart", toppnantBbControls.startLoopHolen);
document.querySelector("#toppnantBb_fieren").addEventListener("mousedown", toppnantBbControls.startLoopFieren);
document.querySelector("#toppnantBb_fieren").addEventListener("touchstart", toppnantBbControls.startLoopFieren);
let toppnantStbControls = createRopeControls([toppnantStb], 20, 50);
document.querySelector("#toppnantStb_holen").addEventListener("mousedown", toppnantStbControls.startLoopHolen);
document.querySelector("#toppnantStb_holen").addEventListener("touchstart", toppnantStbControls.startLoopHolen);
document.querySelector("#toppnantStb_fieren").addEventListener("mousedown", toppnantStbControls.startLoopFieren);
document.querySelector("#toppnantStb_fieren").addEventListener("touchstart", toppnantStbControls.startLoopFieren);

let obermarsniederholerBbControls = createRopeControls([obermarsniederholerBb], 1, 30);
document.querySelector("#obermarsniederholerBb_holen").addEventListener("mousedown", obermarsniederholerBbControls.startLoopHolen);
document.querySelector("#obermarsniederholerBb_holen").addEventListener("touchstart", obermarsniederholerBbControls.startLoopHolen);
document.querySelector("#obermarsniederholerBb_fieren").addEventListener("mousedown", obermarsniederholerBbControls.startLoopFieren);
document.querySelector("#obermarsniederholerBb_fieren").addEventListener("touchstart", obermarsniederholerBbControls.startLoopFieren);
let obermarsniederholerStbControls = createRopeControls([obermarsniederholerStb], 1, 30);
document.querySelector("#obermarsniederholerStb_holen").addEventListener("mousedown", obermarsniederholerStbControls.startLoopHolen);
document.querySelector("#obermarsniederholerStb_holen").addEventListener("touchstart", obermarsniederholerStbControls.startLoopHolen);
document.querySelector("#obermarsniederholerStb_fieren").addEventListener("mousedown", obermarsniederholerStbControls.startLoopFieren);
document.querySelector("#obermarsniederholerStb_fieren").addEventListener("touchstart", obermarsniederholerStbControls.startLoopFieren);


// geitaue und gordinge

let royalgeitaueControls = createRopeControls([royalgeitauBb, royalgeitauStb], 0, 30);
document.querySelector("#royalgeitaue_holen").addEventListener("mousedown", royalgeitaueControls.startLoopHolen);
document.querySelector("#royalgeitaue_holen").addEventListener("touchstart", royalgeitaueControls.startLoopHolen);
document.querySelector("#royalgeitaue_fieren").addEventListener("mousedown", royalgeitaueControls.startLoopFieren);
document.querySelector("#royalgeitaue_fieren").addEventListener("touchstart", royalgeitaueControls.startLoopFieren);
let royalgordingeControls = createRopeControls([royalgordingBb, royalgordingStb], 0, 20);
document.querySelector("#royalgordinge_holen").addEventListener("mousedown", royalgordingeControls.startLoopHolen);
document.querySelector("#royalgordinge_holen").addEventListener("touchstart", royalgordingeControls.startLoopHolen);
document.querySelector("#royalgordinge_fieren").addEventListener("mousedown", royalgordingeControls.startLoopFieren);
document.querySelector("#royalgordinge_fieren").addEventListener("touchstart", royalgordingeControls.startLoopFieren);
let bramgeitaueControls = createRopeControls([bramgeitauBb, bramgeitauStb], 0, 30);
document.querySelector("#bramgeitaue_holen").addEventListener("mousedown", bramgeitaueControls.startLoopHolen);
document.querySelector("#bramgeitaue_holen").addEventListener("touchstart", bramgeitaueControls.startLoopHolen);
document.querySelector("#bramgeitaue_fieren").addEventListener("mousedown", bramgeitaueControls.startLoopFieren);
document.querySelector("#bramgeitaue_fieren").addEventListener("touchstart", bramgeitaueControls.startLoopFieren);
let bramgordingeControls = createRopeControls([bramgordingBb, bramgordingStb], 0, 20);
document.querySelector("#bramgordinge_holen").addEventListener("mousedown", bramgordingeControls.startLoopHolen);
document.querySelector("#bramgordinge_holen").addEventListener("touchstart", bramgordingeControls.startLoopHolen);
document.querySelector("#bramgordinge_fieren").addEventListener("mousedown", bramgordingeControls.startLoopFieren);
document.querySelector("#bramgordinge_fieren").addEventListener("touchstart", bramgordingeControls.startLoopFieren);
let obermarsgeitaueControls = createRopeControls([obermarsgeitauBb, obermarsgeitauStb], 0, 30);
document.querySelector("#obermarsgeitaue_holen").addEventListener("mousedown", obermarsgeitaueControls.startLoopHolen);
document.querySelector("#obermarsgeitaue_holen").addEventListener("touchstart", obermarsgeitaueControls.startLoopHolen);
document.querySelector("#obermarsgeitaue_fieren").addEventListener("mousedown", obermarsgeitaueControls.startLoopFieren);
document.querySelector("#obermarsgeitaue_fieren").addEventListener("touchstart", obermarsgeitaueControls.startLoopFieren);
let obermarsgordingeControls = createRopeControls([obermarsgordingBb, obermarsgordingStb], 0, 20);
document.querySelector("#obermarsgordinge_holen").addEventListener("mousedown", obermarsgordingeControls.startLoopHolen);
document.querySelector("#obermarsgordinge_holen").addEventListener("touchstart", obermarsgordingeControls.startLoopHolen);
document.querySelector("#obermarsgordinge_fieren").addEventListener("mousedown", obermarsgordingeControls.startLoopFieren);
document.querySelector("#obermarsgordinge_fieren").addEventListener("touchstart", obermarsgordingeControls.startLoopFieren);
let untermarsgeitaueControls = createRopeControls([untermarsgeitauBb, untermarsgeitauStb], 0, 30);
document.querySelector("#untermarsgeitaue_holen").addEventListener("mousedown", untermarsgeitaueControls.startLoopHolen);
document.querySelector("#untermarsgeitaue_holen").addEventListener("touchstart", untermarsgeitaueControls.startLoopHolen);
document.querySelector("#untermarsgeitaue_fieren").addEventListener("mousedown", untermarsgeitaueControls.startLoopFieren);
document.querySelector("#untermarsgeitaue_fieren").addEventListener("touchstart", untermarsgeitaueControls.startLoopFieren);
let untermarsgordingeControls = createRopeControls([untermarsgordingBb, untermarsgordingStb], 0, 20);
document.querySelector("#untermarsgordinge_holen").addEventListener("mousedown", untermarsgordingeControls.startLoopHolen);
document.querySelector("#untermarsgordinge_holen").addEventListener("touchstart", untermarsgordingeControls.startLoopHolen);
document.querySelector("#untermarsgordinge_fieren").addEventListener("mousedown", untermarsgordingeControls.startLoopFieren);
document.querySelector("#untermarsgordinge_fieren").addEventListener("touchstart", untermarsgordingeControls.startLoopFieren);
let untersegelgeitaueControls = createRopeControls([untersegelgeitauBb, untersegelgeitauStb], 0, 50);
document.querySelector("#untersegelgeitaue_holen").addEventListener("mousedown", untersegelgeitaueControls.startLoopHolen);
document.querySelector("#untersegelgeitaue_holen").addEventListener("touchstart", untersegelgeitaueControls.startLoopHolen);
document.querySelector("#untersegelgeitaue_fieren").addEventListener("mousedown", untersegelgeitaueControls.startLoopFieren);
document.querySelector("#untersegelgeitaue_fieren").addEventListener("touchstart", untersegelgeitaueControls.startLoopFieren);
let untersegelgordingeControls = createRopeControls([untersegelgordingBb, untersegelgordingStb], 0, 30);
document.querySelector("#untersegelgordinge_holen").addEventListener("mousedown", untersegelgordingeControls.startLoopHolen);
document.querySelector("#untersegelgordinge_holen").addEventListener("touchstart", untersegelgordingeControls.startLoopHolen);
document.querySelector("#untersegelgordinge_fieren").addEventListener("mousedown", untersegelgordingeControls.startLoopFieren);
document.querySelector("#untersegelgordinge_fieren").addEventListener("touchstart", untersegelgordingeControls.startLoopFieren);


// schoten

let royalschotStbControls = createRopeControls([royalschotStb], 0, 20);
document.querySelector("#royalschotStb_holen").addEventListener("mousedown", royalschotStbControls.startLoopHolen);
document.querySelector("#royalschotStb_holen").addEventListener("touchstart", royalschotStbControls.startLoopHolen);
document.querySelector("#royalschotStb_fieren").addEventListener("mousedown", royalschotStbControls.startLoopFieren);
document.querySelector("#royalschotStb_fieren").addEventListener("touchstart", royalschotStbControls.startLoopFieren);
let royalschotBbControls = createRopeControls([royalschotBb], 0, 20);
document.querySelector("#royalschotBb_holen").addEventListener("mousedown", royalschotBbControls.startLoopHolen);
document.querySelector("#royalschotBb_holen").addEventListener("touchstart", royalschotBbControls.startLoopHolen);
document.querySelector("#royalschotBb_fieren").addEventListener("mousedown", royalschotBbControls.startLoopFieren);
document.querySelector("#royalschotBb_fieren").addEventListener("touchstart", royalschotBbControls.startLoopFieren);
let bramschotStbControls = createRopeControls([bramschotStb], 0, 40);
document.querySelector("#bramschotStb_holen").addEventListener("mousedown", bramschotStbControls.startLoopHolen);
document.querySelector("#bramschotStb_holen").addEventListener("touchstart", bramschotStbControls.startLoopHolen);
document.querySelector("#bramschotStb_fieren").addEventListener("mousedown", bramschotStbControls.startLoopFieren);
document.querySelector("#bramschotStb_fieren").addEventListener("touchstart", bramschotStbControls.startLoopFieren);
let bramschotBbControls = createRopeControls([bramschotBb], 0, 40);
document.querySelector("#bramschotBb_holen").addEventListener("mousedown", bramschotBbControls.startLoopHolen);
document.querySelector("#bramschotBb_holen").addEventListener("touchstart", bramschotBbControls.startLoopHolen);
document.querySelector("#bramschotBb_fieren").addEventListener("mousedown", bramschotBbControls.startLoopFieren);
document.querySelector("#bramschotBb_fieren").addEventListener("touchstart", bramschotBbControls.startLoopFieren);
let obermarsschotStbControls = createRopeControls([obermarsschotStb], 0, 20);
document.querySelector("#obermarsschotStb_holen").addEventListener("mousedown", obermarsschotStbControls.startLoopHolen);
document.querySelector("#obermarsschotStb_holen").addEventListener("touchstart", obermarsschotStbControls.startLoopHolen);
document.querySelector("#obermarsschotStb_fieren").addEventListener("mousedown", obermarsschotStbControls.startLoopFieren);
document.querySelector("#obermarsschotStb_fieren").addEventListener("touchstart", obermarsschotStbControls.startLoopFieren);
let obermarsschotBbControls = createRopeControls([obermarsschotBb], 0, 20);
document.querySelector("#obermarsschotBb_holen").addEventListener("mousedown", obermarsschotBbControls.startLoopHolen);
document.querySelector("#obermarsschotBb_holen").addEventListener("touchstart", obermarsschotBbControls.startLoopHolen);
document.querySelector("#obermarsschotBb_fieren").addEventListener("mousedown", obermarsschotBbControls.startLoopFieren);
document.querySelector("#obermarsschotBb_fieren").addEventListener("touchstart", obermarsschotBbControls.startLoopFieren);
let untermarsschotStbControls = createRopeControls([untermarsschotStb], 0, 20);
document.querySelector("#untermarsschotStb_holen").addEventListener("mousedown", untermarsschotStbControls.startLoopHolen);
document.querySelector("#untermarsschotStb_holen").addEventListener("touchstart", untermarsschotStbControls.startLoopHolen);
document.querySelector("#untermarsschotStb_fieren").addEventListener("mousedown", untermarsschotStbControls.startLoopFieren);
document.querySelector("#untermarsschotStb_fieren").addEventListener("touchstart", untermarsschotStbControls.startLoopFieren);
let untermarsschotBbControls = createRopeControls([untermarsschotBb], 0, 20);
document.querySelector("#untermarsschotBb_holen").addEventListener("mousedown", untermarsschotBbControls.startLoopHolen);
document.querySelector("#untermarsschotBb_holen").addEventListener("touchstart", untermarsschotBbControls.startLoopHolen);
document.querySelector("#untermarsschotBb_fieren").addEventListener("mousedown", untermarsschotBbControls.startLoopFieren);
document.querySelector("#untermarsschotBb_fieren").addEventListener("touchstart", untermarsschotBbControls.startLoopFieren);
let untersegelschotStbControls = createRopeControls([untersegelschotStb], 0, 40);
document.querySelector("#untersegelschotStb_holen").addEventListener("mousedown", untersegelschotStbControls.startLoopHolen);
document.querySelector("#untersegelschotStb_holen").addEventListener("touchstart", untersegelschotStbControls.startLoopHolen);
document.querySelector("#untersegelschotStb_fieren").addEventListener("mousedown", untersegelschotStbControls.startLoopFieren);
document.querySelector("#untersegelschotStb_fieren").addEventListener("touchstart", untersegelschotStbControls.startLoopFieren);
let untersegelschotBbControls = createRopeControls([untersegelschotBb], 0, 40);
document.querySelector("#untersegelschotBb_holen").addEventListener("mousedown", untersegelschotBbControls.startLoopHolen);
document.querySelector("#untersegelschotBb_holen").addEventListener("touchstart", untersegelschotBbControls.startLoopHolen);
document.querySelector("#untersegelschotBb_fieren").addEventListener("mousedown", untersegelschotBbControls.startLoopFieren);
document.querySelector("#untersegelschotBb_fieren").addEventListener("touchstart", untersegelschotBbControls.startLoopFieren);
let untersegelhalsStbControls = createRopeControls([untersegelhalsStb], 0, 40);
document.querySelector("#untersegelhalsStb_holen").addEventListener("mousedown", untersegelhalsStbControls.startLoopHolen);
document.querySelector("#untersegelhalsStb_holen").addEventListener("touchstart", untersegelhalsStbControls.startLoopHolen);
document.querySelector("#untersegelhalsStb_fieren").addEventListener("mousedown", untersegelhalsStbControls.startLoopFieren);
document.querySelector("#untersegelhalsStb_fieren").addEventListener("touchstart", untersegelhalsStbControls.startLoopFieren);
let untersegelhalsBbControls = createRopeControls([untersegelhalsBb], 0, 40);
document.querySelector("#untersegelhalsBb_holen").addEventListener("mousedown", untersegelhalsBbControls.startLoopHolen);
document.querySelector("#untersegelhalsBb_holen").addEventListener("touchstart", untersegelhalsBbControls.startLoopHolen);
document.querySelector("#untersegelhalsBb_fieren").addEventListener("mousedown", untersegelhalsBbControls.startLoopFieren);
document.querySelector("#untersegelhalsBb_fieren").addEventListener("touchstart", untersegelhalsBbControls.startLoopFieren);

// brassen

let obermarsbrasseStbControls = createRopeControls([obermarsbrasseStb], 0, 100);
document.querySelector("#obermarsbrasseStb_holen").addEventListener("mousedown", obermarsbrasseStbControls.startLoopHolen);
document.querySelector("#obermarsbrasseStb_holen").addEventListener("touchstart", obermarsbrasseStbControls.startLoopHolen);
document.querySelector("#obermarsbrasseStb_fieren").addEventListener("mousedown", obermarsbrasseStbControls.startLoopFieren);
document.querySelector("#obermarsbrasseStb_fieren").addEventListener("touchstart", obermarsbrasseStbControls.startLoopFieren);
let obermarsbrasseBbControls = createRopeControls([obermarsbrasseBb], 0, 100);
document.querySelector("#obermarsbrasseBb_holen").addEventListener("mousedown", obermarsbrasseBbControls.startLoopHolen);
document.querySelector("#obermarsbrasseBb_holen").addEventListener("touchstart", obermarsbrasseBbControls.startLoopHolen);
document.querySelector("#obermarsbrasseBb_fieren").addEventListener("mousedown", obermarsbrasseBbControls.startLoopFieren);
document.querySelector("#obermarsbrasseBb_fieren").addEventListener("touchstart", obermarsbrasseBbControls.startLoopFieren);
let untermarsbrasseStbControls = createRopeControls([untermarsbrasseStb], 0, 90);
document.querySelector("#untermarsbrasseStb_holen").addEventListener("mousedown", untermarsbrasseStbControls.startLoopHolen);
document.querySelector("#untermarsbrasseStb_holen").addEventListener("touchstart", untermarsbrasseStbControls.startLoopHolen);
document.querySelector("#untermarsbrasseStb_fieren").addEventListener("mousedown", untermarsbrasseStbControls.startLoopFieren);
document.querySelector("#untermarsbrasseStb_fieren").addEventListener("touchstart", untermarsbrasseStbControls.startLoopFieren);
let untermarsbrasseBbControls = createRopeControls([untermarsbrasseBb], 0, 90);
document.querySelector("#untermarsbrasseBb_holen").addEventListener("mousedown", untermarsbrasseBbControls.startLoopHolen);
document.querySelector("#untermarsbrasseBb_holen").addEventListener("touchstart", untermarsbrasseBbControls.startLoopHolen);
document.querySelector("#untermarsbrasseBb_fieren").addEventListener("mousedown", untermarsbrasseBbControls.startLoopFieren);
document.querySelector("#untermarsbrasseBb_fieren").addEventListener("touchstart", untermarsbrasseBbControls.startLoopFieren);
let unterbrasseStbControls = createRopeControls([unterbrasseStb], 0, 80);
document.querySelector("#unterbrasseStb_holen").addEventListener("mousedown", unterbrasseStbControls.startLoopHolen);
document.querySelector("#unterbrasseStb_holen").addEventListener("touchstart", unterbrasseStbControls.startLoopHolen);
document.querySelector("#unterbrasseStb_fieren").addEventListener("mousedown", unterbrasseStbControls.startLoopFieren);
document.querySelector("#unterbrasseStb_fieren").addEventListener("touchstart", unterbrasseStbControls.startLoopFieren);
let unterbrasseBbControls = createRopeControls([unterbrasseBb], 0, 80);
document.querySelector("#unterbrasseBb_holen").addEventListener("mousedown", unterbrasseBbControls.startLoopHolen);
document.querySelector("#unterbrasseBb_holen").addEventListener("touchstart", unterbrasseBbControls.startLoopHolen);
document.querySelector("#unterbrasseBb_fieren").addEventListener("mousedown", unterbrasseBbControls.startLoopFieren);
document.querySelector("#unterbrasseBb_fieren").addEventListener("touchstart", unterbrasseBbControls.startLoopFieren);


// SCHIFF

function createShipControls() {
    let interval; // Variable to hold the interval ID
  
    function stopLoop() {
        clearInterval(interval); // Stop the interval
        document.removeEventListener("touchend", stopLoop); // Remove the touchend event listener
        document.removeEventListener("mouseup", stopLoop); // Remove the mouseup event listener
        document.removeEventListener("mouseleave", stopLoop); // Remove the mouseleave event listener
    }
  
    function startLoopRight(event) {
        if (event.button !== 0 && event.type !== "touchstart") {
            return; // Only start the event on left mouse button down or touchstart
        }
        event.preventDefault(); // Prevent default touch behavior
        interval = setInterval(function () {
            let max_pos = centerX + 600;
            if (rumpfUnten.pointB.x < max_pos) {
                rumpfUnten.pointB.x = Math.min(rumpfUnten.pointB.x + 2, max_pos);
            } else {
                stopLoop();
            }
        }, 10); // Set interval time to 10 milliseconds (adjust as needed)
        document.addEventListener("touchend", stopLoop); // Add touchend event listener to stop the interval when the button is released
        document.addEventListener("mouseup", stopLoop); // Add mouseup event listener to stop the interval when the button is released
        document.addEventListener("mouseleave", stopLoop); // Add mouseleave event listener to stop the interval when the mouse leaves the button area
    }
  
    function startLoopLeft(event) {
        if (event.button !== 0 && event.type !== "touchstart") {
            return; // Only start the event on left mouse button down or touchstart
        }
        event.preventDefault(); // Prevent default touch behavior
        interval = setInterval(function () {
            let min_pos = centerX - 600;
            if (rumpfUnten.pointB.x > min_pos) {
                rumpfUnten.pointB.x = Math.max(rumpfUnten.pointB.x - 2, min_pos);
            } else {
                stopLoop();
            }
        }, 10); // Set interval time to 10 milliseconds (adjust as needed)
        document.addEventListener("touchend", stopLoop); // Add touchend event listener to stop the interval when the button is released
        document.addEventListener("mouseup", stopLoop); // Add mouseup event listener to stop the interval when the button is released
        document.addEventListener("mouseleave", stopLoop); // Add mouseleave event listener to stop the interval when the mouse leaves the button area
    }
  
    return {
         startLoopRight: startLoopRight,
         startLoopLeft: startLoopLeft
    };
}

let shipControls = createShipControls()
document.querySelector("#ship_left").addEventListener("mousedown", shipControls.startLoopLeft);
document.querySelector("#ship_left").addEventListener("touchstart", shipControls.startLoopLeft);
document.querySelector("#ship_right").addEventListener("mousedown", shipControls.startLoopRight);
document.querySelector("#ship_right").addEventListener("touchstart", shipControls.startLoopRight);