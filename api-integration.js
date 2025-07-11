// API集成示例
// 此文件展示如何将真实的翻译和OCR服务集成到应用中

// ==================== OCR服务集成 ====================

// 1. Google Cloud Vision API集成
class GoogleVisionOCR {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://vision.googleapis.com/v1/images:annotate';
    }

    async extractText(imageFile) {
        try {
            // 将图片转换为Base64
            const base64Image = await this.fileToBase64(imageFile);
            
            const requestBody = {
                requests: [{
                    image: {
                        content: base64Image
                    },
                    features: [{
                        type: 'TEXT_DETECTION',
                        maxResults: 1
                    }]
                }]
            };

            const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();
            
            if (result.responses && result.responses[0].textAnnotations) {
                return result.responses[0].textAnnotations[0].description;
            }
            
            throw new Error('无法从图片中提取文本');
        } catch (error) {
            console.error('OCR错误:', error);
            throw error;
        }
    }

    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                // 移除data:image/xxx;base64,前缀
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}

// 2. Tesseract.js客户端OCR集成
class TesseractOCR {
    constructor() {
        this.isLoaded = false;
    }

    async loadTesseract() {
        if (this.isLoaded) return;
        
        // 动态加载Tesseract.js
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js';
        document.head.appendChild(script);
        
        return new Promise((resolve) => {
            script.onload = () => {
                this.isLoaded = true;
                resolve();
            };
        });
    }

    async extractText(imageFile, languages = 'eng+chi_sim') {
        try {
            await this.loadTesseract();
            
            const { createWorker } = Tesseract;
            const worker = createWorker();
            
            await worker.load();
            await worker.loadLanguage(languages);
            await worker.initialize(languages);
            
            const { data: { text } } = await worker.recognize(imageFile);
            await worker.terminate();
            
            return text.trim();
        } catch (error) {
            console.error('Tesseract OCR错误:', error);
            throw error;
        }
    }
}

// ==================== 翻译服务集成 ====================

// 1. Google Translate API集成
class GoogleTranslate {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://translation.googleapis.com/language/translate/v2';
    }

    async translateText(text, targetLanguage, sourceLanguage = 'auto') {
        try {
            const params = new URLSearchParams({
                key: this.apiKey,
                q: text,
                target: targetLanguage,
                format: 'text'
            });

            if (sourceLanguage !== 'auto') {
                params.append('source', sourceLanguage);
            }

            const response = await fetch(`${this.baseUrl}?${params}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });

            const result = await response.json();
            
            if (result.data && result.data.translations) {
                return {
                    translatedText: result.data.translations[0].translatedText,
                    detectedSourceLanguage: result.data.translations[0].detectedSourceLanguage
                };
            }
            
            throw new Error('翻译失败');
        } catch (error) {
            console.error('Google翻译错误:', error);
            throw error;
        }
    }

    async detectLanguage(text) {
        try {
            const params = new URLSearchParams({
                key: this.apiKey,
                q: text
            });

            const response = await fetch(`${this.baseUrl}/detect?${params}`, {
                method: 'POST'
            });

            const result = await response.json();
            
            if (result.data && result.data.detections) {
                return result.data.detections[0][0].language;
            }
            
            throw new Error('语言检测失败');
        } catch (error) {
            console.error('语言检测错误:', error);
            throw error;
        }
    }
}

// 2. OpenAI GPT翻译集成
class OpenAITranslate {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.openai.com/v1/chat/completions';
    }

    async translateText(text, targetLanguage, sourceLanguage = 'auto') {
        try {
            const languageNames = {
                'en': 'English',
                'zh': 'Chinese',
                'ja': 'Japanese',
                'ko': 'Korean',
                'fr': 'French',
                'de': 'German',
                'es': 'Spanish',
                'ru': 'Russian',
                'ar': 'Arabic'
            };

            const targetLangName = languageNames[targetLanguage] || targetLanguage;
            
            const prompt = `请将以下文本翻译成${targetLangName}，保持原文的语气和风格，确保翻译自然流畅：\n\n${text}`;

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 1000,
                    temperature: 0.3
                })
            });

            const result = await response.json();
            
            if (result.choices && result.choices[0]) {
                return {
                    translatedText: result.choices[0].message.content.trim(),
                    detectedSourceLanguage: sourceLanguage
                };
            }
            
            throw new Error('OpenAI翻译失败');
        } catch (error) {
            console.error('OpenAI翻译错误:', error);
            throw error;
        }
    }
}

// 3. DeepL API集成
class DeepLTranslate {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api-free.deepl.com/v2/translate';
    }

    async translateText(text, targetLanguage, sourceLanguage = 'auto') {
        try {
            const formData = new FormData();
            formData.append('text', text);
            formData.append('target_lang', targetLanguage.toUpperCase());
            
            if (sourceLanguage !== 'auto') {
                formData.append('source_lang', sourceLanguage.toUpperCase());
            }

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `DeepL-Auth-Key ${this.apiKey}`
                },
                body: formData
            });

            const result = await response.json();
            
            if (result.translations && result.translations[0]) {
                return {
                    translatedText: result.translations[0].text,
                    detectedSourceLanguage: result.translations[0].detected_source_language
                };
            }
            
            throw new Error('DeepL翻译失败');
        } catch (error) {
            console.error('DeepL翻译错误:', error);
            throw error;
        }
    }
}

// ==================== 翻译服务管理器 ====================

class TranslationManager {
    constructor() {
        this.ocrService = null;
        this.translateService = null;
        this.config = {
            // 在这里配置您的API密钥
            googleApiKey: 'YOUR_GOOGLE_API_KEY',
            openaiApiKey: 'YOUR_OPENAI_API_KEY',
            deeplApiKey: 'YOUR_DEEPL_API_KEY',
            preferredOCR: 'tesseract', // 'google' 或 'tesseract'
            preferredTranslate: 'google' // 'google', 'openai', 或 'deepl'
        };
    }

    async initializeServices() {
        // 初始化OCR服务
        if (this.config.preferredOCR === 'google' && this.config.googleApiKey) {
            this.ocrService = new GoogleVisionOCR(this.config.googleApiKey);
        } else {
            this.ocrService = new TesseractOCR();
        }

        // 初始化翻译服务
        switch (this.config.preferredTranslate) {
            case 'google':
                if (this.config.googleApiKey) {
                    this.translateService = new GoogleTranslate(this.config.googleApiKey);
                }
                break;
            case 'openai':
                if (this.config.openaiApiKey) {
                    this.translateService = new OpenAITranslate(this.config.openaiApiKey);
                }
                break;
            case 'deepl':
                if (this.config.deeplApiKey) {
                    this.translateService = new DeepLTranslate(this.config.deeplApiKey);
                }
                break;
        }
    }

    async performOCR(imageFile) {
        if (!this.ocrService) {
            throw new Error('OCR服务未初始化');
        }
        
        return await this.ocrService.extractText(imageFile);
    }

    async performTranslation(text, targetLanguage, sourceLanguage = 'auto') {
        if (!this.translateService) {
            throw new Error('翻译服务未初始化');
        }
        
        return await this.translateService.translateText(text, targetLanguage, sourceLanguage);
    }

    async translateImage(imageFile, targetLanguage, sourceLanguage = 'auto') {
        try {
            // 先进行OCR
            const extractedText = await this.performOCR(imageFile);
            
            if (!extractedText.trim()) {
                throw new Error('无法从图片中提取文本');
            }
            
            // 再进行翻译
            const translationResult = await this.performTranslation(
                extractedText, 
                targetLanguage, 
                sourceLanguage
            );
            
            return {
                originalText: extractedText,
                translatedText: translationResult.translatedText,
                detectedSourceLanguage: translationResult.detectedSourceLanguage
            };
        } catch (error) {
            console.error('图片翻译错误:', error);
            throw error;
        }
    }
}

// ==================== 使用示例 ====================

// 使用示例：集成到现有应用中
async function integrateRealAPIs() {
    // 1. 创建翻译管理器实例
    const translationManager = new TranslationManager();
    
    // 2. 配置API密钥（请替换为您的实际密钥）
    translationManager.config.googleApiKey = 'YOUR_ACTUAL_GOOGLE_API_KEY';
    translationManager.config.openaiApiKey = 'YOUR_ACTUAL_OPENAI_API_KEY';
    translationManager.config.deeplApiKey = 'YOUR_ACTUAL_DEEPL_API_KEY';
    
    // 3. 初始化服务
    await translationManager.initializeServices();
    
    // 4. 替换现有的performTranslation函数
    window.performTranslation = async function(text, hasImage) {
        // 显示加载状态
        loadingSpinner.classList.remove('hidden');
        outputSection.classList.add('hidden');
        translateButton.disabled = true;
        
        const startTime = Date.now();
        
        try {
            let result;
            
            if (hasImage) {
                // 图片翻译
                const imageFile = imageInput.files[0];
                result = await translationManager.translateImage(
                    imageFile,
                    targetLanguage.value,
                    sourceLanguage.value
                );
                
                // 显示结果
                outputText.value = result.translatedText;
                
                // 可选：显示原始提取的文本
                if (result.originalText) {
                    inputText.value = result.originalText;
                }
            } else {
                // 文本翻译
                result = await translationManager.performTranslation(
                    text,
                    targetLanguage.value,
                    sourceLanguage.value
                );
                
                // 显示结果
                outputText.value = result.translatedText;
            }
            
            // 显示输出区域
            outputSection.classList.remove('hidden');
            
            // 更新统计信息
            const endTime = Date.now();
            const duration = ((endTime - startTime) / 1000).toFixed(2);
            document.getElementById('translationTime').textContent = `${duration}s`;
            document.getElementById('confidence').textContent = '98%';
            
            showToast('翻译完成', 'success');
            
        } catch (error) {
            showToast(`翻译失败: ${error.message}`, 'error');
            console.error('翻译错误:', error);
        } finally {
            loadingSpinner.classList.add('hidden');
            translateButton.disabled = false;
        }
    };
    
    console.log('API集成完成');
}

// ==================== 初始化 ====================

// 页面加载完成后自动初始化API集成
document.addEventListener('DOMContentLoaded', async function() {
    try {
        await integrateRealAPIs();
    } catch (error) {
        console.error('API集成失败:', error);
        showToast('API集成失败，使用模拟数据', 'error');
    }
});

// 导出模块（如果使用ES6模块）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GoogleVisionOCR,
        TesseractOCR,
        GoogleTranslate,
        OpenAITranslate,
        DeepLTranslate,
        TranslationManager
    };
} 