CenterRelation-JS
=================

A simple demo for CenterRelation plug-in. Based on raphael.js and query.js


>  **function centerRelation(centerTEXT, DIVid, list, pWidth, pHeight, smallR, ANIMATE, ANIMATETIME, hrefBase)**
>    - centerTEXT (string) the text of the center
>    - DIVid (string) the id of a div dom to put the graph in
>    - list (array of object) the type of that in list is object with attribute -name(string) and -num(number) the larger the list[i].num is, the more center the list[i].name is 
>    - pWidth (number) the width of graph
>    - pHeight (number) the height of graph
>    - smallR (number) the smallest radius of circle
>    - ANIMATE (string) the type of animate it has "linear", "easeIn", "easeOut", "easeInOut", "backIn", "elastic", "bounce"
>    - ANIMATETIME (number) the time of the start ANIMATE cost. the unit is “ms”
>    - hrefBase (string) hrefBase + list[i].name is the real url of a rect

![image](https://github.com/huangm-fat/CenterRelation-JS/blob/master/img/centerRelation-0.png?raw=true)
