/**
 * User: Mike Chung
 * Date: 15/12/13
 * Time: 7:40 PM
 */
"use strict";
var ServiceManager = function() {
    var services = [];

    function vadildateServiceObject(id, service) {
        if (!service || typeof service != "function") {
            throw "Service has to be a function";
        }
        if (services[id] && typeof services[id] == "function") {
            throw "This service has been registered";
        }
    }

    return {
        register: function(id, service) {
            vadildateServiceObject(id, service);
            services[id] = service;
        },
        serve: function(id, req, resp, param) {
            services[id](req, resp, param);
        },
        isService: function(id) {
            return !!services[id] && typeof services[id] == "function";
        }
    };
};

module.exports = new ServiceManager();