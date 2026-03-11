const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 9000;

// 日志目录
const LOG_DIR = path.join(__dirname, "../logs");

// 确保日志目录存在
const logDirs = ["js", "api", "crypto"];
logDirs.forEach(dir => {
    const dirPath = path.join(LOG_DIR, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
});

// 中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 日志接收接口
app.post("/log", (req, res) => {
    try {
        const logData = req.body;
        const logType = logData.type || "general";
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

        // 根据类型保存到不同文件
        let logFile;
        switch (logType) {
            case "aes_encrypt":
            case "aes_decrypt":
            case "rsa_encrypt":
            case "hmac_sha256":
            case "md5":
            case "webcrypto_encrypt":
            case "sm2_encrypt":
            case "sm4_encrypt":
                logFile = path.join(LOG_DIR, "crypto", `${logType}_${timestamp}.log`);
                break;
            case "fetch_sensitive":
            case "xhr_sensitive":
            case "ws_message":
                logFile = path.join(LOG_DIR, "api", `${logType}_${timestamp}.log`);
                break;
            case "btoa":
            case "atob":
            case "json_sensitive":
                logFile = path.join(LOG_DIR, "crypto", `encoding_${timestamp}.log`);
                break;
            default:
                logFile = path.join(LOG_DIR, "general", `${timestamp}.log`);
        }

        // 格式化日志内容
        const logContent = [
            "=".repeat(60),
            `时间: ${logData.timestamp}`,
            `类型: ${logData.type}`,
            `数据: ${JSON.stringify(logData.data, null, 2)}`,
            "=".repeat(60),
            ""
        ].join("\n");

        // 写入日志文件
        fs.appendFileSync(logFile, logContent);

        console.log(`[日志保存] ${logType} -> ${path.basename(logFile)}`);

        res.json({ success: true, message: "日志已保存" });
    } catch (error) {
        console.error("[日志保存失败]", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 获取日志列表
app.get("/logs", (req, res) => {
    try {
        const logs = {};

        logDirs.forEach(dir => {
            const dirPath = path.join(LOG_DIR, dir);
            const files = fs.readdirSync(dirPath);
            logs[dir] = files.map(file => {
                const filePath = path.join(dirPath, file);
                const stats = fs.statSync(filePath);
                return {
                    name: file,
                    size: stats.size,
                    modified: stats.mtime
                };
            });
        });

        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 下载日志文件
app.get("/log/:type/:filename", (req, res) => {
    try {
        const { type, filename } = req.params;
        const filePath = path.join(LOG_DIR, type, filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "文件不存在" });
        }

        res.download(filePath);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 清空日志
app.delete("/logs", (req, res) => {
    try {
        logDirs.forEach(dir => {
            const dirPath = path.join(LOG_DIR, dir);
            const files = fs.readdirSync(dirPath);
            files.forEach(file => {
                const filePath = path.join(dirPath, file);
                fs.unlinkSync(filePath);
            });
        });

        res.json({ success: true, message: "日志已清空" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log("=".repeat(50));
    console.log("Crypto Analyzer V5 日志服务器");
    console.log(`运行端口: ${PORT}`);
    console.log(`访问地址: http://127.0.0.1:${PORT}`);
    console.log(`日志目录: ${LOG_DIR}`);
    console.log("=".repeat(50));
});

// 优雅退出
process.on("SIGINT", () => {
    console.log("\n正在停止日志服务器...");
    process.exit();
});
