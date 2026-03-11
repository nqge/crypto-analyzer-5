(function() {
    "use strict";

    console.log("🔄 Encoding Hook 已加载");

    // Hook btoa (Base64编码)
    const originalBtoa = window.btoa;
    window.btoa = function(data) {
        console.log("%c[btoa编码]", "color: #673ab7; font-weight: bold;");
        console.log("  原始数据:", data);
        console.log("  编码结果:", originalBtoa(data));
        console.trace("btoa 调用栈");

        if (window.cryptoAnalyzer) {
            cryptoAnalyzer.log("btoa", {
                data: data,
                encoded: originalBtoa(data)
            });
        }

        return originalBtoa.apply(this, arguments);
    };

    // Hook atob (Base64解码)
    const originalAtob = window.atob;
    window.atob = function(data) {
        console.log("%c[atob解码]", "color: #673ab7; font-weight: bold;");
        console.log("  编码数据:", data);
        console.log("  解码结果:", originalAtob(data));
        console.trace("atob 调用栈");

        if (window.cryptoAnalyzer) {
            cryptoAnalyzer.log("atob", {
                data: data,
                decoded: originalAtob(data)
            });
        }

        return originalAtob.apply(this, arguments);
    };

    // Hook encodeURIComponent
    const originalEncodeURIComponent = window.encodeURIComponent;
    window.encodeURIComponent = function(data) {
        const result = originalEncodeURIComponent.apply(this, arguments);

        if (data.length > 20) { // 只记录较长的编码
            console.log("%c[encodeURIComponent]", "color: #9c27b0;");
            console.log("  原始:", data);
            console.log("  编码:", result);
        }

        return result;
    };

    // Hook decodeURIComponent
    const originalDecodeURIComponent = window.decodeURIComponent;
    window.decodeURIComponent = function(data) {
        const result = originalDecodeURIComponent.apply(this, arguments);

        if (data.length > 20) { // 只记录较长的解码
            console.log("%c[decodeURIComponent]", "color: #9c27b0;");
            console.log("  编码:", data);
            console.log("  解码:", result);
        }

        return result;
    };

})();
