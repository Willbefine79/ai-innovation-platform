// 价格滑块更新
const priceRange = document.getElementById('price-range');
const priceValue = document.getElementById('price-value');

if (priceRange && priceValue) {
    priceRange.addEventListener('input', function() {
        priceValue.textContent = this.value + '元';
    });
}

// 开始监控
function startMonitoring() {
    alert('监控任务已启动，正在分析评论数据...');
    // 模拟监控过程
    setTimeout(() => {
        alert('监控完成！已分析100,000+条评论，提取200+个关键词');
    }, 2000);
}

// Excel上传处理
let mainCategoryKeywords = [];
let subCategoryKeywords = [];

function handleMainCategoryUpload(event) {
    const file = event.target.files[0];
    if (file) {
        alert('主品类Excel文档已上传，正在解析数据...');
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                // 提取爆词数据（假设Excel中第一列是爆词）
                mainCategoryKeywords = jsonData.map(row => {
                    return Object.values(row)[0];
                }).filter(value => value && typeof value === 'string');
                
                if (mainCategoryKeywords.length === 0) {
                    alert('未从Excel中提取到爆词数据，请检查Excel格式');
                } else {
                    alert(`主品类Excel数据解析完成！已提取 ${mainCategoryKeywords.length} 个爆词`);
                }
            } catch (error) {
                alert('Excel解析失败：' + error.message);
                console.error('Excel解析错误:', error);
            }
        };
        
        reader.onerror = function() {
            alert('文件读取失败');
        };
        
        reader.readAsArrayBuffer(file);
    }
}

function handleSubCategoryUpload(event) {
    const file = event.target.files[0];
    if (file) {
        alert('副品类Excel文档已上传，正在解析数据...');
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                // 提取爆词数据（假设Excel中第一列是爆词）
                subCategoryKeywords = jsonData.map(row => {
                    return Object.values(row)[0];
                }).filter(value => value && typeof value === 'string');
                
                if (subCategoryKeywords.length === 0) {
                    alert('未从Excel中提取到爆词数据，请检查Excel格式');
                } else {
                    alert(`副品类Excel数据解析完成！已提取 ${subCategoryKeywords.length} 个爆词`);
                }
            } catch (error) {
                alert('Excel解析失败：' + error.message);
                console.error('Excel解析错误:', error);
            }
        };
        
        reader.onerror = function() {
            alert('文件读取失败');
        };
        
        reader.readAsArrayBuffer(file);
    }
}

// 存储生成的概念数据
let generatedConcepts = [];

// 生成概念
function generateConcepts() {
    // 获取输入参数
    const mainCategory = document.getElementById('main-category').value;
    const subCategory = document.getElementById('sub-category').value;
    const combinationType = document.getElementById('combination-type').value;
    const generateCount = parseInt(document.getElementById('generate-count').value);
    const creativityStyle = document.getElementById('creativity-style').value;
    const targetAudience = document.getElementById('target-audience').value;

    // 验证输入
    if (!mainCategory || !subCategory || mainCategoryKeywords.length === 0 || subCategoryKeywords.length === 0) {
        alert('请填写完整的参数信息并上传Excel文档');
        return;
    }

    alert('AI正在生成概念，请稍候...');

    // 模拟生成过程
    setTimeout(() => {
        generatedConcepts = generateConceptsFromKeywords(
            mainCategory, subCategory, mainCategoryKeywords, subCategoryKeywords,
            combinationType, generateCount, creativityStyle, targetAudience
        );
        displayConcepts(generatedConcepts);
        alert(`概念生成完成！已生成${generatedConcepts.length}个新品概念`);
    }, 3000);
}

// 根据关键词生成概念
function generateConceptsFromKeywords(mainCategory, subCategory, mainKeywords, subKeywords, combinationType, count, style, audience) {
    const concepts = [];
    const radicalTextures = ['脆心', '爆浆', '夹心', '流心', '气泡', '酥脆'];
    const radicalFunctions = ['助眠', '提神', '解压', '美颜', '护眼'];
    
    // 品类常识映射表
    const categoryCommonSense = {
        '糖果': ['糖', '软糖', '硬糖', '巧克力', '太妃糖', '牛轧糖', '水果糖', '奶糖', '焦糖'],
        '巧克力': ['巧克力', '巧脆', '巧心', '巧克力球', '巧克力棒', '巧克力块'],
        '饮料': ['茶', '果汁', '饮品', '饮料', '气泡水', '奶茶', '果茶'],
        '零食': ['薯片', '饼干', '坚果', '果干', '肉脯', '膨化食品'],
        '冰淇淋': ['冰淇淋', '雪糕', '冰棒', '冰沙', '冰品']
    };
    
    // 润色规则
    const polishRules = {
        '橘': '橘子',
        '苹': '苹果',
        '桃': '桃子',
        '蕉': '香蕉',
        '莓': '草莓',
        '葡': '葡萄',
        '柠': '柠檬',
        '芒': '芒果',
        '椰': '椰子',
        '枣': '红枣'
    };
    
    for (let i = 0; i < count; i++) {
        // 随机选择主爆词和副爆词
        const mainKeyword = mainKeywords[Math.floor(Math.random() * mainKeywords.length)];
        const subKeyword = subKeywords[Math.floor(Math.random() * subKeywords.length)];
        
        // 生成概念名称
        let conceptName = '';
        if (combinationType === 'sub-into-main') {
            if (style === 'radical') {
                // 激进风格：添加意想不到的质地或功能
                const textureOrFunction = Math.random() > 0.5 
                    ? radicalTextures[Math.floor(Math.random() * radicalTextures.length)]
                    : radicalFunctions[Math.floor(Math.random() * radicalFunctions.length)];
                conceptName = `${subKeyword}${textureOrFunction}${mainKeyword}`;
            } else {
                // 保守或适中风格：保持主流市场接受度
                conceptName = `${subKeyword}${mainKeyword}`;
            }
        } else {
            if (style === 'radical') {
                const textureOrFunction = Math.random() > 0.5 
                    ? radicalTextures[Math.floor(Math.random() * radicalTextures.length)]
                    : radicalFunctions[Math.floor(Math.random() * radicalFunctions.length)];
                conceptName = `${mainKeyword}${subKeyword}${textureOrFunction}`;
            } else {
                conceptName = `${mainKeyword}${subKeyword}融合`;
            }
        }
        
        // 润色概念名称
        conceptName = polishConceptName(conceptName, polishRules);
        
        // 确保概念名称符合主品类的品类常识
        conceptName = ensureCategoryCommonSense(conceptName, mainCategory, categoryCommonSense);
        
        // 确保概念名称符合商品名称的基本原则
        // 不限制8个字，但也不要太长
        if (conceptName.length > 12) {
            // 简化过长的名称
            conceptName = conceptName.substring(0, 12);
        }
        
        // 生成slogan
        let tagline = '';
        switch (style) {
            case 'conservative':
                tagline = `经典${mainCategory}，${subKeyword}新风味`;
                break;
            case 'moderate':
                tagline = `${subKeyword}遇见${mainCategory}，碰撞新火花`;
                break;
            case 'radical':
                tagline = `${subKeyword}${mainCategory}，颠覆你的味蕾`;
                break;
        }
        
        // 生成核心卖点
        let coreSellingPoint = '';
        if (style === 'radical') {
            coreSellingPoint = `融合${subKeyword}的独特风味与${mainKeyword}的经典口感，添加创新${Math.random() > 0.5 ? '质地' : '功能'}，为${audience || '消费者'}带来全新体验`;
        } else {
            coreSellingPoint = `融合${subKeyword}的独特风味与${mainKeyword}的经典口感，为${audience || '消费者'}带来全新的味觉体验`;
        }
        
        // 生成使用场景
        const targetScenario = [`办公室下午茶`, `休闲零食时光`, `朋友聚会分享`];
        
        // 生成感官描述
        let sensoryDescription = '';
        switch (style) {
            case 'conservative':
                sensoryDescription = `口感醇厚，${subKeyword}的清香与${mainKeyword}的浓郁完美融合，层次丰富`;
                break;
            case 'moderate':
                sensoryDescription = `${subKeyword}的清新与${mainKeyword}的丝滑交织，口感细腻，回味无穷`;
                break;
            case 'radical':
                const radicalTexture = radicalTextures[Math.floor(Math.random() * radicalTextures.length)];
                sensoryDescription = `${subKeyword}的独特风味与${mainKeyword}的浓郁碰撞，${radicalTexture}口感，带来意想不到的体验`;
                break;
        }
        
        // 生成价格带
        const priceRange = '25-35元';
        
        // 生成爆词溯源
        const inspirationFrom = `${mainKeyword} + ${subKeyword}`;
        
        // 生成概念卡
        concepts.push({
            concept_name: conceptName,
            tagline: tagline,
            core_selling_point: coreSellingPoint,
            target_scenario: targetScenario,
            sensory_description: sensoryDescription,
            suggested_price_range: priceRange,
            inspiration_from: inspirationFrom
        });
    }
    
    return concepts;
}

// 显示生成的概念
function displayConcepts(concepts) {
    const resultsContainer = document.getElementById('concept-results');
    resultsContainer.innerHTML = '';
    
    concepts.forEach((concept, index) => {
        const conceptCard = document.createElement('div');
        conceptCard.className = 'concept-card';
        conceptCard.innerHTML = `
            <h4>${concept.concept_name}</h4>
            <p class="tagline">${concept.tagline}</p>
            <p class="score">匹配度: ${Math.floor(Math.random() * 10) + 85}%</p>
            <div class="selling-points">
                <span>${concept.core_selling_point.split('，')[0]}</span>
                <span>${concept.core_selling_point.split('，')[1]}</span>
                <span>${concept.core_selling_point.split('，')[2] || '创新体验'}</span>
            </div>
            <p class="inspiration">爆词溯源: ${concept.inspiration_from}</p>
            <button class="btn primary-btn" onclick="selectConcept(this, ${index})">生成概念卡</button>
        `;
        resultsContainer.appendChild(conceptCard);
    });
}

// 选择概念并生成概念卡
function selectConcept(button, conceptIndex) {
    // 移除其他概念的选中状态
    const conceptCards = document.querySelectorAll('.concept-card');
    conceptCards.forEach(card => {
        card.classList.remove('selected');
    });
    
    // 添加当前概念的选中状态
    const conceptCard = button.closest('.concept-card');
    conceptCard.classList.add('selected');
    
    alert('已选择该概念，正在生成概念卡...');
    
    // 滚动到概念卡生成部分
    document.getElementById('concept-card').scrollIntoView({ behavior: 'smooth' });
    
    // 模拟生成概念卡
    setTimeout(() => {
        updateConceptCard(conceptIndex);
    }, 2000);
}

// 重新生成图片
function generateImage() {
    const img = document.getElementById('concept-card-image');
    if (img) {
        const conceptName = document.getElementById('concept-card-title').textContent;
        
        // 显示加载状态
        const originalSrc = img.src;
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAgMTAwIEwxOTAgMTAwIEwxMDAgMTAiIHN0cm9rZT0iIzNiODJmNiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTEwIDEwMCBMMTkwIDEwMCBMMTAwIDE5MCIgc3Ryb2tlPSIjM2I4MmY2IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48L3N2Zz4=';
        
        console.log('图片生成中，请稍候...');
        
        // 异步生成图片，避免阻塞UI
        setTimeout(() => {
            img.src = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(conceptName)} 产品图 现代简约风格&image_size=square&t=${new Date().getTime()}`;
            
            img.onload = function() {
                alert('图片生成完成！');
            };
            
            img.onerror = function() {
                console.error('图片生成失败');
                img.src = originalSrc;
            };
        }, 100);
    }
}

// 导出报告
function exportReport() {
    alert('报告导出中，请稍候...');
    // 模拟导出过程
    setTimeout(() => {
        alert('报告已导出为PDF格式！');
    }, 2000);
}

// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(44, 62, 80, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.backgroundColor = '#2c3e50';
        navbar.style.boxShadow = 'none';
    }
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    console.log('AI新品创新平台已加载完成！');
    
    // 模拟数据加载
    const loadingElements = document.querySelectorAll('.chart-bar .bar');
    loadingElements.forEach(element => {
        const height = element.style.height;
        element.style.height = '0';
        setTimeout(() => {
            element.style.height = height;
        }, 500);
    });
});

// 响应式菜单
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// 模拟AI分析过程
function simulateAIAnalysis() {
    // 这里可以添加更复杂的AI分析模拟逻辑
    console.log('AI分析中...');
}

// 润色概念名称
function polishConceptName(name, rules) {
    let polishedName = name;
    // 应用润色规则
    for (const [key, value] of Object.entries(rules)) {
        if (polishedName.includes(key)) {
            polishedName = polishedName.replace(key, value);
        }
    }
    return polishedName;
}

// 确保概念名称符合主品类的品类常识
function ensureCategoryCommonSense(name, category, commonSense) {
    // 检查是否已经包含品类相关词汇
    const categoryTerms = commonSense[category] || [];
    
    // 检查概念名称是否已经包含品类相关词汇
    for (const term of categoryTerms) {
        if (name.includes(term)) {
            return name;
        }
    }
    
    // 如果没有包含品类相关词汇，添加一个合适的品类词汇
    if (categoryTerms.length > 0) {
        const randomTerm = categoryTerms[Math.floor(Math.random() * categoryTerms.length)];
        // 确保不会重复添加
        if (!name.includes(randomTerm)) {
            // 根据品类选择合适的添加位置
            if (category === '糖果' && !name.includes('糖')) {
                return name + '糖';
            } else if (category === '巧克力' && !name.includes('巧克力')) {
                return name + '巧克力';
            } else if (category === '饮料' && !name.includes('茶') && !name.includes('果汁') && !name.includes('饮品')) {
                return name + '饮品';
            } else {
                return name;
            }
        }
    }
    return name;
}

// 模拟数据更新
function updateData() {
    // 这里可以添加实时数据更新逻辑
    console.log('数据更新中...');
}

// 更新概念卡
function updateConceptCard(conceptIndex) {
    console.log('开始更新概念卡，索引：' + conceptIndex);
    
    // 使用存储的概念数据
    if (generatedConcepts && generatedConcepts[conceptIndex]) {
        console.log('找到概念数据，概念名称：' + generatedConcepts[conceptIndex].concept_name);
        
        const concept = generatedConcepts[conceptIndex];
        const conceptName = concept.concept_name;
        const tagline = concept.tagline;
        const sellingPoints = [
            concept.core_selling_point.split('，')[0],
            concept.core_selling_point.split('，')[1],
            concept.core_selling_point.split('，')[2] || '创新体验'
        ];
        
        // 显示概念卡生成部分
        const conceptCardGenerator = document.getElementById('concept-card-generator');
        if (conceptCardGenerator) {
            console.log('找到概念卡生成元素，设置为显示');
            conceptCardGenerator.style.display = 'block';
        } else {
            console.error('未找到概念卡生成元素');
        }
        
        // 滚动到概念卡生成部分
        const conceptCardSection = document.getElementById('concept-card');
        if (conceptCardSection) {
            console.log('找到概念卡部分，开始滚动');
            conceptCardSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            console.error('未找到概念卡部分');
        }
        
        // 更新概念卡内容
        const cardTitle = document.getElementById('concept-card-title');
        if (cardTitle) {
            console.log('找到标题元素，设置为：' + conceptName);
            cardTitle.textContent = conceptName;
        } else {
            console.error('未找到标题元素');
        }
        
        const cardSellingPoints = document.getElementById('concept-card-selling-points');
        if (cardSellingPoints) {
            console.log('找到卖点元素，更新卖点');
            cardSellingPoints.innerHTML = '';
            sellingPoints.forEach(point => {
                const span = document.createElement('span');
                span.textContent = point;
                cardSellingPoints.appendChild(span);
            });
        } else {
            console.error('未找到卖点元素');
        }
        
        // 更新概念卡描述
        const cardDescription = document.getElementById('concept-card-description');
        if (cardDescription) {
            console.log('找到描述元素，设置为：' + concept.core_selling_point);
            cardDescription.textContent = concept.core_selling_point;
        } else {
            console.error('未找到描述元素');
        }
        
        // 优化图片生成：先显示加载状态，然后异步生成图片
        const cardImage = document.getElementById('concept-card-image');
        if (cardImage) {
            console.log('找到图片元素，开始生成图片');
            
            // 显示加载状态
            cardImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAgMTAwIEwxOTAgMTAwIEwxMDAgMTAiIHN0cm9rZT0iIzNiODJmNiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTEwIDEwMCBMMTkwIDEwMCBMMTAwIDE5MCIgc3Ryb2tlPSIjM2I4MmY2IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48L3N2Zz4=';
            
            // 异步生成图片，避免阻塞UI
            setTimeout(() => {
                const imageUrl = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(conceptName)} 产品图 现代简约风格&image_size=square&t=${new Date().getTime()}`;
                console.log('生成图片URL：' + imageUrl);
                cardImage.src = imageUrl;
                
                // 添加图片加载和错误处理
                cardImage.onload = function() {
                    console.log('图片加载成功');
                };
                
                cardImage.onerror = function() {
                    console.error('图片加载失败');
                };
            }, 100);
        } else {
            console.error('未找到图片元素');
        }
        
        alert('概念卡生成完成！');
    } else {
        alert('未找到概念数据，请重新生成概念');
    }
}

// 初始化页面
function initPage() {
    // 初始化页面状态
    console.log('页面初始化完成！');
    
    // 绑定事件
    bindEvents();
}

// 绑定事件
function bindEvents() {
    // 绑定主品类Excel上传事件
    const mainCategoryUpload = document.getElementById('main-category-upload');
    if (mainCategoryUpload) {
        mainCategoryUpload.addEventListener('change', handleMainCategoryUpload);
    }
    
    // 绑定副品类Excel上传事件
    const subCategoryUpload = document.getElementById('sub-category-upload');
    if (subCategoryUpload) {
        subCategoryUpload.addEventListener('change', handleSubCategoryUpload);
    }
    
    console.log('事件绑定完成！');
}

// 收藏夹功能
let favorites = [];

// 保存到收藏夹
function saveToFavorites() {
    const cardTitle = document.getElementById('concept-card-title');
    const cardSellingPoints = document.getElementById('concept-card-selling-points');
    const cardDescription = document.getElementById('concept-card-description');
    const cardImage = document.getElementById('concept-card-image');
    
    if (cardTitle) {
        const concept = {
            id: Date.now(),
            name: cardTitle.textContent,
            sellingPoints: Array.from(cardSellingPoints.querySelectorAll('span')).map(span => span.textContent),
            description: cardDescription ? cardDescription.textContent : '',
            image: cardImage ? cardImage.src : ''
        };
        
        // 添加到收藏夹
        favorites.push(concept);
        
        // 保存到本地存储
        localStorage.setItem('aiInnovationFavorites', JSON.stringify(favorites));
        
        // 更新收藏夹显示
        updateFavoritesList();
        
        alert('概念卡已添加到收藏夹！');
    }
}

// 更新收藏夹列表
function updateFavoritesList() {
    const favoritesList = document.getElementById('favorites-list');
    if (favoritesList) {
        if (favorites.length === 0) {
            favoritesList.innerHTML = '<p class="empty-message">暂无收藏的概念卡</p>';
        } else {
            favoritesList.innerHTML = '';
            favorites.forEach(concept => {
                const favoriteCard = document.createElement('div');
                favoriteCard.className = 'concept-card';
                favoriteCard.innerHTML = `
                    <h4>${concept.name}</h4>
                    <div class="selling-points">
                        ${concept.sellingPoints.map(point => `<span>${point}</span>`).join('')}
                    </div>
                    <p class="card-description">${concept.description}</p>
                    ${concept.image ? `<div class="favorite-image"><img src="${concept.image}" alt="${concept.name}"></div>` : ''}
                    <button class="btn secondary-btn" onclick="removeFromFavorites(${concept.id})">移除收藏</button>
                `;
                favoritesList.appendChild(favoriteCard);
            });
        }
    }
}

// 从收藏夹移除
function removeFromFavorites(id) {
    favorites = favorites.filter(concept => concept.id !== id);
    localStorage.setItem('aiInnovationFavorites', JSON.stringify(favorites));
    updateFavoritesList();
    alert('概念卡已从收藏夹移除！');
}

// 加载收藏的概念卡
function loadFavorites() {
    const savedFavorites = localStorage.getItem('aiInnovationFavorites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
    }
    updateFavoritesList();
}

// 调用初始化函数
initPage();

// 加载收藏的概念卡
loadFavorites();