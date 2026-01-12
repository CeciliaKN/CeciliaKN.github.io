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
        '幻想': '/src/fant/ind.html',
        'fantasy': '/src/fant/ind.html',
        'baletu': '/src/fant/ind.html',
        
        // 语言相关
        '人造语言': '/src/fant/langue.html',
        
        // 民族相关
        'saxona': '/src/fant/peoples/EP0001SaxonaNixi.html',
        'nixi': '/src/fant/peoples/EP0001SaxonaNixi.html',
        'miarika': '/src/fant/peoples/EZ0001Miarika.html',
        
        // 维基相关
        'sjaleta': '/src/fant/wiki/R00001Sjaleta.html',
        
        // 文学相关
        '文学': '/src/literature/ind.html',
        'literature': '/src/literature/ind.html',
        '花': '/src/literature/ind.html',
        '向日葵': '/src/literature/hana/240622.html',
        
        // 现实世界
        '博客': '/src/real/ind.html',
        'blog': '/src/real/ind.html',
        '主页': '/src/real/ind.html',
        
        // Sarava
        'sarava': '/src/Sarava/word.html',
        '萨拉瓦': '/src/Sarava/word.html'
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
