// 课程页面的侧边栏控制
function toggleSidebarMenu() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.course-content');
    
    // 确保元素存在
    if (!sidebarToggle || !sidebar || !content) return;
    
    // 切换侧边栏
    sidebarToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        sidebar.classList.toggle('collapsed');
        
        // 更新内容区域
        if (sidebar.classList.contains('collapsed')) {
            content.style.marginLeft = '60px';
        } else {
            content.style.marginLeft = '300px';
        }
        
        // 保存状态
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    });
    
    // 恢复上次的状态
    const wasCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (wasCollapsed) {
        sidebar.classList.add('collapsed');
        content.style.marginLeft = '60px';
    }
    
    // 移动端适配
    const mobileToggle = window.matchMedia('(max-width: 768px)');
    
    function handleMobileChange(e) {
        if (e.matches) {
            content.style.marginLeft = '0';
            sidebar.classList.remove('collapsed');
        } else {
            content.style.marginLeft = wasCollapsed ? '60px' : '300px';
        }
    }
    
    mobileToggle.addListener(handleMobileChange);
    handleMobileChange(mobileToggle);
}

// 初始化课程页面功能
document.addEventListener('DOMContentLoaded', () => {
    toggleSidebarMenu();
});