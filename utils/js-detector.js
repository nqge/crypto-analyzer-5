const fs = require("fs");
const path = require("path");

class JSDetector {
    constructor(logDir) {
        this.logDir = logDir;
        this.patterns = {
            cryptojs: /CryptoJS|crypto-js/i,
            jsencrypt: /JSEncrypt|jsencrypt/i,
            webcrypto: /crypto\.subtle|window\.crypto/i,
            sm2: /sm2|SM2/i,
            sm3: /sm3|SM3/i,
            sm4: /sm4|SM4/i,
            base64: /btoa|atob|base64/i,
            md5: /MD5|md5/i,
            sha: /SHA|sha\d+/i,
            aes: /AES|aes/i,
            rsa: /RSA|rsa/i,
            hmac: /HMAC|hmac/i
        };
    }

    detectCryptoLibraries(content) {
        const detected = [];

        for (const [lib, pattern] of Object.entries(this.patterns)) {
            if (pattern.test(content)) {
                detected.push(lib);
            }
        }

        return detected;
    }

    analyzeFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, "utf8");
            const libs = this.detectCryptoLibraries(content);

            return {
                file: path.basename(filePath),
                libraries: libs,
                hasCrypto: libs.length > 0
            };
        } catch (error) {
            return {
                file: path.basename(filePath),
                error: error.message
            };
        }
    }

    scanDirectory(dir) {
        const results = [];

        if (!fs.existsSync(dir)) {
            return results;
        }

        const files = fs.readdirSync(dir);

        files.forEach(file => {
            if (file.endsWith(".js")) {
                const filePath = path.join(dir, file);
                const analysis = this.analyzeFile(filePath);
                results.push(analysis);
            }
        });

        return results;
    }

    generateReport(results) {
        const report = {
            totalFiles: results.length,
            cryptoFiles: results.filter(r => r.hasCrypto).length,
            libraries: {},
            details: results
        };

        // 统计加密库使用频率
        results.forEach(result => {
            if (result.hasCrypto) {
                result.libraries.forEach(lib => {
                    report.libraries[lib] = (report.libraries[lib] || 0) + 1;
                });
            }
        });

        return report;
    }
}

module.exports = JSDetector;
