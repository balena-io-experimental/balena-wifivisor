#!/bin/env node

(function() {
    'use strict';

    const fs = require('fs');

    let helper = function() {
        if (!(this instanceof helper)) return new helper();
    };

    helper.prototype.createWifiConfig = function createWifiConfig(data, callback) {
        let serviceFile = '/data/wifi/' + data.ssid + '.json';
        let config = {};
        config.Name = data.ssid;
        config.Passphrase = data.psk;

        fs.writeFile(serviceFile, config, 'utf8', (error) => {
            if (error) {
                callback(error);
                return;
            }
            callback(err, serviceFile);
        });
    };

    helper.prototype.removeWifiConfig = function removeWifiConfig(ssid, callback) {
        let serviceFile = '/data/wifi/' + ssid + '.json';
        fs.unlink(serviceFile, (error) => {
            callback(error);
        });
    };
})();

module.exports = helper();
