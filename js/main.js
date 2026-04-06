document.addEventListener('DOMContentLoaded', () => {
  // Tab switching logic
  const tabBtns = document.querySelectorAll('.c-tabs__btn');
  const tabContents = document.querySelectorAll('.c-tabs__content');

  if (tabBtns.length > 0) {
    const tabNav = document.querySelector('.c-tabs__nav');
    
    const updateTabBackground = (btn) => {
      const rect = btn.getBoundingClientRect();
      const navRect = tabNav.getBoundingClientRect();
      const left = rect.left - navRect.left;
      const width = rect.width;
      
      tabNav.style.setProperty('--tab-x', `${left}px`);
      tabNav.style.setProperty('--tab-width', `${width}px`);
    };

    // Initial position
    const activeBtn = document.querySelector('.c-tabs__btn.is-active');
    if (activeBtn) updateTabBackground(activeBtn);

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');

        // Update buttons
        tabBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        
        // Update background position
        updateTabBackground(btn);

        // Update content
        tabContents.forEach(content => {
          content.classList.remove('is-active');
          if (content.id === targetId) {
            content.classList.add('is-active');
          }
        });
      });
    });
  }

  // Header scroll effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
      header.style.backgroundColor = 'rgba(253, 251, 248, 0.98)';
    } else {
      header.style.boxShadow = 'none';
      header.style.backgroundColor = 'rgba(253, 251, 248, 0.95)';
    }
  });

  // Reveal on scroll
  const revealElements = document.querySelectorAll('.section-title, .c-card, .beginner__item, .news__item');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
    revealObserver.observe(el);
  });

  // Custom Select Dropdown logic
  const customSelects = document.querySelectorAll('.js-custom-select');
  
  customSelects.forEach(select => {
    const trigger = select.querySelector('.c-custom-select__trigger');
    const label = select.querySelector('.c-custom-select__label');
    const checkboxes = select.querySelectorAll('input[type="checkbox"]');
    const placeholder = select.getAttribute('data-placeholder');
    const isMulti = select.getAttribute('data-multi') === 'true';

    // Toggle dropdown
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      customSelects.forEach(s => {
        if (s !== select) s.classList.remove('is-open');
      });
      select.classList.toggle('is-open');
    });

    // Handle item clicks
    const items = select.querySelectorAll('.c-custom-select__dropdown-item');
    items.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();

        if (isMulti) {
          const checkbox = item.querySelector('input[type="checkbox"]');
          if (e.target !== checkbox) {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
          }
        } else {
          // Single select logic (No checkbox)
          const value = item.getAttribute('data-value') || item.textContent;
          label.textContent = value;
          label.classList.remove('is-placeholder');
          
          // Selection state visual (optional)
          items.forEach(i => i.classList.remove('is-selected'));
          item.classList.add('is-selected');

          select.classList.remove('is-open');
        }
      });
    });

    // Handle checkbox changes (for multi-select)
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const checkedValues = Array.from(checkboxes)
          .filter(cb => cb.checked)
          .map(cb => cb.value);

        if (checkedValues.length > 0) {
          label.textContent = checkedValues.join(', ');
          label.classList.remove('is-placeholder');
        } else {
          label.textContent = placeholder;
          label.classList.add('is-placeholder');
        }
      });
    });
  });

  // Global click to close dropdowns
  document.addEventListener('click', () => {
    customSelects.forEach(select => select.classList.remove('is-open'));
  });

  // Scroll to Top Button Logic
  const scrollTopBtn = document.getElementById('js-scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('is-visible');
      } else {
        scrollTopBtn.classList.remove('is-visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
