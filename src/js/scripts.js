        // 检查页面是否使用自定义背景（跳过有 data-custom-bg 属性的页面）
        if (!document.body.hasAttribute('data-custom-bg')) {
            // 获取当前月份
            const month = new Date().getMonth();
            let backgroundImage;

            // 根据月份设置背景图片
            if (month >= 2 && month <= 4) { // 春季: 3月, 4月, 5月
                backgroundImage = '/src/bg/spring.png';
            } else if (month >= 5 && month <= 7) { // 夏季: 6月, 7月, 8月
                backgroundImage = '/src/bg/summer.png';
            } else if (month >= 8 && month <= 10) { // 秋季: 9月, 10月, 11月
                backgroundImage = '/src/bg/autumn.png';
            } else { // 冬季: 12月, 1月, 2月
                backgroundImage = '/src/bg/winter.png';
            }

            // 设置背景图片
            document.body.style.backgroundImage = `url(${backgroundImage})`;
        }
      
      // 关于馆长模态框功能
      document.addEventListener('DOMContentLoaded', function() {
      var modal = document.getElementById("aboutModal");
      var btn = document.getElementById("aboutButton");
      var span = document.getElementsByClassName("close")[0];
      
      if (btn) {
        btn.onclick = function() {
          modal.style.display = "block";
        }
      }
      
      if (span) {
        span.onclick = function() {
          modal.style.display = "none";
        }
      }
      
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }
    });
    
    // 搜索功能 - 搜索幻想世界和其他页面
    function performSearch() {
      const searchTerm = document.getElementById('searchBox').value.toLowerCase().trim();
      
      if (!searchTerm) {
        alert('请输入搜索内容');
        return;
      }
      
      // 搜索映射表 - 可以根据关键词找到对应页面
      const searchMap = {
        // 幻想世界相关
        '幻想': '/src/cn/fant/ind.html',
        'fantasy': '/src/cn/fant/ind.html',
        'baletu': '/src/cn/fant/ind.html',
        
        // 语言相关
        '人造语言': '/src/cn/fant/langue.html',
        
        // 民族相关
        'saxona': '/src/cn/fant/peoples/EP0001SaxonaNixi.html',
        'nixi': '/src/cn/fant/peoples/EP0001SaxonaNixi.html',
        'miarika': '/src/cn/fant/peoples/EZ0001Miarika.html',
        
        // 维基相关
        'sjaleta': '/src/cn/fant/wiki/R00001Sjaleta.html',
        
        // 文学相关
        '文学': '/src/cn/literature/ind.html',
        'literature': '/src/cn/literature/ind.html',
        '花': '/src/cn/literature/ind.html',
        '向日葵': '/src/cn/literature/hana/240622.html',
        
        // 现实世界
        '博客': '/src/cn/real/ind.html',
        'blog': '/src/cn/real/ind.html',
        '主页': '/src/cn/real/ind.html',
        
        // Sarava
        'sarava': '/src/cn/Sarava/word.html',
        '萨拉瓦': '/src/cn/Sarava/word.html'
      };
      
      // 查找匹配
      let foundUrl = null;
      for (let key in searchMap) {
        if (searchTerm.includes(key) || key.includes(searchTerm)) {
          foundUrl = searchMap[key];
          break;
        }
      }
      
      if (foundUrl) {
        window.open(foundUrl, '_blank');
      } else {
        alert('功能尚未完善。未找到相关内容: ' + searchTerm);
      }
    }
    
    // 回车键触发搜索
    document.addEventListener('DOMContentLoaded', function() {
      const searchBox = document.getElementById('searchBox');
      if (searchBox) {
        searchBox.addEventListener('keypress', function(event) {
          if (event.key === 'Enter') {
            performSearch();
          }
        });
      }
    });
    
    // 语言切换功能
    document.addEventListener('DOMContentLoaded', function() {
      const langButtons = document.querySelectorAll('.lang-btn');
      
      langButtons.forEach(button => {
        button.addEventListener('click', function() {
          const lang = this.getAttribute('data-lang');
          
          // 获取当前路径
          let currentPath = window.location.pathname;
          
          // 替换语言代码
          // 识别当前语言文件夹 (cn, jp, en, la)
          const langPattern = /\/(cn|jp|en|la)\//;
          
          if (langPattern.test(currentPath)) {
            // 如果路径中包含语言代码，则替换
            const newPath = currentPath.replace(langPattern, `/${lang}/`);
            window.location.href = newPath;
          } else {
            // 如果是主页或其他页面，跳转到对应语言的默认页面
            window.location.href = `/src/${lang}/real/ind`;
          }
        });
      });
    });
    
// Empty JS for your own code to be here
// 分组筛选功能 - 用于literature/ind.html和real/ind.html
document.addEventListener('DOMContentLoaded', function() {
  let currentCategory = null; // 当前激活的分类
  
  // 处理侧边栏分组筛选（仅literature页面有）
  const categoryFilters = document.querySelectorAll('.category-filter');
  categoryFilters.forEach(filter => {
    filter.addEventListener('click', function(e) {
      e.preventDefault();
      const category = this.getAttribute('data-category');
      
      // 如果点击的是当前已激活的分类，则还原显示所有
      if (currentCategory === category) {
        showAllPosts();
        currentCategory = null;
        // 移除所有激活状态
        categoryFilters.forEach(f => f.classList.remove('active-category'));
      } else {
        // 否则筛选该分类
        filterByCategory(category);
        currentCategory = category;
        // 更新激活状态
        categoryFilters.forEach(f => f.classList.remove('active-category'));
        this.classList.add('active-category');
      }
    });
  });
  
  // 处理文章内分组标签点击
  const postCategories = document.querySelectorAll('.post-category');
  postCategories.forEach(cat => {
    cat.addEventListener('click', function(e) {
      e.preventDefault();
      const category = this.getAttribute('data-category');
      
      // 如果点击的是当前已激活的分类，则还原显示所有
      if (currentCategory === category) {
        showAllPosts();
        currentCategory = null;
        categoryFilters.forEach(f => f.classList.remove('active-category'));
      } else {
        // 否则筛选该分类
        filterByCategory(category);
        currentCategory = category;
        // 同步更新侧边栏激活状态
        categoryFilters.forEach(f => {
          if (f.getAttribute('data-category') === category) {
            f.classList.add('active-category');
          } else {
            f.classList.remove('active-category');
          }
        });
      }
    });
  });
  
  // 筛选指定分类的文章
  function filterByCategory(category) {
    const posts = document.querySelectorAll('.blog-post');
    posts.forEach(post => {
      const postCategory = post.getAttribute('data-category');
      if (postCategory === category) {
        post.style.display = 'block';
        // 添加淡入动画
        post.style.animation = 'fadeIn 0.5s ease';
      } else {
        post.style.display = 'none';
      }
    });
  }
  
  // 显示所有文章
  function showAllPosts() {
    const posts = document.querySelectorAll('.blog-post');
    posts.forEach(post => {
      post.style.display = 'block';
      post.style.animation = 'fadeIn 0.5s ease';
    });
  }
});

// 添加淡入动画的CSS（如果main_style.css中没有的话）
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .active-category {
    background-color: rgba(141, 180, 226, 0.3) !important;
    font-weight: bold;
  }
`;
document.head.appendChild(style);
