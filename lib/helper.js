#!/bin/env node

(function() {
    'use strict';

    const fs = require('fs');
    const jsonfile = require('jsonfile');

    let helper = function() {
        if (!(this instanceof helper)) return new helper();

        this.serviceDir = process.env.WIFIVISOR_CONFIG_DIR || '/data/wifi/';
    };

    helper.prototype.createWifiConfig = function createWifiConfig(data, callback) {
        let self = this;

        let serviceFile = self.serviceDir + data.ssid + '.json';
        let config = {};
        config.Name = data.ssid;
        config.Passphrase = data.psk;

        jsonfile.writeFile(serviceFile, config, function(err) {
            if (error) {
                callback(error);
                return;
            }
            callback(err, serviceFile);
        });
    };

    helper.prototype.scanWifiConfigs = function createWifiConfig(data, callback) {
        let self = this;

        jsonfile.readdir(self.serviceDir, function(err, files) {
            if (err) {
                callback(err);
                return;
            }
            callback(err, files);
        });
    };

    helper.prototype.readWifiConfig = function createWifiConfig(data, callback) {
        let self = this;

        let serviceFile = self.serviceDir + data.ssid + '.json';
        jsonfile.readFile(serviceFile, function(err, obj) {
            if (err) {
                callback(err);
                return;
            }
            callback(err, obj);
        });
    };

    helper.prototype.removeWifiConfig = function removeWifiConfig(ssid, callback) {
        let self = this;

        let serviceFile = self.serviceDir + ssid + '.json';
        fs.unlink(serviceFile, (error) => {
            callback(error);
        });
    };

    module.exports = helper();

})();
