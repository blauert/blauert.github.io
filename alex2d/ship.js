function makeRah(y_pct, width_pct, height_pct, y2_pct=null) {
    let y_offset = mastHeight * y_pct;  // distance from mast foot
    let y = mastfussY - y_offset;  // absolute position on canvas

    // relative position from mast center
    let vector1 = Vector.create(0, mastHeight/2 - y_offset);
    let vector2 = null;
    if (y2_pct !== null) {
        let y2_offset = mastHeight * y2_pct;
        vector2 = Vector.create(0, mastHeight/2 - y2_offset);
    };

    let width = mastHeight * width_pct;
    let height = mastHeight * height_pct;

    let rah = Bodies.rectangle(centerX, y, width, height, {
        collisionFilter: {
            category: rahCategory,
            mask: defaultCategory | rahCategory,
        },
        render: {
            sprite: {
                texture: rahSprite.file,
                xScale: width / rahSprite.width,
                yScale: height / rahSprite.height,
            }
        },
        density: 0.00001,
    });
    // save properties
    rah.width = width;
    rah.height = height;

    let rack = Constraint.create({
        bodyA: rah,
        pointA: { x: 0, y: 0 },
        bodyB: mast,
        // https://brm.io/matter-js/docs/classes/Vector.html#method_clone
        pointB: Vector.clone(vector1),
        stiffness: 1,
        render: { visible: false },
    });

    return [rah, rack, vector1, vector2];
}


// https://brm.io/matter-js/demo/#cloth
function cloth(xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) {

    particleOptions = Common.extend({
        inertia: Infinity,
        friction: 0.00001,
        density: 0.00001,
        collisionFilter: { category: untouchableCategory, mask: defaultCategory },
        render: { visible: false }},
        particleOptions
        );
    constraintOptions = Common.extend({
        stiffness: 0.25,
        render: { type: 'line', strokeStyle: 'darkgreen', lineWidth: 2, anchors: false, behind: true } },
        constraintOptions
        );

    let cloth = Composites.stack(xx-particleRadius, yy-particleRadius, columns, rows, columnGap, rowGap, function(x, y) {
        return Bodies.circle(x, y, particleRadius, particleOptions);
    });

    Composites.mesh(cloth, columns, rows, crossBrace, constraintOptions);

    return cloth;
};


function makeSail(rah, height_pct) {
    let leftX = rah.bounds.min.x + mastHeight * 0.01;
    let rightX = rah.bounds.max.x - mastHeight * 0.01;
    let rahWidth = rightX - leftX;
    
    const particleRadius = 1;
    let gap = mastHeight * 0.03;

    // why 1.9*particleRadius ?
    let cols = Math.floor(rahWidth / (gap+1.9*particleRadius)) + 1;
    gap = rahWidth / (cols - 1) - 1.9*particleRadius;

    let height = mastHeight * height_pct;
    let rows = Math.floor(height / (gap+1.9*particleRadius)) + 1;

    let sail = cloth(leftX, rah.position.y, cols, rows, gap, gap, false, particleRadius);

    for (var i = 0; i < cols; i++) {
        Composite.add(sail, Constraint.create({
            bodyA: sail.bodies[i],
            bodyB: rah,
            pointB: { x: sail.bodies[i].position.x - centerX, y: 0 },
            stiffness: 1,
            render: { visible: false },
        }));
    }

    // save properties
    sail.rows = rows;
    sail.cols = cols;

    return sail;
};


// https://brm.io/matter-js/docs/classes/Vector.html
function rope(bodyA, pointA, bodyB, pointB, segments, color) {
    let pointA_abs = Matter.Vector.add(bodyA.position, pointA);
    let pointB_abs = Matter.Vector.add(bodyB.position, pointB);
    let ropeVector = Matter.Vector.sub(pointB_abs, pointA_abs);
    let segmentVector = Matter.Vector.div(ropeVector, segments);

    let particles = Composite.create();
    for (let i = 1; i < segments; i++) {
        let curr = Matter.Vector.add(pointA_abs, Matter.Vector.mult(segmentVector, i));
        Composite.add(particles, Bodies.circle(curr.x, curr.y, 1, {
            collisionFilter: { category: untouchableCategory, mask: defaultCategory },
            render: { visible: false },
            density: 0.00001,
        }));
    }
    let renderOptions = { anchors: false, };
    if (!color) {
        renderOptions.visible = false;
    } else {
        renderOptions.strokeStyle = color;
    }

    let rope = Composites.chain(particles, 0, 0, 0, 0, {
        render: renderOptions,
    });
    Composite.add(rope, Constraint.create({
        bodyA: bodyA,
        pointA: pointA,
        bodyB: rope.bodies[0],
        pointB: { x: 0, y: 0 },
        render: renderOptions,
    }));
    Composite.add(rope, Constraint.create({
        bodyA: rope.bodies[rope.bodies.length-1],
        pointA: { x: 0, y: 0 },
        bodyB: bodyB,
        pointB: pointB,
        render: renderOptions,
    }));

    return rope;
}


function makeHanger(rah, rah_x_pct, mast_y_pct, color) {
    let rahX = mastHeight * rah_x_pct;
    //let rah_y = (rah.bounds.min.y - rah.position.y) / 2;
    let rahY = -rah.height/4;
    let mastX = 0;
    let mastY = mastHeight/2 - mastHeight * mast_y_pct;

    let hangerBb = rope(rah, { x: -rahX, y: rahY }, mast, { x: -mastX, y: mastY }, 5, color);
    let hangerStb = rope(rah, { x: rahX, y: rahY }, mast, { x: mastX, y: mastY }, 5, color);

    let hanger = [hangerBb, hangerStb];

    for (let rope of hanger) {
        for (let constraint of rope.constraints) {
            constraint.length *= 0.9;  // tighten the rope
        }
    }

    return hanger;
}


function makeGeitaue(rah, sail) {
    let rahX = rah.width/2*0.97;
    let rahY = rah.height/4;
    let leftCorner = sail.bodies[(sail.rows-1)*sail.cols]
    let rightCorner = sail.bodies[sail.bodies.length-1];

    let geitauBb = rope(rah, { x: -rahX, y: rahY }, leftCorner, { x: 0, y: 0 }, 5, 'darkkhaki');
    let geitauStb = rope(rah, { x: rahX, y: rahY }, rightCorner, { x: 0, y: 0 }, 5, 'darkkhaki');

    let geitaue = [geitauBb, geitauStb];

    for (let rope of geitaue) {
        for (let constraint of rope.constraints) {
            constraint.length = 0;  // tighten the rope
        }
    }

    return geitaue;
}


function makeGordinge(rah, sail) {
    let rahX = rah.width/2*0.3;
    let rahY = rah.height/4;
    let a_third = Math.floor(sail.cols / 3)
    let left_corner = sail.bodies[(sail.rows-1)*sail.cols + a_third]
    let right_corner = sail.bodies[sail.bodies.length-1 - a_third];

    let gordingBb = rope(rah, { x: -rahX, y: rahY }, left_corner, { x: 0, y: 0 }, 7, 'darkkhaki');
    let gordingStb = rope(rah, { x: rahX, y: rahY }, right_corner, { x: 0, y: 0 }, 7, 'darkkhaki');

    let gordinge = [gordingBb, gordingStb];

    for (let rope of gordinge) {
        for (let constraint of rope.constraints) {
            constraint.length = 0;  // tighten the rope
        }
    }

    return gordinge;
}


function makeSchoten(rah, sail, relax_factor) {
    let rahX = rah.width/2*0.97;
    let rahY = rah.height/4;
    let leftCorner = sail.bodies[(sail.rows-1)*sail.cols]
    let rightCorner = sail.bodies[sail.bodies.length-1];

    let schotBb = rope(rah, { x: -rahX, y: -rahY }, leftCorner, { x: 0, y: 0 }, 7, 'aquamarine');
    let schotStb = rope(rah, { x: rahX, y: -rahY }, rightCorner, { x: 0, y: 0 }, 7, 'aquamarine');

    let schoten = [schotBb, schotStb];

    for (let rope of schoten) {
        for (let constraint of rope.constraints) {
            constraint.length *= relax_factor;  // relax the rope
        }
    }

    return schoten;
}


function makeBrassen(rah, rumpfX, rumpfY, color) {
    let rahX = rah.width/2*0.98;
    let rahY = 0;

    let brasseBb = rope(rah, { x: -rahX, y: -rahY }, rumpf, { x: -rumpfX, y: rumpfY }, 7, color);
    let brasseStb = rope(rah, { x: rahX, y: -rahY }, rumpf, { x: rumpfX, y: rumpfY }, 7, color);

    let brassen = [brasseBb, brasseStb];

    // put bottom segments behind rumpf
    for (let rope of brassen) {
        rope.constraints[6].render.behind = true;
        rope.constraints[4].render.behind = true;
        rope.constraints[3].render.behind = true;
        rope.constraints[2].render.behind = true;
    }

    return brassen;
}