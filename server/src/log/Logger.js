const readline = require('readline')
var fs = require('fs')

const Clock = require('./Clock.js')
const Lang = require('../lang/Lang')

const LEVEL = {
  OFF: 0,
  WARNING: 1,
  INFO: 2,
  CONFIG: 4,
  FINE: 8,
  FINER: 16,
  FINEST: 32,
  ALL: 63
}

class Handel {
  constructor () {
    this._buffer = ''
    this._level = LEVEL.OFF
    this._ANSI_COLOR = false
  }

  close () { }

  add (message) {
    this._buffer += message
  }

  flush () {

  }

  clearBuffer () {
    this._buffer = ''
  }

  set level (level) {
    this._level = level
  }

  get level () {
    return this._level
  }

  isSupportColor () {
    return this._ANSI_COLOR
  }
}

class FileHandel extends Handel {
  constructor (name) {
    super()
    this._ANSI_COLOR = false
    this._path = name ? './log/' + name : './log/'
  }

  setPath (path) {
    this._path = path
  }

  add (message) {
    Handel.prototype.add.call(this, message + '\n')
  }

  flush () {
    if (this._buffer === '') return

    try {
      if (!fs.existsSync('log')) fs.mkdirSync('log')

      let date = new Date()

      fs.writeFileSync(this._path + date.getTime() + '.log', this._buffer, 'utf-8')
    } catch (e) {
      console.log(e)
    }

    this.clearBuffer()
  }

  close () {
    this.flush()
  }
}

class ConsoleHandel extends Handel {
  constructor () {
    super()
    this._ANSI_COLOR = true
  }

  add (message) {
    Handel.prototype.add.call(this, message)

    this.flush()
  }

  flush () {
    readline.clearLine(process.stdout)
    readline.cursorTo(process.stdout, 0)

    process.stdout.write(this._buffer)

    this.clearBuffer()
  }
}

class Logger {
  constructor (name) {
    this._name = name || Lang.format('name.logger')
    this._clock = new Clock()
    this._level = LEVEL.OFF
    this._handel = []

    this._prompForm = '\n' + Lang.format('form.promp')
  }

  get name () {
    return this._name
  }

  set level (level) {
    this._level = level
  }

  get level () {
    return this._level
  }

  addHandler (handel) {
    this._handel.push(handel)
  }

  info (message) {
    if ((this._level & LEVEL.INFO) === 0) return

    this._clock.update()
    this._handel.forEach(element => {
      if ((element.level & LEVEL.INFO) !== 0) {
        if (element.isSupportColor()) {
          element.add(Lang.format('form.log.info.color', [this._clock.time, message]) + this._prompForm)
        } else {
          element.add(Lang.format('form.log.info', [this._clock.time, message]))
        }
      }
    })
  }

  warning (message) {
    if ((this._level & LEVEL.WARNING) === 0) return

    this._clock.update()
    this._handel.forEach(element => {
      if ((element.level & LEVEL.WARNING) !== 0) {
        if (element.isSupportColor()) {
          element.add(Lang.format('form.log.warn.color', [this._clock.time, message]) + this._prompForm)
        } else {
          element.add(Lang.format('form.log.warn', [this._clock.time, message]))
        }
      }
    })
  }

  config (message) {
    if ((this._level & LEVEL.CONFIG) === 0) return

    this._clock.update()
    this._handel.forEach(element => {
      if ((element.level & LEVEL.CONFIG) !== 0) {
        if (element.isSupportColor()) {
          element.add(Lang.format('form.log.config.color', [this._clock.time, message]) + this._prompForm)
        } else {
          element.add(Lang.format('form.log.config', [this._clock.time, message]))
        }
      }
    })
  }

  fine (message) {
    if ((this._level & LEVEL.FINE) === 0) return

    this._clock.update()
    this._handel.forEach(element => {
      if ((element.level & LEVEL.FINE) !== 0) {
        if (element.isSupportColor()) {
          element.add(Lang.format('form.log.fine.color', [this._clock.time, message]) + this._prompForm)
        } else {
          element.add(Lang.format('form.log.fine', [this._clock.time, message]))
        }
      }
    })
  }

  finer (message) {
    if ((this._level & LEVEL.FINER) === 0) return

    this._clock.update()
    this._handel.forEach(element => {
      if ((element.level & LEVEL.FINE) !== 0) {
        if (element.isSupportColor()) {
          element.add(Lang.format('form.log.finer.color', [this._clock.time, message]) + this._prompForm)
        } else {
          element.add(Lang.format('form.log.finer', [this._clock.time, message]))
        }
      }
    })
  }

  finest (message) {
    if ((this._level & LEVEL.FINEST) === 0) return

    this._clock.update()
    this._handel.forEach(element => {
      if ((element.level & LEVEL.FINE) !== 0) {
        if (element.isSupportColor()) {
          element.add(Lang.format('form.log.finest.color', [this._clock.time, message]) + this._prompForm)
        } else {
          element.add(Lang.format('form.log.finest', [this._clock.time, message]))
        }
      }
    })
  }

  message (message) {
    this._handel.forEach(element => {
      if (element.isSupportColor()) {
        element.add(Lang.format('form.log.msg.color', [this._clock.time, '', message]) + this._prompForm)
      } else {
        element.add(Lang.format('form.log.msg', [this._clock.time, '', message]))
      }
    })
  }

  close () {
    this._handel.forEach(element => {
      element.close()
    })
  }
}

module.exports = { Logger, ConsoleHandel, FileHandel, LEVEL }
