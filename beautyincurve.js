(function () {
  var data = {
    range: 0,
    speed: 0,
    isInner: true,
    pointNum: 0,
    innerNum: 0,
    outerNum: 0,
    zoom: 0,
    radian: 0,
    radius: 0,
    ratio: 0,
    x: 0,
    y: 0,
    isPause: false,
    color: [],
    ctx: null
  };
  initCanvas(data);
  processForm(data);
  processControl(data);
})();

function initCanvas(data) {
  var canvasWrapper = document.getElementById('canvasWrapper');
  var canvas = document.getElementById('canvas');
  var range = 0;
  var ctx;
  if (canvasWrapper.clientWidth > 450) {
    range = 900;
  } else {
    range = 300;
  }
  data.range = range;
  canvas.width = range;
  canvas.height = range;
  if (data.ctx) {
    ctx = data.ctx;
  } else {
    ctx = canvas.getContext('2d');
    data.ctx = ctx;
  }
  ctx.fillStyle = '#000';
  ctx.fillRect(0,0,range,range);
}

function processForm(data) {
  var speedSlider = document.getElementById('speed');
  var inputRadio = document.getElementById('inputRadio');
  changeState('buttonArea', true);
  data.speed = parseInt(speedSlider.value);
  speedSlider.onchange = function () {
    data.speed = parseInt(speedSlider.value);
  }
  inputRadio.onchange = function (e) {
    var randomButton = document.getElementById('random');
    var inputArea = document.getElementById('inputArea');
    var inputArray = [];
    var val = e.target.value;
    inputArea.innerHTML = '';
    changeState('random', false);
    if ('inner' == val) {
      data.isInner = true;
      inputArray = [{
        name: 'pointPosition',
        min: 1,
        max: 16
      }, {
        name: 'innerCircleRadius',
        min: 1,
        max: 2
      }, {
        name: 'outerCircleRadius',
        min: 1.5,
        max: 3
      }];
    } else {
      data.isInner = false;
      inputArray = [{
        name: 'innerCircleRadius',
        min: 1,
        max: 22
      }, {
        name: 'outerCircleRadius',
        min: 1.5,
        max: 3
      }, {
        name: 'pointPosition',
        min: 1,
        max: 1.5
      }];
    }
    randomButton.onclick = function () {
      setRandom(inputArray[0].name);
      setTimeout(function () {
        setRandom(inputArray[1].name);
        setTimeout(function () {
          setRandom(inputArray[2].name);
        });
      });
    };
    processInput(data, inputArea, inputArray, 1, 0);
  };
}

function processControl(data) {
  var playButton = document.getElementById('play');
  var stopButton = document.getElementById('stop');
  var clickPlay = function () {
    changeState('inputControl', true);
    changeState('random', true);
    changeState('stop', false);
    this.textContent = 'Pause';
    this.onclick = clickPause;
    data.isPause = false;
    startDrawing(data);
  };
  var clickPause = function () {
    this.textContent = 'Play';
    this.onclick = clickPlay;
    data.isPause = true;
  };
  playButton.onclick = clickPlay;
  stopButton.onclick = function () {
    clickPause.call(playButton);
    changeState('inputControl', false);
    changeState('random', false);
    changeState('stop', true);
    setTimeout(function () {
      data.zoom = 0;
      data.radian = 0;
      data.radius = 0;
      data.ratio = 0;
      data.x = 0;
      data.y = 0;
      data.color = [];
      initCanvas(data);
    }, 50-10*data.speed);
  };
}

function processInput(data, parent, arr, preNum, index) {
  var inputData = arr[index];
  var min = Math.ceil(inputData.min*preNum);
  var max = Math.floor(inputData.max*preNum);
  var created = createInput(inputData.name, min, max, function (e) {
    var number = parseInt(e.target.value);
    var attrName = inputData.name.replace(/[A-Z]/, '-').split('-')[0] + 'Num';
    changeState('play', true);
    arr.forEach(function (each, currentIndex) {
      var eachElement = document.getElementById(each.name + 'Wrapper');
      if (currentIndex > index && eachElement != null) {
        parent.removeChild(eachElement);
      }
    });
    if (number < min || number > max) {
      e.target.value = '';
    } else {
      data[attrName] = number;
      if (index < arr.length-1) {
        processInput(data, parent, arr, number, index+1);
      } else {
        changeState('play', false);
      }
    }
  });
  parent.appendChild(created);
}

function createInput(name, min, max, onChange) {
  var div = document.createElement('div');
  var span = document.createElement('span');
  var input = document.createElement('input');
  var friendlyName = name.replace(/([A-Z])/g, ' $1').toLowerCase();
  var val = '';
  div.id = name + 'Wrapper';
  span.className = 'block';
  span.textContent = 'Please input a integer for ' + friendlyName + ' from ' + min + ' to ' + max + '.';
  div.appendChild(span);
  input.type = 'number';
  input.className = 'block';
  input.name = name;
  input.min = min;
  input.max = max;
  input.onkeydown = function (e) {
    var key = e.key;
    if (!(this.value || /[1-9]/.test(key))) {
      e.preventDefault();
    } else if (key == '.') {
      e.preventDefault();
    } else {
      val = this.value;
    }
  }
  input.oninput = function () {
    var newVal = this.value;
    var num = parseInt(newVal);
    if (!newVal) {
    } else if (isNaN(num)) {
      this.value = val;
    } else if (num > max || (num < min && (num <= min/10-1 || num > max/10))) {
      this.value = val;
    }
  }
  if (typeof onChange == 'function') {
    input.onchange = onChange;
  }
  div.appendChild(input);
  return div;
}

function setRandom(name) {
  var inputElement = document.querySelector('input[name="' + name + '"]');
  var range = parseInt(inputElement.max) - parseInt(inputElement.min) + 1;
  var randomNum = parseInt(inputElement.min) + Math.random() * range;
  inputElement.value = Math.floor(randomNum);
  inputElement.dispatchEvent(new Event('change'));
}

function changeState(id, disabled) {
  var element = document.getElementById(id);
  if (element.tagName == 'DIV') {
    var inputs = element.querySelectorAll('input,label,button');
    inputs.forEach(function (input) {
      if (disabled) {
        input.style.cursor = 'not-allowed';
      } else {
        input.style.cursor = '';
      }
      input.disabled = disabled;
    });
  } else {
      if (disabled) {
        element.style.cursor = 'not-allowed';
      } else {
        element.style.cursor = '';
      }
      element.disabled = disabled;
  }
}

function startDrawing(data) {
  var x = 0;
  var y = 0;
  var color = '';
  var isChanged = false;
  var divisor = 180;
  var tempRadian = Math.PI*data.radian/divisor;
  var colorObj;
  var quotient;
  if (!data.radius) {
    data.radius = data.outerNum-data.innerNum;
  }
  if (!data.zoom) {
    data.zoom = data.range/(2*(data.outerNum + data.pointNum));
  }
  if (data.isInner) {
    if (!data.ratio) {
      data.ratio = data.outerNum/data.innerNum;
    }
  } else {
    if (!data.ratio) {
      data.ratio = data.innerNum/data.outerNum;
    }
  }
  x = data.radius*Math.sin(tempRadian);
  y = 0 - data.radius*Math.cos(tempRadian);
  x += data.pointNum*Math.sin(tempRadian-data.ratio*tempRadian);
  y -= data.pointNum*Math.cos(tempRadian-data.ratio*tempRadian);
  x = x*data.zoom + data.range/2;
  y = y*data.zoom + data.range/2;
  for (var i = 0; i < 3; i++) {
    if (!data.color[i]) {
      isChanged = true;
      colorObj = {};
      data.color[i] = colorObj;
      colorObj.value = 80 + Math.floor(160*Math.random());
      colorObj.step = 5+10*Math.random();
      colorObj.index = 0;
      colorObj.sign = 1;
    } else {
      colorObj = data.color[i];
    }
    quotient = Math.floor(data.radian/colorObj.step) - colorObj.index;
    if (quotient == 1) {
      isChanged = true;
      colorObj.index++;
      colorObj.value += colorObj.sign;
      if (colorObj.value > 240) {
        colorObj.sign = -1;
      } else if (colorObj.value < 80) {
        colorObj.sign = 1;
      }
    }
  }
  if (isChanged) {
    color = 'rgb(';
    data.color.forEach(function (item) {
      color += item.value + ', ';
    });
    color = color.slice(0, -2) + ')';
  }
  drawLine(data.x, data.y, x, y, color, data.ctx, data.range);
  data.x = x;
  data.y = y;
  data.radian++;
  if (!data.isPause) {
    if (data.radian%360 == 0 && data.ratio*data.radian%360 == 0) {
      document.getElementById('play').dispatchEvent(new Event('click'));
    }
    setTimeout(startDrawing, 50-10*data.speed, data);
  }
}

function drawLine(x1, y1, x2, y2, color, ctx, range) {
  if (color) {
    ctx.strokeStyle = color;
  }
  if (x1 == 0 && y1 == 0) {
    if (range == 300) {
      ctx.lineWidth = 1;
    } else if (range == 900) {
      ctx.lineWidth = 2;
    }
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
