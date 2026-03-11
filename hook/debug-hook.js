(function() {
    "use strict";

    console.log("🐛 Debug Hook 已加载");

    // Hook JSON.stringify
    const jsonStringify = JSON.stringify;
    JSON.stringify = function(obj, replacer, space) {
        const result = jsonStringify(obj, replacer, space);

        // 检测敏感数据
        if (typeof obj === "object" && obj !== null) {
            const objStr = JSON.stringify(obj);

            if (objStr.includes("password") || objStr.includes("token") || objStr.includes("sign") || objStr.includes("secret")) {
                console.log("%c[JSON.stringify 检测到敏感数据]", "color: #f44336; font-weight: bold;");
                console.log("  对象:", obj);
                console.log("  序列化结果:", result);
                console.trace("JSON.stringify 调用栈");

                if (window.cryptoAnalyzer) {
                    cryptoAnalyzer.log("json_sensitive", {
                        object: obj,
                        result: result
                    });
                }
            }
        }

        return result;
    };

    // Hook JSON.parse
    const jsonParse = JSON.parse;
    JSON.parse = function(text, reviver) {
        const result = jsonParse(text, reviver);

        // 检测敏感数据
        const textLower = text.toLowerCase();
        if (textLower.includes("password") || textLower.includes("token") || textLower.includes("sign")) {
            console.log("%c[JSON.parse 解析敏感数据]", "color: #ff9800; font-weight: bold;");
            console.log("  原始:", text);
            console.log("  解析结果:", result);
        }

        return result;
    };

    // 增强console
    const originalConsole = {
        log: console.log.bind(console),
        warn: console.warn.bind(console),
        error: console.error.bind(console)
    };

    // 监控console中的敏感信息
    console.log = function(...args) {
        const output = args.map(arg => {
            if (typeof arg === "string") {
                if (arg.toLowerCase().includes("password") ||
                    arg.toLowerCase().includes("token") ||
                    arg.toLowerCase().includes("sign")) {
                    console.warn("%c[检测到敏感信息输出]", "color: #f44336;", arg);
                }
            }
            return arg;
        });

        originalConsole.log.apply(console, output);
    };

    // 提供加密函数查找工具
    window.findCryptoFunctions = function() {
        console.log("%c=== 加密函数扫描 ===", "color: #00ff00; font-size: 14px; font-weight: bold;");

        const cryptoLibs = {
            "CryptoJS": window.CryptoJS,
            "JSEncrypt": window.JSEncrypt,
            "WebCrypto": window.crypto?.subtle,
            "SM2": window.sm2,
            "SM3": window.sm3,
            "SM4": window.sm4
        };

        for (const [name, lib] of Object.entries(cryptoLibs)) {
            if (lib) {
                console.log(`✓ ${name}: 已加载`);

                if (typeof lib === "object") {
                    const methods = [];
                    for (const prop in lib) {
                        if (typeof lib[prop] === "function") {
                            methods.push(prop);
                        }
                    }
                    if (methods.length > 0) {
                        console.log(`  可用方法: ${methods.join(", ")}`);
                    }
                }
            } else {
                console.log(`✗ ${name}: 未检测到`);
            }
        }
    };

    // 提供快速调试函数
    window.debugCrypto = function(funcName) {
        const path = funcName.split(".");
        let obj = window;

        for (const part of path) {
            if (obj && obj[part]) {
                obj = obj[part];
            } else {
                console.error(`未找到函数: ${funcName}`);
                return;
            }
        }

        if (typeof obj === "function") {
            console.log(`%c已设置断点: ${funcName}`, "color: #00ff00; font-weight: bold;");
            debugger;
        } else {
            console.error(`${funcName} 不是一个函数`);
        }
    };

    // 自动检测加密库
    setTimeout(() => {
        findCryptoFunctions();
    }, 2000);

})();
