// https://adventofcode.com/2022/day/10

function printPixel(pixel) {
    document.getElementById("p" + pixel).innerText = '#';
}

function printInstruction(instr) {
    document.getElementById("instruction").innerText = instr;
}

function highlight(pixel) {
    const p = document.getElementById("p" + pixel);
    p.style.color = "black";
    p.style.backgroundColor = "#00ff00";
}

function unhighlight(pixel) {
    const p = document.getElementById("p" + pixel);
    p.style.removeProperty('color');
    p.style.removeProperty('background-color');
}

function getSpritePosition(x, cycle) {
    let row = Math.floor((cycle-1)/40);
    return (row * 40) + x;
}

function isPrintable(cycle, sprite) {
    if (cycle <= 240 && cycle-1 >= sprite-1 && cycle-1 <= sprite+1) {
        return true
    }
    else {
        return false
    }
}

function printSprite(center, remove=false) {
    let leftSpace = "s" + (center-1)
    let rightSpace;
    if ((center+2) % 40 == 0) {
        rightSpace = "s" + (center+2) + "r";
    }
    else {
        rightSpace = "s" + (center+2);
    }
    if (remove) {
        document.getElementById(leftSpace).innerHTML = "&nbsp";
        document.getElementById(rightSpace).innerHTML = "&nbsp";
    }
    else {
        document.getElementById(leftSpace).innerText = '[';
        document.getElementById(rightSpace).innerText = ']';
    }
}

function removeSprite(center) {
    printSprite(center, remove=true);
}

function printX(x) {
    document.getElementById("x").innerText = x;
}

function printCycle(cycle) {
    document.getElementById("cycle").innerText = cycle;
    if (cycle <= 240) {
        highlight(cycle-1);
    }
    if (cycle > 1) {
        unhighlight(cycle-2);
    }
}

function setCycle(c) {
    cycle = c;
    printCycle(cycle);
}

function printSpeed(speed) {
    document.getElementById("speed").innerText = speed;
}

function setSpeed(s) {
    speed = s;
    printSpeed(speed);
}

function speedUp() {
    let newSpeed = speed / 2;
    setSpeed(Math.max(newSpeed, 7.8125));
}

function speedDown() {
    let newSpeed = speed * 2;
    setSpeed(Math.min(newSpeed, 4000));
}

const crt = document.getElementById('crt');
for (i = 0; i < 240; i++) {
    spaceBefore = document.createElement('span');
    spaceBefore.id = "s" + i;
    spaceBefore.innerHTML = "&nbsp";
    crt.append(spaceBefore);
    pixel = document.createElement('span');
    pixel.id = "p" + i;
    pixel.innerText = ".";
    crt.append(pixel);
    if ((i+1) % 40 == 0) {
        spaceAfter = document.createElement('span');
        spaceAfter.id = "s" + (i+1) + "r";
        spaceAfter.innerHTML = "&nbsp";
        crt.append(spaceAfter);
        br = document.createElement('br');
        crt.append(br);
    }
}

const plus = document.getElementById('plus');
plus.addEventListener("click", speedUp);

const minus = document.getElementById('minus');
minus.addEventListener("click", speedDown);

async function* clockCircuit() {
    while (true) {
        await new Promise(resolve => setTimeout(resolve, speed));
        yield 1;
    }
}

async function* getInstructions() {
    const response = await fetch(path + input_file);
    const text = await response.text();
    const rows = text.split('\n');
    for (let row of rows) {
        yield row;
    };
}

async function cpu(clock) {
    if (isPrintable(cycle, sprite)) {
        printPixel(cycle-1);
    }

    await clock.next().then(tick => setCycle(cycle + tick.value));

    if (part1cycles.has(cycle)) {
        part1solution += (cycle * x);
    }
    
    removeSprite(sprite);
    sprite = getSpritePosition(x, cycle);
    if (sprite <= 239) {
        printSprite(sprite);
    }
}

async function main() {
    const instr = getInstructions();
    const clock = clockCircuit();

    for await (const ins of instr) {
        printInstruction(ins);
        
        await cpu(clock);

        if (ins != "noop") {
            x += Number(ins.split(' ')[1]);
            printX(x);
            
            await cpu(clock);
        }
    }
    console.log("Part 1: " + part1solution)
}

const part1cycles = new Set([20, 60, 100, 140, 180, 220]);
let part1solution = 0;

let x = 1;
let cycle = 1;
let speed = 1000;

let sprite = getSpritePosition(x, cycle);

printX(x);
printSprite(sprite);
printCycle(cycle);
printSpeed(speed);

const path = "https://raw.githubusercontent.com/blauert/Advent-of-Code-2022/master/10%20Cathode-Ray%20Tube/";
const input_file = "real_input.txt";
//const input_file = "test_input.txt";

main();