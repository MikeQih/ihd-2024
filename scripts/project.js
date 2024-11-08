class ProjectPageManager {
    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.content = document.querySelector('.course-content');
        this.toggle = document.querySelector('.sidebar-toggle');
        this.programmeTitle = document.querySelector('.sidebar-header h1');
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

        this.programmeTitle?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleSidebar();
        });

        if (this.programmeTitle) {
            this.programmeTitle.style.cursor = 'pointer';
        }
        
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
                
        if (!isExpanded) {
            // close all other expand
            document.querySelectorAll('.course-button').forEach(otherButton => {
                if (otherButton !== button) {  // except for current button
                    otherButton.setAttribute('aria-expanded', 'false');
                    const otherList = document.getElementById(otherButton.getAttribute('aria-controls'));
                    if (otherList) {
                        otherList.classList.remove('expanded');
                    }
                }
            });
        }

        // open current button
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
        // 获取当前URL路径
        const path = window.location.pathname;
        // 检查是否是项目页面
        const isProjectPage = path.includes('project');
        
        if (isProjectPage) {
            // 从路径中提取课程ID (例如从 'project1_01101.html' 提取 '01101')
            const courseMatch = path.match(/\/(\d+)\/project\d+_\1\.html$/);
            const courseId = courseMatch ? courseMatch[1] : null;
            
            if (courseId) {
                document.querySelectorAll('.course-button.active').forEach(button => {
                    button.classList.remove('active');
                });

                // 找到对应的课程按钮
                const courseButton = document.querySelector(`[aria-controls="projects-${courseId}"]`);
                if (courseButton) {
                    courseButton.classList.add('active');
                    courseButton.setAttribute('aria-expanded', 'true');
                    const projectList = document.getElementById(`projects-${courseId}`);
                    if (projectList) {
                        projectList.classList.add('expanded');
                    }
                    
                    // 标记课程为激活状态
                    // const courseItem = courseButton.closest('li');
                    // if (courseItem) {
                    //     courseItem.classList.add('active');
                    // }
                    
                    // 获取项目编号 (例如从 'project1_01101.html' 提取 '1')
                    const projectMatch = path.match(/project(\d+)_/);
                    const projectNumber = projectMatch ? projectMatch[1] : null;
                    
                    if (projectNumber) {
                        // 找到并激活对应的项目链接
                        const projectLink = projectList.querySelector(`a[href$="project${projectNumber}_${courseId}.html"]`);
                        if (projectLink) {
                            // 移除其他项目的激活状态
                            projectList.querySelectorAll('a').forEach(link => {
                                link.classList.remove('active');
                            });
                            // 添加当前项目的激活状态
                            projectLink.classList.add('active');
                        }
                    }
                }
            }
        } else {
            // 原有的课程页面逻辑
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
        // const match = path.match(/(\d+)/);
        // const match = path.match(/project\d+_(\d+)\.html$/);
        const match = path.match(/\/(\d+)\/project\d+_\1\.html$/);

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
            // 移动端状态
            this.sidebar.classList.add('collapsed');
            this.content.style.marginLeft = '60px'; // 改为固定的 60px 而不是 0
            
            // 确保标题和箭头正确显示
            if (this.programmeTitle) {
                this.programmeTitle.style.display = 'none'; // 隐藏文字
            }
            if (this.toggle) {
                this.toggle.style.display = 'block'; // 确保箭头显示
            }
        } else {
            // 桌面端状态
            const wasCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
            this.content.style.marginLeft = wasCollapsed ? '60px' : '300px';
            this.sidebar.classList.toggle('collapsed', wasCollapsed);
            
            // 恢复标题和箭头的显示
            if (this.programmeTitle) {
                this.programmeTitle.style.display = ''; // 恢复默认显示
            }
            if (this.toggle) {
                this.toggle.style.display = ''; // 恢复默认显示
            }
        }
    }

}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new ProjectPageManager();
});