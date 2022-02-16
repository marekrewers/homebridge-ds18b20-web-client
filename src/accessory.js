const axios = require('axios');

module.exports = (api) => {
  api.registerAccessory('TemperatureSensor', TemperatureSensor);
};

class TemperatureSensor {

  constructor(log, config, api) {
    this.log = log;
    this.api = api;

    this.Service = this.api.hap.Service;
    this.Characteristic = this.api.hap.Characteristic;

    this.name = config.name;
    this.ip = config.ip;
    // create a new Temperature Sensor service
    this.service = new this.Service(this.Service.TemperatureSensor);

    // create handlers for required characteristics
    this.service.getCharacteristic(this.Characteristic.CurrentTemperature)
        .onGet(async () => {
          this.log.debug('Triggered GET CurrentTemperature');
          try {
            const { temperature } = await axios.get(`http://${this.ip}`);
            this.log.info(`Temperature was fetched: ${temperature}`);
            return temperature;
          } catch (error) {
            this.log.error(`Failed to fetch temperature: ${error}`);
          }
        });
  }
}