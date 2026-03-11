(function() {
    "use strict";

    console.log("%c=Crypto Analyzer V5 Loaded=", "color: #00ff00; font-size: 16px; font-weight: bold;");
    console.log("%c主要功能:", "color: #ff9800; font-weight: bold;");
    console.log("  ✓ 自动识别 AES/RSA/SM2/SM4/HMAC/MD5");
    console.log("  ✓ 自动定位加密函数调用位置");
    console.log("  ✓ 自动记录 token/sign 参数");
    console.log("  ✓ Hook fetch/xhr/WebSocket");
    console.log("  ✓ Hook JSON.stringify/atob/btoa");
    console.log("  ✓ Console 调试辅助");
    console.log("%c使用方法: debug(CryptoJS.AES.encrypt)", "color: #2196f3;");

    // Hook脚本列表
    const hookScripts = [
        "api-hook.js",
        "crypto-hook.js",
        "encoding-hook.js",
        "debug-hook.js"
    ];

    // 动态加载Hook脚本
    hookScripts.forEach(function(script) {
        const scriptEl = document.createElement("script");
        scriptEl.src = script;
        scriptEl.onload = function() {
            console.log(`✓ ${script} 加载完成`);
        };
        scriptEl.onerror = function() {
            console.error(`✗ ${script} 加载失败`);
        };
        (document.head || document.documentElement).appendChild(scriptEl);
    });

    // 提供全局调试函数
    window.cryptoAnalyzer = {
        version: "5.0.0",
        logs: [],

        // 记录日志
        log: function(type, data) {
            const logEntry = {
                timestamp: new Date().toISOString(),
                type: type,
                data: data
            };
            this.logs.push(logEntry);

            // 发送到日志服务器
            fetch("http://127.0.0.1:9000/log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(logEntry)
            }).catch(() => {});
        },

        // 获取所有日志
        getLogs: function() {
            return this.logs;
        },

        // 清空日志
        clearLogs: function() {
            this.logs = [];
        }
    };

})();
