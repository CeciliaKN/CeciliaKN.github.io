/**
 * 网站Header组件
 * 统一管理所有页面的header部分
 */
class HeaderComponent {
    constructor(options = {}) {
        this.options = {
            // 当前语言
            currentLang: 'cn',
            // 是否显示返回按钮
            showBackButton: false,
            // 返回按钮链接
            backButtonUrl: '/src/cn/real/ind.html',
            // 返回按钮文本
            backButtonText: '返回',
            // 搜索框占位符
            searchPlaceholder: '搜索页面...',
            // 自定义按钮配置
            customButtons: [],
            ...options
        };
        
        this.initPaths();
    }

    // 初始化路径配置
    initPaths() {
        // 根据当前页面路径自动检测语言和相对路径
        const currentPath = window.location.pathname;
        const pathSegments = currentPath.split('/');
        
        // 检测语言
        if (pathSegments.includes('cn')) {
            this.options.currentLang = 'cn';
        } else if (pathSegments.includes('jp')) {
            this.options.currentLang = 'jp';
        } else if (pathSegments.includes('en')) {
            this.options.currentLang = 'en';
        } else if (pathSegments.includes('la')) {
            this.options.currentLang = 'la';
        }

        // 计算相对路径深度
        this.pathPrefix = this.calculatePathPrefix(currentPath);
    }

    // 计算路径前缀
    calculatePathPrefix(path) {
        // 计算从当前页面到根目录的相对路径
        const depth = path.split('/').filter(segment => segment && segment !== 'index.html').length - 1;
        return depth > 0 ? '../'.repeat(depth) : './';
    }

    // 生成header HTML
    generateHTML() {
        const { currentLang, showBackButton, backButtonUrl, backButtonText, searchPlaceholder } = this.options;
        
        return `
        <header>
            <div class="header-left">
                <div class="language-switcher">
                    <button class="lang-btn ${currentLang === 'cn' ? 'active' : ''}" data-lang="cn">CN</button>
                    <button class="lang-btn ${currentLang === 'jp' ? 'active' : ''}" data-lang="jp">JP</button>
                    <button class="lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
                    <button class="lang-btn ${currentLang === 'la' ? 'active' : ''}" data-lang="la">LA</button>
                </div>
            </div>
            <div class="header-center">
                <input type="text" id="searchBox" class="search-box" placeholder="${searchPlaceholder}">
                <button class="search-btn" onclick="performSearch()">搜索</button>
            </div>
            <div class="header-right">
                ${this.generateNavigationButtons()}
                ${showBackButton ? `<button class="header-btn" onclick="window.location.href='${backButtonUrl}'">${backButtonText}</button>` : ''}
                <div id="auth-buttons"></div>
            </div>
        </header>
        `;
    }

    // 生成导航按钮
    generateNavigationButtons() {
        const prefix = this.pathPrefix;
        
        return `
            <button class="header-btn" onclick="window.open('${prefix}src/indx/talk')">相谈</button>
            <button class="header-btn" onclick="window.open('${prefix}src/indx/friends')">友人</button>
            <button class="header-btn" onclick="window.open('${prefix}src/indx/sponsor')">赞助</button>
        `;
    }

    // 渲染header到指定容器
    render(containerId = 'header-container') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Header container with id "${containerId}" not found`);
            return;
        }

        container.innerHTML = this.generateHTML();
        this.bindEvents();
    }

    // 绑定事件
    bindEvents() {
        // 语言切换事件
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleLanguageSwitch(e.target.dataset.lang);
            });
        });

        // 搜索功能（如果还没有定义的话）
        if (typeof window.performSearch === 'undefined') {
            window.performSearch = () => {
                const searchTerm = document.getElementById('searchBox').value;
                if (searchTerm.trim()) {
                    alert(`搜索功能：${searchTerm}`);
                    // 这里可以实现实际的搜索逻辑
                }
            };
        }
    }

    // 处理语言切换
    handleLanguageSwitch(lang) {
        // 更新按钮状态
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-lang="${lang}"]`).classList.add('active');

        // 实现语言切换逻辑
        this.switchLanguage(lang);
    }

    // 语言切换逻辑
    switchLanguage(targetLang) {
        const currentPath = window.location.pathname;
        
        // 定义语言映射
        const langMappings = {
            'cn': '/src/cn/real/ind.html',
            'jp': '/src/jp/real/ind.html', 
            'en': '/src/en/real/ind.html',
            'la': '/src/la/real/ind.html'
        };

        // 尝试智能切换到对应语言的相同页面
        let targetPath = '';
        
        if (currentPath.includes('/cn/')) {
            targetPath = currentPath.replace('/cn/', `/${targetLang}/`);
        } else if (currentPath.includes('/jp/')) {
            targetPath = currentPath.replace('/jp/', `/${targetLang}/`);
        } else if (currentPath.includes('/en/')) {
            targetPath = currentPath.replace('/en/', `/${targetLang}/`);
        } else if (currentPath.includes('/la/')) {
            targetPath = currentPath.replace('/la/', `/${targetLang}/`);
        } else {
            targetPath = langMappings[targetLang];
        }

        // 检查目标页面是否存在（简单检查）
        fetch(targetPath, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    window.location.href = targetPath;
                } else {
                    // 如果页面不存在，跳转到该语言的主页
                    window.location.href = langMappings[targetLang];
                }
            })
            .catch(() => {
                // 网络错误时直接跳转
                window.location.href = langMappings[targetLang];
            });
    }

    // 更新配置
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        this.initPaths();
    }
}

// 默认初始化函数
function initHeader(options = {}) {
    const header = new HeaderComponent(options);
    header.render();
    
    // 存储实例以供外部访问
    window.headerComponent = header;
    
    return header;
}

// 专门为认证页面的header初始化
function initAuthHeader(options = {}) {
    const defaultAuthOptions = {
        showBackButton: true,
        backButtonUrl: '/src/cn/real/ind.html',
        backButtonText: '返回'
    };
    
    return initHeader({ ...defaultAuthOptions, ...options });
}

// 自动初始化（如果页面有header-container）
document.addEventListener('DOMContentLoaded', function() {
    const headerContainer = document.getElementById('header-container');
    if (headerContainer && !window.headerComponent) {
        // 检查是否是认证页面
        if (window.location.pathname.includes('/auth/')) {
            initAuthHeader();
        } else {
            initHeader();
        }
    }
});

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HeaderComponent, initHeader, initAuthHeader };
}

// 浏览器全局对象
if (typeof window !== 'undefined') {
    window.HeaderComponent = HeaderComponent;
    window.initHeader = initHeader;
    window.initAuthHeader = initAuthHeader;
}