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
        radius = size * size;
    for (let x = 0; x < size; ++x) {
        for (let y = 0; y < size; ++y) {
            let dsqr = (x - center) * (x - center) + (y - center) * (y - center),
                color = radius / dsqr - Math.sqrt(dsqr) / size * 10,
                i = (x + y * size) << 2;
            data[i] = color;
            data[i + 1] =  color;
            data[i + 2] = color * 1.25;
            data[i + 3] = 255;
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
    numParticles = 0;
    console.log(window.screen.width, window.screen.height);
    console.log(canvas.width, canvas.height);


for (let i = 0; i < numParticles; ++i) {
    let size = Math.pow(2, 8 + Math.random() * 3 | 0);
    textures[size] = textures[size] || createBallTexture(size);

    engine.particles.push(new Particle(
        textures[size],
        Math.random() * engine.width,
        Math.random() * engine.height,
        Math.random() - .5,
        Math.random() - .5
    ));
}



// Main loop:
let last = performance.now();
function frame(time) {
    requestAnimationFrame(frame);


    ctx.fill();
    engine.update(time - last);
    engine.draw(ctx);
    last = time;
}
requestAnimationFrame(frame);