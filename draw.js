const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let color = [34, 139, 34]; // Green color for the fractals
let width = 2;

function getColor(x, y, mult = 1) {
  // Adjust these values to control the color gradient
  const r = Math.floor(128 + 128 * Math.sin((x ** 1.25 / 205) * mult));
  const g = Math.floor(128 + 128 * Math.sin((y / 25) * mult));
  const b = Math.floor(128 + 128 * Math.sin(((x * y) / 20005) * mult));

  return [r, g, b];
}

function setColor(r, g, b) {
  color = [r, g, b];
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

function circle(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI, false);
  ctx.lineWidth = width;
  ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  ctx.stroke();
}

function arc(x, y, radius, startAngle, endAngle, counterclockwise = false) {
  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, endAngle);
  ctx.lineWidth = width;
  ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  ctx.stroke();
}

function rect(x_low, x_high, y_low, y_high) {
  ctx.beginPath();
  ctx.rect(x_low, y_low, x_high - x_low, y_high - y_low);
  ctx.lineWidth = width;
  ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  ctx.stroke();
}

function regularPolygon(center_x, center_y, sides = 6, radius = 50, angle_offset = 0) {
  // let angle_offset = Math.random() * 2 * Math.PI;
  ctx.beginPath();
  for (let i = 0; i <= sides; i++) {
      let angle = angle_offset + i * 2 * Math.PI / sides;
      let x = center_x + radius * Math.cos(angle);
      let y = center_y + radius * Math.sin(angle);
      if (i === 0) {
          ctx.moveTo(x, y);
      } else {
          ctx.lineTo(x, y);
      }
  }
  ctx.lineWidth = width;
  ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  ctx.stroke();
}

function polygon(x_array, y_array) {
  ctx.beginPath();
  for (let i = 0; i < x_array.length; i++) {
      if (i === 0) {
          ctx.moveTo(x_array[i], y_array[i]);
      } else {
          ctx.lineTo(x_array[i], y_array[i]);
      }
  }
  ctx.closePath();
  ctx.lineWidth = width;
  ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  ctx.stroke();
}


function blendColors(blend_mult, x, y, r) {
  // Get the image data for the circle
  let imageData = ctx.getImageData(x - r, y - r, r * 2, r * 2);
  let data = imageData.data;

  // Calculate the average color
  let avg_color = [0, 0, 0];
  let count = 0;
  for (let i = 0; i < data.length; i += 4) {
      if (data[i] == 255 && data[i+1] == 255 && data[i+2] == 255) {
          continue;
      }
      let px_x = (i / 4) % (r * 2) - r;
      let px_y = Math.floor(i / 4 / (r * 2)) - r;
      if (px_x * px_x + px_y * px_y <= r * r) {
          avg_color[0] += data[i];
          avg_color[1] += data[i + 1];
          avg_color[2] += data[i + 2];
          count++;
      }
  }
  avg_color = avg_color.map(v => v / count);

  // Apply the blend
  for (let i = 0; i < data.length; i += 4) {
      let px_x = (i / 4) % (r * 2) - r;
      let px_y = Math.floor(i / 4 / (r * 2)) - r;
      if (px_x * px_x + px_y * px_y <= r * r) {
          data[i] = data[i] * (1 - blend_mult) + avg_color[0] * blend_mult;
          data[i + 1] = data[i + 1] * (1 - blend_mult) + avg_color[1] * blend_mult;
          data[i + 2] = data[i + 2] * (1 - blend_mult) + avg_color[2] * blend_mult;
      }
  }

  // Put the image data back
  ctx.putImageData(imageData, x - r, y - r);
}

function giveListFractalPoints(x, y, n, r, size_mult, iterations) {
  let points = [];
  let angle_offset = Math.random() * 2 * Math.PI;

  // Generate the initial polygon points
  for (let i = 0; i < n; i++) {
      let angle = angle_offset + i * 2 * Math.PI / n;
      points.push([x + r * Math.cos(angle), y + r * Math.sin(angle)]);
  }

  // Generate the fractal points
  for (let iter = 0; iter < iterations; iter++) {
      let new_points = [];
      for (let i = 0; i < points.length; i++) {
          let point = points[i];
          let next_point = points[(i + 1) % points.length];
          let mid_point = [(point[0] + next_point[0]) / 2, (point[1] + next_point[1]) / 2];
          let angle = Math.atan2(mid_point[1] - y, mid_point[0] - x) + Math.PI / 2;
          new_points.push([
              mid_point[0] + size_mult * r * Math.cos(angle),
              mid_point[1] + size_mult * r * Math.sin(angle)
          ]);
      }
      points = points.concat(new_points);
      r *= size_mult;
  }

  return points;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function setRandomColor() {
  color = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
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

function dist(x1,y1,x2,y2) {
  return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

function convert(x1,y1,x2,y2,mult=0.5) {
  let midX = (x1+x2)/2;
  let midY = (y1+y2)/2;
  
  lenS = dist(x1,y1,x2,y2);
  
  let unitPerp = [(y1-y2)/lenS,(x2-x1)/lenS]
  // algebraically let d - dist from line
  
  let angle = Math.abs(mult)*Math.PI/2;
  let d = lenS / (2*Math.tan(angle));
  
  let offX = unitPerp[0]*d;
  let offY = unitPerp[1]*d;
  
  let cx = offX+midX;
  let cy = offY+midY;

  if (mult<0) {
    cx = -offX + midX;
    cy = -offY + midY;
  }

  let radius = d / Math.cos(angle);
  
  // angle is half the full angle
  
  let start_angle = Math.atan2(y1-cy,x1-cx);
  let end_angle = Math.atan2(y2-cy,x2-cx);
  
  if (mult < 0) {
    let temp = end_angle;
    end_angle = start_angle;
    start_angle = temp;
  }

  return [cx,cy,radius,start_angle,end_angle];
}

function curvedLine(x1,y1,x2,y2,mult,flip=false){
  let k = convert(x1,y1,x2,y2,mult);
  arc(k[0],k[1],k[2],k[3],k[4],flip);
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

function example6() {
  for (i = 0; i < 1; i++) {
    drawNGonFractal(400, 400, 3, 100, 7, 0.2 * i+180*3.14/360, 0.2);
  }
}

function example7() {
  for (i = 0; i < 1; i++) {
    drawNGonFractal(400, 300, 4, 75, 5, 3.14/360 * i*37+180*3.14/360, 0.2);
  }
}

function example8() {
  for (i = 0; i < 20; i++) {
    drawNGonFractal(400, 300, 2, 75, 5, 3.14/360 * i*1+180*3.14/360, 0.2);
  }
}

function example9() {
  for (i = 0; i < 20; i++) {
    drawNGonFractal(400, 300, 3, 75, 5, 3.14/360 * i*1+180*3.14/360, 0.2);
  }
}

function example10() {
  fractalTree(400, 500, 80, -Math.PI / 2, 15);
}

function example11() {
  example1();
  blendColors(0.6,420,300,110);
}

function clear() {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  ctx.lineWidth = width;
}