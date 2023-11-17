const winston = require('winston');
const path = require('path');
const srcPath = require('./path')
const { format } = require('date-fns')
module.exports = winston.createLogger({
    // format của log được kết hợp thông qua format.combine
    format: winston.format.combine(
        winston.format.splat(),
        // Định dạng time cho log
        winston.format.timestamp({
            format: 'DD-MM-YYYY HH:mm:ss'
        }),
        // thêm màu sắc
        // winston.format.colorize(),
        // thiết lập định dạng của log
        winston.format.printf(
            log => {
                // nếu log là error hiển thị stack trace còn không hiển thị message của log 
                if (log.stack) return `[${log.timestamp}] [${log.level}] ${log.stack}`;
                return `[${log.timestamp}] [${log.level}] ${log.message}`;
            },
        ),
    ),
    transports: [
        // hiển thị log thông qua console
        new winston.transports.Console(),
        // Thiết lập ghi các errors vào file 
        // new winston.transports.File({ filename: 'error.log', level: 'error' }),
        // // new winston.transports.File({ filename: 'error.log', level: 'error' }),
        // new winston.transports.File({ filename: 'tung.log', level: 'warn' }),
        // new winston.transports.File({ filename: 'info.log', level: 'info' }),
        // // new winston.transports.File({ filename: 'debug.log', level: 'debug' }),
        // new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.File({
            level: 'error',
            filename: path.join(srcPath, 'logs', 'error.log')
        }),
        new winston.transports.File({
            level: 'warn',
            filename: path.join(srcPath, 'logs', 'warning.log')
        }),
        new winston.transports.File({
            level: 'info',
            filename: path.join(srcPath, 'logs', 'info.log')
        }),
    ],
})