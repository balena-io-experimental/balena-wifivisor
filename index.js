#!/bin/env node

(function() {
    'use strict';

    const fs = require('fs');
    const EventEmitter = require('events').EventEmitter;
    const util = require('util');
    const hasbin = require('hasbin');
    const helper = require('./lib/helper');
    const connman = require('connman-simplified')();
    const express = require('express');
    const app = express();

    let Wifi = function() {
        if (!(this instanceof Wifi)) return new Wifi();
        this.state = "idle";
        this.serveCached = false;
        this.port = parseInt(process.env.WIFIVISOR_CONFIG_PORT) || 3000;
    };
    util.inherits(Wifi, EventEmitter);

    Wifi.prototype.init = function() {
        let self = this;

        connman.init(function(err) {
            if (err) {
                self.emit("error", err);
            } else {
                connman.initWiFi(function(err, wifi, properties) {
                    if (err) {
                        self.emit("error", err);
                    } else {

                        wifi.on('state', function(value) {
                            self.state = value;
                        });

                        app.get('/v1/wifi/state', function(req, res) {
                            res.send(self.state);
                        });

                        app.put('/v1/wifi/state', function(req, res) {
                            wifi.enable(function() {
                                self.emit("powered", true);
                                res.sendStatus(200);
                            });
                        });

                        app.delete('/v1/wifi/state', function(req, res) {
                            wifi.disable(function() {
                                self.emit("powered", false);
                                res.sendStatus(200);
                            });
                        });

                        app.get('/v1/wifi', function(req, res) {
                            if (!self.serveCached) {
                                wifi.getNetworks(function(err, list) {
                                    res.send(list);
                                });
                            } else {
                                wifi.getNetworksCache(function(err, list) {
                                    res.send(list);
                                });
                            }
                        });

                        app.post('/v1/wifi/:ssid/:psk', function(req, res) {
                            wifi.getNetworks(function(err, list) {
                                wifi.join(req.params.ssid, req.params.psk);
                                self.emit('connect', req.params.ssid);
                                res.sendStatus(200);
                            });
                        });

                        app.delete('/v1/wifi', function(req, res) {
                            wifi.disconnect();
                            self.emit('disconnect');
                            res.sendStatus(200);
                        });

                        app.post('/v1/wifi/hotspot/:ssid/:psk', function(req, res) {
                            wifi.openHotspot(req.params.ssid, req.params.psk, function(err) {
                                if (err) {
                                    self.emit("error", err);
                                    res.sendStatus(500);
                                } else {
                                    self.serveCached = true;
                                    self.emit('hotspot', {
                                        "ssid": req.params.ssid,
                                        "psk": req.params.psk,
                                        "active": true
                                    });
                                    res.sendStatus(200);
                                }
                            });
                        });

                        app.delete('/v1/wifi/hotspot', function(req, res) {
                            wifi.closeHotspot(function(err) {
                                if (err) {
                                    self.emit("error", err);
                                    res.sendStatus(500);
                                } else {
                                    self.serveCached = false;
                                    self.emit('hotspot', {
                                        "ssid": req.params.ssid,
                                        "psk": req.params.psk,
                                        "active": false
                                    });
                                    res.sendStatus(200);
                                }
                            });
                        });

                        app.get('/v1/wifi/config', function(req, res) {
                            helper.scanWifiConfigs(function(err, configs) {
                                if (err) {
                                    self.emit("error", err);
                                    res.sendStatus(500);
                                } else {
                                    res.send(configs);
                                }
                            });
                        });

                        app.post('/v1/wifi/config/:ssid/:psk', function(req, res) {
                            helper.createWifiConfig({"ssid":req.params.ssid,"psk": req.params.psk},function(err) {
                                if (err) {
                                    self.emit("error", err);
                                    res.sendStatus(500);
                                } else {
                                    res.sendStatus(200);
                                }
                            });
                        });

                        app.delete('/v1/wifi/config/:ssid', function(req, res) {
                            helper.removeWifiConfig(req.params.ssid,function(err) {
                                if (err) {
                                    self.emit("error", err);
                                    res.sendStatus(500);
                                } else {
                                    res.sendStatus(200);
                                }
                            });
                        });

                        app.listen(self.port, '127.0.0.1', function() {
                            self.emit("start", self.port);
                        });
                    }
                });
            }
        });
    };

    module.exports = Wifi();

})();
