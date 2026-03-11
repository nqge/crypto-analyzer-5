const AnyProxy = require("anyproxy");

const options = {
    port: 10086,
    rule: require("./rules/rule"),
    webInterface: {
        enable: true,
        webPort: 8002
    },
    forceProxyHttps: true,
    silent: false
};

const proxyServer = new AnyProxy.ProxyServer(options);

proxyServer.on("ready", () => {
    console.log("=".repeat(50));
    console.log("Crypto Analyzer V5 启动成功");
    console.log("代理地址: 127.0.0.1:10086");
    console.log("管理界面: http://127.0.0.1:8002");
    console.log("证书下载: http://127.0.0.1:8002/fetchCrtFile");
    console.log("=".repeat(50));
});

proxyServer.on("error", (e) => {
    console.error("代理错误:", e);
});

proxyServer.start();

process.on("SIGINT", () => {
    console.log("\n正在停止代理...");
    proxyServer.close();
    process.exit();
});
