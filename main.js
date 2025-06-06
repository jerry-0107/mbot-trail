
//init
var canvas = new fabric.Canvas("main")
canvas.setHeight(350);
canvas.setWidth(900);

canvas.setBackgroundImage("/img/底圖.png", function () {
  canvas.renderAll();
});

//加入新板子: 取得radio value => render
function findSelection(name) {
  try {
    return document.querySelector(`[name="${name}"]:checked`).value
  } catch (e) {
    return null
  }
}

var left = 5
$("#joinBtn").on("click", function () {
  console.log(findSelection("flexRadioDefault"))
  var imgPath = document.querySelector("#" + findSelection("flexRadioDefault"))
  var img =
    new fabric.Image(imgPath, {
      name: ``,
      top: 265,
      left: 30,
      padding: 10,
      borderDashArray: [5, 5],
      cornerStyle: 'circle'

    })
  canvas.add(img)
  canvas.renderAll()
})




//自訂控件(旋轉、刪除、複製) 
//以下這段code超脆弱，絕!對!不!要!動!
fabric.Canvas.prototype.customiseControls({
  tl: {
    action: {
      'rotateByDegrees': -90
    },
    cursor: "pointer"

  },
  tr: {
    action: 'rotate',
    action: {
      'rotateByDegrees': 90
    },

    cursor: "pointer"

  },
  bl: {
    action: 'remove',

    cursor: "pointer"

  },
  br: {
    cursor: "pointer",
    action: function (e, target) {

      canvas.getActiveObject().clone(function (cloned) {
        _clipboard = cloned;
      });


      _clipboard.clone(function (clonedObj) {
        canvas.discardActiveObject();

        clonedObj.set({
          left: clonedObj.left + 10,
          top: clonedObj.top + 10,

          evented: true,
        });
        if (clonedObj.type === 'activeSelection') {
          // active selection needs a reference to the canvas.
          clonedObj.canvas = canvas;
          clonedObj.forEachObject(function (obj) {
            canvas.add(obj);
          });
          // this should solve the unselectability
          clonedObj.setCoords();
        } else {
          canvas.add(clonedObj);
        }
        _clipboard.top += 10;
        _clipboard.left += 10;
        canvas.setActiveObject(clonedObj);
        // canvas.requestRenderAll();
      })
    },

  },
  mb: {
    action: 'moveDown',

  },
  mt: {
    action: {
      'rotateByDegrees': 90
    }
  },
  mr: {
    action: function (e, target) {
      target.set({
        left: 200
      });
      canvas.renderAll();
    }
  },
  // only is hasRotatingPoint is not set to false
  mtr: {
    action: 'rotate',

  },
}, function () {
  canvas.renderAll();
});
fabric.Object.prototype.customiseCornerIcons({
  settings: {
    borderColor: '#0094dd',
    cornerSize: 15,
    cornerShape: 'rect',
    cornerBackgroundColor: '#ffffffac',
  },
  br: {
    icon: "/img/clipboard.svg",

  },
  tl: {
    icon: "/img/arrow-counterclockwise.svg"
  },
  tr: {
    icon: "/img/arrow-clockwise.svg"
  },
  ml: {

  },
  mr: {

  },
  bl: {
    icon: "/img/trash3.svg"

  },
  // only is hasRotatingPoint is not set to false
  mtr: {

  },
}, function () {
  canvas.renderAll();
});
fabric.Object.prototype.setControlsVisibility({
  bl: true, // 左下
  br: true, // 右下
  mb: false, // 下中
  ml: false, // 中左
  mr: false, // 中右
  mt: false, // 上中
  tl: true, // 上左
  tr: true, // 上右
  mtr: false // 旋轉控制鍵
})

//當畫布更新觸發的事件 (也許之後用的上)
canvas.on("object:modified", function (e) { console.log(e) })

//加入題組
function addImg(imgs, points) {

  //設定加分點:9G.18E.27F (對，你沒看錯，加分點是寫死的)
  var imgPath = document.querySelector("#img-" + "A")
  canvas.add(new fabric.Image(imgPath, {
    name: ``,
    top: 122,
    left: 220,
    padding: 10,
    borderDashArray: [5, 5],
    cornerStyle: 'circle'
  }))
  canvas.add(new fabric.Image(imgPath, {
    name: ``,
    top: 79,
    left: 426,
    padding: 10,
    borderDashArray: [5, 5],
    cornerStyle: 'circle'
  }))
  canvas.add(new fabric.Image(imgPath, {
    name: ``,
    top: 101,
    left: 633,
    padding: 10,
    borderDashArray: [5, 5],
    cornerStyle: 'circle'
  }))

  //設定板子
  var left = 0
  var imgPath = document.querySelector("#img-0")
  var img =
    new fabric.Image(imgPath, {
      name: ``,
      top: 101,
      left: 37,
      padding: 10,
      borderDashArray: [5, 5],
      cornerStyle: 'circle',
      angle: 90

    })
  canvas.add(img)

  for (i = 0; i < imgs.length; i++) {
    left += 30
    for (j = 0; j < 7; j++) {
      var imgPath = document.querySelector("#img-" + imgs[i])
      var img =
        new fabric.Image(imgPath, {
          name: ``,
          top: 265,
          left: 30 + left,
          padding: 10,
          borderDashArray: [5, 5],
          cornerStyle: 'circle'

        })
      canvas.add(img)
      canvas.renderAll()
    }
  }
  left += 30
  for (j = 0; j < 7; j++) {
    var imgPath = document.querySelector("#img-" + "S")
    var img =
      new fabric.Image(imgPath, {
        name: ``,
        top: 265,
        left: 30 + left,
        padding: 10,
        borderDashArray: [5, 5],
        cornerStyle: 'circle'

      })
    canvas.add(img)
    canvas.renderAll()
  }

  canvas.renderAll()
}

//防止悲劇發生 (onbeforeunload) => 要離開網站嗎?系統不會儲存你所做的變更
window.addEventListener("beforeunload", (e) => {
  e.preventDefault();
  e.returnValue = true;
});
