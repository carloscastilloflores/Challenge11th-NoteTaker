
/**
 * Module dependencies.
 */
var reqwest = require('reqwest');

exports = module.exports = init;

/**
 * Module initialization function.
 *
 * @public
 */
function init(config) {
  return new Clog(config);
}


/**
 * Main module object.
 *
 * @param {Object} config
 * @param {string} [config.host="localhost"] - The server host to connect to.
 * @param {number} [config.port=8000] - The server port to connect to.
 * @param {string} [config.source=""] - Client node log identifier.
 * @constructor
 * @private
 */
function Clog(config) {
  var config = config || {},
      config = {
        host: config.host || 'localhost',
        port: config.port || 5000,
        source: config.source || ''
      };

  this.serverUrl = 'http://' + config.host + ':' + config.port;
  this.config = config;
  return this;
}


/**
 * Submit a log event to the Clog server.
 *
 * @param {object} data
 * @param {function} cb - Called on success.
 */
Clog.prototype.log = function(data, cb) {
  var clog = this,
      payload = {'log': {'data': data}, 'source': clog.config.source},
      cb = cb || function(){};

  reqwest({
    url: clog.serverUrl + '/api/v1/logs/',
    method: 'post',
    crossOrigin: true,
    contentType: 'application/json',
    data: JSON.stringify(payload),
    success: cb
  });
}
