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

        console.log('Current URL:', window.location.pathname);
        console.log('Current Course ID:', this.getCurrentCourseId());
        console.log('Found Buttons:', document.querySelectorAll('.course-button').length);
        console.log('LocalStorage State:', localStorage.getItem('sidebarCollapsed'));
        // 测试不同路径的匹配
        const testPaths = [
            '/projects/01101/project1_01101.html',
            '/projects/01101/project1_01101',
            '/courses/01101.html'  // 添加课程页面的路径
        ];
        console.log('=== Path Matching Tests ===');
        testPaths.forEach(testPath => {
            const match = testPath.match(/\/(?:projects\/|courses\/)(\d+)/);
            console.log(`Test path: ${testPath}`);
            console.log(`Match result:`, match);
            console.log(`Extracted ID:`, match ? match[1] : null);
        });

        const path = window.location.pathname;
        const currentCourseId = this.getCurrentCourseId();
        console.log('Processing path:', path);
        console.log('Current Course ID:', currentCourseId);

        if (currentCourseId) {
            const currentButton = document.querySelector(`[aria-controls="projects-${currentCourseId}"]`);
            if (currentButton) {
                currentButton.setAttribute('aria-expanded', 'true');
                const projectList = document.getElementById(`projects-${currentCourseId}`);
                if (projectList) {
                    // 先移除所有已展开的列表
                    document.querySelectorAll('.project-list').forEach(list => {
                        if (list !== projectList) {
                            list.classList.remove('expanded');
                        }
                    });
                    
                    // 展开当前列表
                    projectList.classList.add('expanded');
                    console.log('Expanded project list:', projectList.id);

                    // 处理项目链接的激活状态
                    if (path.includes('project')) {
                        const projectMatch = path.match(/project(\d+)_/);
                        const projectNumber = projectMatch ? projectMatch[1] : null;
                        
                        if (projectNumber) {
                            // 查找并激活当前项目链接
                            const projectLinkSelector = `a[href$="project${projectNumber}_${currentCourseId}.html"], a[href$="project${projectNumber}_${currentCourseId}"]`;
                            const projectLink = projectList.querySelector(projectLinkSelector);
                            console.log('Found project link:', projectLink);
                            
                            if (projectLink) {
                                projectList.querySelectorAll('a').forEach(link => {
                                    link.classList.remove('active');
                                });
                                projectLink.classList.add('active');
                            }
                        }
                    }
                }

                const courseItem = currentButton.closest('li');
                if (courseItem) {
                    document.querySelectorAll('.course-item').forEach(item => {
                        item.classList.remove('active');
                    });
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

    // Old Version:
    // getCurrentCourseId() {
    //     const path = window.location.pathname;
    //     const match = path.match(/(\d+)/);
    //     return match ? match[1] : null;
    // }

    // New Version (Consider Netlify without .html Version)
    getCurrentCourseId() {
        const path = window.location.pathname;
        console.log('Current path:', path);
        
        // 同时匹配两种格式:
        // 1. /courses/01101.html (本地和 Netlify)
        // 2. /courses/01101 (Netlify, 无 .html)
        // 3. /projects/01101/project1_01101.html (本地)
        // 4. /projects/01101/project1_01101 (Netlify)
        const courseMatch = path.match(/\/courses\/(\d+)(?:\.html)?$/);
        const projectMatch = path.match(/\/projects\/(\d+)\/project\d+_\1(?:\.html)?$/);
        
        console.log('Course match:', courseMatch);
        console.log('Project match:', projectMatch);
        
        // 返回匹配到的第一个ID
        return (courseMatch && courseMatch[1]) || (projectMatch && projectMatch[1]) || null;
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