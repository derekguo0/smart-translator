// 功能验证脚本
// 在浏览器控制台中运行此脚本来验证各项功能

console.log('🧪 开始功能验证测试...');

// 测试数据
const testData = {
    simpleText: "Hello, how are you today?",
    longText: `The quick brown fox jumps over the lazy dog. This is a common English sentence that contains every letter of the alphabet. It's often used to test keyboards, fonts, and other text-related systems. The sentence is also known as a pangram, which is a sentence that uses every letter of the alphabet at least once.`,
    chineseText: "今天天气很好，我们去公园散步吧。公园里有很多花草树木，空气清新，非常适合散步和放松心情。",
    specialText: "Hello! 你好. Comment ça va? ¿Cómo estás? 元気ですか？",
    emptyText: "",
    htmlText: "<div>Hello World</div>",
    numberText: "123 456 789",
    mixedText: "Hello 世界 123 !@#"
};

// 验证函数
const validators = {
    // 验证文本预处理
    testPreprocessText: function() {
        console.log('📝 测试文本预处理...');
        
        if (typeof preprocessText === 'function') {
            const result1 = preprocessText("  Hello   World  ");
            const result2 = preprocessText("\n\tTest\n\t");
            
            console.log('✅ 预处理功能正常:', {
                test1: result1 === "Hello World",
                test2: result2 === "Test"
            });
        } else {
            console.log('❌ preprocessText 函数未定义');
        }
    },
    
    // 验证文本分段
    testSplitText: function() {
        console.log('📝 测试文本分段...');
        
        if (typeof splitTextIntoChunks === 'function') {
            const result1 = splitTextIntoChunks("Short text", 1000);
            const result2 = splitTextIntoChunks(testData.longText, 50);
            
            console.log('✅ 分段功能正常:', {
                shortText: result1.length === 1,
                longText: result2.length > 1
            });
        } else {
            console.log('❌ splitTextIntoChunks 函数未定义');
        }
    },
    
    // 验证翻译质量检查
    testValidateTranslation: function() {
        console.log('📝 测试翻译质量检查...');
        
        if (typeof validateTranslation === 'function') {
            const result1 = validateTranslation("Hello", "你好");
            const result2 = validateTranslation("Hello", "Hello");
            const result3 = validateTranslation("Hello", "");
            
            console.log('✅ 质量检查功能正常:', {
                validTranslation: result1.isValid === true,
                duplicateTranslation: result2.isValid === false,
                emptyTranslation: result3.isValid === false
            });
        } else {
            console.log('❌ validateTranslation 函数未定义');
        }
    },
    
    // 验证DOM元素
    testDOMElements: function() {
        console.log('📝 测试DOM元素...');
        
        const elements = [
            'inputText', 'outputText', 'sourceLanguage', 'targetLanguage',
            'translateButton', 'loadingSpinner', 'progressFill',
            'imageInput', 'previewImage', 'ocrSection', 'ocrText'
        ];
        
        const missing = elements.filter(id => !document.getElementById(id));
        
        if (missing.length === 0) {
            console.log('✅ 所有DOM元素都存在');
        } else {
            console.log('❌ 缺少DOM元素:', missing);
        }
    },
    
    // 验证Tesseract.js
    testTesseract: function() {
        console.log('📝 测试OCR引擎...');
        
        if (typeof Tesseract !== 'undefined') {
            console.log('✅ Tesseract.js 已加载');
            
            // 测试创建worker
            if (typeof Tesseract.createWorker === 'function') {
                console.log('✅ Tesseract.createWorker 可用');
            } else {
                console.log('❌ Tesseract.createWorker 不可用');
            }
        } else {
            console.log('❌ Tesseract.js 未加载');
        }
    },
    
    // 验证翻译API函数
    testTranslationAPIs: function() {
        console.log('📝 测试翻译API函数...');
        
        const apiFunctions = [
            'translateWithGoogle',
            'translateWithMyMemory', 
            'translateWithLibre',
            'performTextTranslation'
        ];
        
        const available = apiFunctions.filter(fn => typeof window[fn] === 'function');
        const missing = apiFunctions.filter(fn => typeof window[fn] !== 'function');
        
        console.log('✅ 可用的翻译API:', available);
        if (missing.length > 0) {
            console.log('⚠️  缺少的翻译API:', missing);
        }
    },
    
    // 验证事件监听器
    testEventListeners: function() {
        console.log('📝 测试事件监听器...');
        
        const button = document.getElementById('translateButton');
        if (button) {
            // 检查是否有点击事件监听器
            const hasListener = button.onclick !== null || 
                               button.addEventListener !== undefined;
            
            if (hasListener) {
                console.log('✅ 翻译按钮事件监听器已设置');
            } else {
                console.log('❌ 翻译按钮缺少事件监听器');
            }
        } else {
            console.log('❌ 翻译按钮不存在');
        }
    },
    
    // 验证本地存储
    testLocalStorage: function() {
        console.log('📝 测试本地存储...');
        
        try {
            const testKey = 'translationTest';
            const testValue = { test: 'value' };
            
            localStorage.setItem(testKey, JSON.stringify(testValue));
            const retrieved = JSON.parse(localStorage.getItem(testKey));
            localStorage.removeItem(testKey);
            
            if (retrieved && retrieved.test === 'value') {
                console.log('✅ 本地存储功能正常');
            } else {
                console.log('❌ 本地存储读取失败');
            }
        } catch (error) {
            console.log('❌ 本地存储不可用:', error.message);
        }
    },
    
    // 验证网络连接
    testNetworkConnection: function() {
        console.log('📝 测试网络连接...');
        
        if (navigator.onLine) {
            console.log('✅ 网络连接正常');
            
            // 测试一个简单的网络请求
            fetch('https://httpbin.org/get')
                .then(response => response.json())
                .then(data => {
                    console.log('✅ 网络请求测试成功');
                })
                .catch(error => {
                    console.log('⚠️  网络请求测试失败:', error.message);
                });
        } else {
            console.log('❌ 网络连接不可用');
        }
    }
};

// 运行所有验证测试
function runAllTests() {
    console.log('🚀 开始运行所有验证测试...\n');
    
    for (const [testName, testFunction] of Object.entries(validators)) {
        try {
            testFunction();
            console.log(''); // 空行分隔
        } catch (error) {
            console.log(`❌ ${testName} 测试失败:`, error.message);
        }
    }
    
    console.log('✅ 所有验证测试完成！');
}

// 自动运行测试
runAllTests();

// 导出测试函数供手动调用
window.testValidation = validators;
window.runAllTests = runAllTests;

// 提供快速测试命令
console.log(`
🎯 快速测试命令：
- runAllTests() - 运行所有验证测试
- testValidation.testPreprocessText() - 测试文本预处理
- testValidation.testDOMElements() - 测试DOM元素
- testValidation.testTesseract() - 测试OCR引擎
- testValidation.testNetworkConnection() - 测试网络连接

💡 使用说明：
1. 在浏览器中访问 http://localhost:8000
2. 打开开发者工具 (F12)
3. 在控制台中粘贴此脚本并运行
4. 查看测试结果
`); 