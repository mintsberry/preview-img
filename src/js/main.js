window.onload = () => {
  let imgs = document.querySelectorAll('img')
  let img;
  let preview;
  let scale = 1
  let rate = 0.1
  let defaultMatrix = {
    M11: 1,
    M12: 0,
    M21: 0,
    M22: 1,
    M31: 0,
    M32: 0
  }
  let pos = {}
  let matrix = Object.assign({}, defaultMatrix)
  createPreview()
  addEvent()
  imgs.forEach(el => {
    el.onclick = function () {
      scale = 1
      pos = {
        x: 0,
        y: 0
      }
      matrix = Object.assign({}, defaultMatrix)
      img.style.transform = `matrix(${matrix.M11},${matrix.M12},${matrix.M21},${matrix.M22},${matrix.M31},${matrix.M32})`
      preview.style.display = 'flex'
      preview.querySelector('img').src = this.src
    }
  })

  function createPreview() {
    preview = document.createElement('div')
    preview.classList.add('preview')
    img = new Image()
    preview.appendChild(img)
    document.body.appendChild(preview)
    hide(preview)
    preview.onclick = function () {
      hide(preview)
    }
  }

  function addEvent() {
    img.addEventListener('mousewheel', scroll, {
      passive: false
    })
    preview.addEventListener('mousewheel', e => {
      e.preventDefault();
    })

    function scroll(e) {
      let rect = img.getClientRects()[0]
      let scale = matrix.M11
      if (e.deltaY >= 0 && matrix.M11 > 0.2) {
        matrix.M11 = matrix.M22 -= rate * matrix.M22
        if (rect.width < document.body.clientWidth || rect.height < document.body.clientHeight) {
          matrix.M31 = Math.max(1, matrix.M31 - matrix.M31 / 3)
          matrix.M32 = Math.max(1, matrix.M32 - matrix.M32 / 3)
          pos = {
            x: matrix.M31 - img.width * (matrix.M11 - 1) / 2,
            y: matrix.M31 - img.height * (matrix.M11 - 1) / 2
          }
        } else {
          let point = {
            x: e.clientX - img.offsetLeft,
            y: e.clientY - img.offsetTop
          }
          let zoom_point = {
            x: (point.x - pos.x) / scale,
            y: (point.y - pos.y) / scale
          }
          pos = {
            x: point.x - zoom_point.x * matrix.M11,
            y: point.y - zoom_point.y * matrix.M11
          }
          matrix.M31 = pos.x + img.width * (matrix.M11 - 1) / 2
          matrix.M32 = pos.y + img.height * (matrix.M11 - 1) / 2
        }
      } else if (e.deltaY < 0) {
        matrix.M11 = matrix.M22 += rate * matrix.M11
        // if (rect.width > document.body.clientWidth || rect.height > document.body.clientHeight) {
        let point = {
          x: e.clientX - img.offsetLeft,
          y: e.clientY - img.offsetTop
        }
        let zoom_point = {
          x: (point.x - pos.x) / scale,
          y: (point.y - pos.y) / scale
        }
        pos = {
          x: point.x - zoom_point.x * matrix.M11,
          y: point.y - zoom_point.y * matrix.M11
        }
        matrix.M31 = pos.x + img.width * (matrix.M11 - 1) / 2
        matrix.M32 = pos.y + img.height * (matrix.M11 - 1) / 2
        // }
      }
      img.style.transform = `matrix(${matrix.M11},${matrix.M12},${matrix.M21},${matrix.M22},${matrix.M31},${matrix.M32})`
    }
  }

  function hide(el) {
    el.style.display = 'none'
  }

  function handleScroll(e) {
    e.preventDefault();
    delta = Math.min(1, Math.max(-1, e.deltaY))
    //鼠标相对图片位置
    let zoom_point = {
      x: e.clientX - img.offsetLeft,
      y: e.clientY - img.offsetTop
    }
    console.log("TCL: handleScroll -> zoom_point", zoom_point)
    //！！未缩放前鼠标的相对位置
    let zoom_target = {
      x: (zoom_point.x - pos.x) / scale,
      y: (zoom_point.y - pos.y) / scale
    }
    scale += -delta * rate * scale
    //鼠标相对图片位置 - 鼠标放大后位置 = 鼠标相对位移位置
    pos.x = zoom_point.x - zoom_target.x * scale
    pos.y = zoom_point.y - zoom_target.y * scale
    var x = pos.x + img.width * (scale - 1) / 2
    var y = pos.y + img.height * (scale - 1) / 2
    if (pos.x > 0)
      pos.x = 0
    if (pos.x + size.w * scale < size.w)
      pos.x = -size.w * (scale - 1)
    if (pos.y > 0)
      pos.y = 0
    if (pos.y + size.h * scale < size.h)
      pos.y = -size.h * (scale - 1)
    img.style.transform = `matrix(${scale},${0},${0},${scale},${x},${y})`
  }
}