(function() {
    "use strict";

    console.log("🔐 Crypto Hook 已加载");

    // Hook CryptoJS
    if (window.CryptoJS) {
        console.log("✓ 检测到 CryptoJS");

        // Hook AES
        if (CryptoJS.AES) {
            const originalAESEncrypt = CryptoJS.AES.encrypt;
            CryptoJS.AES.encrypt = function(data, key, options) {
                console.log("%c[AES加密]", "color: #f44336; font-weight: bold;");
                console.log("  明文:", data.toString());
                console.log("  密钥:", key.toString());
                if (options) console.log("  选项:", options);
                console.trace("AES 调用栈");

                if (window.cryptoAnalyzer) {
                    cryptoAnalyzer.log("aes_encrypt", {
                        plaintext: data.toString(),
                        key: key.toString(),
                        options: options
                    });
                }

                return originalAESEncrypt.apply(this, arguments);
            };

            const originalAESDecrypt = CryptoJS.AES.decrypt;
            CryptoJS.AES.decrypt = function(data, key, options) {
                console.log("%c[AES解密]", "color: #4caf50; font-weight: bold;");
                console.log("  密文:", data.toString());
                console.log("  密钥:", key.toString());
                console.trace("AES 解密调用栈");

                return originalAESDecrypt.apply(this, arguments);
            };
        }

        // Hook RSA (通过 JSEncrypt)
        if (window.JSEncrypt) {
            console.log("✓ 检测到 JSEncrypt (RSA)");

            const originalRSAEncrypt = JSEncrypt.prototype.encrypt;
            JSEncrypt.prototype.encrypt = function(data) {
                console.log("%c[RSA加密]", "color: #ff5722; font-weight: bold;");
                console.log("  明文:", data);
                console.trace("RSA 调用栈");

                if (window.cryptoAnalyzer) {
                    cryptoAnalyzer.log("rsa_encrypt", {
                        plaintext: data
                    });
                }

                return originalRSAEncrypt.apply(this, arguments);
            };
        }

        // Hook HMAC
        if (CryptoJS.HmacSHA256 || CryptoJS.HmacMD5) {
            const originalHmacSHA256 = CryptoJS.HmacSHA256;
            if (originalHmacSHA256) {
                CryptoJS.HmacSHA256 = function(data, key) {
                    console.log("%c[HMAC-SHA256]", "color: #3f51b5; font-weight: bold;");
                    console.log("  数据:", data.toString());
                    console.log("  密钥:", key.toString());
                    console.trace("HMAC 调用栈");

                    if (window.cryptoAnalyzer) {
                        cryptoAnalyzer.log("hmac_sha256", {
                            data: data.toString(),
                            key: key.toString()
                        });
                    }

                    return originalHmacSHA256.apply(this, arguments);
                };
            }
        }

        // Hook MD5
        if (CryptoJS.MD5) {
            const originalMD5 = CryptoJS.MD5;
            CryptoJS.MD5 = function(data) {
                console.log("%c[MD5]", "color: #607d8b; font-weight: bold;");
                console.log("  数据:", data.toString());
                console.trace("MD5 调用栈");

                if (window.cryptoAnalyzer) {
                    cryptoAnalyzer.log("md5", {
                        data: data.toString()
                    });
                }

                return originalMD5.apply(this, arguments);
            };
        }
    }

    // Hook Web Crypto API
    if (window.crypto && window.crypto.subtle) {
        console.log("✓ 检测到 Web Crypto API");

        const originalSubtleEncrypt = crypto.subtle.encrypt.bind(crypto.subtle);
        crypto.subtle.encrypt = function(algorithm, key, data) {
            console.log("%c[WebCrypto加密]", "color: #e91e63; font-weight: bold;");
            console.log("  算法:", algorithm);
            console.log("  数据长度:", data.byteLength);
            console.trace("WebCrypto 调用栈");

            if (window.cryptoAnalyzer) {
                cryptoAnalyzer.log("webcrypto_encrypt", {
                    algorithm: algorithm,
                    dataLength: data.byteLength
                });
            }

            return originalSubtleEncrypt(algorithm, key, data);
        };
    }

    // Hook 国密算法 (SM2/SM3/SM4)
    if (window.sm2 || window.sm3 || window.sm4) {
        console.log("✓ 检测到 国密算法");

        if (window.sm2) {
            const originalSM2 = window.sm2.doEncrypt;
            if (originalSM2) {
                window.sm2.doEncrypt = function(data, publicKey) {
                    console.log("%c[SM2加密]", "color: #00bcd4; font-weight: bold;");
                    console.log("  明文:", data);
                    console.trace("SM2 调用栈");

                    if (window.cryptoAnalyzer) {
                        cryptoAnalyzer.log("sm2_encrypt", {
                            data: data
                        });
                    }

                    return originalSM2.apply(this, arguments);
                };
            }
        }

        if (window.sm4) {
            const originalSM4 = window.sm4.encrypt;
            if (originalSM4) {
                window.sm4.encrypt = function(data, key) {
                    console.log("%c[SM4加密]", "color: #00bcd4; font-weight: bold;");
                    console.log("  明文:", data);
                    console.trace("SM4 调用栈");

                    if (window.cryptoAnalyzer) {
                        cryptoAnalyzer.log("sm4_encrypt", {
                            data: data,
                            key: key
                        });
                    }

                    return originalSM4.apply(this, arguments);
                };
            }
        }
    }

})();
