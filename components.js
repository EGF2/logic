"use strict";

const option = require("commons/option");
const bunyan = require("bunyan");

function init() {
    return option().config.then(config => {
        module.exports.config = config;
        module.exports.clientData = require("commons/client-data")(config["client-data"]);
        module.exports.logger = bunyan.createLogger({
            name: "logic",
            level: config.log_level
        });
        return module.exports;
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
}

module.exports = {
    init
};