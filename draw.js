const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let color = [34, 139, 34]; // Green color for the fractals
let width = 2;

function showLineNumbers() {
  document.getElementById("lineNumbers").innerHTML = "";


  for (var rep = 0; rep < 30; rep++) {
    document.getElementById("lineNumbers").innerHTML += (rep+1) + "<br />";
  }
}

function run() {
  var program = document.getElementById('input').value;
  var programHolder = document.getElementById('holder');


  if (programHolder) {
    programHolder.parentNode.removeChild(programHolder);
  }


  var newProgram = document.createElement('script');
  newProgram.id = 'holder';
  newProgram.text = program;
  document.body.appendChild(newProgram);
}

function getColor(x, y, mult = 1) {
  // Adjust these values to control the color gradient
  const r = Math.floor(128 + 128 * Math.sin((x ** 1.25 / 205) * mult));
  const g = Math.floor(128 + 128 * Math.sin((y / 25) * mult));
  const b = Math.floor(128 + 128 * Math.sin(((x * y) / 20005) * mult));

  return [r, g, b];
}

function line(ax, ay, bx, by, mult = 1) {
  z = (Math.atan(ax / 100) * 255) / 3.2;
  color = getColor(ax, ay, mult);
  ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.closePath();
  ctx.stroke();
}

function drawSierpinskiTriangle(x1, y1, x2, y2, x3, y3, depth) {
  if (depth === 0) {
    line(x1, y1, x2, y2);
    line(x2, y2, x3, y3);
    line(x3, y3, x1, y1);
    return;
  }

  const mid1x = (x1 + x2) / 2;
  const mid1y = (y1 + y2) / 2;
  const mid2x = (x2 + x3) / 2;
  const mid2y = (y2 + y3) / 2;
  const mid3x = (x3 + x1) / 2;
  const mid3y = (y3 + y1) / 2;

  drawSierpinskiTriangle(x1, y1, mid1x, mid1y, mid3x, mid3y, depth - 1);
  drawSierpinskiTriangle(mid1x, mid1y, x2, y2, mid2x, mid2y, depth - 1);
  drawSierpinskiTriangle(mid3x, mid3y, mid2x, mid2y, x3, y3, depth - 1);
  //drawSierpinskiTriangle(mid1x, mid3y, x2, mid2y, x3, y3, depth - 1);
}

function drawRandomFractalPattern(x, y, n, r, size_mult, iterations) {
  const points = giveListFractalPoints(x, y, n, r, size_mult, iterations);

  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    line(p1.x, p1.y, p2.x, p2.y);
  }
}

function dragonCurve(x1, y1, x2, y2, depth) {
  if (depth === 0) {
    line(x1, y1, x2, y2);
    return;
  }

  const deltaX = x2 - x1;
  const deltaY = y2 - y1;

  const x3 = 0.5 * (x1 + x2) - 0.5 * deltaY;
  const y3 = 0.5 * (y1 + y2) + 0.5 * deltaX;

  dragonCurve(x1, y1, x3, y3, depth - 1);
  dragonCurve(x3, y3, x2, y2, depth - 1);
}

function drawNGonFractal(
  centerX,
  centerY,
  sides,
  size,
  depth,
  angle_0 = 0,
  mult = 1
) {
  const vertices = [];

  // Calculate the vertices of the regular n-gon
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides + angle_0;
    const x = centerX + size * Math.cos(angle);
    const y = centerY + size * Math.sin(angle);
    vertices.push({ x, y });
  }

  // Draw the initial n-gon
  for (let i = 0; i < sides; i++) {
    const p1 = vertices[i];
    const p2 = vertices[(i + 1) % sides];

    line(p1.x, p1.y, p2.x, p2.y, mult);
  }

  // Recursively draw fractals between each pair of vertices
  if (depth > 0) {
    for (let i = 0; i < sides; i++) {
      const p1 = vertices[i];
      const p2 = vertices[(i + 1) % sides];
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;

      const deltaX = p2.x - p1.x;
      const deltaY = p2.y - p1.y;

      const newX = midX + (deltaY / 2) * Math.sqrt(3);
      const newY = midY - (deltaX / 2) * Math.sqrt(3);

      drawNGonFractal(newX, newY, sides, size / 2, depth - 1, angle_0, mult);
    }
  }
}

function fractalTree(x, y, length, angle, depth) {
  if (depth === 0) {
    return;
  }

  const x2 = x + length * Math.cos(angle);
  const y2 = y + length * Math.sin(angle);

  // Draw the current branch
  line(x,y,x2,y2)

  // Recursively draw two sub-branches
  fractalTree(x2, y2, length * 0.7, angle - Math.PI / 4, depth - 1);
  fractalTree(x2, y2, length * 0.7, angle + Math.PI / 4, depth - 1);
}

// Example: Draw a fractal tree
fractalTree(400, 500, 80, -Math.PI / 2, 5);

function example1() {
  for (i = 0; i < 17; i++) {
    drawNGonFractal(400, 300, 7, 50, 2, 0.2 * i, 0.3);
  }
}

function example2() {
  for (i = 0; i < 17; i++) {
    drawNGonFractal(400, 300, 2, 50, 5, 0.2 * i, 0.2);
  }
}

function example3() {
  for (i = 0; i < 17; i++) {
    drawNGonFractal(400, 300, 3, 100, 3, 0.2 * i, 0.2);
  }
}

function example4() {
  for (i = 0; i < 17; i++) {
    drawNGonFractal(400 - 10 * i, 20 * i + 150, 2, 70, 4, 0.2 * i, 0.7);
  }
}

function example5() {
  for (j = 0; j < 1; j++) {
    for (i = 0; i < 17; i++) {
      drawNGonFractal(400, 10 * i + 150, 4, 150, 2, 0.2 * i+1.3*j, 0.7);
    }
  }
}

function draw() {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  ctx.lineWidth = width;

  //drawSierpinskiTriangle(0, 300, 200, 000, 400, 300, 5);

  //dragonCurve(200, 400, 400, 400, 11)

  //drawNGonFractal(400, 300, 2, 35, 4,1.6)

  
  
  //fractalTree(400, 500, 80, -Math.PI / 2, 11);
}

// Call the draw function
draw();
