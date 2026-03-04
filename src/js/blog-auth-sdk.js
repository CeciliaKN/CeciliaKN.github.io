/**
 * BlogBackend 认证 SDK
 * 用于前端项目集成用户认证功能
 */
class BlogBackendAuth {
    constructor(baseUrl = 'https://blogbackend.nixin985.workers.dev/api') {
        this.baseUrl = baseUrl;
        this.tokenKey = 'blog_auth_token';
        this.userKey = 'blog_user_info';
    }

    /**
     * 发送HTTP请求的通用方法
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            return { data, status: response.status };
        } catch (error) {
            throw new Error(`网络请求失败: ${error.message}`);
        }
    }

    /**
     * 用户注册
     */
    async register(username, email, password) {
        const { data, status } = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });

        if (data.success) {
            // 检查是否需要审核
            if (data.needsApproval) {
                // 注册成功但需要审核，不保存token
                return { success: true, user: data.user, message: data.message, needsApproval: true };
            } else {
                // 注册成功且直接激活
                this.setToken(data.token);
                this.setUser(data.user);
                return { success: true, user: data.user, message: data.message };
            }
        } else {
            return { success: false, error: data.error };
        }
    }

    /**
     * 用户登录
     */
    async login(username, password) {
        const { data, status } = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });

        if (data.success) {
            this.setToken(data.token);
            this.setUser(data.user);
            return { success: true, user: data.user, message: data.message };
        } else {
            return { success: false, error: data.error };
        }
    }

    /**
     * 获取当前用户信息
     */
    async getCurrentUser() {
        const token = this.getToken();
        if (!token) {
            return { success: false, error: '未登录' };
        }

        const { data, status } = await this.request('/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (data.success) {
            this.setUser(data.user);
            return { success: true, user: data.user };
        } else {
            // token无效，清除本地存储
            if (status === 401) {
                this.logout();
            }
            return { success: false, error: data.error };
        }
    }

    /**
     * 用户登出
     */
    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
    }

    /**
     * 检查用户是否已登录
     */
    isLoggedIn() {
        return !!this.getToken();
    }

    /**
     * 获取存储的token
     */
    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    /**
     * 存储token
     */
    setToken(token) {
        localStorage.setItem(this.tokenKey, token);
    }

    /**
     * 获取存储的用户信息
     */
    getUser() {
        const userStr = localStorage.getItem(this.userKey);
        return userStr ? JSON.parse(userStr) : null;
    }

    /**
     * 存储用户信息
     */
    setUser(user) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }

    /**
     * 发送认证请求 (自动添加Authorization头)
     */
    async authenticatedRequest(endpoint, options = {}) {
        const token = this.getToken();
        if (!token) {
            throw new Error('未登录，无法发送认证请求');
        }

        return this.request(endpoint, {
            ...options,
            headers: {
                'Authorization': `Bearer ${token}`,
                ...options.headers
            }
        });
    }

    /**
     * 获取当前用户权限
     */
    async getCurrentPermissions() {
        return this.authenticatedRequest('/auth/permissions');
    }

    /**
     * 管理员：获取待审核用户
     */
    async getPendingUsers() {
        return this.authenticatedRequest('/admin/pending-users');
    }

    /**
     * 管理员：审核用户
     */
    async approveUser(username, action, role = null) {
        return this.authenticatedRequest('/admin/approve-user', {
            method: 'POST',
            body: JSON.stringify({ username, action, role })
        });
    }

    /**
     * 管理员：获取所有用户
     */
    async getAllUsers() {
        return this.authenticatedRequest('/admin/users');
    }

    /**
     * 创建内容（需要编辑权限）
     */
    async createContent(content) {
        return this.authenticatedRequest('/content/create', {
            method: 'POST',
            body: JSON.stringify(content)
        });
    }

    /**
     * 创建评论（需要评论权限）
     */
    async createComment(comment) {
        return this.authenticatedRequest('/comments/create', {
            method: 'POST',
            body: JSON.stringify(comment)
        });
    }

    /**
     * 检查用户是否有特定权限
     * 支持两种检查方式：
     * 1. 通过后端权限对象: result.data.permissions[permission]
     * 2. 通过本地用户role字段: user.role === 'admin'
     * 3. 通过后端role字段: result.data.role
     */
    async hasPermission(permission) {
        try {
            // 优先检查本地存储的用户信息中的role字段
            const user = this.getUser();
            console.log(`[hasPermission] 检查: ${permission}, 本地用户:`, user);
            
            if (user && permission === 'canAdmin' && user.role === 'admin') {
                console.log(`[hasPermission] 本地检查通过: user.role = admin`);
                return true;
            }

            // 然后调用API检查权限
            console.log(`[hasPermission] 调用API检查权限...`);
            const result = await this.getCurrentPermissions();
            console.log(`[hasPermission] API返回:`, result);
            
            if (result.data && result.data.success) {
                // 方式1: 检查permissions对象
                if (result.data.permissions && result.data.permissions[permission]) {
                    console.log(`[hasPermission] API permissions检查通过:`, result.data.permissions[permission]);
                    return true;
                }
                // 方式2: 检查role字段（针对canAdmin权限）
                if (permission === 'canAdmin' && result.data.role === 'admin') {
                    console.log(`[hasPermission] API role检查通过: role = admin`);
                    return true;
                }
            }
            console.log(`[hasPermission] 检查失败`);
            return false;
        } catch (error) {
            console.error(`[hasPermission] 异常:`, error);
            // 网络错误时，回退到检查本地用户信息
            const user = this.getUser();
            if (user && permission === 'canAdmin' && user.role === 'admin') {
                console.log(`[hasPermission] 网络错误，使用本地缓存，返回true`);
                return true;
            }
            console.log(`[hasPermission] 网络错误，无本地缓存，返回false`);
            return false;
        }
    }

    /**
     * 检查API健康状态
     */
    async healthCheck() {
        try {
            const { data } = await this.request('/health');
            return data;
        } catch (error) {
            throw error;
        }
    }
}

// 浏览器全局对象
if (typeof window !== 'undefined') {
    window.BlogBackendAuth = BlogBackendAuth;
}

// CommonJS导出 (兼容Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogBackendAuth;
}

// 浏览器全局对象
if (typeof window !== 'undefined') {
    window.BlogBackendAuth = BlogBackendAuth;
}