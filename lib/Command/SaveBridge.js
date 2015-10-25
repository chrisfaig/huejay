'use strict';

let Bridge = require('../Bridge');
let Error  = require('../Error');

const ATTRIBUTE_MAP = {
  'name':          'name',
  'zigbeeChannel': 'zigbeechannel',
  'ipAddress':     'ipaddress',
  'dhcp':          'dhcp',
  'netmask':       'netmask',
  'gateway':       'gateway',
  'proxyPort':     'proxyport',
  'proxyAddress':  'proxyaddress',
  'timeZone':      'timezone',
  'linkButton':    'linkbutton',
  'touchLink':     'touchlink',
};

/**
 * Save bridge command
 *
 * Saves bridge
 */
class SaveBridge {
  /**
   * Constructor
   *
   * @param {Bridge} bridge Bridge
   */
  constructor(bridge) {
    validateBridge(bridge);

    this.bridge        = bridge;
    this.changedValues = bridge.getChangedValues();
  }

  /**
   * Invoke command
   *
   * @param {Client} client Client
   *
   * @return {Promise} Promise for chaining
   */
  invoke(client) {
    let options = {
      method: 'PUT',
      path:   `api/${client.username}/config`,
      body:   {}
    };

    let promises = [];
    for (let key in this.changedValues) {
      if (key in ATTRIBUTE_MAP) {
        promises.push(
          this.saveBridgeSetting(client, ATTRIBUTE_MAP[key], this.changedValues[key])
        );
      }
    }

    return Promise.all(promises)
      .then(results => {
        this.bridge.resetChangedValues();

        return true;
      });
  }

  /**
   * Save bridge setting
   *
   * @param {Client} client    Client
   * @param {string} attribute Attribute
   * @param {mixed}  value     Value
   *
   * @return {Promise} Promise for chaining
   */
  saveBridgeSetting(client, attribute, value) {
    let options = {
      method: 'PUT',
      path:   `api/${client.username}/config`,
      body:   {}
    };

    options.body[attribute] = value;

    return client.getTransport()
      .sendRequest(options);
  }
}

/**
 * Validate bridge
 *
 * @param {mixed} bridge Bridge object
 *
 * @return {bool} True if valid
 */
function validateBridge(bridge) {
  if (bridge instanceof Bridge) {
    return true;
  }

  throw Error({
    description: 'Expecting Bridge'
  });
}

module.exports = SaveBridge;