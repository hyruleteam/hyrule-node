const {createLogger, format, transports,loggers} = require('winston');
const path = require('path');

const myFormat = format.printf(info => {
    return `[${info.timestamp}] [${info.label}] ${info.level}: ${info.message}`;
  });

const logger = createLogger({
    format: format.combine(
        format.label({
            label:'controller'
        }),
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.prettyPrint(),
        format.json(),
        myFormat,
    ),
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new transports.File({
            filename: path.join(__dirname, '../../logs/error.log'),
            level: 'error',
            maxsize: 1024 * 1024 * 10,
        }),
        new transports.File({
            filename: path.join(__dirname, '../../logs/combined.log'),
            maxsize: 1024 * 1024 * 10,
        })
    ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        handleExceptions: true,
        format: format.combine(
            format.label({
                label:'controller'
            }),
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            format.prettyPrint(),
            format.colorize(),
            format.json(),
            myFormat,
        ),
    }));
}

let responseTransports = [
    new transports.File({
        filename: path.join(__dirname, '../../logs/response.log'),
        maxsize: 1024 * 1024 * 10,
        format: format.combine(
            myFormat,
        ),
    })
]

if(process.env.NODE_ENV !== 'production'){
    responseTransports.push(new transports.Console({
        handleExceptions: true,
        format: format.combine(
            format.colorize(),
            myFormat,
        ),
    }))
}

loggers.add('response', {
    format: format.combine(
        format.label({
            label:'response'
        }),
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.prettyPrint(),
        format.json()
    ),
    transports: responseTransports
});

const response = loggers.get('response');

logger.response = {
    info(data){
        response.info(data);
    }
}

module.exports = logger;
