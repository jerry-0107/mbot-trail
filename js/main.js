
//init----------
var canvas = new fabric.Canvas("main", {
  selection: true,// localStorage.getItem("mbotTrailer-allowselection") === 'true',
  backgroundColor: "#ffffff"
})
canvas.setHeight(350);
canvas.setWidth(900);

canvas.setBackgroundImage("/img/底圖.png", function () {
  canvas.renderAll();
});
const toastElList = document.querySelectorAll('.toast')
const toastList = [...toastElList].map(toastEl => new bootstrap.Toast(toastEl))

const attrText = new fabric.Text('軌道擺設模擬 By Jerry. 2023 ~ 2025.06', {
  left: 700,
  top: 338,
  fontSize: 11,
  fill: 'black',
  evented: false,
  fontFamily: 'Arial',
  selectable: false,
  backgroundColor: "#ccc",
  padding: 5,
  margin: 10,
  id: "attrText"
});

canvas.add(attrText);

$('#allowselection').attr('checked', localStorage.getItem('mbotTrailer-allowselection') === 'true')
$('#advsetting1').attr('checked', localStorage.getItem('mbotTrailer-advsetting1') === 'true')
//-----------

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
      name: findSelection("flexRadioDefault"),
      top: 265,
      left: 30,
      padding: 5,
      borderDashArray: [5, 5],
      cornerStyle: 'circle',

    })
  canvas.add(img)
  canvas.renderAll()
})

function exportCanvas() {
  // Convert canvas to data URL
  const text = new fabric.Text('軌道擺設模擬 By Jerry. 2023 ~ 2025.06 [請勿遮擋此標籤]', {
    left: 620,
    top: 338,
    fontSize: 11,
    fill: 'black',
    evented: false,
    fontFamily: 'Arial',
    selectable: false,
    backgroundColor: "#ff0000",
    padding: 5,
    margin: 10
  });
  if (isAttrTextBoxBeenBlocked()) {
    canvas.discardActiveObject()
    canvas.add(text);
  }

  const dataURL = canvas.toDataURL({
    format: 'png',
    quality: 1.0,
  });

  var
    dat = new Date(),
    date = String(dat.getMonth() + 1 > 9 ? dat.getMonth() + 1 : "0" + (dat.getMonth() + 1)) + String(dat.getDate() > 9 ? dat.getDate() : '0' + dat.getDate()),
    h = String(dat.getHours() > 9 ? dat.getHours() : "0" + dat.getHours()),
    m = String(dat.getMinutes() > 9 ? dat.getMinutes() : "0" + dat.getMinutes())



  const link = document.createElement('a');
  link.href = dataURL;
  link.download = `軌道擺設模擬-${date}-${h}${m}.png`;
  link.click();

  if (isAttrTextBoxBeenBlocked()) canvas.remove(text)

}


const saveButton = document.getElementById("saveImgBtn")
saveButton.addEventListener('click', () => {
  exportCanvas()
});



//自訂控件(旋轉、刪除、複製) 
//以下這段code超脆弱，絕!對!不!要!動!
fabric.Canvas.prototype.customiseControls({
  tl: {
    // action: {
    //   'rotateByDegrees': -90
    // },
    action: function () {
      var activeGroup = canvas.getActiveGroup();
      if (activeGroup) {
        var activeObjects = activeGroup.getObjects();
        for (let i in activeObjects) {
          const t = activeObjects[i].angle
          activeObjects[i].set('angle', t - 90)
        }
        canvas.discardActiveGroup();
        canvas.renderAll();
      } else {
        const t = canvas.getActiveObject().angle
        canvas.getActiveObject().set('angle', t - 90)
      }
      setTimeout(function () { // for some reason...
        // canvas.deactivateAll();
        canvas.renderAll();
      }, 10);
    },
    cursor: "pointer"

  },
  tr: {
    //action: 'rotate',
    // action: {
    //   'rotateByDegrees': 90
    // },
    action: function () {
      var activeGroup = canvas.getActiveGroup();
      if (activeGroup) {
        var activeObjects = activeGroup.getObjects();
        for (let i in activeObjects) {
          const t = activeObjects[i].angle
          activeObjects[i].set('angle', t + 90)
        }
        canvas.discardActiveGroup();
        canvas.renderAll();
      } else {
        const t = canvas.getActiveObject().angle
        canvas.getActiveObject().set('angle', t + 90)
      }
      setTimeout(function () { // for some reason...
        // canvas.deactivateAll();
        canvas.renderAll();
      }, 10);
    },

    cursor: "pointer"

  },
  bl: {
    //   action: 'remove',

    cursor: "pointer",
    action: function () {
      var activeGroup = canvas.getActiveGroup();
      if (activeGroup) {
        console.log(activeGroup)
        $('#delBoardCount').text(activeGroup._objects.length)
        const alertModal = new bootstrap.Modal(document.getElementById('alertModal2'));

        alertModal.show()
      } else {
        canvas.getActiveObject().remove();

        setTimeout(function () { // for some reason...
          canvas.deactivateAll();
          canvas.renderAll();
        }, 10);
      }
    }

  },
  br: {
    cursor: "pointer",
    action: function (e, target) {
      if (!canvas.getActiveObject()) {
        new bootstrap.Toast(document.getElementById('alertToast')).show()
        return
      }
      canvas.getActiveObject().clone(function (cloned) {
        _clipboard = cloned;


        _clipboard.clone(function (clonedObj) {
          canvas.discardActiveObject();

          clonedObj.set({
            left: clonedObj.left + 10,
            top: clonedObj.top + 10,
            name: ``,

            padding: 5,
            borderDashArray: [5, 5],
            cornerStyle: 'circle',

            evented: true,
          });
          if (clonedObj.type === 'activeSelection') {
            // active selection needs a reference to the canvas.
            clonedObj.canvas = canvas;
            clonedObj.forEachObject(function (obj) {
              canvas.add(obj);
            });
            // this should solve the unselectability
            //  clonedObj.setCoords();
          } else {
            canvas.add(clonedObj);
          }
          _clipboard.top += 10;
          _clipboard.left += 10;
          canvas.setActiveObject(clonedObj);
          canvas.renderAll()
          //   canvas.requestRenderAll();
        })
      });



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



//選擇多於一張板子會觸發bug
// canvas.on('object:selected', function (e) {
//   console.log(e)
//   if (e.target._objects) {

//     //   alert("不可以同時選擇多於一張板子");
//     canvas.deactivateAll()
//   }
// });
function deleteAllSelectedObj(confirmed) {
  if (confirmed) {
    var activeGroup = canvas.getActiveGroup();
    if (activeGroup) {
      var activeObjects = activeGroup.getObjects();
      for (let i in activeObjects) {
        canvas.remove(activeObjects[i]);
      }
      canvas.discardActiveGroup();
      canvas.renderAll();
    } else canvas.getActiveObject().remove();

    setTimeout(function () { // for some reason...
      canvas.deactivateAll();
      canvas.renderAll();
    }, 10);
  }
}

function setAllowSelection(e) {
  if (e) {
    localStorage.setItem("mbotTrailer-allowselection", 'true')
    //  localStorage.setItem("mbotTrailer-allowselection", "true")
    const alertModal = new bootstrap.Modal(document.getElementById('alertModal'));
    if (localStorage.getItem("mbotTrailer-showalert1") !== "false") {
      alertModal.toggle()
    }
    canvas.selection = true
    canvas.renderAll()

  } else {
    canvas.selection = false
    canvas.renderAll()
    localStorage.setItem("mbotTrailer-allowselection", 'false')
  }
}

canvas.on("object:modified", () => {
  //防止悲劇發生 (onbeforeunload) => 要離開網站嗎?系統不會儲存你所做的變更
  window.addEventListener("beforeunload", (e) => {
    e.preventDefault();
    e.returnValue = true;
  });
})

//加入題組
function addImg(imgs, points) {

  //設定加分點:9G.18E.27F (對，你沒看錯，加分點是寫死的)
  var imgPath = document.querySelector("#img-" + "A")
  canvas.add(new fabric.Image(imgPath, {
    name: ``,
    top: 118,
    left: 218,
    padding: 5,
    borderDashArray: [5, 5],
    cornerStyle: 'circle'
  }))
  canvas.add(new fabric.Image(imgPath, {
    name: ``,
    top: 73,
    left: 424,
    padding: 5,
    borderDashArray: [5, 5],
    cornerStyle: 'circle'
  }))
  canvas.add(new fabric.Image(imgPath, {
    name: ``,
    top: 96,
    left: 630,
    padding: 5,
    borderDashArray: [5, 5],
    cornerStyle: 'circle'
  }))

  //設定板子
  var left = 0
  var imgPath = document.querySelector("#img-0")
  var img =
    new fabric.Image(imgPath, {
      name: ``,
      top: 97,
      left: -10,
      padding: 5,
      borderDashArray: [5, 5],
      cornerStyle: 'circle',
      //    angle: 90

    })
  canvas.add(img)

  for (i = 0; i < imgs.length; i++) {
    left += 30
    for (j = 0; j < 7; j++) {
      var imgPath = document.querySelector("#img-" + imgs[i])
      var img =
        new fabric.Image(imgPath, {
          name: "#img-" + imgs[i],
          top: 265,
          left: 30 + left,
          padding: 5,
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
        name: `img-S`,
        top: 265,
        left: 30 + left,
        padding: 5,
        borderDashArray: [5, 5],
        cornerStyle: 'circle'

      })
    canvas.add(img)
    canvas.renderAll()
  }

  canvas.renderAll()
}


function isAttrTextBoxBeenBlocked() {

  const target = canvas.getObjects().find(obj => obj.id === 'attrText');
  const targetBounds = target.getBoundingRect();

  const allObjects = canvas.getObjects();
  const targetIndex = allObjects.indexOf(target);
  console.log(allObjects, targetIndex)
  let isObscured = false;

  for (let i = targetIndex + 1; i < allObjects.length; i++) {
    const obj = allObjects[i];

    if (!obj.visible) continue; // 跳過隱藏物件

    const objBounds = obj.getBoundingRect();

    const intersects =
      targetBounds.left < objBounds.left + objBounds.width &&
      targetBounds.left + targetBounds.width > objBounds.left &&
      targetBounds.top < objBounds.top + objBounds.height &&
      targetBounds.top + targetBounds.height > objBounds.top;

    if (intersects) {
      isObscured = true;
      break;
    }
  }

  console.log(`Object ${target.id} is ${isObscured ? "obscured" : "not obscured"}`);
  return isObscured
}


canvas.on('object:moving', (e) => {
  if (localStorage.getItem("mbotTrailer-advsetting1") === 'true') {
    try {
      var activeGroup = canvas.getActiveGroup();
      if (activeGroup) return

      const target = e.target,
        x = 23, y = 22.50
      // 設定移動間隔為格線間隔

      console.log(target.name, target.angle)
      if (target.angle == -90 || target.angle == 270 && Number(target.name.replace('img-', '')) > 5) {
        if (target.left > 620) {
          target.left = Math.round(target.left / x) * x + 9
        } else {
          target.left = Math.round(target.left / x) * x + 12

        }
      }

      else if (target.left > 620) {
        target.left = Math.round(target.left / x) * x + 7
      } else {
        target.left = Math.round(target.left / x) * x + 10.5
      }
      target.top = Math.round(target.top / y) * y + 6.5
    } catch { }
  }
})

// var isXPressed = false
// document.addEventListener('keydown', function (event) {
//   console.log('Key down:', event.key);
//   if (event.key === 'x') isXPressed = true
//   else isXPressed = false
// });
// document.addEventListener('keyup', function (event) {
//   isXPressed = false
// });