/*
  centerRelation 1.0 - used to draw a relation graph with only one center
  based on jQuery, Raphael, html5

   Author: Huang Min
       from Sun Yat-sen University, Schools of Software Software engineering
*/
var CRpWidth;
var CRpHeight;
var CRhrefBase;
var CRpaper;
var CRanimate;
var CRanimatetime;
var CRcenterX;
var CRcenterY;

/*\
  > Arguments

    - centerTEXT (string) the text of the center
    - DIVid (string) the id of a div dom to put the svg in
    - list (array of object) the type of that in list is object with attribute -name(string) and -num(number)
      the larger the list[i].num is, the more center the list[i].name is
    - pWidth (number) the width of svg
    - pHeight (number) the height of svg
    - smallR (number) the smallest distance of svg
    - ANIMATE (string) the type of animate
      it has "linear", "easeIn", "easeOut", "easeInOut", "backIn", "elastic", "bounce"
    - ANIMATETIME (number) the time of the start ANIMATE cost. the unit is “ms”
    - hrefBase (string) hrefBase + list[i].name is the real url of a rect
\*/
function centerRelation(centerTEXT, DIVid, list, pWidth, pHeight, smallR, ANIMATE, ANIMATETIME, hrefBase) {
  CRpWidth = pWidth;
  CRpHeight = pHeight;
  CRhrefBase = hrefBase;
  CRanimate = ANIMATE;
  CRanimatetime = ANIMATETIME;
  CRcenterX = pWidth / 2;
  CRcenterY = pHeight / 2;
  var objList = []
  var pBigger;
  var overlapY = 5;
  var overlapX = 8;
  if (pWidth < 100 && pHeight < 100)
    return "the width and height is too small";
  if (pWidth > pHeight) {
    pBigger = pWidth;
  } else pBigger = pHeight;
  var bigR = Math.sqrt(Math.abs((CRcenterX - 10) * (CRcenterX - 10) - (CRcenterY - 10) * (CRcenterY - 10)))
  CRpaper = Raphael(DIVid, pWidth, pHeight);
  var resultBig = -10000000;
  var resultSmall = 1000000;
  var center = insertRect(0, 0, centerTEXT);
  // add some effect to center
  center.rect.glow({
    'color': $(center.rect.node).css('fill'),
    'opacity': 0.8,
  })
  center.text.attr('font-weight', 'bolder');
  for (var i in list) {
    if (list[i].num < resultSmall) resultSmall = list[i].num;
    if (list[i].num >
      resultBig) resultBig = list[i].num;
    list[i].x = 0;
    list[i].y = 0;
    list[i].xd = 0;
    list[i].yd = 0;
  }

  var rangePaper = bigR - smallR;
  var rangeResult = resultBig - resultSmall;
  var unit = rangePaper / rangeResult;
  var down = 0;
  var up = 0;
  var ram = 0;
  var overlap;
  for (var i in list) {
    list[i].num = (resultBig - list[i].num) * unit + smallR;
    do {
      if (list[i].num <= (CRcenterY - 10)) {
        list[i].xd = Math.random() * (list[i].num - (-list[i].num)) - list[i].num;
      } else {
        var ram = Math.random();
        if (ram < 0.5) {
          ram = -1;
        } else {
          ram = 1;
        }
        down = Math.sqrt(list[i].num * list[i].num - (CRcenterY - 10) * (CRcenterY - 10))
        up = list[i].num;
        list[i].xd = (Math.random() * (up - down) + down) * ram;
      }

      ram = Math.random();
      if (ram < 0.5) {
        ram = -1;
      } else {
        ram = 1;
      }
      list[i].yd = Math.sqrt(list[i].num * list[i].num - list[i].xd * list[i].xd) * ram;
      overlap = false;

      // for(var j in objList){
      //   console.log(objList[j].rect.isPointInside(list[i].xd+CRcenterX,list[i].yd+CRcenterY),j,i)
      //   if(objList[j].rect.isPointInside(Math.abs(list[i].xd+CRcenterX),Math.abs(list[i].yd+CRcenterY))
      //     || objList[j].rect.isPointInside(list[i].xd+CRcenterX+overlapX,list[i].yd+CRcenterY+overlapY)
      //     || objList[j].rect.isPointInside(list[i].xd+CRcenterX-overlapX,list[i].yd+CRcenterY-overlapY)
      //     || objList[j].rect.isPointInside(list[i].xd+CRcenterX-overlapX,list[i].yd+CRcenterY+overlapY)
      //     || objList[j].rect.isPointInside(list[i].xd+CRcenterX+overlapX,list[i].yd+CRcenterY-overlapY)){
      //     overlap = true;

      //     break;
      //   }
      // }
    } while (overlap);
    objList[i] = insertRectPath(list[i].xd, list[i].yd, list[i].name)
  }
}

function randomColor() {
  return "CR-" + String.fromCharCode(Math.floor(parseInt(Math.random() * (105 - 97 + 1) + 97)));
}

function insertRect(xd, yd, textContent) {
  var obj = new Object();
  // creat rect and text
  obj.rect = CRpaper.rect(CRcenterX, CRcenterY, 100, 50, 15);

  obj.rect.node.setAttribute("class", randomColor());
  obj.text = CRpaper.text(CRcenterX, CRcenterY, textContent);
  obj.text.attr({
    'font-size': 15,
    'font-family': '"Lato", Helvetica, Arial, sans-serif',
    'href': CRhrefBase + textContent
  });
  obj.rect.attr({
    'width': obj.text.getBBox().width + 20,
    'height': obj.text.getBBox().height + 10,
    'x': (obj.rect.attr('x') - (obj.text.getBBox().width / 2)) - 10,
    'y': (obj.rect.attr('y') - (obj.text.getBBox().height / 2)) - 5,
  });
  // add animations to rect and text
  obj.rect.animate(Raphael.animation({
    'x': obj.rect.attr('x') + xd,
    'y': obj.rect.attr('y') + yd
  }, CRanimatetime, CRanimate));
  obj.text.animate(Raphael.animation({
    'x': obj.text.attr('x') + xd,
    'y': obj.text.attr('y') + yd
  }, CRanimatetime, CRanimate));
  // bind the text mouseover ,mouseout and click event
  obj.text.mouseover(function() {
    obj.rect.toFront();
    obj.rect.node.className.baseVal += " active";
    obj.rect.attr({
      'width': obj.rect.attr('width') * 1.2,
      'height': obj.rect.attr('height') * 1.2,
      'r': obj.rect.attr('r') * 1.2,
      'x': (obj.rect.attr('x') - obj.rect.attr('width') * 0.1),
      'y': (obj.rect.attr('y') - obj.rect.attr('height') * 0.1),
    });
    obj.text.attr({
      'font-size': obj.text.attr('font-size') * 1.2
    });
    obj.text.toFront();
  });

  obj.text.mouseout(function() {
    obj.rect.attr({
      'width': obj.rect.attr('width') / 1.2,
      'height': obj.rect.attr('height') / 1.2,
      'r': obj.rect.attr('r') / 1.2,
      'x': (obj.rect.attr('x') + obj.rect.attr('width') / 1.2 * 0.1),
      'y': (obj.rect.attr('y') + obj.rect.attr('height') / 1.2 * 0.1)
    });
    obj.text.attr({
      'font-size': obj.text.attr('font-size') / 1.2
    });
    obj.rect.node.className.baseVal = obj.rect.node.className.baseVal.substring(0, 4);
  });

  obj.text.click(function() {
    window.open(obj.text.attr('href'));
  });

  // bind the rect mouseover, mouseout and click event
  obj.rect.mouseover(function() {
    obj.rect.toFront();
    obj.rect.node.className.baseVal += " active";
    obj.rect.attr({
      'width': obj.rect.attr('width') * 1.2,
      'height': obj.rect.attr('height') * 1.2,
      'r': obj.rect.attr('r') * 1.2,
      'x': (obj.rect.attr('x') - obj.rect.attr('width') * 0.1),
      'y': (obj.rect.attr('y') - obj.rect.attr('height') * 0.1),
    });
    obj.text.attr({
      'font-size': obj.text.attr('font-size') * 1.2
    });
    obj.text.toFront();
  });

  obj.rect.mouseout(function() {
    obj.rect.attr({
      'width': obj.rect.attr('width') / 1.2,
      'height': obj.rect.attr('height') / 1.2,
      'r': obj.rect.attr('r') / 1.2,
      'x': (obj.rect.attr('x') + obj.rect.attr('width') / 1.2 * 0.1),
      'y': (obj.rect.attr('y') + obj.rect.attr('height') / 1.2 * 0.1)
    });
    obj.text.attr({
      'font-size': obj.text.attr('font-size') / 1.2
    });
    obj.rect.node.className.baseVal = obj.rect.node.className.baseVal.substring(0, 4);
  });

  obj.rect.click(function() {
    window.open(obj.text.attr('href'));
  });
  return obj;
}

function insertRectPath(xd, yd, textContent) {
  var obj = new Object();
  obj = insertRect(xd, yd, textContent);
  obj.path = CRpaper.path("M" + CRcenterX + "," + CRcenterY + "L" + CRcenterX + "," + CRcenterY)
  obj.path.attr('stroke', '#888');
  obj.path.toBack();
  x = CRcenterX + xd;
  y = CRcenterY + yd;
  obj.path.animate(Raphael.animation({
    'path': "M" + CRcenterX + "," + CRcenterY + "L" + x + "," + y
  }, CRanimatetime, CRanimate))
  return obj;
}
