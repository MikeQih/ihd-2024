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

    closeAllProjectLists() {
        document.querySelectorAll('.course-button').forEach(button => {
            button.setAttribute('aria-expanded', 'false');
            const projectList = document.getElementById(button.getAttribute('aria-controls'));
            if (projectList) {
                projectList.classList.remove('expanded');
            }
        });
    }

    toggleProjectList(button) {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        const projectList = document.getElementById(button.getAttribute('aria-controls'));
                
        // 切换状态
        button.setAttribute('aria-expanded', !isExpanded);
        if (projectList) {
            if (isExpanded) {
                projectList.classList.remove('expanded');
            } else {
                projectList.classList.add('expanded');
            }
        }
    }

    setInitialCourseState() {
        const currentCourseId = this.getCurrentCourseId();
        if (currentCourseId) {
            const currentButton = document.querySelector(`[aria-controls="projects-${currentCourseId}"]`);
            if (currentButton) {
                currentButton.setAttribute('aria-expanded', 'true');
                const projectList = document.getElementById(`projects-${currentCourseId}`);
                if (projectList) {
                    projectList.classList.add('expanded');
                }

                const courseItem = currentButton.closest('li');
                if (courseItem) {
                    courseItem.classList.add('active');
                }
            }
        }
    }


    setupCourseButtons() {
        // 先关闭所有项目列表
        this.closeAllProjectLists();

        // 为每个按钮设置点击事件
        document.querySelectorAll('.course-button').forEach(button => {
            const courseLink = button.querySelector('.course-link');
            if (courseLink) {
                courseLink.addEventListener('click', (e) => {
                    if (courseLink.getAttribute('href') === window.location.pathname.split('/').pop()) {
                        e.preventDefault();
                    }
                });
            }
    
            button.addEventListener('click', () => {
                this.toggleProjectList(button);
            });
        });
    
        // 根据当前URL设置初始状态
        this.setInitialCourseState();
    }

    getCurrentCourseId() {
        const path = window.location.pathname;
        const match = path.match(/(\d+)/);
        return match ? match[1] : null;
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