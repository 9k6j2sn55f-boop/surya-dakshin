/**
 * Surya Dakshin - Core Client Script
 * Vanilla DOM interactions for navigation, filtering, and scroll synchronization.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMenuFilters();
  initHeaderScroll();
});

/**
 * Mobile Navigation Drawer & ARIA Accessibility
 */
function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  const masthead = document.getElementById('masthead');
  const navLinks = primaryNav ? primaryNav.querySelectorAll('.nav-link') : [];

  if (!navToggle || !primaryNav) return;

  const toggleMenu = (forceState) => {
    const isCurrentlyOpen = primaryNav.classList.contains('is-open');
    const targetState = typeof forceState === 'boolean' ? forceState : !isCurrentlyOpen;

    primaryNav.classList.toggle('is-open', targetState);
    navToggle.classList.toggle('is-active', targetState);
    navToggle.setAttribute('aria-expanded', String(targetState));

    if (window.innerWidth <= 768) {
      document.body.style.overflow = targetState ? 'hidden' : '';
    }
  };

  navToggle.addEventListener('click', () => toggleMenu());

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (primaryNav.classList.contains('is-open')) {
        toggleMenu(false);
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (
      primaryNav.classList.contains('is-open') &&
      masthead &&
      !masthead.contains(event.target)
    ) {
      toggleMenu(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && primaryNav.classList.contains('is-open')) {
      toggleMenu(false);
      document.body.style.overflow = '';
    }
  }, { passive: true });
}

/**
 * Menu Category Matrix Filtering
 */
function initMenuFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-item-card');

  if (!filterButtons.length || !menuItems.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedFilter = btn.getAttribute('data-filter');

      filterButtons.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle('is-active', isActive);
        b.setAttribute('aria-selected', String(isActive));
      });

      menuItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        const shouldShow = selectedFilter === 'all' || itemCategory === selectedFilter;

        if (shouldShow) {
          item.style.display = 'flex';
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(6px)';
          item.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Header Elevation on Scroll
 */
function initHeaderScroll() {
  const masthead = document.getElementById('masthead');
  if (!masthead) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      masthead.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.45)';
      masthead.style.borderBottomColor = 'rgba(245, 242, 235, 0.14)';
    } else {
      masthead.style.boxShadow = 'none';
      masthead.style.borderBottomColor = 'rgba(245, 242, 235, 0.08)';
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}
