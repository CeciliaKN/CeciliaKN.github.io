/**
 * 博客管理系统JavaScript模块
 * 处理管理员权限验证、内容创建、管理等功能
 */

class BlogAdminManager {
    constructor() {
        this.auth = new BlogBackendAuth();
        this.selectedCategory = '';
        this.selectedContentType = '';
        this.init();
    }

    // 初始化管理系统
    async init() {
        await this.checkAdminPermission();
        this.initializeDateInput();
        this.initializeEventListeners();
    }

    // 检查管理员权限
    async checkAdminPermission() {
        if (!this.auth.isLoggedIn()) {
            this.showAccessDenied();
            return;
        }

        try {
            // 获取完整的权限信息用于调试
            const permResult = await this.auth.getCurrentPermissions();
            console.log('🔍 完整权限API响应:', permResult);
            
            // 检查admin权限
            const hasAdmin = await this.auth.hasPermission('canAdmin');
            console.log('🔍 hasPermission("canAdmin") 结果:', hasAdmin);
            
            if (hasAdmin) {
                this.showAdminContent();
            } else {
                console.log('❌ 权限检查失败，用户没有canAdmin权限');
                this.showAccessDenied();
            }
        } catch (error) {
            console.error('权限检查失败:', error);
            this.showAccessDenied();
        }
    }

    // 显示拒绝访问
    showAccessDenied() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('admin-content').style.display = 'none';
        document.getElementById('access-denied').style.display = 'block';
    }

    // 显示管理员内容
    showAdminContent() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('access-denied').style.display = 'none';
        document.getElementById('admin-content').style.display = 'block';
        
        // 加载内容列表
        this.refreshContentList();
    }

    // 初始化日期输入框（默认今天）
    initializeDateInput() {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        const dateInput = document.getElementById('contentDate');
        if (dateInput) {
            dateInput.value = formattedDate;
        }
    }

    // 初始化事件监听器
    initializeEventListeners() {
        // 内容类型选择
        document.querySelectorAll('.content-type-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.handleContentTypeSelection(e.target);
            });
        });

        // 分类选择
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-option') && 
                (e.target.classList.contains('category-blog') || e.target.classList.contains('category-literature'))) {
                this.handleCategorySelection(e.target);
            }
        });

        // 表单提交
        const form = document.getElementById('createContentForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
    }

    // 处理内容类型选择
    handleContentTypeSelection(element) {
        // 清除之前的选择
        document.querySelectorAll('.content-type-option').forEach(opt => 
            opt.classList.remove('selected')
        );
        
        // 选中当前项
        element.classList.add('selected');
        this.selectedContentType = element.dataset.type;
        const hiddenInput = document.getElementById('selectedContentType');
        if (hiddenInput) {
            hiddenInput.value = this.selectedContentType;
        }
        
        // 显示对应的分类选项
        this.showCategoriesForType(this.selectedContentType);
        
        // 切换相关字段显示
        this.updateFieldsForContentType(this.selectedContentType);
        
        // 清除之前选择的分类
        this.clearCategorySelection();
    }

    // 处理分类选择
    handleCategorySelection(element) {
        // 清除同类型的其他选择
        const sameTypeOptions = document.querySelectorAll(`.category-${this.selectedContentType}`);
        sameTypeOptions.forEach(opt => opt.classList.remove('selected'));
        
        // 选中当前项
        element.classList.add('selected');
        this.selectedCategory = element.dataset.category;
        const hiddenInput = document.getElementById('selectedCategory');
        if (hiddenInput) {
            hiddenInput.value = this.selectedCategory;
        }
    }

    // 显示对应内容类型的分类选项
    showCategoriesForType(type) {
        const blogCategories = document.getElementById('blog-categories');
        const literatureCategories = document.getElementById('literature-categories');
        
        if (type === 'blog') {
            if (blogCategories) blogCategories.style.display = 'grid';
            if (literatureCategories) literatureCategories.style.display = 'none';
        } else if (type === 'literature') {
            if (blogCategories) blogCategories.style.display = 'none';
            if (literatureCategories) literatureCategories.style.display = 'grid';
        } else {
            if (blogCategories) blogCategories.style.display = 'none';
            if (literatureCategories) literatureCategories.style.display = 'none';
        }
    }

    // 根据内容类型更新表单字段显示
    updateFieldsForContentType(type) {
        const locationGroup = document.getElementById('location-group');
        const literatureDateGroup = document.getElementById('literature-date-group');
        
        if (type === 'blog') {
            if (locationGroup) locationGroup.style.display = 'block';
            if (literatureDateGroup) literatureDateGroup.style.display = 'none';
        } else if (type === 'literature') {
            if (locationGroup) locationGroup.style.display = 'none';
            if (literatureDateGroup) literatureDateGroup.style.display = 'block';
        }
    }

    // 清除分类选择
    clearCategorySelection() {
        document.querySelectorAll('.category-blog, .category-literature').forEach(opt => 
            opt.classList.remove('selected')
        );
        this.selectedCategory = '';
        const hiddenInput = document.getElementById('selectedCategory');
        if (hiddenInput) {
            hiddenInput.value = '';
        }
    }

    // 切换标签页
    switchTab(tabName) {
        document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        const clickedTab = event.target;
        clickedTab.classList.add('active');
        const targetTab = document.getElementById(tabName + '-tab');
        if (targetTab) {
            targetTab.classList.add('active');
        }
    }

    // 预览内容
    previewContent() {
        const title = document.getElementById('contentTitle')?.value.trim() || '';
        const content = document.getElementById('contentText')?.value.trim() || '';
        const date = document.getElementById('contentDate')?.value || '';
        
        if (!title || !content || !this.selectedCategory || !date || !this.selectedContentType) {
            this.showAlert('danger', '请填写完整的内容信息后再预览', 'create-alert');
            return;
        }
        
        let previewHTML = '';
        
        if (this.selectedContentType === 'blog') {
            const location = document.getElementById('contentLocation')?.value.trim() || '';
            previewHTML = this.generateBlogPreview(title, content, date, location);
        } else if (this.selectedContentType === 'literature') {
            const literatureDate = document.getElementById('literatureDate')?.value.trim() || '';
            previewHTML = this.generateLiteraturePreview(title, content, literatureDate);
        }
        
        const previewContent = document.getElementById('previewContent');
        if (previewContent) {
            previewContent.innerHTML = previewHTML;
        }
        
        const previewSection = document.getElementById('previewSection');
        if (previewSection) {
            previewSection.style.display = 'block';
            previewSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // 生成博客预览HTML
    generateBlogPreview(title, content, date, location) {
        const formattedDate = new Date(date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        return `
            <h1>${title}</h1>
            <div class="meta" style="color: #666; font-size: 14px; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                <span>📅 ${formattedDate}</span> | 
                <span>📁 分组：${this.selectedCategory}</span>
            </div>
            <div class="content" style="line-height: 1.8; color: #444; font-size: 16px; white-space: pre-line;">
                ${content}
            </div>
            ${location ? `<p class="blog-location" style="margin-top: 20px; color: #666;">📍 ${location}</p>` : ''}
        `;
    }

    // 生成文学作品预览HTML
    generateLiteraturePreview(title, content, literatureDate) {
        return `
            <div class="blog-post-in" style="padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <button class="back-button" style="margin-bottom: 15px; padding: 8px 15px; background: #8db4e2; color: white; border: none; border-radius: 5px;">返回上一页</button>
                <h3 class="blog-post-title-in" style="color: #333; margin-bottom: 10px;">${title}</h3>
                <p class="blog-post-meta-in" style="color: #666; font-size: 14px; margin-bottom: 20px;">
                    ${literatureDate || '发表日期'} 分组：<a href="#" style="color: #8db4e2; text-decoration: none;">${this.selectedCategory}</a>
                </p>
                <p class="blog-post-content-in" style="line-height: 1.8; color: #444;">
                    ${content.replace(/\n/g, '<br>')}
                </p>
            </div>
        `;
    }

    // 处理表单提交
    async handleFormSubmit(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('.btn-success');
        if (!submitBtn) return;
        
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="spinner" style="display: inline-block; width: 16px; height: 16px; margin-right: 5px;"></div>发布中...';
        
        this.clearAlert('create-alert');
        
        try {
            await this.createContent();
        } catch (error) {
            console.error('创建内容失败:', error);
            this.handleCreateError(error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    // 创建内容
    async createContent() {
        const title = document.getElementById('contentTitle')?.value.trim() || '';
        const content = document.getElementById('contentText')?.value.trim() || '';
        const date = document.getElementById('contentDate')?.value || '';
        
        if (!title || !content || !this.selectedCategory || !date || !this.selectedContentType) {
            this.showAlert('danger', '请填写完整的内容信息', 'create-alert');
            return;
        }

        const contentId = Date.now().toString();
        let apiEndpoint = '';
        let requestData = {};
        
        if (this.selectedContentType === 'blog') {
            const location = document.getElementById('contentLocation')?.value.trim() || '';
            apiEndpoint = '/api/admin/create-blog';
            requestData = {
                title: title,
                content: content, 
                description: title.length > 160 ? title.substring(0, 160) + '...' : title,
                category: this.selectedCategory,
                tags: []  
            };
        } else if (this.selectedContentType === 'literature') {
            const literatureDate = document.getElementById('literatureDate')?.value.trim() || '';
            apiEndpoint = '/api/admin/create-literature';
            requestData = {
                title: title,
                content: content, 
                category: this.selectedCategory,
                date: date,
                literatureDate: literatureDate,
                contentId: contentId
            };
        }

        const result = await this.auth.authenticatedRequest(apiEndpoint, {
            method: 'POST',
            body: JSON.stringify(requestData)
        });
        
        if (result.data && result.data.success) {
            this.showAlert('success', `${this.selectedContentType === 'blog' ? '博客' : '文学作品'}创建成功！`, 'create-alert');
            this.resetForm();
            this.refreshContentList();
        } else {
            this.showAlert('danger', '创建失败: ' + (result.data?.error || '未知错误'), 'create-alert');
        }
    }

    // 处理创建错误
    handleCreateError(error) {
        if (error.message.includes('404') || error.message.includes('Not Found')) {
            const apiName = this.selectedContentType === 'blog' ? 
                'POST /api/admin/create-blog' : 
                'POST /api/admin/create-literature';
            this.showAlert('info', `🚧 API开发中：${apiName} 接口尚未实现，请联系后端工程师。`, 'create-alert');
        } else {
            this.showAlert('danger', '创建失败: ' + error.message, 'create-alert');
        }
    }

    // 重置表单
    resetForm() {
        const form = document.getElementById('createContentForm');
        if (form) {
            form.reset();
        }
        
        this.selectedCategory = '';
        this.selectedContentType = '';
        document.querySelectorAll('.category-option').forEach(opt => 
            opt.classList.remove('selected')
        );
        
        const previewSection = document.getElementById('previewSection');
        if (previewSection) {
            previewSection.style.display = 'none';
        }
        
        this.showCategoriesForType('');
        this.updateFieldsForContentType('');
        this.initializeDateInput();
    }

    // 刷新内容列表
    async refreshContentList() {
        const listContainer = document.getElementById('blogList');
        if (!listContainer) return;
        
        listContainer.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>正在加载内容列表...</p>
            </div>
        `;
        
        try {
            const result = await this.auth.authenticatedRequest('/api/admin/contents');
            
            if (result.data && result.data.success) {
                this.renderContentList(result.data.contents || []);
            } else {
                this.renderContentListError(result.data?.error || '未知错误');
            }
            
        } catch (error) {
            console.error('获取内容列表失败:', error);
            this.renderContentListNetworkError(error);
        }
    }

    // 渲染内容列表
    renderContentList(contents) {
        const listContainer = document.getElementById('blogList');
        if (!listContainer) return;
        
        if (contents.length === 0) {
            listContainer.innerHTML = `
                <div class="alert alert-info">
                    还没有任何内容。创建您的第一篇文章吧！
                </div>
            `;
            return;
        }
        
        let contentHTML = '';
        contents.forEach(item => {
            const typeIcon = item.type === 'blog' ? '📝' : '📚';
            const typeName = item.type === 'blog' ? '博客' : '文学作品';
            const formattedDate = new Date(item.date).toLocaleDateString('zh-CN');
            
            contentHTML += `
                <div class="blog-item">
                    <h4>${typeIcon} ${item.title}</h4>
                    <div class="meta">
                        ${formattedDate} | 类型：${typeName} | 分类：${item.category}
                        ${item.url ? ` | <a href="${item.url}" target="_blank" style="color: #8db4e2; text-decoration: none;">🔗 查看</a>` : ''}
                    </div>
                    <div class="actions">
                        <button class="btn btn-danger btn-sm" 
                                onclick="blogAdminManager.deleteContent('${item.type}', '${item.id}', '${item.title}')">
                            删除
                        </button>
                    </div>
                </div>
            `;
        });
        
        listContainer.innerHTML = contentHTML;
    }

    // 渲染内容列表错误
    renderContentListError(error) {
        const listContainer = document.getElementById('blogList');
        if (listContainer) {
            listContainer.innerHTML = `
                <div class="alert alert-warning">
                    <strong>获取内容列表失败：</strong>${error}<br>
                    <button class="btn btn-primary btn-sm mt-2" onclick="blogAdminManager.refreshContentList()">🔄 重试</button>
                </div>
            `;
        }
    }

    // 渲染网络错误
    renderContentListNetworkError(error) {
        const listContainer = document.getElementById('blogList');
        if (!listContainer) return;
        
        if (error.message.includes('404') || error.message.includes('Not Found')) {
            listContainer.innerHTML = `
                <div class="alert alert-info">
                    <h5>🚧 API开发中</h5>
                    <p><strong>GET /api/admin/contents</strong> 接口尚未实现。</p>
                    <p>请联系后端工程师实现此接口以获取内容列表。</p>
                    <hr>
                    <p><small>预期返回格式：</small></p>
                    <pre style="font-size: 12px; background: #f8f9fa; padding: 10px; border-radius: 4px;">{
  "success": true,
  "contents": [
    {
      "id": "123",
      "title": "文章标题",
      "type": "blog|literature", 
      "category": "分类名称",
      "date": "2026-03-04",
      "url": "/blog/slug"
    }
  ]
}</pre>
                </div>
            `;
        } else {
            listContainer.innerHTML = `
                <div class="alert alert-danger">
                    <strong>网络错误：</strong>${error.message}<br>
                    <button class="btn btn-primary btn-sm mt-2" onclick="blogAdminManager.refreshContentList()">🔄 重试</button>
                </div>
            `;
        }
    }

    // 删除内容
    async deleteContent(contentType, contentId, contentTitle) {
        if (!confirm(`确定要删除「${contentTitle}」吗？\n\n类型：${contentType === 'blog' ? '博客文章' : '文学作品'}\n此操作不可恢复！`)) {
            return;
        }
        
        try {
            const endpoint = contentType === 'blog' ? '/api/admin/delete-blog' : '/api/admin/delete-literature';
            const result = await this.auth.authenticatedRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify({ contentId: contentId })
            });
            
            if (result.data && result.data.success) {
                this.showAlert('success', `${contentType === 'blog' ? '博客' : '文学作品'}删除成功！`, 'manage-alert');
                this.refreshContentList();
            } else {
                this.showAlert('danger', '删除失败: ' + (result.data?.error || '未知错误'), 'manage-alert');
            }
            
        } catch (error) {
            console.error('删除内容失败:', error);
            if (error.message.includes('404') || error.message.includes('Not Found')) {
                const apiName = contentType === 'blog' ? 
                    'POST /api/admin/delete-blog' : 
                    'POST /api/admin/delete-literature';
                this.showAlert('info', `🚧 API开发中：${apiName} 接口尚未实现，请联系后端工程师。`, 'manage-alert');
            } else {
                this.showAlert('danger', '删除失败: ' + error.message, 'manage-alert');
            }
        }
    }

    // 显示提示信息
    showAlert(type, message, alertId) {
        const alert = document.getElementById(alertId);
        if (alert) {
            alert.className = `alert alert-${type}`;
            alert.textContent = message;
            alert.style.display = 'block';
            
            // 5秒后自动隐藏
            setTimeout(() => {
                alert.style.display = 'none';
            }, 5000);
        }
    }

    // 清除提示信息
    clearAlert(alertId) {
        const alert = document.getElementById(alertId);
        if (alert) {
            alert.style.display = 'none';
        }
    }
}

// 全局实例和函数（保持向后兼容性）
let blogAdminManager;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化认证页面header
    if (typeof initAuthHeader === 'function') {
        initAuthHeader();
    }
    
    // 初始化管理工具
    blogAdminManager = new BlogAdminManager();
});

// 兼容原有的全局函数
function switchTab(tabName) {
    if (blogAdminManager) {
        blogAdminManager.switchTab(tabName);
    }
}

function previewContent() {
    if (blogAdminManager) {
        blogAdminManager.previewContent();
    }
}

function refreshContentList() {
    if (blogAdminManager) {
        blogAdminManager.refreshContentList();
    }
}