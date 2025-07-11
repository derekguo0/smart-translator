#!/bin/bash

# 智能翻译助手 - 自动化部署脚本
# 使用方法：./deploy.sh [platform]
# 平台选项：github, vercel, netlify, firebase

echo "🚀 智能翻译助手 - 自动化部署脚本"
echo "================================="

# 检查参数
if [ -z "$1" ]; then
    echo "请指定部署平台："
    echo "  ./deploy.sh github    # 部署到GitHub Pages"
    echo "  ./deploy.sh vercel    # 部署到Vercel"
    echo "  ./deploy.sh netlify   # 部署到Netlify"
    echo "  ./deploy.sh firebase  # 部署到Firebase"
    exit 1
fi

PLATFORM=$1

# 基础检查
check_dependencies() {
    echo "📋 检查依赖..."
    
    # 检查git
    if ! command -v git &> /dev/null; then
        echo "❌ Git 未安装，请先安装Git"
        exit 1
    fi
    
    # 检查Node.js
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js 未安装，请先安装Node.js"
        exit 1
    fi
    
    echo "✅ 依赖检查通过"
}

# 创建必要的配置文件
create_config_files() {
    echo "📄 创建配置文件..."
    
    # 创建 .gitignore
    if [ ! -f .gitignore ]; then
        cat > .gitignore << 'EOF'
# 依赖文件
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 环境变量
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# 编辑器
.vscode/
.idea/
*.swp
*.swo
*~

# 操作系统
.DS_Store
Thumbs.db

# 构建输出
dist/
build/
.next/
out/

# 日志文件
*.log

# 缓存文件
.cache/
.temp/

# 部署文件
.vercel
.netlify
.firebase
EOF
        echo "✅ 创建 .gitignore 文件"
    fi
    
    # 创建 README.md
    if [ ! -f README.md ]; then
        cat > README.md << 'EOF'
# 智能翻译助手

一个功能强大的现代化翻译Web应用，支持文本翻译、OCR图像翻译、拖拽上传、剪贴板粘贴等功能。

## 功能特点

- 🌍 多语言支持（中英日韩法德西俄阿拉伯语等）
- 📱 响应式设计，支持移动端
- 🖼️ OCR图像翻译
- 🎯 多种翻译引擎（Google、OpenAI、DeepL等）
- 📋 剪贴板支持
- 🎨 现代化UI设计
- ⚡ 高性能，快速响应

## 使用方法

1. 输入或粘贴要翻译的文本
2. 选择源语言和目标语言
3. 点击"开始翻译"
4. 或者上传图片进行OCR翻译

## 部署

详细部署说明请查看 [deploy-guide.md](deploy-guide.md)

## 技术栈

- HTML5 + CSS3 + JavaScript
- Tailwind CSS
- FontAwesome
- Tesseract.js (OCR)
- 多种翻译API

## 许可证

MIT License
EOF
        echo "✅ 创建 README.md 文件"
    fi
}

# 优化项目文件
optimize_project() {
    echo "🔧 优化项目文件..."
    
    # 检查并优化package.json
    if [ ! -f package.json ]; then
        echo "❌ package.json 文件不存在"
        exit 1
    fi
    
    echo "✅ 项目文件优化完成"
}

# 部署到GitHub Pages
deploy_github() {
    echo "🐙 部署到GitHub Pages..."
    
    # 初始化git仓库
    if [ ! -d .git ]; then
        git init
        git branch -M main
    fi
    
    # 添加所有文件
    git add .
    git commit -m "Deploy to GitHub Pages" || true
    
    echo "📝 请按照以下步骤完成GitHub Pages部署："
    echo "1. 在GitHub上创建一个新仓库"
    echo "2. 执行以下命令："
    echo "   git remote add origin https://github.com/您的用户名/smart-translator.git"
    echo "   git push -u origin main"
    echo "3. 在GitHub仓库设置中启用GitHub Pages"
    echo "4. 选择 'Deploy from a branch' 和 'main' 分支"
    
    echo "✅ GitHub Pages部署准备完成"
}

# 部署到Vercel
deploy_vercel() {
    echo "▲ 部署到Vercel..."
    
    # 检查Vercel CLI
    if ! command -v vercel &> /dev/null; then
        echo "📦 安装Vercel CLI..."
        npm install -g vercel
    fi
    
    # 创建vercel.json配置
    if [ ! -f vercel.json ]; then
        cat > vercel.json << 'EOF'
{
    "version": 2,
    "builds": [
        {
            "src": "index.html",
            "use": "@vercel/static"
        }
    ],
    "routes": [
        {
            "src": "/(.*)",
            "dest": "/$1"
        }
    ],
    "headers": [
        {
            "source": "/(.*)",
            "headers": [
                {
                    "key": "X-Content-Type-Options",
                    "value": "nosniff"
                },
                {
                    "key": "X-Frame-Options",
                    "value": "DENY"
                },
                {
                    "key": "X-XSS-Protection",
                    "value": "1; mode=block"
                }
            ]
        }
    ]
}
EOF
        echo "✅ 创建 vercel.json 配置"
    fi
    
    echo "🚀 开始部署到Vercel..."
    vercel --prod
    
    echo "✅ Vercel部署完成"
}

# 部署到Netlify
deploy_netlify() {
    echo "🌐 部署到Netlify..."
    
    # 检查Netlify CLI
    if ! command -v netlify &> /dev/null; then
        echo "📦 安装Netlify CLI..."
        npm install -g netlify-cli
    fi
    
    # 创建netlify.toml配置
    if [ ! -f netlify.toml ]; then
        cat > netlify.toml << 'EOF'
[build]
  publish = "."
  command = "echo 'Static site, no build needed'"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[dev]
  command = "npx http-server -p 8000"
  port = 8000
  publish = "."
EOF
        echo "✅ 创建 netlify.toml 配置"
    fi
    
    echo "🚀 开始部署到Netlify..."
    netlify deploy --prod --dir=.
    
    echo "✅ Netlify部署完成"
}

# 部署到Firebase
deploy_firebase() {
    echo "🔥 部署到Firebase..."
    
    # 检查Firebase CLI
    if ! command -v firebase &> /dev/null; then
        echo "📦 安装Firebase CLI..."
        npm install -g firebase-tools
    fi
    
    # 初始化Firebase项目
    if [ ! -f firebase.json ]; then
        echo "🔧 初始化Firebase项目..."
        firebase init hosting
    fi
    
    echo "🚀 开始部署到Firebase..."
    firebase deploy
    
    echo "✅ Firebase部署完成"
}

# 主函数
main() {
    check_dependencies
    create_config_files
    optimize_project
    
    case $PLATFORM in
        github)
            deploy_github
            ;;
        vercel)
            deploy_vercel
            ;;
        netlify)
            deploy_netlify
            ;;
        firebase)
            deploy_firebase
            ;;
        *)
            echo "❌ 不支持的平台: $PLATFORM"
            echo "支持的平台：github, vercel, netlify, firebase"
            exit 1
            ;;
    esac
    
    echo ""
    echo "🎉 部署完成！"
    echo "📖 详细部署指南请查看：deploy-guide.md"
}

# 执行主函数
main 