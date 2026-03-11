# Crypto Analyzer V5

## 📖 简介

**Crypto Analyzer V5** - JS 加密研究与调试框架

自动定位加密逻辑 + 记录关键参数 + 调试辅助

---

## ✨ 主要功能

- ✅ 自动识别加密算法（AES/RSA/SM2/SM4/HMAC/MD5）
- ✅ 自动定位加密函数调用位置
- ✅ 自动记录 token/sign 参数
- ✅ 自动保存所有 JS 文件
- ✅ Hook fetch/xhr/WebSocket
- ✅ Hook JSON.stringify/atob/btoa
- ✅ Console 调试辅助

---

## 📂 项目结构

```
crypto-analyzer-v5/
├── package.json           # 项目配置
├── proxy.js              # 代理服务器入口
├── rules/
│   └── rule.js           # 代理规则
├── hook/                 # 前端Hook脚本
│   ├── hook-entry.js     # Hook入口
│   ├── api-hook.js       # API Hook
│   ├── crypto-hook.js    # 加密Hook
│   ├── encoding-hook.js  # 编码Hook
│   └── debug-hook.js     # 调试Hook
├── server/
│   └── log_server.js     # 日志服务器
├── utils/                # 工具函数
│   ├── logger.js         # 日志工具
│   ├── js-detector.js    # JS检测工具
│   └── stack-trace.js    # 堆栈分析
└── logs/                 # 日志目录
    ├── js/               # JS文件
    ├── api/              # API日志
    └── crypto/           # 加密日志
```

---

## 🚀 安装

```bash
cd crypto-analyzer-v5
npm install
```

---

## 🎯 使用场景

1. **JS 加密算法逆向分析**
2. **前端加密逻辑定位**
3. HMAC token 提取
4. **Hook + 记录加密调用**
5. **Console 调试辅助**

---

## 📌 链接

- **仓库**：https://github.com/nqge/crypto-analyzer-5
- **作者**：（查看 README.md）
- **许可**：（查看 LICENSE 文件）

---

_更新时间：2026-03-11_
_来源：/root/crypto-analyzer-v5/_
_发布者：小牛🦞_
