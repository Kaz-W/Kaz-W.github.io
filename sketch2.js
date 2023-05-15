// Create a canvas with given 'width' and 'height':
function createCanvas(width, height) {
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

// Draw a "metaball" with diameter 'size':
function drawBall(ctx, size) {
    let imageData = ctx.getImageData(0, 0, size, size),
        data = imageData.data,
        center = size >> 1,
        radius = size * size,
        rad = 0.5 * size, //actual radius
        p = 0; // interpolating value from zero to one
    for (let x = 0; x < size; ++x) {
        for (let y = 0; y < size; ++y) {
            let dsqr = (x - center) * (x - center) + (y - center) * (y - center); //distance from pixel to centre of circle
                if (dsqr > rad**2) dsqr = rad**2 // if dsqr < radius, this will be > 1, so all white
                let color = 255 * (1 - Math.sqrt(dsqr)/rad);
                /* dsqr = Math.sqrt((x - center) * (x - center) + (y - center) * (y - center)); //distance from pixel to centre of circle
                if (dsqr > 0.5 * size) dsqr = 0.5 * size // if dsqr < radius, this will be > 1, so all white
                let color = 255 * (1 - dsqr/(0.5*size));*/
            //color = radius / dsqr - (dsqr**(-3) / size) * 10,
                i = (x + y * size) << 2;

            data[i + 0] = color * 1.05;
            data[i + 1] = color;
            data[i + 2] = color * 1.4;
            data[i + 3] = color;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

// Create a "metaball" texture with dimensions 'size' x 'size':
function createBallTexture(size) {
    let canvas = createCanvas(size, size),
        ctx = canvas.getContext("2d");
    drawBall(ctx, size);
    return canvas;
}

// A textured particle with position and velocity:
function Particle(texture, x, y, vx = 0, vy = 0) {
    this.texture = texture;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
}

// A particle engine holding particles:
function Engine(width = 300, height = 150) {
    this.particles = [];
    this.width = width;
    this.height = height;
}

Engine.prototype.update = function(dt) {
    for (let particle of this.particles) {
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;

        if (particle.x > this.width) {
            particle.x = this.width;
            particle.vx = -particle.vx;
        } else if (particle.x < 0) {
            particle.x = 0;
            particle.vx = -particle.vx;
        }

        if (particle.y > this.height) {
            particle.y = this.height;
            particle.vy = -particle.vy;
        } else if (particle.y < 0) {
            particle.y = 0;
            particle.vy = -particle.vy;
        }
    }
}

Engine.prototype.draw = function(ctx) {
    let compositeOperation = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = "lighter";
    for (let particle of this.particles) {
        ctx.drawImage(
            particle.texture, particle.x - (particle.texture.width >> 1),
            particle.y - (particle.texture.height >> 1)
        );
    }
    ctx.globalCompositeOperation = compositeOperation;
}

// Create particles and their textures:
let canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    engine = new Engine(window.screen.width, window.screen.height),
    textures = {},
    numParticles = 10;


    canvas.setAttribute("width", window.screen.width)
    canvas.setAttribute("height", window.screen.height)

for (let i = 0; i < numParticles; ++i) {
    let scale = (log((window.screen.height* window.screen.width)/(1600*700), 4))
    console.log(Math.sqrt(window.screen.height*window.screen.width), scale)
    let size = Math.pow(2, 8.75 + scale + Math.random() * 3 | 0);
    textures[size] = textures[size] || createBallTexture(size);

    engine.particles.push(new Particle(
        textures[size],
        Math.random() * engine.width,
        Math.random() * engine.height,
        Math.random()/5,
        Math.random()/5
    ));
}

// Main loop:
let last = performance.now();
function frame(time) {
    requestAnimationFrame(frame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    engine.update(time - last);
    engine.draw(ctx);
    last = time;
}
requestAnimationFrame(frame);

function log(a, b) {
    return Math.log(a) / Math.log(b);
}