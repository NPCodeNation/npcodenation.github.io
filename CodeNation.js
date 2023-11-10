// CodeNation.js
//============= CodeNation.js =============
//============= Fractal Variables ==============


var xmax = 600;
var ymax = 600;
var radius = 1;
var maxIterations = 2000;
var magnification = 0.99;
var plotRatio = 0.5;
// .5, .55, .62, .67, .69, .71, .73, .74  
var numberOfVertices = 3;
var verticesOrientation = 0;
var vertsOrient = 2*Math.PI * verticesOrientation/360;
var isMouseDown = 0;
var clickState = 0;
var startx = 0;
var starty = 1;
var endx = 0;
var endy = 0;
var currentx = 0;
var currenty = 0;
  
var maxNumberOfVertices = 20;
var color = new Array(maxNumberOfVertices);


color[0] = 0xFF0000FF; 
color[1] = 0xFF00FF00;
color[2] = 0xFFFF0000;
color[3] = 0xFFFF99FF;
color[4] = 0xFFDF9988;
color[5] = 0xFFAA5599;
color[6] = 0xFFFF8800;
color[7] = 0xFFFFFF00;
color[8] = 0xFF888888;
color[9] = 0xFFFF88FF;
color[10] = 0xFFAA33BB;
color[11] = 0xFFFF3333;
color[12] = 0xFF99FF33;
color[13] = 0xFF330000;
color[14] = 0xFF000033;
color[15] = 0xFFAADDFF;
color[16] = 0xFFFFDDAA;
color[17] = 0xFFAACCFF;
color[18] = 0xFF999933;
color[19] = 0xFFFF8888;


//============= Fractal Functions =============


function setVerticies(numberOfVertices, vertexSize) {
   vertex = new Array(numberOfVertices);
   for (var repV = 0; repV < numberOfVertices; repV++){
        vertex[repV] = new Array(2);
   }
   var tempx = 0.0;       // x = x'cosT - y'sinT   
   var tempy = 250.0;     // y = x'sinT + y'cosT  
   angle = 2 * Math.PI / numberOfVertices;   
   theta = angle;
   vertex[0][0] = tempx * Math.cos(vertsOrient) - 
                  tempy * Math.sin(vertsOrient);
   vertex[0][1] = tempx * Math.sin(vertsOrient) + 
                  tempy * Math.cos(vertsOrient);
   setColor(0);
   drawCircle(magnification * vertex[0][0], magnification * vertex[0][1],vertexSize);
   for (var repINIT = 1; repINIT < numberOfVertices;
                                          repINIT++){
        vertex[repINIT][0] = vertex[0][0] * Math.cos(theta) - 
                         vertex[0][1] * Math.sin(theta);
        vertex[repINIT][1] = vertex[0][0] * Math.sin(theta) + 
                         vertex[0][1] * Math.cos(theta);     
        theta += angle;
        
        setColor(repINIT);
        drawCircle(magnification * vertex[repINIT][0], magnification * vertex[repINIT][1],vertexSize);
   }        
   currVx = vertex[0][0];           // inital point for start of game   
   currVy = vertex[0][1];   
   nextVx = currVx;   
   nextVy = currVy;
   
   return vertex;
}


function getNextXCoordinate(next, vert, plotRatio) 
{ // add to the current coordinate the plotRatio   
  // of the distance to the chosen vertex   
  // return next + (vert - next) * plotRatio + 10*Math.cos(vert - next);
   return next + (vert - next) * plotRatio; 
}


function getNextYCoordinate(next, vert, plotRatio) 
{ // add to the current coordinate the plotRatio   
  // of the distance to the chosen vertex   
  // return next + (vert - next) * plotRatio + 10*Math.cos(vert - next); 
   return next + (vert - next) * plotRatio; 
}


function drawFractal(vertexSize, pointSize)
{  
  vertex = setVerticies(numberOfVertices, vertexSize);
  for (var repD = 0; repD < maxIterations; repD++) {
     vert = Math.floor( Math.random() * numberOfVertices );   
     currVx = getNextXCoordinate(currVx, vertex[vert][0], plotRatio);   
     currVy = getNextYCoordinate(currVy, vertex[vert][1], plotRatio);   
     setColor(vert);
     if (pointSize <= 1)
     {
       drawPoint(magnification * currVx, magnification * currVy);
     }
     else
     {
        drawCircle(magnification * currVx, magnification * currVy, pointSize);
     }
  }
  isCalculating = 0;
  clickSate = 0;
}


function setNumberOfVertices(num)
{
  numberOfVertices = num;
}


function setPlotRatio(ratio)
{
  plotRatio = ratio;
}


function setMagnification(mag)
{
  magnification = mag;
}


function setMaxIterations(iters)
{
  maxIterations = iters;
}


function setOrientation(angle)
{
  verticesOrientation = angle;
  vertsOrient = Math.PI + 2*Math.PI * verticesOrientation/360;
}


//drawFractal(false);


//======================= IceGraphics =========================
//======================= IceGraphics =========================
//======================= IceGraphics =========================


function setBackgroundColor(color)
{
  document.body.style.background = color;
}
  
function makeLineOfColor(color, length)
{
  var temp = "";
  for (var rep = 0; rep < length; rep++)
  {
    temp += "_";
  }
  document.getElementById("output").innerHTML += "<div style='background: " + color + "; color: " + color + ";'>" + temp + "</div>";
}
  
function showLineNumbers()
{
  document.getElementById("lineNumbers").innerHTML = "";


  for (var rep = 0; rep < 30; rep++)
  {
    document.getElementById("lineNumbers").innerHTML += (rep+1) + "<br />";
  }
}


function newLine()
{
  document.getElementById("output").innerHTML += "<br />";
}
  
function showPic(fileName)
{
  document.getElementById("output").innerHTML += "<img src='" + fileName + "' />";    
}  


function showPic(fileName, width, height)
{
  document.getElementById("output").innerHTML += 
    "<img src='" + fileName + "' width='" +
           width + "' height='" + height + "' />";    
}  


function clearScreen()
{
  document.getElementById("output").innerHTML = "";    
}  


function print(str)
{
  document.getElementById("output").innerHTML += str + "<br />";    
}  


function run() 
{
  var start=Date.now();
  data = ctx.createImageData(600,600);
  isCalculating = 1;
  setState();
  var program = document.getElementById('input').value;
  var programHolder = document.getElementById('holder');


  if (programHolder) 
  {
    programHolder.parentNode.removeChild(programHolder);
  }


  var newProgram = document.createElement('script');
  newProgram.id = 'holder';
  newProgram.text = program;
  document.body.appendChild(newProgram);
  //drawStuff();
  t.innerText="Frame time:"+(Date.now()-start)+"ms";
  isCalculating = 0;
  setState();
  ctx.putImageData(data, 0, 0);
}  


function setState()
{
  if (isCalculating == 1)
  {
    document.getElementById("t").innerHTML="Drawing ...";
  }
  else
  {
    document.getElementById("t").innerHTML=" ";
  }
  ctx.putImageData(data, 0, 0);
}


var hexDigits = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];


function convertDecToHex(number)
{
  if (number < 16)
  {
    return "0" + hexDigits[number];
  }
  return hexDigits[Math.floor(number / 16)] + 
         hexDigits[Math.floor(number % 16)];
}


function convert(red, green, blue)
{
  var redHex = convertDecToHex(red);
  var greenHex = convertDecToHex(green);
  var blueHex = convertDecToHex(blue);
  //console.log(redHex + greenHex + blueHex);
  return redHex + greenHex + blueHex;
}


function setRGB(red, green, blue)
{
  console.log('0xFF' + convert(blue, green, red) );
  bufColor = ('0xFF' + convert(blue, green, red) );
  // bufColor = 0xFFFF00FF;
}


function setColor(col)
{
  if (col == "red")
    bufColor = 0xFF0000FF;
  else if (col == "green")
    bufColor = 0xFF00FF00;
  else if (col == "blue")
    bufColor = 0xFFFF0000;
  else if (col == "blue")
    bufColor = 0xFFFF0000;
  else if (eval(col) >= 0 && eval(col) <= 19)
    bufColor = color[col];
  else
    bufColor = ('0xFF' + convert( Math.floor(Math.random()*256),
                                  Math.floor(Math.random()*256),
                                  Math.floor(Math.random()*256) ) );  
}

function setColorRGB(r, g, b) {
  bufColor = ('0xFF' + convert(r, g, b));
}


function drawRectangle(x1,y1,x2,y2)
{
  x1 = x1 + Math.floor(xmax / 2);
  x2 = x2 + Math.floor(xmax / 2);
  y1 = Math.floor(xmax / 2) - y1;
  y2 = Math.floor(xmax / 2) - y2;
  var diff = x2-x1+1;
  var i = ymax * Math.floor(y1) + Math.floor(x1);
  for(var y = y1; y <= y2; y++)
  {
    for(var x = x1; x <= x2; x++)
    {
      buf[i] = bufColor;
      i++;
    }
    i += xmax - diff;
  }
  ctx.putImageData(data,0,0);
}


function drawPoint(x,y)
{
  x = x + Math.floor(xmax / 2);
  y = Math.floor(xmax / 2) - y;
  var i = ymax * Math.floor(y) + Math.floor(x);
  buf[i] = bufColor;
  ctx.putImageData(data,0,0);
}


function drawCircle(x1,y1,radius)
{
  var xmin = x1 - radius;
  var ymin = y1 - radius;
  var xmax = x1 + radius;
  var ymax = y1 + radius
  //var i = ymax * Math.floor(ymin) + Math.floor(xmin);
  for(var y = ymin; y <= ymax; y++)
  {
    for(var x = xmin; x <= xmax; x++)
    {
      var d1 = Math.abs( (x-x1)*(x-x1) + (y-y1)*(y-y1) -
                                    radius * radius ) < 49.0;
      if (d1) drawPoint(x,y);
    }
  }
}


function drawSin(a, b, c, d)
{
  var prev = a * Math.sin(rep*b + c) + d
  for (var rep = 0; rep < 600; rep += 1)
  {
    var next = a * Math.sin(rep*b + c) + d
    drawPoint(rep, 150 + 50*Math.sin(rep*0.1));
    prev = next;
  }
}


function drawSegment(x1, y1, x2, y2)
 {
   if (x1 == x2)
   {
     if (y1 > y2)
     {
       var temp = y1;
       y1 = y2;
       y2 = temp;
     }
     drawRectangle(x1,y1,x1,y2);
   }
   else if (y1 == y2)
   {
     if (x1 > x2)
     {
       var temp = x1;
       x1 = x2;
       x2 = temp;
     }
     drawRectangle(x1,y1,x2,y1);
   }
   else
   {
     if (x1 > x2)
     {
       var tempx = x1;
       x1 = x2;
       x2 = tempx;
       var tempy = y1;
       y1 = y2;
       y2 = tempy;
     }
     var slope = (y2 - y1)/(x2 - x1);
     for (var xc = x1; xc <= x2; xc++)
     {
       var yc = y1 + (xc - x1) * slope;
       var xcoord = xc;
       var ycoord = yc;
       xcoord = Math.floor(xcoord); // integer pixel only
       ycoord = Math.floor(ycoord);
       if (xcoord >= -Math.floor(xmax/2) && 
           xcoord < Math.floor(xmax/2) && 
           ycoord >= -Math.floor(ymax/2) && 
           ycoord < Math.floor(ymax/2))
       {
         drawPoint(xcoord, ycoord);
       }
     }
   }
  }


function drawConnectedSegment(x1, y1, x2, y2)
{
  if (x1 == x2)
  {
    for (var rep = y1; rep <= y2; rep++)
    {
      drawPoint(x1, rep);
    }
  }
  else
  {
    var prev = y1;
    var slope = (y2-y1)/(x2-x1);
    for (var x = x1; x <= x2; x++)
    {
      var y =  (x-x1) * slope + y1;
      drawPoint( x, Math.floor(y));
      for (var rep = prev; rep < y; rep++)
      {
        drawPoint( x, rep);
      }
      prev = y;
    }
  }
}


function drawStuff()
{
  var start=Date.now();
  setColor(0);


  for (var rep = 50; rep < 500; rep += 100)
  {
    drawRectangle(rep, 70, rep+80, 90);
    drawCircle(rep, 250, 30);
    drawPoint(rep, 150);
  }


  for (var rep = 0; rep < 600; rep += 1)
  {
    drawPoint(rep, 150 + 50*Math.sin(rep*0.1));
  }


  for (var rep = 0; rep < 1000; rep += 1)
  {
    drawPoint( Math.floor(Math.random()*600), Math.floor(Math.random()*600) );
  }
  t.innerText = "Frame time:" + (Date.now()-start) + "ms";
}


function showPic1(fileName)
{
  document.getElementById("output").innerHTML += "<img src='" + fileName + "' />";    
}


function showPic2(fileName, reps)
{
  for (var rep = 0; rep < reps; rep++)
  {
    document.getElementById("output").innerHTML += 
      "<img src='" + fileName + "' />";    
  }
}


function showPic3(fileName, width, height, reps)
{
  for (var rep = 0; rep < reps; rep++)
  {
    document.getElementById("output").innerHTML +
      "<img src='" + fileName + "' width='" + width +
                                "' height='" + height +
                                "' />";
  }
}


function circle(x, y, r) {
  drawCircle(x, y, r);
}


function square(center_x, center_y, width)
{
  
}


function rectangle(x_low, y_low, x_high, y_high) {
  drawRectangle(x_low, y_low, x_high, y_high);
}


function segment(ax,ay,bx,by)
{
  drawSegment(ax, ay, bx, by);
}


function regularPolygon(center_x,center_y)
{
   vertex = new Array(numberOfVertices);
   for (var repV = 0; repV < numberOfVertices; repV++){
        vertex[repV] = new Array(2);
   }
   var tempx = 0.0;       // x = x'cosT - y'sinT   
   var tempy = 200.0;     // y = x'sinT + y'cosT  
   angle = 2 * Math.PI / numberOfVertices;   
   theta = angle;
   vertex[0][0] = tempx * Math.cos(vertsOrient) - 
                  tempy * Math.sin(vertsOrient);
   vertex[0][1] = tempx * Math.sin(vertsOrient) + 
                  tempy * Math.cos(vertsOrient);
   setColor(0);
   drawCircle(magnification * vertex[0][0], magnification * vertex[0][1],vertexSize);
   for (var repINIT = 1; repINIT < numberOfVertices;
                                          repINIT++){
        vertex[repINIT][0] = vertex[0][0] * Math.cos(theta) - 
                         vertex[0][1] * Math.sin(theta);
        vertex[repINIT][1] = vertex[0][0] * Math.sin(theta) + 
                         vertex[0][1] * Math.cos(theta);     
        theta += angle;
        
        setColor(repINIT);
        drawCircle(magnification * vertex[repINIT][0], magnification * vertex[repINIT][1],vertexSize);
   }        
   currVx = vertex[0][0];           // inital point for start of game   
   currVy = vertex[0][1];   
   nextVx = currVx;   
   nextVy = currVy;
   
   return vertex;
}


function polygon(x_array,y_array)
{
  // Each point is (x_array[i],y_array[i])
}


function random_float(min,max)
{
  // Gives random float from min to max value. 
  return Math.random()*(max-min) + min;
}


function set_random_color()
{
  // Sets global color amount things are set to to a random color


  // modifies global variable color
}


function random_stuff()
{
  // If you have time, some functions which generate fractals,
  //   with some things that people can modify would be cool
}

