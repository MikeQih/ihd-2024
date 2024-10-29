// Program Menu Toggle
function toggleProgramMenu() {
    const button = document.querySelector('.program-button');
    const menu = document.querySelector('.program-menu');
    
    button.addEventListener('click', () => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !isExpanded);
        menu.classList.toggle('show');
    });

    // Click to close menu
    document.addEventListener('click', (e) => {
        if (!button.contains(e.target) && !menu.contains(e.target)) {
            button.setAttribute('aria-expanded', 'false');
            menu.classList.remove('show');
        }
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    toggleProgramMenu();
    // Other Functions
});