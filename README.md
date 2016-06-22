# resin-wifivisor
a supervisor-like set of endpoints that enables wifi management under resin containers

### Dependencies

* `connman`
* `libdbus-1-dev`
* `libglib2.0-dev`

on **Debian**/**Ubuntu** :

`sudo apt-get update && sudo apt -get install connman libdbus-1 libglib2.0-dev -y`

### Installation

`npm i resin-wifivisor --save`

### Usage

```javascript

const Wifi = require('resin-wifivisor');

Wifi.init();

Wifi.on('error', function(err) {
    console.error(err)
});

Wifi.on('start', function(port) {
    console.log("wifi manager listening on port " + port);
});

Wifi.on('connect', function(ssid) {
    console.log('connected to ' + ssid);
});

Wifi.on('disconnect', function() {
    console.log("disconnected");
});

Wifi.on('hotspot', function(data) {
    if (data.active) {
        console.log("hotspot enabled with SSID: " + data.ssid + " and passphrase: " + data.psk);
    } else {
        console.log("hotspot disabled");
    }
});

Wifi.on('powered', function(status) {
    if (status) {
        console.log("Wifi enabled");
    } else {
        console.log("Wifi disabled");
    }
});

```

### APIs

* You can set the port on which to expose the webserver via `WIFIVISOR_CONFIG_PORT` *env-var* (defaults to `3000`)
* You can set the connections configuration path via `WIFIVISOR_CONFIG_DIR` *env-var* (defaults to `/data/wifi/`)

##### Get WiFi state

Endpoint | Method | Response | Description
------------ | ------------- | ------------- | -------------
`/v1/wifi/state` | `GET` | empty `200 OK` | returns the current state of the Wifi chip

##### Set WiFi power mode to ON

Endpoint | Method | Response | Description
------------ | ------------- | ------------- | -------------
`/v1/wifi/state` | `PUT` | empty `200 OK` | powers *ON* the WiFi chip

##### Set WiFi power mode to OFF

Endpoint | Method | Response | Description
------------ | ------------- | ------------- | -------------
`/v1/wifi/state` | `DELETE` | empty `200 OK` | powers *OFF* the WiFi chip

##### Scan WiFi

Endpoint | Method | Response | Description
------------ | ------------- | ------------- | -------------
`/v1/wifi/` | `GET` | obj `200 OK` | scans for Wifi access points

##### Connect

Endpoint | Method | Response | Description
------------ | ------------- | ------------- | -------------
`/v1/wifi/<ssid>/<psk>` | `POST` | obj `200 OK` | connects to a given Wifi access point with given `SSID` and `PSK`

##### Disconnect

Endpoint | Method | Response | Description
------------ | ------------- | ------------- | -------------
`/v1/wifi/` | `DELETE` | empty `200 OK` | disconnects to any current Wifi access point

##### Hotspot ON

Endpoint | Method | Response | Description
------------ | ------------- | ------------- | -------------
`/v1/wifi/hotspot/<ssid>/<psk>` | `POST` | obj `200 OK` *or* `500 INTERNAL SERVER ERROR` | enables the Hotspot mode with given `SSID` and `PSK`

##### Hotspot OFF

Endpoint | Method | Response | Description
------------ | ------------- | ------------- | -------------
`/v1/wifi/hotspot/` | `DELETE` | empty `200 OK` | disables the Hotspot mode

##### Get Configs

Endpoint | Method | Response | Description
------------ | ------------- | ------------- | -------------
`/v1/wifi/config/` | `GET` | obj `200 OK` *or* `500 INTERNAL SERVER ERROR` | gets already configured connections

##### Save config

Endpoint | Method | Response | Description
------------ | ------------- | ------------- | -------------
`/v1/wifi/config/<ssid>/<psk>` | `POST` | empty `200 OK` *or* `500 INTERNAL SERVER ERROR` | save connection config

##### Delete config

Endpoint | Method | Response | Description
------------ | ------------- | ------------- | -------------
`/v1/wifi/config/<ssid>` | `DELETE` | empty `200 OK` *or* `500 INTERNAL SERVER ERROR` | delete connection config

## License

Copyright 2016 Rulemotion Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
