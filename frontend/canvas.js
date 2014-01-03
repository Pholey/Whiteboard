// Generated by LiveScript 1.2.0
(function(){
  var Brush, WireframeBrush, ColorSamplerBrush, EraserBrush, getBrush, Action, User;
  Brush = (function(){
    Brush.displayName = 'Brush';
    var prototype = Brush.prototype, constructor = Brush;
    function Brush(radius, color, canvas){
      this.type = "default";
      this.isTool = false;
      this.radius = radius;
      this.color = color;
      this.canvas = canvas;
    }
    prototype.actionStart = function(x, y){
      this.canvas.context.moveTo(x, y);
      this.canvas.context.strokeStyle = this.color;
      this.canvas.context.beginPath();
      this.canvas.context.lineWidth = this.radius;
      this.canvas.context.lineJoin = this.canvas.context.lineCap = 'round';
    };
    prototype.actionEnd = function(){
      this.canvas.context.closePath();
    };
    prototype.actionMove = function(x, y){
      this.canvas.context.lineTo(x, y);
      this.canvas.context.stroke();
    };
    prototype.actionMoveData = function(data){
      var i$, len$, p;
      for (i$ = 0, len$ = data.length; i$ < len$; ++i$) {
        p = data[i$];
        this.canvas.context.lineTo(p[0], p[1]);
      }
      this.canvas.context.stroke();
    };
    prototype.doAction = function(data){
      var i$, len$, p;
      if (data.length !== 0) {
        this.actionStart(data[0][0], data[0][1]);
        for (i$ = 0, len$ = data.length; i$ < len$; ++i$) {
          p = data[i$];
          this.canvas.context.lineTo(p[0], p[1]);
        }
        this.canvas.context.stroke();
        this.actionEnd();
      }
    };
    return Brush;
  }());
  WireframeBrush = (function(superclass){
    var prototype = extend$((import$(WireframeBrush, superclass).displayName = 'WireframeBrush', WireframeBrush), superclass).prototype, constructor = WireframeBrush;
    function WireframeBrush(radius, color, canvas){
      WireframeBrush.superclass.apply(this, arguments);
      this.type = "wireframe";
    }
    prototype.actionStart = function(x, y){
      this.canvas.context.moveTo(x, y);
      this.canvas.context.strokeStyle = this.color;
      this.canvas.context.beginPath();
      this.canvas.context.lineWidth = this.radius;
    };
    prototype.actionEnd = function(){
      this.canvas.context.closePath();
    };
    prototype.actionMove = function(x, y){
      var numpoints;
      this.canvas.context.lineTo(x, y);
      numpoints = this.canvas.action.coord_data.length;
      if (numpoints >= 4) {
        this.canvas.context.lineTo(this.canvas.action.coord_data[numpoints - 4][0], this.canvas.action.coord_data[numpoints - 4][1]);
      }
      this.canvas.context.stroke();
    };
    prototype.actionMoveData = function(data){
      var i$, to$, i, nearpoint;
      for (i$ = 1, to$ = data.length; i$ < to$; ++i$) {
        i = i$;
        this.canvas.context.lineTo(data[i][0], data[i][1]);
        nearpoint = data[i - 5];
        if (nearpoint) {
          this.canvas.context.moveTo(nearpoint[0], nearpoint[1]);
          this.canvas.context.lineTo(data[i][0], data[i][1]);
        }
      }
      this.canvas.context.stroke();
    };
    prototype.doAction = function(data){
      var i$, to$, i, nearpoint;
      if (data.length !== 0) {
        this.actionStart(data[0][0], data[0][1]);
        for (i$ = 1, to$ = data.length; i$ < to$; ++i$) {
          i = i$;
          this.canvas.context.lineTo(data[i][0], data[i][1]);
          nearpoint = data[i - 5];
          if (nearpoint) {
            this.canvas.context.moveTo(nearpoint[0], nearpoint[1]);
            this.canvas.context.lineTo(data[i][0], data[i][1]);
          }
        }
        this.canvas.context.stroke();
        this.actionEnd();
      }
    };
    return WireframeBrush;
  }(Brush));
  ColorSamplerBrush = (function(superclass){
    var prototype = extend$((import$(ColorSamplerBrush, superclass).displayName = 'ColorSamplerBrush', ColorSamplerBrush), superclass).prototype, constructor = ColorSamplerBrush;
    function ColorSamplerBrush(radius, color, canvas){
      ColorSamplerBrush.superclass.apply(this, arguments);
      this.type = "sampler";
    }
    prototype.actionStart = function(x, y){
      var p, a, hex;
      p = this.canvas.context.getImageData(x, y, 1, 1).data;
      a = p[3] / 255.0;
      hex = "rgba(" + p[0] + "," + p[1] + "," + p[2] + "," + a + ")";
      this.canvas.doColorChange(hex);
    };
    prototype.actionEnd = function(){
      return;
    };
    prototype.actionMove = function(x, y){
      this.actionStart(x, y);
    };
    prototype.actionMoveData = function(data){};
    prototype.doAction = function(data){
      return;
    };
    return ColorSamplerBrush;
  }(Brush));
  EraserBrush = (function(superclass){
    var prototype = extend$((import$(EraserBrush, superclass).displayName = 'EraserBrush', EraserBrush), superclass).prototype, constructor = EraserBrush;
    function EraserBrush(radius, color, canvas){
      EraserBrush.superclass.apply(this, arguments);
      this.type = "eraser";
      this.eraseBuffer = void 8;
    }
    prototype.actionStart = function(x, y){
      this.eraseBuffer = this.canvas.context.createImageData(this.radius, this.radius);
    };
    return EraserBrush;
  }(Brush));
  getBrush = function(brushtype, radius, color, canvas){
    switch (false) {
    case brushtype !== 'default':
      return new Brush(radius, color, canvas);
    case brushtype !== 'wireframe':
      return new WireframeBrush(radius, color, canvas);
    case brushtype !== 'sampler':
      return new ColorSamplerBrush(radius, color, canvas);
    }
  };
  Action = (function(){
    Action.displayName = 'Action';
    var prototype = Action.prototype, constructor = Action;
    function Action(id, brushtype, radius, color, coords){
      this.id = id;
      this.brushtype = brushtype;
      this.radius = radius;
      this.fillColor = color;
      this.coord_data = coords;
    }
    return Action;
  }());
  User = (function(){
    User.displayName = 'User';
    var prototype = User.prototype, constructor = User;
    function User(id){
      this.id = id;
    }
    return User;
  }());
  (function(){
    var createCanvas, init, container;
    createCanvas = function(parent, width, height){
      var canvas;
      width == null && (width = 100);
      height == null && (height = 100);
      canvas = {};
      canvas.node = document.createElement('canvas');
      canvas.node.width = width;
      canvas.node.height = height;
      canvas.node.style.cursor = 'url("content/cursor_pencil.png"), url("content/cursor_pencil.cur"), pointer';
      canvas.context = canvas.node.getContext('2d');
      parent.appendChild(canvas.node);
      return canvas;
    };
    init = function(container, width, height, fillColor, brushRadius){
      var canvas, context, points, pool, i$, i;
      canvas = createCanvas(container, width, height);
      context = canvas.context;
      points = {};
      canvas.id = "";
      pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (i$ = 0; i$ <= 20; ++i$) {
        i = i$;
        canvas.id += pool.charAt(Math.floor(Math.random() * pool.length));
      }
      canvas.brushRadius = brushRadius;
      canvas.history = [];
      canvas.users = {};
      canvas.action = new Action('self', 'default', brushRadius, fillColor, []);
      canvas.brush = new Brush(brushRadius, fillColor, canvas);
      canvas.connection = new WebSocket('ws://localhost:9002/');
      canvas.connection.onopen = function(){
        canvas.connection.send(JSON.stringify({
          id: canvas.id,
          action: 'join'
        }));
        return;
      };
      canvas.connection.onerror = function(error){
        console.log('websocket dun goofed: ' + error);
      };
      canvas.connection.onmessage = function(e){
        var message, cur_user, tempAction, x;
        message = JSON.parse(e.data);
        if (message.id) {
          switch (message.action) {
          case 'join':
            canvas.users[message.id] = new User(message.id);
            canvas.users[message.id].brush = new Brush(10, '#000000', canvas);
            canvas.users[message.id].action = new Action(message.id, 'default', 10);
            break;
          case 'action-start':
            cur_user = canvas.users[message.id];
            cur_user.action = new Action(message.id, cur_user.brush.type, message.data.radius, message.data.fillColor, []);
            break;
          case 'action-data':
            canvas.users[message.id].action.coord_data.push(message.data);
            canvas.userdraw(message.id, message.data[0], message.data[1]);
            break;
          case 'action-end':
            cur_user = canvas.users[message.id];
            tempAction = new Action(message.id, cur_user.brush.type, cur_user.action.radius, cur_user.action.fillColor, (function(){
              var i$, ref$, len$, results$ = [];
              for (i$ = 0, len$ = (ref$ = cur_user.action.coord_data).length; i$ < len$; ++i$) {
                x = ref$[i$];
                results$.push(x);
              }
              return results$;
            }()));
            canvas.history.push(tempAction);
            break;
          case 'undo':
            canvas.undo(message.id);
            break;
          case 'radius-change':
            canvas.users[message.id].brush.radius = message.data;
            canvas.users[message.id].action.radius = message.data;
            break;
          case 'color-change':
            canvas.users[message.id].brush.color = message.data;
            canvas.users[message.id].action.fillColor = message.data;
            break;
          case 'brush-change':
            cur_user = canvas.users[message.id];
            cur_user.brush = getBrush(message.data, cur_user.action.radius, cur_user.action.fillColor, canvas);
          }
        } else {
          console.log("server says: " + e.data);
        }
      };
      context.fillCircle = function(x, y, radius, fillColor){
        this.fillStyle = fillColor;
        this.beginPath();
        this.moveTo(x, y);
        this.arc(x, y, radius, 0, Math.PI * 2, false);
        this.fill();
      };
      canvas.userdraw = function(user_id, x, y){
        var temp_user, ref$, tempcoords;
        temp_user = canvas.users[user_id];
        if (!temp_user.brush.isTool) {
          if (canvas.isDrawing) {
            canvas.brush.actionEnd();
          }
          [(ref$ = temp_user.action.coord_data.push)[x], ref$[y]];
          temp_user.brush.doAction(temp_user.action.coord_data);
          if (canvas.isDrawing) {
            tempcoords = canvas.action.coord_data[0];
            canvas.brush.actionStart(tempcoords[0], tempcoords[1]);
            canvas.brush.actionMoveData(canvas.action.coord_data);
          }
        }
      };
      canvas.node.onmousemove = function(e){
        var x, y;
        if (!canvas.isDrawing) {
          return;
        }
        x = e.clientX;
        y = e.clientY;
        canvas.brush.actionMove(x, y);
        canvas.action.coord_data.push([x, y]);
        canvas.connection.send(JSON.stringify({
          id: canvas.id,
          action: 'action-data',
          data: [x, y]
        }));
      };
      canvas.redraw = function(){
        var tempBrush, i$, ref$, len$, x;
        canvas.context.clearRect(0, 0, canvas.node.width, canvas.node.height);
        tempBrush = canvas.brush;
        for (i$ = 0, len$ = (ref$ = canvas.history).length; i$ < len$; ++i$) {
          x = ref$[i$];
          canvas.brush = getBrush(x.brushtype, x.radius, x.fillColor, canvas);
          if (!canvas.brush.isTool) {
            canvas.brush.doAction(x.coord_data);
          }
        }
        canvas.brush = tempBrush;
      };
      canvas.undo = function(user_id){
        var i$, i, tempcoords;
        if (user_id === 'self') {
          canvas.connection.send(JSON.stringify({
            id: canvas.id,
            action: 'undo'
          }));
        }
        if (canvas.isDrawing) {
          canvas.brush.actionEnd();
        }
        for (i$ = canvas.history.length - 1; i$ >= 0; --i$) {
          i = i$;
          if (canvas.history[i].id = user_id) {
            canvas.history.splice(i, 1);
            break;
          }
        }
        if (canvas.isDrawing) {
          tempcoords = canvas.action.coord_data[0];
          canvas.brush.actionStart(tempcoords[0], tempcoords[1]);
          canvas.brush.actionMoveData(canvas.action.coord_data);
        }
        canvas.redraw();
      };
      canvas.node.onmousedown = function(e){
        canvas.isDrawing = true;
        canvas.brush.actionStart(e.clientX, e.clientY);
        canvas.connection.send(JSON.stringify({
          id: canvas.id,
          action: 'action-start',
          data: {
            radius: canvas.action.radius,
            fillColor: canvas.action.fillColor
          }
        }));
      };
      canvas.node.onmouseup = function(e){
        var tempAction, x;
        canvas.isDrawing = false;
        tempAction = new Action('self', canvas.brush.type, canvas.action.radius, canvas.action.fillColor, (function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = canvas.action.coord_data).length; i$ < len$; ++i$) {
            x = ref$[i$];
            results$.push(x);
          }
          return results$;
        }()));
        canvas.history.push(tempAction);
        canvas.action.coord_data = [];
        canvas.brush.actionEnd();
        canvas.redraw();
        canvas.connection.send(JSON.stringify({
          id: canvas.id,
          action: 'action-end'
        }));
      };
      canvas.doColorChange = function(color){
        document.getElementById('color-value').value = color;
        canvas.action.fillColor = color;
        canvas.brush.color = color;
        canvas.connection.send(JSON.stringify({
          id: canvas.id,
          action: 'color-change',
          data: color
        }));
      };
      window.onkeydown = function(e){
        if (e.ctrlKey) {
          canvas.ctrlActivated = true;
        }
      };
      window.onkeyup = function(e){
        switch (e.keyCode) {
        case 90:
          if (canvas.ctrlActivated) {
            canvas.undo('self');
          }
        }
        if (e.ctrlKey) {
          canvas.ctrlActivated = false;
        }
      };
      document.getElementById('color-value').onkeypress = function(e){
        canvas.doColorChange(this.value);
      };
      document.getElementById('radius-value').onkeypress = function(e){
        canvas.action.radius = this.value;
        canvas.brush.radius = this.value;
        canvas.connection.send(JSON.stringify({
          id: canvas.id,
          action: 'radius-change',
          data: this.value
        }));
      };
      document.getElementById('download').onclick = function(e){
        window.open(canvas.node.toDataURL(), 'Download');
      };
      document.getElementById('csampler').onclick = function(e){
        canvas.brush = new ColorSamplerBrush(canvas.action.radius, canvas.action.fillColor, canvas);
        canvas.node.style.cursor = 'url("content/cursor_pipet.png"), url("content/cursor_pipet.cur"), pointer';
        canvas.connection.send(JSON.stringify({
          id: canvas.id,
          action: 'brush-change',
          data: 'sampler'
        }));
      };
      document.getElementById('pencil-brush').onclick = function(e){
        canvas.brush = new Brush(canvas.action.radius, canvas.action.fillColor, canvas);
        canvas.node.style.cursor = 'url("content/cursor_pencil.png"), url("content/cursor_pencil.cur"), pointer';
        canvas.connection.send(JSON.stringify({
          id: canvas.id,
          action: 'brush-change',
          data: 'default'
        }));
      };
      document.getElementById('wireframe-brush').onclick = function(e){
        canvas.brush = new WireframeBrush(canvas.action.radius, canvas.action.fillColor, canvas);
        canvas.node.style.cursor = 'url("content/cursor_wireframe.png"), url("content/cursor_wireframe.cur"), pointer';
        canvas.connection.send(JSON.stringify({
          id: canvas.id,
          action: 'brush-change',
          data: 'wireframe'
        }));
      };
    };
    container = document.getElementById('canvas');
    return init(container, window.innerWidth - 17, window.innerHeight - 45, 'rgba(0,0,0,1.0)', 10);
  })();
  function extend$(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
