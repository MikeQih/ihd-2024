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
        this.setupCourseButtons();
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

    setupCourseButtons() {
        document.querySelectorAll('.course-button').forEach(button => {
            // 处理课程链接点击
            const courseLink = button.querySelector('.course-link');
            if (courseLink) {
                courseLink.addEventListener('click', (e) => {
                    // 如果是当前页面的链接，阻止默认行为
                    if (courseLink.getAttribute('href') === window.location.pathname.split('/').pop()) {
                        e.preventDefault();
                    }
                });
            }
    
            button.addEventListener('click', () => {
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                const projectList = document.getElementById(button.getAttribute('aria-controls'));
                
                // 关闭其他展开的项目列表
                // document.querySelectorAll('.course-button').forEach(otherButton => {
                //     if (otherButton !== button && otherButton.getAttribute('aria-expanded') === 'true') {
                //         otherButton.setAttribute('aria-expanded', 'false');
                //         const otherList = document.getElementById(otherButton.getAttribute('aria-controls'));
                //         otherList.classList.remove('expanded');
                //     }
                // });
    
                // 切换当前项目列表
                // button.setAttribute('aria-expanded', !isExpanded);
                // projectList.classList.toggle('expanded');

                button.setAttribute('aria-expanded', !isExpanded);
                if (projectList) {
                    projectList.classList.toggle('expanded');
                }
            });
        });
    
        // 根据当前URL设置active状态
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage) {
            const targetLink = document.querySelector(`.course-link[href="${currentPage}"]`);
            if (targetLink) {
                const courseItem = targetLink.closest('li');
                if (courseItem) {
                    // 只将当前课程设为active
                    courseItem.classList.add('active');
                    const projectList = courseItem.querySelector('.project-list');
                    const button = courseItem.querySelector('.course-button');
                    if (projectList && button) {
                        projectList.classList.add('expanded');
                        button.setAttribute('aria-expanded', 'true');
                    }
                }
            }
        }
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