/**
 * Export `Deferred`
 */

module.exports = Deferred

/**
 * Deferred
 */

function Deferred () {
  if (!(this instanceof Deferred)) return new Deferred()
  var self = this

  var p = new Promise(function (resolve, reject) {
    self.resolve = resolve
    self.reject = reject
  })

  self.then = p.then.bind(p)
  self.catch = p.catch.bind(p)
}
