/*
    centerRelation 2.0 - used to draw a relation graph with only one center
    based on Raphael

    Author: Huang Min
       from Sun Yat-sen University, Schools of Software Software engineering
*/

/*\
  > Arguments

    - centerTEXT (string) the text of the center
    - DIVid (string) the id of a div dom to put the graph in
    - list (array of object) the type of that in list is object with attribute -name(string) and -num(number)
      the larger the list[i].num is, the more center the list[i].name is
    - width (number) the width of graph
    - height (number) the height of graph
    - smallR (number) the smallest radius of circle, must smaller than width and height
    - animation (string) the type of animation
      it has "linear", "easeIn", "easeOut", "easeInOut", "backIn", "elastic", "bounce"
    - animateTime (number) the time of the start ANIMATE cost. the unit is "ms"
    - hrefBase (string) hrefBase + list[i].name is the real url of a rect, can be null
\*/
function centerRelation(centerTEXT, docID, list, width, height, smallR, animation, animateTime, hrefBase) {
    this.centerTEXT = centerTEXT;
    this.doc = document.getElementById(docID);
    this.list = list.concat();
    this.smallR = smallR;
    this.animation = animation;
    this.animateTime = animateTime;
    this.width = width;
    this.height = height;
    this.hrefBase = hrefBase;
    this.centerX = width/2;
    this.centerY = height/2;
    this.paper = Raphael(docID, width, height);

  
    if (!this._isParamValid() || !this._isListValid()){
      this.doc.innerHTML = this.wrongInfo;
    }
    this.paint();
}
centerRelation.prototype.paint = function (){
    var _t = this;


    var center = _t._insertRect(0,0,_t.centerTEXT)[0];
    center.glow({'fill': _t._getStyle(center.node, 'fill'),
                'opcity': 0.8});
    // IE8不支持forEach
    _t.list.forEach(function (value, index){
        value.num = (this.biggest - value.num) * this.unit + this.smallR;
        var up, down;
        // 随机选取周围词条插入位置
        if ( (!this.widthLonger) && value.num > (this.centerX-30) ){
          up = this.centerX-30;
        } else up = value.num;

        if ( this.widthLonger && value.num > (this.centerY-10)){
          down = Math.sqrt(Math.pow(value.num, 2) - Math.pow(this.centerY-10, 2))
        } else down = 0;

        do {
          value.xd = (Math.random()*(up-down) + down)*(Math.random()<0.5 ? -1 : 1);
          value.yd = Math.sqrt((Math.pow(value.num, 2) - Math.pow(value.xd, 2)))*(Math.random()<0.5 ? -1 : 1);
          console.log(1);
        } while (this._overlap(value.xd, value.yd, index));
        this._insertRect(value.xd, value.yd, value.name)
    },_t);
  }
centerRelation.prototype._ramdomColor = function () {
    return "CR-" + String.fromCharCode(Math.floor(Math.random() * 8) + 97);
}
centerRelation.prototype._getStyle = function (el, attr){
  if (window.getComputedStyle){
    return window.getComputedStyle(el)[attr];
  } else if (el.currentStyle) {
    return el.currentStyle[attr];
  } else return null;
}
centerRelation.prototype._overlap = function(xd, yd, index){
  var _t = this,
    xUp = xd+90,
    xDown = xd-90,
    yUp = yd+20,
    yDown = yd-20,
    re = false;

  if (xd<90 && xd>-90 && yd<20 && yd>-20) return true;
  for (var i=0; i<index; i++){
    if (this.list[i].xd<xUp && this.list[i].xd>xDown && this.list[i].yd<yUp && this.list[i].yd>yDown){
      re = true;
      break;
    }
  }
  return re;
}

centerRelation.prototype._addActive = function(){
  for(var i=0;i<arguments.length;i++){
    arguments[i].setAttribute("class",arguments[i].getAttribute("class")+" active");
    console.log(arguments[i].getAttribute("class"))
  }
}
centerRelation.prototype._removeActive = function(){
  for(var i=0;i<arguments.length;i++){
    arguments[i].setAttribute("class",arguments[i].getAttribute("class").slice(0,-7));
  }
}
centerRelation.prototype._insertRect = function(xd, yd, textContent) {
    var rect, text, path,
        _t = this;

    text = _t.paper.text(_t.centerX, _t.centerY, textContent);
    text.node.setAttribute("class","CR-text")
    console.log(text.node.getAttribute("class"));


    var rWidth = text.getBBox().width + 20,
        rHeight = text.getBBox().height + 10;

    rect = this.paper.rect(
        this.centerX-rWidth/2, this.centerY-rHeight/2, rWidth, rHeight, 15);
    rect.node.setAttribute("class",_t._ramdomColor());

    var rectSet = this.paper.set();
    rectSet.push(rect,text);

    if(_t.hrefBase) {
        text.attr('href', _t.hrefBase + textContent);
        rectSet.click(function() {
        window.open(text.attr('href'));
      });
    }
    text.toFront();
    
    path = _t.paper.path("M" + _t.centerX + "," + _t.centerY)
          .attr('stroke', '#888').toBack()
          .animate({
            'path' : "M" + _t.centerX + "," + _t.centerY + "L" + (_t.centerX+xd) + "," + (_t.centerY+yd)
          }, _t.animateTime, _t.animation);
    path.node.setAttribute("class", "CR-path");

    all = this.paper.set().push(rect,text,path);

    all.hover(function (){
      rectSet.transform("S1.2").toFront();
      _t._addActive(rect.node);
      path.attr({
        'stroke': _t._getStyle(rect.node,'fill'),
        'stroke-width': '3'
      });

    }, function (){
      rectSet.transform("S1");
      _t._removeActive(rect.node);
      path.attr({
        'stroke': '#888',
        'stroke-width': '1'
      });
    });

    rectSet.forEach(function (e){
      e.animate({
        'x': e.attr('x') + xd,
        'y': e.attr('y') + yd
      }, _t.animateTime, _t.animation)
    });
    return rectSet;
}

centerRelation.prototype._isListValid = function(){
    var smallest = Infinity,
        biggest = -Infinity;
    //IE8不支持every
    var isValid = this.list.every(function (value){
        if (typeof value.num !== "number" && typeof value.name !== "string"){
            return false;
        } else{
            if (value.num > biggest) biggest = value.num;
            if (value.num < smallest) smallest = value.num;
            return true;
        }
    });

    if (!isValid) {
        this.wrongInfo = "Invalid list";
        return false;
    } else{
        var rangeFinal = this.bigR - this.smallR,
            rangeData = biggest - smallest;
        this.unit = rangeFinal/rangeData;
        this.biggest = biggest;
        return true;
    }
}


centerRelation.prototype._isParamValid = function(){
  var _t = this;
  if (typeof _t.centerTEXT !== "string"){
    _t.wrongInfo = "centerTEXT must be a string";
    return false;
  }

  if (_t.doc === null){
    _t.wrongInfo = "There has no elements ID is "+ _t.docID;
    return false;
  }

  if (typeof _t.width !== "number" || _t.width<=0 ){
    _t.wrongInfo = "Invalid width";
    return false;
  }

  if (typeof _t.height !== "number" || _t.height<=0 ){
    _t.wrongInfo = "Invalid height";
    return false;
  }

  if (typeof _t.smallR !== "number" || _t.smallR<0 
      || _t.smallR>=_t.width || _t.smallR>=_t.height){
    _t.wrongInfo = "smallR must be a number and vailid";
    return false;
  }

  var animateValue = "linear,easeIn,easeOut,easeInOut,backIn,elastic,bounce";
  if (typeof _t.animation !== "string" || animateValue.indexOf(_t.animation) === -1){
    _t.wrongInfo = 
      "animation must be in ['linear', 'easeIn', 'easeOut', 'backIn', 'elastic', 'bounce']";
    return false;
  }

  if (typeof _t.animateTime !== "number" || _t.animateTime<0){
    _t.wrongInfo = "Invalid animateTime";
    return false;
  }


  if (_t.hrefBase !== null && typeof _t.hrefBase !== "string"){
    _t.wrongInfo = "Invalid hrefBase";
    return false;
  }

  _t.widthLonger = _t.width-60 > _t.height-20 ? true : false;
  _t.longSide = _t.widthLonger ? _t.width-60 : _t.height-20;
  _t.bigR = _t.longSide/2;

  return true;
}