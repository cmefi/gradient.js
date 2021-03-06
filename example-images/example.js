document.addEventListener("DOMContentLoaded", function(event) {

    
    var testdiv = document.getElementById('test');

    /**********************************************/
    testdiv.innerHTML += '<h4>2-color gradient with stops at 0 to 100</h4>'
    //Create gradient map and store it in grMap variable
    var grMap = gradient.create(
      [0,100],
      ['#fff','#b3d9ff'],
      'hex'
    );
    //Calculate colors the gradient resolves to at specific values
    testdiv.innerHTML += '<ol><li>Get the color at 0 in RGB: ' + gradient.valToColor(0,grMap,'rgb')+ '</li>' +
                         '<li>Get the color at 50 in RGBA: ' + gradient.valToColor(50,grMap,'rgba')+ '</li>' +
                         '<li>Get the color at 90 in Hex: ' + gradient.valToColor(50,grMap,'hex')+ '</li></ol>';
    testdiv.innerHTML += '<span>Draw the full gradient:</span>';
    for (var i=0;i<100;i+=2) {
      var color = gradient.valToColor(i,grMap,'hex');
      testdiv.innerHTML += '<div style="width:100%;height:3px;background-color:' + color + '"></div>';
    }
    
    
    
    /**********************************************/
    testdiv.innerHTML += '<h4>4-color gradient from -50 to 150 using HTML color names (List of available color names from <a href="https://www.w3schools.com/cssref/css_colors.asp">w3schools</a>)</h4>'
    //Create gradient map and store it in grMap variable
    var grMap = gradient.create(
      [-50,10,75,150],
      ['darkgreen','lightblue', 'white','khaki'],
      'htmlcolor'
    );
    //Calculate colors the gradient resolves to at specific values
    testdiv.innerHTML += '<ol><li>RGB color at -13: ' + gradient.valToColor(-13,grMap,'rgb')+ '</li>' +
                         '<li>RGBA color at 50: ' + gradient.valToColor(50,grMap,'rgba')+ '</li>' +
                         '<li>Hex color at 90: ' + gradient.valToColor(50,grMap,'hex')+ '</li></ol>';
    testdiv.innerHTML += '<span>Full gradient:</span>';
    for (var i=-50;i<150;i+=5) {
      var color = gradient.valToColor(i,grMap,'hex');
      testdiv.innerHTML += '<div style="width:100%;height:2px;background-color:' + color + '"></div>';
    }
    
    
    
    /**********************************************/
    testdiv.innerHTML += '<h4>8-color gradient from 0 to 1 with semi-transparent RGBA inputs</h4>'
    var grMap = gradient.create(
      [-1,-0.5,-0.15,0,0.3,0.5,0.8,1],
      ['rgba(5,0,255,1)','rgba(0,132,255,.8)','rgba(0,212,255,.6)','rgba(0,255,204,.5)','rgba(253,255,53,.4)','rgba(255,160,0,.5)','rgba(255,50,0,.8)','rgba(255,0,122,1)'],
      'rgba'
    );
    for (var i=-1;i<1;i+=0.05) {
      var color = gradient.valToColor(i,grMap,'rgba');
      testdiv.innerHTML += '<div style="width:100%;background-color:' + color + '">'+
                             '<span style="font-size:x-small">' + 
                                'value: ' + i.toFixed(1) + ' | hex: ' + color +
                             '</span>' + 
                           '</div>';
    }
    
    
    
    /********************************************/
    testdiv.innerHTML += '<a name="ex4"><h4>SVG Example</h4></a>';
    //Create SVG container
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width','200');
    svg.setAttribute('height','200');
    testdiv.appendChild(svg);
    //Create outer diamond
    var d0 ='M100,0 L200,100 100,200 0,100Z';
    //Define gradient
    var grMap = gradient.create(
      [0,10,30,40,50,70,80,90,100],
      ['rgba(5,0,255,1)','rgba(0,132,255,.8)','rgba(0,212,255,.6)','rgba(0,255,204,.5)','rgba(253,255,53,.4)','rgba(255,160,0,.5)','rgba(255,50,0,.8)','rgba(255,0,122,1)','rgba(255,255,255,1)'],
      'rgba'
    );
    //Draw SVG
    for (var i=0;i<=100;i+=1) {
      var color = gradient.valToColor(i,grMap,'rgba');
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      var d = 'M100,'+i.toString()+' L'+(200-i).toString()+',100 100,'+(200-i).toString()+' '+i.toString()+',100Z';
      console.log(d);
      path.setAttribute('d','M100,'+i.toString()+' L'+(200-i).toString()+',100 100,'+(200-i).toString()+' ' + i + ',100Z');
      path.setAttribute('fill',color);
      svg.appendChild(path);
      //Add animation
      path.innerHTML = '<animate attributeName="d" from="'+d+'" to="'+d0+'" dur="30s" fill="freeze" repeatCount="indefinite" />';
    }
    
    
    
    
    
    /********************************************/
    testdiv.innerHTML += '<a name="ex5"><h4>SVG Example 2</h4></a>';
    //Create SVG container
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width','200');
    svg.setAttribute('height','200');
    testdiv.appendChild(svg);
    //Create outer diamond
    var d0 ='M100,0 L200,100 100,200 0,100Z';
    //Define gradient
    var grMap = gradient.create(
      [0,10,30,40,50,70,80,90,100],
      ['rgba(5,0,255,1)','rgba(0,132,255,.8)','rgba(0,212,255,.6)','rgba(0,255,204,.5)','rgba(253,255,53,.4)','rgba(255,160,0,.5)','rgba(255,50,0,.8)','rgba(255,0,122,1)','rgba(255,255,255,1)'],
      'rgba'
    );
    
    //Draw SVG
    for (var i=0;i<=100;i+=1) {
      var color = gradient.valToColor(i,grMap,'rgba');
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      var d = 'M100,'+i.toString()+' L'+(200-i).toString()+',100 100,'+(200-i).toString()+' '+i.toString()+',100Z';
      path.setAttribute('d','M100,'+i.toString()+' L'+(200-i).toString()+',100 100,'+(200-i).toString()+' ' + i + ',100Z');
      path.setAttribute('fill',color);
      path.setAttribute('id',i);
      svg.appendChild(path);
      var dur = ((i/1000+0.0001).toFixed(4)).toString() + 's';
      console.log(dur);
      path.innerHTML = '<animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="'+dur+'" additive="sum" repeatCount="indefinite" />';
      //Add animation
    }
    
    var interval = setInterval(randomColors, 100);
    function randomColors() {
      var n = Math.random();
      n = Math.floor(n*100);
      var randColorIndex = Math.floor(Math.random() * 100);
      var newColor = gradient.valToColor(randColorIndex,grMap,'rgba');
      document.getElementById(n).setAttribute('fill',newColor);
      for (var i=1;i<=100;i++) {
        if (randColorIndex + i > 100 || n + i > 100) break;
        newColor = gradient.valToColor(randColorIndex+i,grMap,'rgba');
        document.getElementById(n+i).setAttribute('fill',newColor);
      }
    }



});
