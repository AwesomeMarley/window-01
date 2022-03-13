javascript: (function() {
  
  
    /*frame = border,	innerframe = background,	title = title and blue bar at top,	innerpage = iframe which website displayed*/
    
    
    var style = document.createElement('style');
    style.innerHTML = `
    
    body {
    overflow: hidden;
    }
    
    
    #frame {
    position: fixed;
    width: 45%;
    height: 45%;
    
    
    margin: 0;
    border-radius: 10px;
    z-index: 1011;
    border: 2px solid #0f99bb;
    background: rgb(255, 0.5);
    }
    
    #innerpage {
    position: relative;
  	bottom: -33px;
		left: 3px;
    
    width: 43%;
    height: 43%;

    
    
    
    border-radius: 10px;
    z-index: 1009;
    
    
    }
    
    #title {
    font-family: monospace;
    background: #0077a7;
    color: white;
    font-size: 24px;
    height: 30px;
    text-align: center;
    border-top-right-radius: 7px;
    border-top-left-radius: 7px;
    z-index: 1010;
    
    }
    
    #innerframe {
    background: #999;
    
    width: 45%;
    height: 45%;

    
    position: fixed;
    margin: 0;
    padding: 0;
    z-index: 1009;
    
    -webkit-transition: all 0.25s ease-in-out;
    -moz-transition: all 0.25s ease-in-out;
    -ms-transition: all 0.25s ease-in-out;
    -o-transition: all 0.25s ease-in-out;
    transition: all 0.25s ease-in-out;
    }
    `;
    document.head.appendChild(style);
    
    
    const frame_element = document.createElement('div');
    frame_element.id = 'frame';
    document.body.append(frame_element);
    
    const title_element = document.createElement('div');
    title_element.id = 'title';
    title_element.textContent = 'Mini Page';
    frame_element.append(title_element);
    
    const innerframe_element = document.createElement('div');
    innerframe_element.id = 'innerframe';
    document.body.append(innerframe_element);
      
    const innerpage_element = document.createElement('iframe');
    innerpage_element.id = 'innerpage';
    innerpage_element.src="https://classic.minecraft.net";
    document.body.append(innerpage_element);
    
    
    
    
    var minWidth = 80;
    var minHeight = 60;
    
    
    var FULLSCREEN_MARGINS = -10;
    var MARGINS = 4;
    
    
    var clicked = null;
    var onRightEdge, onBottomEdge, onLeftEdge, onTopEdge;
    
    var rightScreenEdge, bottomScreenEdge;
    
    var preSnapped;
    
    var b, x, y;
    
    var redraw = false;
    
    var frame = document.getElementById('frame');
    var innerframe = document.getElementById('innerframe');
    var page = document.getElementById('innerpage');
    
    function setBounds(element, x, y, w, h) {
      element.style.left = x + 'px';
      element.style.top = y + 'px';
      element.style.width = w + 'px';
      element.style.height = h + 'px';
    }
    
    function hintHide() {
    setBounds(innerframe, b.left, b.top, b.width, b.height);
    innerframe.style.opacity = 0;

    
    }
    
    
    frame.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    
    
    frame.addEventListener('touchstart', onTouchDown);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
    
    
    function onTouchDown(e) {
    onDown(e.touches[0]);
    e.preventDefault();
    }
    
    function onTouchMove(e) {
    onMove(e.touches[0]);		
    }
    
    function onTouchEnd(e) {
    if (e.touches.length ==0) onUp(e.changedTouches[0]);
    }
    
    function onMouseDown(e) {
    onDown(e);
    e.preventDefault();
    }
    
    function onDown(e) {
    calc(e);
    
    var isResizing = onRightEdge || onBottomEdge || onTopEdge || onLeftEdge;
    
    clicked = {
      x: x,
      y: y,
      cx: e.clientX,
      cy: e.clientY,
      w: b.width,
      h: b.height,
      isResizing: isResizing,
      isMoving: !isResizing && canMove(),
      onTopEdge: onTopEdge,
      onLeftEdge: onLeftEdge,
      onRightEdge: onRightEdge,
      onBottomEdge: onBottomEdge
    };
    }
    
    function canMove() {
    return x > 0 && x < b.width && y > 0 && y < b.height
    && y < 30;
    }
    
    function calc(e) {
    b = frame.getBoundingClientRect();
    x = e.clientX - b.left;
    y = e.clientY - b.top;
    
    onTopEdge = y < MARGINS;
    onLeftEdge = x < MARGINS;
    onRightEdge = x >= b.width - MARGINS;
    onBottomEdge = y >= b.height - MARGINS;
    
    rightScreenEdge = window.innerWidth - MARGINS;
    bottomScreenEdge = window.innerHeight - MARGINS;
    }
    
    var e;
    
    function onMove(ee) {
    calc(ee);
    
    e = ee;
    
    redraw = true;
    
    }
    
    function animate() {
    
    requestAnimationFrame(animate);
    
    if (!redraw) return;
    
    redraw = false;
    
    if (clicked && clicked.isResizing) {
    
      if (clicked.onRightEdge) frame.style.width = Math.max(x, minWidth) + 'px';
      if (clicked.onBottomEdge) frame.style.height = Math.max(y, minHeight) + 'px';
      if (clicked.onRightEdge) page.style.width = Math.max(x, minWidth) + 'px';
      if (clicked.onBottomEdge) page.style.height = Math.max(y, minHeight) + 'px';
    
      if (clicked.onLeftEdge) {
        var currentWidth = Math.max(clicked.cx - e.clientX  + clicked.w, minWidth);
        if (currentWidth > minWidth) {
          frame.style.width = currentWidth + 'px';
          frame.style.left = e.clientX + 'px'; 
          page.style.width = currentWidth + 'px';
          page.style.left = e.clientX + 'px';	
        }
      }
    
      if (clicked.onTopEdge) {
        var currentHeight = Math.max(clicked.cy - e.clientY  + clicked.h, minHeight);
        if (currentHeight > minHeight) {
          frame.style.height = currentHeight + 'px';
          frame.style.top = e.clientY + 'px';	
          page.style.height = currentHeight + 'px';
          page.style.top = e.clientY + 'px';	
        }
      }
    
      hintHide();
    
      return;
    }
    
    if (clicked && clicked.isMoving) {
    
      if (b.top < FULLSCREEN_MARGINS || b.left < FULLSCREEN_MARGINS || b.right > window.innerWidth - FULLSCREEN_MARGINS || b.bottom > window.innerHeight - FULLSCREEN_MARGINS) {
    
        setBounds(innerframe, 0, 0, window.innerWidth, window.innerHeight);
        innerframe.style.opacity = 0.2;
      } else if (b.top < MARGINS) {
    
        setBounds(innerframe, 0, 0, window.innerWidth, window.innerHeight / 2);
        innerframe.style.opacity = 0.2;
      } else if (b.left < MARGINS) {
    
        setBounds(innerframe, 0, 0, window.innerWidth / 2, window.innerHeight);
        innerframe.style.opacity = 0.2;
      } else if (b.right > rightScreenEdge) {
    
        setBounds(innerframe, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
        innerframe.style.opacity = 0.2;
      } else if (b.bottom > bottomScreenEdge) {
    
        setBounds(innerframe, 0, window.innerHeight / 2, window.innerWidth, window.innerWidth / 2);
        innerframe.style.opacity = 0.2;
      } else {
        hintHide();
      }
    
      if (preSnapped) {
        setBounds(frame,
            e.clientX - preSnapped.width / 2,
            e.clientY - Math.min(clicked.y, preSnapped.height),
            preSnapped.width,
            preSnapped.height
        );
        setBounds(page,
            e.clientX - preSnapped.width / 2,
            e.clientY - Math.min(clicked.y, preSnapped.height),
            preSnapped.width,
            preSnapped.height
        );
        return;
      }
    
    
      frame.style.top = (e.clientY - clicked.y) + 'px';
      frame.style.left = (e.clientX - clicked.x) + 'px';
      page.style.top = (e.clientY - clicked.y) + 'px';
      page.style.left = (e.clientX - clicked.x) + 'px';
    
      return;
    }
    
    
    if (onRightEdge && onBottomEdge || onLeftEdge && onTopEdge) {
      frame.style.cursor = 'nwse-resize';
      page.style.cursor = 'nwse-resize';
    } else if (onRightEdge && onTopEdge || onBottomEdge && onLeftEdge) {
      frame.style.cursor = 'nesw-resize';
      page.style.cursor = 'nesw-resize';
    } else if (onRightEdge || onLeftEdge) {
      frame.style.cursor = 'ew-resize';
      page.style.cursor = 'ew-resize';
    } else if (onBottomEdge || onTopEdge) {
      frame.style.cursor = 'ns-resize';
      page.style.cursor = 'ns-resize';
    } else if (canMove()) {
      frame.style.cursor = 'move';
      page.style.cursor = 'move';
    } else {
      frame.style.cursor = 'default';
      page.style.cursor = 'default';
    }
    }
    
    animate();
    
    function onUp(e) {
    calc(e);
    
    if (clicked && clicked.isMoving) {
    
      var snapped = {
        width: b.width,
        height: b.height
      };
    
      if (b.top < FULLSCREEN_MARGINS || b.left < FULLSCREEN_MARGINS || b.right > window.innerWidth - FULLSCREEN_MARGINS || b.bottom > window.innerHeight - FULLSCREEN_MARGINS) {
    
        setBounds(frame, 0, 0, window.innerWidth, window.innerHeight);
        setBounds(page, 0, 0, window.innerWidth, window.innerHeight);
        preSnapped = snapped;
      } else if (b.top < MARGINS) {
    
        setBounds(frame, 0, 0, window.innerWidth, window.innerHeight / 2);
        setBounds(page, 0, 0, window.innerWidth, window.innerHeight / 2);
        preSnapped = snapped;
      } else if (b.left < MARGINS) {
    
        setBounds(frame, 0, 0, window.innerWidth / 2, window.innerHeight);
        setBounds(page, 0, 0, window.innerWidth / 2, window.innerHeight);
        preSnapped = snapped;
      } else if (b.right > rightScreenEdge) {
    
        setBounds(frame, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
        setBounds(page, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
        preSnapped = snapped;
      } else if (b.bottom > bottomScreenEdge) {
    
        setBounds(frame, 0, window.innerHeight / 2, window.innerWidth, window.innerWidth / 2);
        setBounds(page, 0, window.innerHeight / 2, window.innerWidth, window.innerWidth / 2);
        preSnapped = snapped;
      } else {
        preSnapped = null;
      }
    
      hintHide();
    
    }
    
    clicked = null;
    
    }
    
    })()