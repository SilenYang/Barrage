// eslint-disable-next-line
import { BarrageConf, BarrageItem, sendType, Barrages } from './index'

const Conf = {
  el: null,
  fontSize: 14,
  color: '#fff',
  gradientColor: '',
  opacity: 1,
  renderArea: 'full',
  fhRate: 1.33,
  brgPadding: 4,
  brgHeight: 14,
  containerWidth: 0,
  brgChannel: 0,
  halfChannel: 0,
  standingTime: 4,
  fixNormal: true
}

/**
 * @type {Barrages}
 */
const Brgs = []

const requestAnimationFrame =
  window.requestAnimationFrame || (fn => setTimeout(fn, 17))

class Barrage {
  /**
   * @param {BarrageConf} config
   */
  Conf = {}

  /**
   * @param {BarrageConf} config
   */
  constructor(config) {
    this.Conf = Object.assign({}, Conf, config)
    this.init()
    move.call(this)
    this.Conf.el.addEventListener('resize', () => this.init())
  }

  init() {
    const { clientWidth, clientHeight } = this.Conf.el
    this.Conf.containerWidth = clientWidth
    this.Conf.brgHeight = Math.ceil(this.Conf.fontSize * this.Conf.fhRate)
    this.Conf.brgChannel = Math.floor(
      clientHeight / (this.Conf.brgHeight + this.Conf.brgPadding * 3)
    )
    this.Conf.halfChannel = Math.ceil(this.Conf.brgChannel / 2)
  }

  /**
   * 发送弹幕
   * @param {BarrageItem} config
   */
  send(config) {
    const { el, halfChannel, brgChannel, renderArea, fixNormal } = this.Conf
    config.sendType = config.sendType || 'normal'
    if (fixNormal && config.sendType !== 'normal') config.type = 'normal'
    else config.type = config.type || 'normal'
    const brgItem = Brgs.filter(
      brg =>
        !brg.show &&
        brg.type === config.type &&
        brg.sendType === config.sendType
    )[0]
    if (brgItem) {
      const channel = getChannel.call(this, config.sendType)
      if (
        typeof channel !== 'number' ||
        channel >= brgChannel ||
        (renderArea === 'up' && channel >= halfChannel) ||
        (renderArea === 'down' && channel < halfChannel)
      ) {
        return
      }
      const { el, style } = upgradeBarrage.call(this, brgItem, config)
      brgItem.el = el
      brgItem.show = true
      brgItem.left = 0
      brgItem.width = 0
      brgItem.style = style

      brgItem.channel = channel
      if (config.sendType !== 'normal') time.call(this)
      else brgItem.move = true
    } else {
      const channel = getChannel.call(this, config.sendType)
      if (
        typeof channel !== 'number' ||
        channel >= brgChannel ||
        (renderArea === 'up' && channel >= halfChannel) ||
        (renderArea === 'down' && channel < halfChannel)
      ) {
        return
      }
      const { El, style } = createBarrage.call(this, config)
      const id = Date.now()
      El.dataset.id = id
      const brg = {
        id,
        move: false,
        show: true,
        el: El,
        distance: 2,
        left: 0,
        channel,
        width: 0,
        cacheW: false,
        type: config.type,
        sendType: config.sendType,
        style
      }
      El.addEventListener('mouseenter', e => {
        const id = e.target.dataset.id
        const Brg = Brgs.filter(brg => brg.id === +id)[0]
        Brg.move = false
      })
      El.addEventListener('mouseleave', e => {
        const id = e.target.dataset.id
        const Brg = Brgs.filter(brg => brg.id === +id)[0]
        Brg.move = true
      })
      el.append(El)
      // console.log(brg);
      Brgs.push(brg)
      if (config.sendType !== 'normal') time.call(this)
      else brg.move = true
    }
  }

  update(config) {
    console.log('更新')
    let reInit = false
    if (this.Conf.fontSize !== config.fontSize) reInit = true
    this.Conf = Object.assign({}, this.Conf, config)
    reInit && this.init()
    updateBarrage.apply(this)
  }

  pause() {
    Brgs.forEach(brg => (brg.move = !brg.move))
  }

  dispose() {
    Brgs.length = 0
  }
}

/**
 * TODO 做一些全局性弹幕的修改
 */
function updateBarrage() {
  console.log(this)
}

/**
 * 配置通用型的 style
 * @param {BarrageConf} config
 */
function getCommonStyle(config = {}) {
  const conf = Object.assign({}, this.Conf, config)
  let gradientStyle = ''
  let borderStyle = ''
  if (conf.gradientColor) {
    gradientStyle = `background:linear-gradient(to right,${
      conf.gradientColor
    });-webkit-text-fill-color: transparent;-webkit-background-clip:text;text-shadow:none;`
  }
  if (conf.borderColor) {
    borderStyle = `border: 1px solid ${conf.borderColor ||
      '#fff'};border-radius:${conf.brgHeight / 2 + conf.brgPadding}px;`
  }
  return `display:inline-block;will-change:transform;perspective:500px;padding:${
    conf.brgPadding
  }px;position:absolute;font-size:${conf.fontSize}px;height:${conf.brgHeight +
    conf.brgPadding * 2}px;font-weight:normal;white-space:nowrap;color:${
    conf.color
  };user-select:none;line-height:${conf.brgHeight}px;opacity:${
    conf.opacity
  };left:${
    conf.containerWidth
  }px;text-shadow:#000 1px 0px 1px,#000 0px 1px 1px,#000 0px -1px 1px,
  #000 -1px 0px 1px;${gradientStyle}${borderStyle}`
}

// 运动函数
function move() {
  Brgs.filter(brg => brg.show && brg.sendType === 'normal').forEach(brg => {
    //  宽度计算缓存
    if (!brg.cacheW) {
      const width = brg.el.offsetWidth
      if (width === brg.width) brg.cacheW = true
      else brg.width = width
    }
    // todo 根据长度改变速度
    brg.distance = brg.distance || 2
    brg.left = brg.move ? brg.left + brg.distance : brg.left
    brg.el.style = `${brg.style}top:${brg.channel *
      (this.Conf.brgHeight + this.Conf.brgPadding * 3) +
      this.Conf.brgPadding}px;transform: translate3d(-${brg.left}px,0,0);`
    if (this.Conf.containerWidth + brg.width + 10 <= brg.left) {
      brg.move = false
      brg.show = false
      brg.cacheW = false
    }
  })
  requestAnimationFrame(move.bind(this))
}

// 定时弹幕
function time() {
  const timeBarrage = Brgs.filter(brg => brg.show)
  for (let brg of timeBarrage) {
    if (brg.move) continue
    brg.move = true
    brg.el.style = `${brg.style}top:${brg.channel *
      (this.Conf.brgHeight + this.Conf.brgPadding * 3) +
      this.Conf.brgPadding}px;left:50%;transform:translate3d(-50%,0,0);`
    setTimeout(() => {
      brg.show = false
      brg.move = false
      brg.el.style = `${brg.style}top:-${this.Conf.brgHeight +
        this.Conf.brgPadding * 3}px;left:50%;transform:translate3d(-50%,0,0);`
    }, this.Conf.standingTime * 1000)
  }
}

/**
 * 创建新弹幕
 * @param {BarrageItem} config
 * @param {Object} Conf
 * @returns {{El: HTMLElement, type: string}}
 */
function createBarrage(config = {}) {
  const Conf = this.Conf
  const type = config.type
  let El = null
  let style = null
  switch (type) {
    case 'normal':
      El = document.createElement('div')
      El.innerHTML = config.text
      style = getCommonStyle.call(this, config)
      break
    case 'avatar':
      El = document.createElement('div')
      const img = document.createElement('img')
      img.src = config.avatar
      const size = Conf.brgHeight
      img.style = `border-radius: 100%;height:${size}px;width:${size}px;margin-right:5px;`
      const span = document.createElement('span')
      span.innerHTML = config.text
      El.appendChild(img)
      El.appendChild(span)
      style = `${getCommonStyle.call(
        this,
        config
      )}display: inline-flex;align-items:center;`
      break
    default:
      El = document.createElement('div')
      El.innerHTML = config.text
      style = getCommonStyle.call(this)
      break
  }
  return { El, style }
}

/**
 * 更新弹幕
 * @param {*} brg
 * @param {BarrageItem} config
 * @returns {{el: HTMLElement, type: string}}
 */
function upgradeBarrage(brg, config) {
  const type = config.type
  const el = brg.el
  let style = null
  switch (type) {
    case 'normal':
      el.innerHTML = config.text
      style = getCommonStyle.call(this, config)
      break
    case 'avatar':
      for (let ele of el.childNodes) {
        if (ele.tagName === 'IMG') {
          ele.src = config.avatar
        }
        if (ele.tagName === 'SPAN') {
          ele.innerHTML = config.text
        }
      }
      style = `${getCommonStyle.call(
        this,
        config
      )}display: inline-flex;align-items:center;`
      break
    default:
      el.innerHTML = config.text
      style = getCommonStyle.call(this)
      break
  }
  return { el, style }
}

/**
 * 获取弹幕通道
 * 按顺序分配通道，若第一个通道最后一个离开，
 * 并且通道弹幕数量未达到最大值，则分配到当前，
 * 否则则是下一个通道
 * @param {sendType} type 发送弹幕类型
 * @returns {(number| undefined)}
 */
function getChannel(type = 'normal') {
  const { renderArea, halfChannel, brgChannel } = this.Conf
  const totalChannels = Array.from(Array(brgChannel), (v, i) => i)
  let channel = 0
  const channelMap = {}
  if (type === 'normal') {
    Brgs.filter(brg => brg.show && brg.sendType === 'normal').forEach(brg => {
      channelMap[brg.channel] = channelMap[brg.channel] || {
        remain: 0
      }
      // 右侧未离开距离 + 20间距
      const remain = brg.left - brg.width - 10
      if (!channelMap[brg.channel].remain)
        channelMap[brg.channel].remain = remain < 0 ? Math.abs(remain) : 0
    })
    // 已存在的弹幕通道
    const alreadyChannels = Object.keys(channelMap).sort((a, b) => +a > +b)

    let validChannels = []
    switch (renderArea) {
      case 'full':
        validChannels = totalChannels
        break
      case 'up':
        validChannels = totalChannels.slice(0, halfChannel)
        break
      case 'down':
        validChannels = totalChannels.slice(halfChannel - brgChannel)
        break
      default:
        validChannels = totalChannels
        break
    }
    /**
     * 使用 cacheChannels 在于该计算方法无通道可选时，
     * 可以继续使用 validChannels 做其他选取方式
     */
    const cacheChannels = validChannels.slice()
    for (let c of alreadyChannels) {
      if (!validChannels.includes(+c)) continue
      channelMap[c].remain && cacheChannels.splice(cacheChannels.indexOf(+c), 1)
    }
    /**
     * 允许在 cacheChannels 随机选择
     * TODO 无可选时，使用 validChannels 做其他选取
     */
    channel = cacheChannels.shift()
  } else {
    Brgs.filter(brg => brg.show && brg.sendType === type).forEach(brg => {
      if (brg.show) {
        channelMap[brg.channel] =
          channelMap[brg.channel] || (channelMap[brg.channel] = 0) + 1
      }
    })
    const alreadyChannels = Object.keys(channelMap).sort((a, b) => +a > +b)
    const validChannels = totalChannels.filter(
      c => !alreadyChannels.includes(c.toString())
    )
    channel =
      type === 'up' ? validChannels.shift() : validChannels.reverse().shift()
  }
  return channel
}

export default Barrage
