const fs = require("fs");
const path = require("path");

class Logger {
    constructor(logDir) {
        this.logDir = logDir;
        this.ensureLogDir();
    }

    ensureLogDir() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    formatTimestamp() {
        return new Date().toISOString();
    }

    log(level, message, data = null) {
        const timestamp = this.formatTimestamp();
        const logEntry = {
            timestamp,
            level,
            message,
            data
        };

        const logLine = JSON.stringify(logEntry) + "\n";

        // 控制台输出
        console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, data || "");

        // 写入文件
        const logFile = path.join(this.logDir, `${level}.log`);
        fs.appendFileSync(logFile, logLine);
    }

    info(message, data) {
        this.log("info", message, data);
    }

    warn(message, data) {
        this.log("warn", message, data);
    }

    error(message, data) {
        this.log("error", message, data);
    }

    debug(message, data) {
        this.log("debug", message, data);
    }
}

module.exports = Logger;
