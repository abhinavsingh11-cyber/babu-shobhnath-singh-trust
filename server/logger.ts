import winston from 'winston';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Create logger with structured format
const logger = winston.createLogger({
  level: isDevelopment ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    isDevelopment
      ? winston.format.printf(({ timestamp, level, message, ...meta }) => {
          let metaStr = '';
          if (Object.keys(meta).length > 0) {
            // Filter out timestamp since we already show it
            const { timestamp: _ts, ...restMeta } = meta;
            if (Object.keys(restMeta).length > 0) {
              metaStr = ' ' + JSON.stringify(restMeta);
            }
          }
          return `${timestamp} [${level.toUpperCase()}] ${message}${metaStr}`;
        })
      : winston.format.json()
  ),
  transports: [
    // Console transport
    new winston.transports.Console(),
  ],
});

// Add file transport in production
if (!isDevelopment) {
  logger.add(
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );

  logger.add(
    new winston.transports.File({
      filename: 'combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

export default logger;
