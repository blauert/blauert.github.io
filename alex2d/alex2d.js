var Engine = Matter.Engine,
    /*
    https://github.com/liabru/matter-js/issues/693
    Implement z-index for renderers: https://github.com/liabru/matter-js/issues/243
    Example: https://github.com/itechdom/kflow/blob/0790f93b701e4d26d429bf08d3122115027c6058/src/World/Simulations/2DReality/Matter/Render.js
    */
    // use custom Render.js instead of Matter.Render
    //Render = Matter.Render,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Bodies = Matter.Bodies,
    Vertices = Matter.Vertices,
    Vector = Matter.Vector,
    Common = Matter.Common;

// create engine
var engine = Engine.create(),
    world = engine.world;

// https://stackoverflow.com/questions/34981126/matterjs-rendering-to-canvas
var canvas = document.getElementById('matterJS');

// create renderer
var render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        width: 600,
        height: 800,
        wireframes: false,
        //background: 'transparent',
    }
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

// ---------------------------------------------------------------------------------------------------------------------

// set sizes of bodies

// edit these to scale the ship
const mastHeight = 680;
const rumpfScale = 0.9;
const rumpfY = 820;

// sprites
const rumpfSprite = {file: 'sprites/rumpf.png', width: 1500, height: 455};
const rahSprite = {file: 'sprites/rah.png', width: 751, height: 20};
const mastSprite = {file: 'sprites/mast.png', width: 25.555, height: 1345};

// https://brm.io/matter-js/docs/classes/Body.html#property_collisionFilter
// define our categories (as bit fields, there are up to 32 available)
// https://brm.io/matter-js/demo/#collisionFiltering
const defaultCategory = 0x0001;
const untouchableCategory = 0x0002;
const rahCategory = 0x0004;


// add bodies

const centerX = render.options.width/2;
const centerY = render.options.height/2;


// RUMPF

const rumpfWidth = mastHeight * 1.115 * rumpfScale;
const rumpfHeight = mastHeight * 0.338 * rumpfScale;

// https://brm.io/matter-js/docs/classes/Bodies.html#method_fromVertices
let rumpf = Bodies.fromVertices(centerX, rumpfY, [
    {x:rumpfWidth/2, y:0}, {x:0, y:rumpfHeight}, {x:rumpfWidth, y:rumpfHeight}], {
    collisionFilter: {
        category: untouchableCategory,
        mask: defaultCategory,
    },
    render: {
        sprite: {
            texture: rumpfSprite.file,
            xScale: rumpfWidth / rumpfSprite.width,
            yScale: rumpfHeight / rumpfSprite.height,
        }
    },
});

let rumpfHanger = Constraint.create({
    bodyA: rumpf,
    pointA: { x: 0, y: -rumpfHeight*0.7 },
    pointB: { x: centerX, y: rumpfY - 400 },
    stiffness: 0.5,
    render: { visible: false },
});

let rumpfUnten = Constraint.create({
    bodyA: rumpf,
    pointA: { x: 0, y: 0 },
    pointB: { x: centerX, y: rumpfY + 200 },
    stiffness: 0.001,
    render: { visible: false },
});


// MAST

const mastWidth = mastHeight * 0.019;
const mastfussY = rumpf.bounds.min.y + (rumpf.bounds.max.y - rumpf.bounds.min.y) * 0.089;
const mastX = centerX;
const mastY = mastfussY - mastHeight/2;

let mast = Bodies.rectangle(mastX, mastY, mastWidth, mastHeight, {
    collisionFilter: {
        category: untouchableCategory,
        mask: defaultCategory,
    },
    render: {
        sprite: {
            texture: mastSprite.file,
            xScale: mastWidth / mastSprite.width,
            yScale: mastHeight / mastSprite.height,
        }
    },
});

let mastFuss = Constraint.create({
    bodyA: rumpf,
    pointA: { x: 0, y: -(rumpfY-mastfussY) },
    bodyB: mast,
    pointB: { x: 0, y: mastHeight/2 },
    stiffness: 1,
    render: { visible: false },
});
let wantenBb = Constraint.create({
    bodyA: rumpf,
    pointA: { x: -rumpfWidth*0.5, y: 0 },
    bodyB: mast,
    pointB: { x: 0, y: -mastHeight/2 },
    stiffness: 1,
    render: { visible: false },
});
let wantenStb = Constraint.create({
    bodyA: rumpf,
    pointA: { x: rumpfWidth*0.5, y: 0 },
    bodyB: mast,
    pointB: { x: 0, y: -mastHeight/2 },
    stiffness: 1,
    render: { visible: false },
});


// RAHEN

let [unterrah, unterrahRack] = makeRah(0.262, 0.559, 0.015);
let [untermarsrah, untermarsrahRack] = makeRah(0.413, 0.536, 0.014);
let [obermarsrah, obermarsrahRack, obermarsrahUnten, obermarsrahOben] = makeRah(0.449, 0.480, 0.012, 0.563);
let [bramrah, bramrahRack, bramrahUnten, bramrahOben] = makeRah(0.688, 0.368, 0.009, 0.757);
let [royalrah, royalrahRack, royalrahUnten, royalrahOben] = makeRah(0.791, 0.280, 0.008, 0.907);


// SEGEL

let untersegel = makeSail(unterrah, 0.2);
let untermars = makeSail(untermarsrah, 0.12);
let obermars = makeSail(obermarsrah, 0.12);
let bram = makeSail(bramrah, 0.15);
let royal = makeSail(royalrah, 0.125);


// TOPPNANTEN & RAHHANGER

let [toppnantBb, toppnantStb] = makeHanger(unterrah, 0.218, 0.409, 'lightseagreen');
let [obermarsrahHangerBb, obermarsrahHangerStb] = makeHanger(obermarsrah, 0.226, 0.608, 'seagreen');
let [bramrahHangerBb, bramrahHangerStb] = makeHanger(bramrah, 0.175, 0.781, 'seagreen');
let [royalrahHangerBb, royalrahHangerStb] = makeHanger(royalrah, 0.130, 0.942, 'seagreen');

let untermars_x = untermarsrah.width/2*0.97;
let obermars_x = obermarsrah.width/2*0.97;
let untermars_y = -untermarsrah.height/4;
let obermars_y = obermarsrah.height/4;
let obermarsniederholerBb = rope(
    untermarsrah, {x: -untermars_x, y: untermars_y},
    obermarsrah, {x: -obermars_x, y: obermars_y},
    5, 'lightseagreen'
    );
let obermarsniederholerStb = rope(
    untermarsrah, {x: untermars_x, y: untermars_y},
    obermarsrah, {x: obermars_x, y: obermars_y},
    5, 'lightseagreen'
    );
for (let rope of [obermarsniederholerBb, obermarsniederholerStb]) {
    for (let constraint of rope.constraints) {
        constraint.length *= 0.85;  // tighten the rope
    }
}


// GEITAUE

let [untersegelgeitauBb, untersegelgeitauStb] = makeGeitaue(unterrah, untersegel);
let [untermarsgeitauBb, untermarsgeitauStb] = makeGeitaue(untermarsrah, untermars);
let [obermarsgeitauBb, obermarsgeitauStb] = makeGeitaue(obermarsrah, obermars);
let [bramgeitauBb, bramgeitauStb] = makeGeitaue(bramrah, bram);
let [royalgeitauBb, royalgeitauStb] = makeGeitaue(royalrah, royal);


// GORDINGE

let [untersegelgordingBb, untersegelgordingStb] = makeGordinge(unterrah, untersegel);
let [untermarsgordingBb, untermarsgordingStb] = makeGordinge(untermarsrah, untermars);
let [obermarsgordingBb, obermarsgordingStb] = makeGordinge(obermarsrah, obermars);
let [bramgordingBb, bramgordingStb] = makeGordinge(bramrah, bram);
let [royalgordingBb, royalgordingStb] = makeGordinge(royalrah, royal);


// SCHOTEN

let [untermarsschotBb, untermarsschotStb] = makeSchoten(unterrah, untermars, 3);
let [obermarsschotBb, obermarsschotStb] = makeSchoten(untermarsrah, obermars, 0.5);
let [bramschotBb, bramschotStb] = makeSchoten(obermarsrah, bram, 2.05);
let [royalschotBb, royalschotStb] = makeSchoten(bramrah, royal, 2);

let untersegel_left_corner = untersegel.bodies[(untersegel.rows-1)*untersegel.cols]
let untersegel_right_corner = untersegel.bodies[untersegel.bodies.length-1];
let untersegelschotX = rumpfY/5.5;
let untersegelschotY = -rumpfY/25;
let untersegelschotBb = rope(rumpf, { x: -untersegelschotX, y: untersegelschotY }, untersegel_left_corner, { x: 0, y: 0 }, 9, 'aquamarine');
let untersegelschotStb = rope(rumpf, { x: untersegelschotX, y: untersegelschotY }, untersegel_right_corner, { x: 0, y: 0 }, 9, 'aquamarine');
for (let rope of [untersegelschotBb, untersegelschotStb]) {
    for (let constraint of rope.constraints) {
        constraint.length *= 1.7;  // relax the rope
        constraint.render.behind = true;
    }
}
let halsX = rumpfY/10.5;
let halsY = -rumpfY/6.7;
let untersegelhalsBb = rope(rumpf, { x: -halsX, y: halsY }, untersegel_left_corner, { x: 0, y: 0 }, 7, 'darkturquoise');
let untersegelhalsStb = rope(rumpf, { x: halsX, y: halsY }, untersegel_right_corner, { x: 0, y: 0 }, 7, 'darkturquoise');
for (let rope of [untersegelhalsBb, untersegelhalsStb]) {
    for (let constraint of rope.constraints) {
        constraint.length *= 1.7;  // relax the rope
        constraint.render.behind = true;
    }
}


// BRASSEN

let color1 = 'mediumpurple';
let color2 = '#C8BFE7';
let [unterbrasseBb, unterbrasseStb] = makeBrassen(unterrah, rumpfY/3.7, 0, color1);
let [untermarsbrasseBb, untermarsbrasseStb] = makeBrassen(untermarsrah, rumpfY/3.5, rumpfY/75, color1);
let [obermarsbrasseBb, obermarsbrasseStb] = makeBrassen(obermarsrah, rumpfY/3.3, rumpfY/50, color1);
let [brambrasseBb, brambrasseStb] = makeBrassen(bramrah, rumpfY*0.65, -rumpfY*0.8, color2);
let [royalbrasseBb, royalbrasseStb] = makeBrassen(royalrah, rumpfY*0.65, -rumpfY*0.8, color2);


// add all of the bodies to the world
Composite.add(world, [
    rumpf, rumpfHanger, rumpfUnten,

    unterrah, unterrahRack,
    untermarsrah, untermarsrahRack,
    obermarsrah, obermarsrahRack,
    bramrah, bramrahRack,
    royalrah, royalrahRack,
    
    untersegel, untermars, obermars, bram, royal,

    toppnantBb, toppnantStb,
    obermarsniederholerBb, obermarsniederholerStb,
    obermarsrahHangerBb, obermarsrahHangerStb,
    bramrahHangerBb, bramrahHangerStb,
    royalrahHangerBb, royalrahHangerStb,

    untersegelgeitauBb, untersegelgeitauStb,
    untermarsgeitauBb, untermarsgeitauStb,
    obermarsgeitauBb, obermarsgeitauStb,
    bramgeitauBb, bramgeitauStb,
    royalgeitauBb, royalgeitauStb,

    untersegelgordingBb, untersegelgordingStb,
    untermarsgordingBb, untermarsgordingStb,
    obermarsgordingBb, obermarsgordingStb,
    bramgordingBb, bramgordingStb,
    royalgordingBb, royalgordingStb,

    untersegelschotBb, untersegelschotStb,
    untersegelhalsBb, untersegelhalsStb,

    untermarsschotBb, untermarsschotStb,
    obermarsschotBb, obermarsschotStb,
    bramschotBb, bramschotStb,
    royalschotBb, royalschotStb,

    unterbrasseBb, unterbrasseStb,
    untermarsbrasseBb, untermarsbrasseStb,
    obermarsbrasseBb, obermarsbrasseStb,

    brambrasseBb, brambrasseStb,
    royalbrasseBb, royalbrasseStb,

    mast, mastFuss, wantenBb, wantenStb,
]);

// ---------------------------------------------------------------------------------------------------------------------

// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

Composite.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;