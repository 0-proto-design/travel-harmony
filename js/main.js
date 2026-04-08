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

  // Search Clear Logic
  const clearBtn = document.querySelector('.js-search-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      // 1. Clear all checkboxes and trigger their change event (for multi-select tags)
      const checkboxes = document.querySelectorAll('.js-custom-select input[type="checkbox"]');
      checkboxes.forEach(cb => {
        if (cb.checked) {
          cb.checked = false;
          cb.dispatchEvent(new Event('change'));
        }
      });

      // 2. Clear all custom selects (including single selects)
      const customSelects = document.querySelectorAll('.js-custom-select');
      customSelects.forEach(select => {
        const label = select.querySelector('.c-custom-select__label');
        const placeholder = select.getAttribute('data-placeholder');
        if (label && placeholder) {
          label.textContent = placeholder;
          label.classList.add('is-placeholder');
          label.innerHTML = placeholder; // Clear any tag elements
        }
        
        // Remove selection states from single select items
        const items = select.querySelectorAll('.c-custom-select__dropdown-item');
        items.forEach(item => item.classList.remove('is-selected'));
        
        // Close dropdown
        select.classList.remove('is-open');
      });

      // 3. Clear keyword input
      const keywordInput = document.querySelector('.js-search-keyword');
      if (keywordInput) {
        keywordInput.value = '';
      }
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

  // Hamburger Menu Toggle
  const hamburger = document.querySelector('.js-hamburger');
  const headerMenu = document.querySelector('.js-header-menu');

  if (hamburger && headerMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('is-open');
      headerMenu.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    });
  }

  // Mobile Submenu Accordion
  const navItems = document.querySelectorAll('.header__nav-item');
  navItems.forEach(item => {
    const link = item.querySelector('.header__nav-link');
    const submenu = item.querySelector('.header__submenu');

    if (link && submenu) {
      link.addEventListener('click', (e) => {
        // Only intercept on mobile
        if (window.innerWidth > 768) return;
        e.preventDefault();
        const isOpen = item.classList.toggle('is-submenu-open');
        // Close other open submenus
        navItems.forEach(other => {
          if (other !== item) other.classList.remove('is-submenu-open');
        });
      });
    }
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (hamburger && headerMenu) {
      if (!header.contains(e.target)) {
        hamburger.classList.remove('is-open');
        headerMenu.classList.remove('is-open');
        hamburger.setAttribute('aria-label', 'メニューを開く');
      }
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
        const checkedItems = Array.from(checkboxes)
          .filter(cb => cb.checked)
          .map(cb => {
            return {
              value: cb.value,
              text: cb.parentElement.textContent.trim()
            };
          });

        // Clear label for new content
        label.innerHTML = '';

        if (checkedItems.length > 0) {
          checkedItems.forEach(item => {
            const tag = document.createElement('span');
            tag.className = 'c-custom-select__tag';
            tag.textContent = item.text;

            const removeBtn = document.createElement('span');
            removeBtn.className = 'c-custom-select__tag-remove';
            removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            
            removeBtn.addEventListener('click', (e) => {
              e.stopPropagation(); // Prevent opening/closing dropdown
              const targetCheckbox = Array.from(checkboxes).find(cb => cb.value === item.value);
              if (targetCheckbox) {
                targetCheckbox.checked = false;
                targetCheckbox.dispatchEvent(new Event('change'));
              }
            });

            tag.appendChild(removeBtn);
            label.appendChild(tag);
          });
          label.classList.remove('is-placeholder');
        } else {
          label.textContent = placeholder;
      label.classList.add('is-placeholder');
        }
      });
    });
  });

  // Tour Slider Logic
  const sliders = document.querySelectorAll('.c-slider');
  
  const initSlider = (slider) => {
    const track = slider.querySelector('.js-slider-track');
    const prevBtn = slider.querySelector('.js-slider-prev');
    const nextBtn = slider.querySelector('.js-slider-next');
    const dotsContainer = slider.querySelector('.js-slider-dots');
    
    if (!track || !dotsContainer) return;
    
    const items = track.querySelectorAll('.c-slider__item');
    if (items.length === 0) return;

    let dots = [];

    const updateDots = () => {
      dotsContainer.innerHTML = '';
      const itemWidth = items[0].offsetWidth + 20; // 20 is gap
      const maxScrollLeft = track.scrollWidth - track.clientWidth;
      
      if (maxScrollLeft <= 0) {
        dotsContainer.style.display = 'none';
        return;
      } else {
        dotsContainer.style.display = 'flex';
      }

      // Calculate how many dots we need
      // Each dot represents one item at the start of the view
      const dotCount = Math.floor(maxScrollLeft / itemWidth) + 1;
      
      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('button');
        dot.className = 'c-slider__dot';
        if (i === 0) dot.classList.add('is-active');
        
        dot.addEventListener('click', () => {
          let scrollTarget = itemWidth * i;
          if (scrollTarget > maxScrollLeft) scrollTarget = maxScrollLeft;
          track.scrollTo({ left: scrollTarget, behavior: 'smooth' });
        });
        dotsContainer.appendChild(dot);
      }
      dots = dotsContainer.querySelectorAll('.c-slider__dot');
      updateActiveDot();
    };

    const updateActiveDot = () => {
      const itemWidth = items[0].offsetWidth + 20;
      const index = Math.round(track.scrollLeft / itemWidth);
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
      });
    };

    // Initialize
    setTimeout(updateDots, 100); // Small delay to ensure layout is ready

    // Update dots on scroll
    track.addEventListener('scroll', updateActiveDot);

    // Arrow controls
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const itemWidth = items[0].offsetWidth + 20;
        track.scrollBy({ left: -itemWidth, behavior: 'smooth' });
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const itemWidth = items[0].offsetWidth + 20;
        track.scrollBy({ left: itemWidth, behavior: 'smooth' });
      });
    }

    // Handle resize
    window.addEventListener('resize', updateDots);
    
    // Custom event for tab switching
    slider.addEventListener('slider-update', updateDots);
  };

  sliders.forEach(initSlider);

  // Tab switching logic (Modified to update sliders)
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

    const activeBtn = document.querySelector('.c-tabs__btn.is-active');
    if (activeBtn) updateTabBackground(activeBtn);

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');

        tabBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        updateTabBackground(btn);

        tabContents.forEach(content => {
          content.classList.remove('is-active');
          if (content.id === targetId) {
            content.classList.add('is-active');
            // Trigger slider update for the newly visible content
            const slider = content.querySelector('.c-slider');
            if (slider) {
              slider.dispatchEvent(new Event('slider-update'));
            }
          }
        });
      });
    });
  }

  // Global click to close dropdowns
  document.addEventListener('click', () => {
    customSelects.forEach(select => select.classList.remove('is-open'));
  });
  // Modal Logic for Floating Search Button
  const searchModal = document.getElementById('js-search-modal');
  const openModalBtn = document.querySelector('.c-floating-btn--search');
  const closeBtns = document.querySelectorAll('.js-modal-close');

  if (searchModal && openModalBtn) {
    openModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      searchModal.classList.add('is-open');
    });

    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        searchModal.classList.remove('is-open');
      });
    });
  }

  // Back to Top Logic
  const backToTopBtn = document.querySelector('.js-back-to-top');
  
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
