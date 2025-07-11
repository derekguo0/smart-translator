@echo off
chcp 65001 > nul
echo 🚀 智能翻译助手 - Windows部署脚本
echo ================================

if "%1"=="" (
    echo 请指定部署平台：
    echo   deploy.bat github    # 部署到GitHub Pages
    echo   deploy.bat vercel    # 部署到Vercel
    echo   deploy.bat netlify   # 部署到Netlify
    echo   deploy.bat firebase  # 部署到Firebase
    goto :eof
)

set PLATFORM=%1

echo 📋 检查依赖...

:: 检查Git
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git 未安装，请先安装Git
    echo 下载地址：https://git-scm.com/download/win
    pause
    exit /b 1
)

:: 检查Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js 未安装，请先安装Node.js
    echo 下载地址：https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ 依赖检查通过

echo 📄 创建配置文件...

:: 创建.gitignore
if not exist .gitignore (
    echo # 依赖文件 > .gitignore
    echo node_modules/ >> .gitignore
    echo npm-debug.log* >> .gitignore
    echo yarn-debug.log* >> .gitignore
    echo yarn-error.log* >> .gitignore
    echo. >> .gitignore
    echo # 环境变量 >> .gitignore
    echo .env >> .gitignore
    echo .env.local >> .gitignore
    echo .env.development.local >> .gitignore
    echo .env.test.local >> .gitignore
    echo .env.production.local >> .gitignore
    echo. >> .gitignore
    echo # 编辑器 >> .gitignore
    echo .vscode/ >> .gitignore
    echo .idea/ >> .gitignore
    echo *.swp >> .gitignore
    echo *.swo >> .gitignore
    echo *~ >> .gitignore
    echo. >> .gitignore
    echo # 操作系统 >> .gitignore
    echo .DS_Store >> .gitignore
    echo Thumbs.db >> .gitignore
    echo. >> .gitignore
    echo # 构建输出 >> .gitignore
    echo dist/ >> .gitignore
    echo build/ >> .gitignore
    echo .next/ >> .gitignore
    echo out/ >> .gitignore
    echo. >> .gitignore
    echo # 日志文件 >> .gitignore
    echo *.log >> .gitignore
    echo. >> .gitignore
    echo # 缓存文件 >> .gitignore
    echo .cache/ >> .gitignore
    echo .temp/ >> .gitignore
    echo. >> .gitignore
    echo # 部署文件 >> .gitignore
    echo .vercel >> .gitignore
    echo .netlify >> .gitignore
    echo .firebase >> .gitignore
    echo ✅ 创建 .gitignore 文件
)

if "%PLATFORM%"=="github" (
    echo 🐙 部署到GitHub Pages...
    
    :: 初始化git仓库
    if not exist .git (
        git init
        git branch -M main
    )
    
    :: 添加所有文件
    git add .
    git commit -m "Deploy to GitHub Pages" 2>nul
    
    echo 📝 请按照以下步骤完成GitHub Pages部署：
    echo 1. 在GitHub上创建一个新仓库
    echo 2. 执行以下命令：
    echo    git remote add origin https://github.com/您的用户名/smart-translator.git
    echo    git push -u origin main
    echo 3. 在GitHub仓库设置中启用GitHub Pages
    echo 4. 选择 'Deploy from a branch' 和 'main' 分支
    
    echo ✅ GitHub Pages部署准备完成
    goto :end
)

if "%PLATFORM%"=="vercel" (
    echo ▲ 部署到Vercel...
    
    :: 检查Vercel CLI
    vercel --version >nul 2>&1
    if errorlevel 1 (
        echo 📦 安装Vercel CLI...
        npm install -g vercel
    )
    
    :: 创建vercel.json配置
    if not exist vercel.json (
        echo { > vercel.json
        echo     "version": 2, >> vercel.json
        echo     "builds": [ >> vercel.json
        echo         { >> vercel.json
        echo             "src": "index.html", >> vercel.json
        echo             "use": "@vercel/static" >> vercel.json
        echo         } >> vercel.json
        echo     ], >> vercel.json
        echo     "routes": [ >> vercel.json
        echo         { >> vercel.json
        echo             "src": "/(.*)", >> vercel.json
        echo             "dest": "/$1" >> vercel.json
        echo         } >> vercel.json
        echo     ] >> vercel.json
        echo } >> vercel.json
        echo ✅ 创建 vercel.json 配置
    )
    
    echo 🚀 开始部署到Vercel...
    vercel --prod
    
    echo ✅ Vercel部署完成
    goto :end
)

if "%PLATFORM%"=="netlify" (
    echo 🌐 部署到Netlify...
    
    :: 检查Netlify CLI
    netlify --version >nul 2>&1
    if errorlevel 1 (
        echo 📦 安装Netlify CLI...
        npm install -g netlify-cli
    )
    
    echo 🚀 开始部署到Netlify...
    netlify deploy --prod --dir=.
    
    echo ✅ Netlify部署完成
    goto :end
)

if "%PLATFORM%"=="firebase" (
    echo 🔥 部署到Firebase...
    
    :: 检查Firebase CLI
    firebase --version >nul 2>&1
    if errorlevel 1 (
        echo 📦 安装Firebase CLI...
        npm install -g firebase-tools
    )
    
    :: 初始化Firebase项目
    if not exist firebase.json (
        echo 🔧 初始化Firebase项目...
        firebase init hosting
    )
    
    echo 🚀 开始部署到Firebase...
    firebase deploy
    
    echo ✅ Firebase部署完成
    goto :end
)

echo ❌ 不支持的平台: %PLATFORM%
echo 支持的平台：github, vercel, netlify, firebase

:end
echo.
echo 🎉 部署完成！
echo 📖 详细部署指南请查看：deploy-guide.md
pause 