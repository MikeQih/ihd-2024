class CoursePageManager {
    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.content = document.querySelector('.course-content');
        this.toggle = document.querySelector('.sidebar-toggle');
        this.mobileBreakpoint = 768;
        
        this.init();
    }
    
    init() {
        this.handleInitialState();
        this.setupEventListeners();
        this.handleResponsiveState();
    }
    
    handleInitialState() {
        // 检查屏幕大小和存储的状态
        const isMobile = window.innerWidth <= this.mobileBreakpoint;
        const wasCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        
        if (isMobile) {
            // 移动端默认收起
            this.sidebar.classList.add('collapsed');
            this.content.style.marginLeft = '0';
        } else if (wasCollapsed) {
            // 桌面端恢复上次状态
            this.sidebar.classList.add('collapsed');
            this.content.style.marginLeft = '60px';
        }
    }
    
    setupEventListeners() {
        // 切换按钮事件
        this.toggle?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleSidebar();
        });
        
        // 响应式变化监听
        window.matchMedia(`(max-width: ${this.mobileBreakpoint}px)`)
            .addListener(() => this.handleResponsiveState());
            
        // 页面加载完成后检查
        window.addEventListener('load', () => this.handleResponsiveState());
    }
    
    toggleSidebar() {
        const isCollapsed = this.sidebar.classList.toggle('collapsed');
        
        if (window.innerWidth > this.mobileBreakpoint) {
            this.content.style.marginLeft = isCollapsed ? '60px' : '300px';
            localStorage.setItem('sidebarCollapsed', isCollapsed);
        }
    }
    
    handleResponsiveState() {
        const isMobile = window.innerWidth <= this.mobileBreakpoint;
        
        if (isMobile) {
            this.sidebar.classList.add('collapsed');
            this.content.style.marginLeft = '0';
        } else {
            const wasCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
            this.content.style.marginLeft = wasCollapsed ? '60px' : '300px';
            this.sidebar.classList.toggle('collapsed', wasCollapsed);
        }
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new CoursePageManager();
});