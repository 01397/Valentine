document.addEventListener('DOMContentLoaded', async () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')!
  const { width, height } = canvas
  const heartSize = 20
  const col = Math.ceil(width / heartSize)
  const row = Math.ceil(height / heartSize)
  const state = new Array(col * row).fill(null)
  const imageMap = new Array(col * row).fill(false)

  const draw = async (speed: number) => {
    const order = new Array(state.length).fill(null).map((v, i) => i)
    suffle(order)
    let count = 0
    for (let i = 0; i < order.length; i++) {
      const o = order[i]
      if ((!imageMap[o] && state[o] === null) || (imageMap[o] && state[o] !== null)) continue
      state[o] = imageMap[o] ? `rgb(${191 + Math.random() * 64}, 32, ${32 + Math.random() * 160})` : null
      if (++count % speed === 0) await render()
    }
    render()
  }
  const init = () => {
    ctx.fillStyle = '#40081b'
    ctx.fillRect(0, 0, width, height)
  }

  const render = () => {
    const len = col * row
    init()
    for (let i = 0; i < len; i++) {
      if (state[i] === null) continue
      ctx.fillStyle = state[i]
      fillHeart(i % col, Math.floor(i / col))
    }
    return new Promise(resolve => setTimeout(resolve, 16))
  }

  const setImageSource = (path: string) => {
    return new Promise(resolve => {
      const t_cvs = document.createElement('canvas')
      t_cvs.width = Math.floor(width / heartSize)
      t_cvs.height = Math.floor(height / heartSize)
      const t_ctx = t_cvs.getContext('2d')!
      const image = new Image()
      image.src = path
      image.addEventListener('load', () => {
        t_ctx.drawImage(image, 0, 0)
        const data = t_ctx.getImageData(0, 0, t_cvs.width, t_cvs.height).data
        const len = data.length / 4
        for (let i = 0; i < len; i++) {
          imageMap[i] = data[i * 4] !== 0
        }
        resolve()
      })
    })
  }
  const sleep = (ms: number) => {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  }

  const fillHeart = (x: number, y: number) => {
    ctx.save()
    ctx.translate(x * heartSize, y * heartSize)
    ctx.scale(heartSize / 120, heartSize / 120)
    ctx.beginPath()
    ctx.moveTo(75, 40)
    ctx.bezierCurveTo(75, 37, 70, 25, 50, 25)
    ctx.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5)
    ctx.bezierCurveTo(20, 80, 40, 102, 75, 120)
    ctx.bezierCurveTo(110, 102, 130, 80, 130, 62.5)
    ctx.bezierCurveTo(130, 62.5, 130, 25, 100, 25)
    ctx.bezierCurveTo(85, 25, 75, 37, 75, 40)
    ctx.fill()
    ctx.restore()
  }
  init()
  await sleep(1500)
  await setImageSource('./source1.bmp')
  await draw(10)
  await sleep(200)
  await setImageSource('./source2.bmp')
  await draw(5)
  await sleep(1000)
  await setImageSource('./source3.bmp')
  await draw(10)
  await sleep(500)
  await setImageSource('./source4.bmp')
  await draw(10)
  await sleep(1000)
  await setImageSource('./source5.bmp')
  await draw(5)
  await sleep(200)
  await setImageSource('./source6.bmp')
  await draw(10)
})

function suffle<T>(arr: T[]) {
  let i = arr.length
  while (i) {
    const j = Math.floor(Math.random() * i--)
    ;[arr[j], arr[i]] = [arr[i], arr[j]]
  }
}
