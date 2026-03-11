(function() {
    "use strict";

    console.log("🔗 API Hook 已加载");

    // Hook Fetch API
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const [url, options = {}] = args;

        console.log("%c[FETCH]", "color: #2196f3; font-weight: bold;", url);
        console.log("  Method:", options.method || "GET");
        console.log("  Headers:", options.headers);

        if (options.body) {
            console.log("  Body:", options.body);

            // 记录加密相关参数
            const bodyStr = JSON.stringify(options.body);
            if (bodyStr.includes("token") || bodyStr.includes("sign") || bodyStr.includes("password")) {
                console.warn("⚠️ 检测到敏感参数:", options.body);

                if (window.cryptoAnalyzer) {
                    cryptoAnalyzer.log("fetch_sensitive", {
                        url: url,
                        body: options.body
                    });
                }
            }
        }

        console.trace("Fetch 调用栈");

        return originalFetch.apply(this, args);
    };

    // Hook XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._cryptoMethod = method;
        this._cryptoUrl = url;
        return originalOpen.apply(this, [method, url, ...rest]);
    };

    XMLHttpRequest.prototype.send = function(data) {
        console.log("%c[XHR]", "color: #ff9800; font-weight: bold;", this._cryptoUrl);
        console.log("  Method:", this._cryptoMethod);

        if (data) {
            console.log("  Data:", data);

            // 检查敏感参数
            const dataStr = JSON.stringify(data);
            if (dataStr.includes("token") || dataStr.includes("sign") || dataStr.includes("password")) {
                console.warn("⚠️ XHR 检测到敏感参数:", data);

                if (window.cryptoAnalyzer) {
                    cryptoAnalyzer.log("xhr_sensitive", {
                        url: this._cryptoUrl,
                        data: data
                    });
                }
            }
        }

        console.trace("XHR 调用栈");

        return originalSend.apply(this, arguments);
    };

    // Hook WebSocket
    const originalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        console.log("%c[WebSocket]", "color: #9c27b0; font-weight: bold;", url);
        console.trace("WebSocket 调用栈");

        const ws = new originalWebSocket(url, protocols);

        // Hook send方法
        const originalWSSend = ws.send;
        ws.send = function(data) {
            console.log("[WebSocket Send]:", data);
            return originalWSSend.apply(this, arguments);
        };

        return ws;
    };

})();
