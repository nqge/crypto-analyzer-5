const fs = require("fs");
const path = require("path");

// 读取注入脚本
const hookScript = fs.readFileSync(
    path.join(__dirname, "../hook/hook-entry.js"),
    "utf8"
);

// 确保日志目录存在
const logDirs = {
    js: path.join(__dirname, "../logs/js"),
    api: path.join(__dirname, "../logs/api"),
    crypto: path.join(__dirname, "../logs/crypto")
};

Object.values(logDirs).forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

module.exports = {
    summary: "Crypto Analyzer V5 - JS加密研究与调试框架",

    // 请求发送前
    *beforeSendRequest(requestDetail) {
        const url = requestDetail.url;

        // 保存JS文件
        if (url.endsWith(".js") || url.includes(".js?")) {
            try {
                const timestamp = Date.now();
                const filename = `${timestamp}_${url.split('/').pop().split('?')[0]}.js`;
                const filepath = path.join(logDirs.js, filename);

                fs.writeFileSync(filepath, requestDetail.requestData || "");
                console.log(`[JS保存] ${filename}`);
            } catch (err) {
                console.error("[JS保存失败]", err.message);
            }
        }

        return null;
    },

    // 响应发送前
    *beforeSendResponse(requestDetail, responseDetail) {
        const contentType = responseDetail.response.header["content-type"] || "";

        // 注入Hook脚本到HTML页面
        if (contentType.includes("text/html")) {
            try {
                let body = responseDetail.response.body.toString();

                // 在</head>前注入脚本
                body = body.replace(
                    /<\/head>/i,
                    `<script>${hookScript}</script></head>`
                );

                responseDetail.response.body = Buffer.from(body);
                console.log(`[Hook注入] ${requestDetail.url}`);
            } catch (err) {
                console.error("[Hook注入失败]", err.message);
            }
        }

        return responseDetail;
    }
};
