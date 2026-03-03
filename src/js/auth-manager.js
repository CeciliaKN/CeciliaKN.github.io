/**
 * 用户认证管理模块
 * 用于在页面中管理用户登录状态和显示相关按钮
 */
class AuthManager {
    constructor() {
        this.auth = new BlogBackendAuth();
        this.init();
    }

    // 初始化
    init() {
        this.updateAuthButtons();
        this.setupEventListeners();
    }

    // 更新认证按钮状态
    async updateAuthButtons() {
        const authButtonsContainer = document.getElementById('auth-buttons');
        if (!authButtonsContainer) return;

        if (this.auth.isLoggedIn()) {
            // 用户已登录，显示用户名和个人中心
            try {
                const userResult = await this.auth.getCurrentUser();
                if (userResult.success) {
                    const user = userResult.user;
                    authButtonsContainer.innerHTML = `
                        <button class="header-btn auth-btn" onclick="window.location.href='/src/cn/auth/profile.html'">
                            ${user.username}
                        </button>
                        <button class="header-btn auth-btn logout-btn" onclick="authManager.logout()">
                            退出
                        </button>
                    `;
                } else {
                    // Token可能过期了，显示登录按钮
                    this.showLoginButton(authButtonsContainer);
                }
            } catch (error) {
                console.error('获取用户信息失败:', error);
                this.showLoginButton(authButtonsContainer);
            }
        } else {
            // 用户未登录，显示登录按钮
            this.showLoginButton(authButtonsContainer);
        }
    }

    // 显示登录按钮
    showLoginButton(container) {
        container.innerHTML = `
            <button class="header-btn auth-btn" onclick="window.location.href='/src/cn/auth/login.html'">
                登录/注册
            </button>
        `;
    }

    // 设置事件监听器
    setupEventListeners() {
        // 监听存储变化，当其他标签页登录时更新状态
        window.addEventListener('storage', (e) => {
            if (e.key === 'blog_auth_token' || e.key === 'blog_user_info') {
                this.updateAuthButtons();
            }
        });
    }

    // 退出登录
    async logout() {
        if (confirm('确定要退出登录吗？')) {
            this.auth.logout();
            this.updateAuthButtons();
            
            // 可选：显示退出成功提示
            this.showMessage('已成功退出登录', 'success');
        }
    }

    // 显示消息提示
    showMessage(message, type = 'info') {
        // 创建临时消息提示
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message auth-message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
            color: ${type === 'success' ? '#155724' : '#721c24'};
            border-radius: 5px;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        `;

        document.body.appendChild(messageDiv);

        // 3秒后移除消息
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    }

    // 检查用户权限
    async hasPermission(permission) {
        if (!this.auth.isLoggedIn()) return false;
        return await this.auth.hasPermission(permission);
    }

    // 获取当前用户信息
    async getCurrentUser() {
        if (!this.auth.isLoggedIn()) return null;
        const result = await this.auth.getCurrentUser();
        return result.success ? result.user : null;
    }
}

// 全局认证管理器实例
let authManager;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 只在没有header-container的页面或header组件未初始化时，手动初始化AuthManager
    const headerContainer = document.getElementById('header-container');
    const authButtons = document.getElementById('auth-buttons');
    
    if (!headerContainer && authButtons && typeof BlogBackendAuth !== 'undefined') {
        // 这是一个没有使用header组件但有auth-buttons容器的页面
        authManager = new AuthManager();
    } else if (headerContainer && !authButtons) {
        // header-container存在但还没有auth-buttons，等待header组件渲染完成
        setTimeout(() => {
            const authButtonsAfterDelay = document.getElementById('auth-buttons');
            if (authButtonsAfterDelay && typeof BlogBackendAuth !== 'undefined') {
                authManager = new AuthManager();
            }
        }, 200);
    }
    // 如果存在header-container且已有auth-buttons，说明header组件已处理认证
});

// 添加认证相关的CSS样式
const authStyles = document.createElement('style');
authStyles.textContent = `
    .auth-btn {
        background: linear-gradient(135deg, #8db4e2, #b4d7ff) !important;
        color: white !important;
        border: none !important;
        transition: all 0.3s ease !important;
    }
    
    .auth-btn:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 5px 15px rgba(141, 180, 226, 0.3) !important;
    }
    
    .logout-btn {
        background: linear-gradient(135deg, #e74c3c, #c0392b) !important;
    }
    
    .logout-btn:hover {
        box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3) !important;
    }
    
    #auth-buttons {
        display: inline-block;
        margin-left: 10px;
    }
    
    .auth-message {
        animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
// 注释掉，因为样式现在由header-component管理
// document.head.appendChild(authStyles);