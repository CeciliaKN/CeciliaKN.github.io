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
      
      // 关于馆长展开/收起功能
      document.addEventListener('DOMContentLoaded', function() {
      var content = document.getElementById("content");
      document.getElementById("title").onclick = function() {
        if (content.style.display === "none" || content.style.display === "") {
          content.style.display = "block";
        } else {
          content.style.display = "none";
        }
      };
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
        '幻想世界': '/src/fant/ind.html',
        'fantastic': '/src/fant/ind.html',
        'fantasy': '/src/fant/ind.html',
        'baletu': '/src/fant/ind.html',
        
        // 语言相关
        '语言': '/src/fant/langue.html',
        'langue': '/src/fant/langue.html',
        'language': '/src/fant/langue.html',
        
        // 民族相关
        'saxona': '/src/fant/peoples/EP0001SaxonaNixi.html',
        'nixi': '/src/fant/peoples/EP0001SaxonaNixi.html',
        'miarika': '/src/fant/peoples/EZ0001Miarika.html',
        
        // 维基相关
        'sjaleta': '/src/fant/wiki/R00001Sjaleta.html',
        
        // 文学相关
        '文学': '/src/literature/ind.html',
        'literature': '/src/literature/ind.html',
        'lonicera': '/src/literature/hana/240607lonicera.html',
        'himawari': '/src/literature/hana/240622himawari.html',
        
        // 现实世界
        '现实': '/src/real/ind.html',
        '现实世界': '/src/real/ind.html',
        'real': '/src/real/ind.html',
        
        // Sarava
        'sarava': '/src/Sarava/word.html',
        'word': '/src/Sarava/word.html'
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
        alert('未找到匹配的页面。尝试搜索：幻想、文学、现实、语言等关键词');
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
    
    // 语言切换功能 (目前仅切换按钮状态，未来可扩展)
    document.addEventListener('DOMContentLoaded', function() {
      const langButtons = document.querySelectorAll('.lang-btn');
      
      langButtons.forEach(button => {
        button.addEventListener('click', function() {
          // 移除所有active类
          langButtons.forEach(btn => btn.classList.remove('active'));
          // 添加当前按钮的active类
          this.classList.add('active');
          
          const lang = this.getAttribute('data-lang');
          // 未来可以在这里添加实际的语言切换逻辑
          console.log('切换到语言:', lang);
          
          // 示例：未来可以这样实现
          // window.location.href = `/index_${lang}.html`;
        });
      });
    });
    
// Empty JS for your own code to be here
