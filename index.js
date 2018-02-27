var eventConsumer = require("commons/event-consumer");
var components = require("./components");
var logic;
var logger;
var util;
var http = require("http");

function processEvent(event) {
    var eventStr = util.getEventString(event);
    return util.extractPath(event).then(path => {
        var rule = logic[path];
        if (rule) {
            return Promise.resolve().then(() => rule(event))
                .then(() => logger.info("RECEIVED EVENT:", path))
                .catch(err => logger.error(`EVENT ${eventStr} PATH ${path} ERROR: ${err}`));
        }
    })
    .catch(err => logger.error(err));
}

components.init().then(() => {
    var config = components.config;
    logger = components.logger;
    logic = require("./extra");
    util = require("./util");

    const server = http.createServer((req, res) => {
        if (req.method === 'GET' && req.url === '/healthcheck') {
            res.statusCode = 200;
        } else {
            res.statusCode = 404;
        }
        res.end();
      }).listen(config.port);

    eventConsumer(config, processEvent, error => {
        logger.error(error);
    });
});
