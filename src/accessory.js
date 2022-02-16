module.exports = (api) => {
  api.registerAccessory('homebridge-ds18b20-web-client','TemperatureSensor', TemperatureSensor);
};

const fetch = require('node-fetch');

class TemperatureSensor {

  constructor(log, config, api) {
    this.log = log;
    this.api = api;

    this.Service = this.api.hap.Service;
    this.Characteristic = this.api.hap.Characteristic;

    this.name = config.name;
    this.url = config.url;
    // create a new Temperature Sensor service
    this.service = new this.Service(this.Service.TemperatureSensor, '0000008A-0000-1000-8000-0026BB765291');

  this.informationService = new this.api.hap.Service.AccessoryInformation()
      .setCharacteristic(this.api.hap.Characteristic.Manufacturer, "Lypzor")
      .setCharacteristic(this.api.hap.Characteristic.Model, "ESP32");

    // create handlers for required characteristics
    this.service.getCharacteristic(this.Characteristic.CurrentTemperature)
        .onGet(async () => {
          this.log.debug('Triggered GET CurrentTemperature');
          try {
            const response = await fetch(this.url);
            const { temperature } = await response.json();
            this.log.info(`Temperature was fetched: ${temperature}`);
            return temperature;
          } catch (error) {
            this.log.error(`Failed to fetch temperature: ${error}`);
          }
        });
  }

    getServices() {
        return [
            this.informationService,
            this.service,
        ];
    }
}