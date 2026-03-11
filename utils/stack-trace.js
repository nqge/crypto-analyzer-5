/**
 * 堆栈跟踪工具
 * 用于解析和格式化JavaScript堆栈信息
 */

class StackTrace {
    /**
     * 解析堆栈信息
     * @param {Error} error - 错误对象
     * @returns {Array} 解析后的堆栈帧数组
     */
    static parse(error) {
        if (!error || !error.stack) {
            return [];
        }

        const stack = error.stack;
        const lines = stack.split("\n");
        const frames = [];

        // 跳过第一行（错误消息）
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const frame = StackTrace.parseLine(line);
            if (frame) {
                frames.push(frame);
            }
        }

        return frames;
    }

    /**
     * 解析单行堆栈信息
     * @param {string} line - 堆栈行
     * @returns {Object|null} 堆栈帧对象
     */
    static parseLine(line) {
        // 匹配常见的堆栈格式: at functionName (file:line:column)
        const match1 = line.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)$/);
        if (match1) {
            return {
                function: match1[1],
                file: match1[2],
                line: parseInt(match1[3]),
                column: parseInt(match1[4])
            };
        }

        // 匹配简化格式: at file:line:column
        const match2 = line.match(/at\s+(.+?):(\d+):(\d+)$/);
        if (match2) {
            return {
                function: "(anonymous)",
                file: match2[1],
                line: parseInt(match2[2]),
                column: parseInt(match2[3])
            };
        }

        // 匹配 eval 代码
        const match3 = line.match(/eval\s+(.+?)/);
        if (match3) {
            return {
                function: "eval",
                file: match3[1],
                line: null,
                column: null
            };
        }

        return null;
    }

    /**
     * 格式化堆栈信息为易读文本
     * @param {Array} frames - 堆栈帧数组
     * @returns {string} 格式化后的文本
     */
    static format(frames) {
        if (!frames || frames.length === 0) {
            return "无堆栈信息";
        }

        const lines = frames.map((frame, index) => {
            return `  ${index + 1}. ${frame.function} (${frame.file}:${frame.line}:${frame.column})`;
        });

        return "调用栈:\n" + lines.join("\n");
    }

    /**
     * 过滤堆栈帧
     * @param {Array} frames - 堆栈帧数组
     * @param {Function} predicate - 过滤函数
     * @returns {Array} 过滤后的堆栈帧数组
     */
    static filter(frames, predicate) {
        return frames.filter(predicate);
    }

    /**
     * 查找特定函数的调用
     * @param {Array} frames - 堆栈帧数组
     * @param {string} functionName - 函数名
     * @returns {Object|null} 找到的堆栈帧
     */
    static findFunction(frames, functionName) {
        return frames.find(frame => frame.function === functionName);
    }

    /**
     * 获取应用代码调用栈（排除系统库）
     * @param {Array} frames - 堆栈帧数组
     * @returns {Array} 应用代码堆栈帧数组
     */
    static getAppFrames(frames) {
        return frames.filter(frame => {
            return !frame.file.includes("node_modules") &&
                   !frame.file.includes("vendor") &&
                   !frame.file.includes("cdn");
        });
    }

    /**
     * 获取加密相关的调用栈
     * @param {Array} frames - 堆栈帧数组
     * @returns {Object} 加密调用分析结果
     */
    static analyzeCryptoCalls(frames) {
        const cryptoKeywords = [
            "encrypt", "decrypt", "sign", "hash",
            "AES", "RSA", "MD5", "SHA", "HMAC",
            "crypto", "cipher"
        ];

        const cryptoFrames = frames.filter(frame => {
            return cryptoKeywords.some(keyword =>
                frame.function.includes(keyword) ||
                frame.file.includes(keyword)
            );
        });

        return {
            hasCryptoCall: cryptoFrames.length > 0,
            cryptoFrames: cryptoFrames,
            firstCryptoFrame: cryptoFrames[0] || null
        };
    }
}

module.exports = StackTrace;
