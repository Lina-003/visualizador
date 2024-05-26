const socket = io();

let lightData = [];
let ledColor = 'green';

function setup() {
    const canvas = createCanvas(800, 400);
    canvas.parent('canvas-container');
    frameRate(1);
}

function draw() {
    background(255);

    stroke(0);
    fill(150);
    textSize(16);
    text('Niveles de Iluminación', 10, 20);

    if (lightData.length > 0) {
        const maxLevel = Math.max(...lightData.map(d => d.level));
        const minLevel = Math.min(...lightData.map(d => d.level));

        beginShape();
        for (let i = 0; i < lightData.length; i++) {
            const x = map(i, 0, lightData.length - 1, 0, width);
            const y = map(lightData[i].level, minLevel, maxLevel, height, 0);
            vertex(x, y);
        }
        endShape();
    }

    textSize(32);
    fill(ledColor);
    text(`LED: ${ledColor.toUpperCase()}`, 10, height - 30);
}

socket.on('dataUpdate', (data) => {
    lightData = data.lightData;
    ledColor = data.ledColor;
});
