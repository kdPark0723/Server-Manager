const Lang = require('./lang/Lang')

const LogManager = require('./manager/LogManager')
const { LEVEL } = require('./log/Logger')

class Application {
  constructor (name) {
    this._name = name || Lang.format('name.application')

    this._logManager = new LogManager(this, Lang.format('name.manager.log'))
    this._logger = this._logManager.getLogger(LEVEL.ALL)

    this._logger.info(Lang.format('msg.application.creating', [this._name]))
    this.init()
    this._logger.fine(Lang.format('msg.application.created', [this._name]))
  }

  init () {
  }

  get name () {
    return this._name
  }
  get logManager () {
    return this._logManager
  }
  get server () {

  }

  destroyer () {
    this._logger.info(Lang.format('msg.application.destroying', [this._name]))
    this.destroy()
    this._logManager.destroyer()
    this._logger.fine(Lang.format('msg.application.destroyed', [this._name]))
  }

  destroy () {
  }
}

module.exports = Application
