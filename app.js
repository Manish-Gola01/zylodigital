document.addEventListener('DOMContentLoaded', () => {
  // --- Navbar Scroll Effect ---
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Menu Toggle ---
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // --- Smooth Scroll Active Link Highlighting ---
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    try {
      let current = '';
      const scrollPos = window.scrollY || window.pageYOffset || 0;
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollPos >= (sectionTop - 150)) {
          current = section.getAttribute('id') || '';
        }
      });

      navItems.forEach(item => {
        item.classList.remove('active');
        const href = item.getAttribute('href');
        if (href && href.startsWith('#') && href.slice(1) === current) {
          item.classList.add('active');
        }
      });
    } catch (e) {
      console.error(e);
    }
  });

  // --- Live Search & Category Filter for Services ---
  const searchInput = document.getElementById('service-search');
  const serviceCards = document.querySelectorAll('.service-card');
  const filterBtns = document.querySelectorAll('.service-filter-btn');
  let activeCategory = 'all';

  function applyServiceFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    serviceCards.forEach(card => {
      const titleEl = card.querySelector('h3');
      const descEl = card.querySelector('p');
      const cardCategory = card.getAttribute('data-category') || '';
      const title = titleEl ? titleEl.textContent.toLowerCase() : '';
      const desc = descEl ? descEl.textContent.toLowerCase() : '';

      const matchesSearch = !query || title.includes(query) || desc.includes(query);
      const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;

      if (matchesSearch && matchesCategory) {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyServiceFilters);
  }

  if (filterBtns) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-filter') || 'all';
        applyServiceFilters();
      });
    });
  }

  // --- Interactive Showcase Mockup Tabs ---
  const tabDevice = document.getElementById('tab-mockup-device');
  const tabDashboard = document.getElementById('tab-mockup-dashboard');
  const mockupImg = document.getElementById('mockup-display-img');

  if (tabDevice && tabDashboard && mockupImg) {
    tabDevice.addEventListener('click', () => {
      tabDevice.classList.add('active');
      tabDashboard.classList.remove('active');
      mockupImg.style.opacity = '0';
      setTimeout(() => {
        mockupImg.src = 'assets/mockup.jpg';
        mockupImg.alt = 'Responsive device view mockups';
        mockupImg.style.opacity = '1';
      }, 150);
    });

    tabDashboard.addEventListener('click', () => {
      tabDashboard.classList.add('active');
      tabDevice.classList.remove('active');
      mockupImg.style.opacity = '0';
      setTimeout(() => {
        mockupImg.src = 'assets/dashboard_mockup.jpg';
        mockupImg.alt = '3D Holographic Analytics Dashboard';
        mockupImg.style.opacity = '1';
      }, 150);
    });
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(other => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // --- Pill Checkboxes & Radio Listeners ---
  document.querySelectorAll('.pill-check-label').forEach(label => {
    label.addEventListener('click', (e) => {
      const radio = label.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        const parentGroup = label.closest('.pill-radio-group');
        if (parentGroup) {
          parentGroup.querySelectorAll('.pill-check-label').forEach(l => l.classList.remove('selected'));
        }
        label.classList.add('selected');
      } else {
        const checkbox = label.querySelector('input[type="checkbox"]');
        if (checkbox) {
          setTimeout(() => {
            if (checkbox.checked) {
              label.classList.add('selected');
            } else {
              label.classList.remove('selected');
            }
          }, 10);
        }
      }
    });
  });

  // --- Form Submission & Booking Modal ---
  const bookingForm = document.getElementById('booking-form');
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal');
  
  if (bookingForm && successModal) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get values
      const name = document.getElementById('client-name') ? document.getElementById('client-name').value : 'Client';
      const email = document.getElementById('client-email') ? document.getElementById('client-email').value : '';
      const phone = document.getElementById('client-phone') ? document.getElementById('client-phone').value : '';
      const company = document.getElementById('client-company') ? document.getElementById('client-company').value : '';
      const social = document.getElementById('client-social') ? document.getElementById('client-social').value : '';
      const notes = document.getElementById('client-notes') ? document.getElementById('client-notes').value : '';
      
      // Get service
      let servicesStr = '';
      const serviceSelect = document.getElementById('client-service');
      if (serviceSelect && serviceSelect.value) {
        servicesStr = serviceSelect.value;
      } else {
        const checkedServices = [];
        document.querySelectorAll('input[name="services"]:checked').forEach(cb => {
          checkedServices.push(cb.value);
        });
        servicesStr = checkedServices.length > 0 ? checkedServices.join(', ') : 'Custom Project';
      }
      
      // Get budget
      let budgetVal = '';
      const budgetSelect = document.getElementById('client-budget');
      if (budgetSelect && budgetSelect.value) {
        budgetVal = budgetSelect.value;
      } else {
        const checkedBudget = document.querySelector('input[name="budget"]:checked');
        budgetVal = checkedBudget ? checkedBudget.value : '₹35K – ₹50K';
      }
      
      // Generate Booking ID
      const bookingId = 'ZYLO-' + Math.floor(100000 + Math.random() * 900000);
      
      // Populate receipt
      if (document.getElementById('receipt-id')) document.getElementById('receipt-id').textContent = bookingId;
      if (document.getElementById('receipt-name')) document.getElementById('receipt-name').textContent = name + (company ? ` (${company})` : '');
      if (document.getElementById('receipt-service')) document.getElementById('receipt-service').textContent = servicesStr;
      if (document.getElementById('receipt-price')) document.getElementById('receipt-price').textContent = budgetVal;
      
      // Save to localStorage
      const bookingData = {
        bookingId,
        name: name + (company ? ` (${company})` : ''),
        email,
        phone: phone + (social ? ` | ${social}` : ''),
        service: servicesStr,
        price: budgetVal,
        advance: '₹15,000',
        remaining: '₹20,000',
        notes: notes,
        status: 'Pending',
        timestamp: new Date().toISOString()
      };
      
      let currentBookings = [];
      try {
        currentBookings = JSON.parse(localStorage.getItem('zylo_bookings')) || [];
        if (!Array.isArray(currentBookings)) currentBookings = [];
      } catch (err) {
        currentBookings = [];
      }
      currentBookings.push(bookingData);
      localStorage.setItem('zylo_bookings', JSON.stringify(currentBookings));
      
      // Show Modal
      successModal.classList.add('active');
      
      // Reset Form
      bookingForm.reset();
    });
  }
  
  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });
    
    // Close modal on click outside content
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
      }
    });
  }

  // --- Scroll Animations (Intersection Observer) ---
  const fadeElements = document.querySelectorAll('.fade-in');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
          observer.unobserve(entry.target); // trigger animation once
        }
      });
    }, observerOptions);
    
    fadeElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    fadeElements.forEach(el => el.classList.add('appear'));
  }

  // --- Staff Portal Login & Dashboard Logic ---
  const staffPortalTrigger = document.getElementById('staff-portal-trigger');
  const staffPortalDrawerTrigger = document.getElementById('staff-portal-drawer-trigger');
  const staffLoginModal = document.getElementById('staff-login-modal');
  const closeStaffLogin = document.getElementById('close-staff-login');
  const staffLoginForm = document.getElementById('staff-login-form');
  const loginErrorMsg = document.getElementById('login-error-msg');
  
  const staffDashboardModal = document.getElementById('staff-dashboard-modal');
  const closeStaffDashboard = document.getElementById('close-staff-dashboard');
  const staffLogoutBtn = document.getElementById('staff-logout-btn');
  const bookingsListBody = document.getElementById('bookings-list-body');
  const noBookingsMsg = document.getElementById('no-bookings-msg');

  // Open login modal
  const openLogin = (e) => {
    e.preventDefault();
    if (loginErrorMsg) {
      loginErrorMsg.style.display = 'none';
    }
    if (staffLoginModal) {
      staffLoginModal.classList.add('active');
    }
    
    // Auto-close hamburger menu on mobile
    if (menuToggle && navLinks) {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    }
  };

  if (staffPortalTrigger && staffLoginModal) {
    staffPortalTrigger.addEventListener('click', openLogin);
  }
  if (staffPortalDrawerTrigger && staffLoginModal) {
    staffPortalDrawerTrigger.addEventListener('click', openLogin);
  }

  // Close login modal
  if (closeStaffLogin && staffLoginModal) {
    closeStaffLogin.addEventListener('click', () => {
      staffLoginModal.classList.remove('active');
    });
  }

  // Perform Login
  if (staffLoginForm) {
    staffLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('staff-email').value.trim();
      const password = document.getElementById('staff-password').value;

      if ((email === 'supportzylo.digital@gmail.com' || email === 'info@zylo.digital') && password === 'zylo@123@') {
        // Success
        staffLoginModal.classList.remove('active');
        staffLoginForm.reset();
        loginErrorMsg.style.display = 'none';
        
        // Open Dashboard & render
        renderStaffBookings();
        staffDashboardModal.classList.add('active');
      } else {
        // Fail
        loginErrorMsg.style.display = 'block';
      }
    });
  }

  // Render bookings in table
  function renderStaffBookings() {
    if (!bookingsListBody) return;
    
    let bookings = [];
    try {
      bookings = JSON.parse(localStorage.getItem('zylo_bookings')) || [];
      if (!Array.isArray(bookings)) bookings = [];
    } catch (err) {
      bookings = [];
    }
    // Update metrics cards
    const metricTotal = document.getElementById('metric-total-bookings');
    const metricConfirmed = document.getElementById('metric-confirmed-bookings');
    if (metricTotal) {
      metricTotal.textContent = bookings.length;
    }
    if (metricConfirmed) {
      const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
      metricConfirmed.textContent = confirmedCount;
    }

    bookingsListBody.innerHTML = '';

    if (bookings.length === 0) {
      document.getElementById('staff-bookings-table').style.display = 'none';
      noBookingsMsg.style.display = 'block';
    } else {
      document.getElementById('staff-bookings-table').style.display = 'table';
      noBookingsMsg.style.display = 'none';

      bookings.forEach((booking, index) => {
        const row = document.createElement('tr');
        
        // Format timestamp
        const dateObj = new Date(booking.timestamp);
        const formattedDate = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        // Status tag
        const isConfirmed = booking.status === 'Confirmed';
        const statusBadge = isConfirmed 
          ? `<span style="background: rgba(34, 197, 94, 0.15); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.3); padding: 0.25rem 0.6rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700; display: inline-block;">Confirmed</span>`
          : `<span style="background: rgba(234, 179, 8, 0.15); color: #eab308; border: 1px solid rgba(234, 179, 8, 0.3); padding: 0.25rem 0.6rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700; display: inline-block;">Pending</span>`;

        // Action buttons
        const confirmBtnHTML = isConfirmed 
          ? `<button class="btn-confirm" disabled style="background: rgba(255, 255, 255, 0.03); color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.05); padding: 0.45rem 0.9rem; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: not-allowed; margin-right: 0.5rem;">Confirmed</button>`
          : `<button class="btn-confirm" data-index="${index}" style="background: rgba(34, 197, 94, 0.1); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.25); padding: 0.45rem 0.9rem; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; margin-right: 0.5rem; transition: all 0.2s ease;" onmouseover="this.style.background='#22c55e'; this.style.color='#000'; this.style.boxShadow='0 0 10px rgba(34,197,94,0.4)';" onmouseout="this.style.background='rgba(34, 197, 94, 0.1)'; this.style.color='#22c55e'; this.style.boxShadow='none';">Confirm</button>`;

        row.innerHTML = `
          <td style="padding: 1rem; font-weight:700; color:var(--primary);">${booking.bookingId}</td>
          <td style="padding: 1rem; color:#fff;">${booking.name}</td>
          <td style="padding: 1rem; line-height:1.4;">
            <span style="color:#fff;">${booking.email}</span><br>
            <span style="color:var(--text-muted); font-size:0.8rem;">${booking.phone}</span>
          </td>
          <td style="padding: 1rem; color:#fff;">${booking.service}</td>
          <td style="padding: 1rem;">${statusBadge}</td>
          <td style="padding: 1rem; color:var(--text-muted);">${formattedDate}</td>
          <td style="padding: 1rem; text-align:center;">
            ${confirmBtnHTML}
            <button class="btn-delete" data-index="${index}">Delete</button>
          </td>
        `;
        bookingsListBody.appendChild(row);
      });

      // Add delete handlers
      const deleteButtons = bookingsListBody.querySelectorAll('.btn-delete');
      deleteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = e.target.getAttribute('data-index');
          deleteBooking(idx);
        });
      });

      // Add confirm handlers
      const confirmButtons = bookingsListBody.querySelectorAll('.btn-confirm');
      confirmButtons.forEach(btn => {
        if (!btn.disabled) {
          btn.addEventListener('click', (e) => {
            const idx = e.target.getAttribute('data-index');
            confirmBooking(idx);
          });
        }
      });
    }
  }

  // Confirm booking function
  function confirmBooking(idx) {
    let bookings = [];
    try {
      bookings = JSON.parse(localStorage.getItem('zylo_bookings')) || [];
      if (!Array.isArray(bookings)) bookings = [];
    } catch (err) {
      bookings = [];
    }
    
    if (bookings[idx]) {
      bookings[idx].status = 'Confirmed';
    }
    localStorage.setItem('zylo_bookings', JSON.stringify(bookings));
    renderStaffBookings();
  }

  // Delete booking function
  function deleteBooking(idx) {
    let bookings = [];
    try {
      bookings = JSON.parse(localStorage.getItem('zylo_bookings')) || [];
      if (!Array.isArray(bookings)) bookings = [];
    } catch (err) {
      bookings = [];
    }
    bookings.splice(idx, 1);
    localStorage.setItem('zylo_bookings', JSON.stringify(bookings));
    renderStaffBookings();
  }

  // Close Dashboard
  if (closeStaffDashboard && staffDashboardModal) {
    closeStaffDashboard.addEventListener('click', () => {
      staffDashboardModal.classList.remove('active');
    });
  }

  // Sign out Dashboard
  if (staffLogoutBtn && staffDashboardModal) {
    staffLogoutBtn.addEventListener('click', () => {
      staffDashboardModal.classList.remove('active');
    });
  }

  // Close modals on clicking outside content
  if (staffLoginModal) {
    staffLoginModal.addEventListener('click', (e) => {
      if (e.target === staffLoginModal) {
        staffLoginModal.classList.remove('active');
      }
    });
  }
  if (staffDashboardModal) {
    staffDashboardModal.addEventListener('click', (e) => {
      if (e.target === staffDashboardModal) {
        staffDashboardModal.classList.remove('active');
      }
    });
  }

  // --- Automatic Theme Accent Color Cycle ---
  const colors = [
    { primary: '#84cc16', glow: 'rgba(132, 204, 22, 0.15)', glowStrong: 'rgba(132, 204, 22, 0.4)', glowBorder: 'rgba(132, 204, 22, 0.3)' }, // Lime Green
    { primary: '#06b6d4', glow: 'rgba(6, 182, 212, 0.15)', glowStrong: 'rgba(6, 182, 212, 0.4)', glowBorder: 'rgba(6, 182, 212, 0.3)' }, // Cyan
    { primary: '#d946ef', glow: 'rgba(217, 70, 239, 0.15)', glowStrong: 'rgba(217, 70, 239, 0.4)', glowBorder: 'rgba(217, 70, 239, 0.3)' }, // Magenta/Purple
    { primary: '#f43f5e', glow: 'rgba(244, 63, 94, 0.15)',  glowStrong: 'rgba(244, 63, 94, 0.4)',  glowBorder: 'rgba(244, 63, 94, 0.3)' },  // Rose
    { primary: '#3b82f6', glow: 'rgba(59, 130, 246, 0.15)', glowStrong: 'rgba(59, 130, 246, 0.4)', glowBorder: 'rgba(59, 130, 246, 0.3)' }  // Blue
  ];
  
  let colorIndex = 0;
  setInterval(() => {
    colorIndex = (colorIndex + 1) % colors.length;
    const nextColor = colors[colorIndex];
    document.documentElement.style.setProperty('--primary', nextColor.primary);
    document.documentElement.style.setProperty('--primary-glow', nextColor.glow);
    document.documentElement.style.setProperty('--primary-glow-strong', nextColor.glowStrong);
    document.documentElement.style.setProperty('--border-glow', nextColor.glowBorder);
  }, 4000); // changes color every 4 seconds

  // --- Live Brand Reach Counter (CounterAPI Dev) ---
  const baselineViews = 2480;
  const reachCountEl = document.getElementById('site-reach-count');
  const metricViewsEl = document.getElementById('metric-site-views');

  function updateViewsUI(views) {
    const formatted = Number(views).toLocaleString();
    if (reachCountEl) {
      reachCountEl.textContent = formatted;
    }
    if (metricViewsEl) {
      metricViewsEl.textContent = formatted;
    }
  }

  // Fallback views simulation in case CounterAPI is blocked or offline
  function fallbackViews() {
    let localHits = parseInt(localStorage.getItem('zylo_simulated_hits') || '0');
    // Increment on first page load per session
    if (!sessionStorage.getItem('zylo_session_viewed')) {
      localHits += 1;
      localStorage.setItem('zylo_simulated_hits', localHits.toString());
      sessionStorage.setItem('zylo_session_viewed', 'true');
    }
    updateViewsUI(baselineViews + localHits);
  }

  // Hit the counter API
  try {
    fetch('https://api.counterapi.dev/v1/zylo_digital_agency/visits/up')
      .then(response => {
        if (!response.ok) throw new Error('API request failed');
        return response.json();
      })
      .then(data => {
        if (data && typeof data.count === 'number') {
          updateViewsUI(baselineViews + data.count);
        } else {
          fallbackViews();
        }
      })
      .catch(err => {
        console.warn('CounterAPI unreachable, using local session counter:', err);
        fallbackViews();
      });
  } catch (err) {
    fallbackViews();
  }

  // --- Pricing View Switcher & Pre-fill Functions ---
  window.switchHomePricing = function(type) {
    const pkgView = document.getElementById('home-pricing-packages');
    const alacarteView = document.getElementById('home-pricing-alacarte');
    const pkgTab = document.getElementById('home-pkg-tab');
    const alacarteTab = document.getElementById('home-alacarte-tab');

    if (type === 'packages') {
      if (pkgView) pkgView.style.display = 'block';
      if (alacarteView) alacarteView.style.display = 'none';
      if (pkgTab) pkgTab.classList.add('active');
      if (alacarteTab) alacarteTab.classList.remove('active');
    } else {
      if (pkgView) pkgView.style.display = 'none';
      if (alacarteView) alacarteView.style.display = 'block';
      if (pkgTab) pkgTab.classList.remove('active');
      if (alacarteTab) alacarteTab.classList.add('active');
    }
  };

  window.selectPackage = function(pkgName, budgetVal) {
    const notesField = document.getElementById('client-notes');
    if (notesField) {
      notesField.value = `Inquiry for ${pkgName}. ` + (notesField.value || '');
    }
    const serviceSelect = document.getElementById('client-service');
    if (serviceSelect) {
      serviceSelect.value = 'Complete Package';
    }
    const budgetSelect = document.getElementById('client-budget');
    if (budgetSelect) {
      if (budgetVal && budgetVal.includes('35,000')) {
        budgetSelect.value = '₹15K – ₹35K';
      } else if (budgetVal && budgetVal.includes('45,000')) {
        budgetSelect.value = '₹35K – ₹50K';
      } else if (budgetVal && budgetVal.includes('50,000')) {
        budgetSelect.value = '₹50K – ₹1L';
      }
    }
    const radios = document.querySelectorAll('input[name="budget"]');
    radios.forEach(r => {
      if (r.value === budgetVal || (r.value.includes('35,000') && budgetVal.includes('35,000'))) {
        r.checked = true;
        const label = r.closest('.pill-check-label');
        if (label && label.closest('.pill-radio-group')) {
          label.closest('.pill-radio-group').querySelectorAll('.pill-check-label').forEach(l => l.classList.remove('selected'));
          label.classList.add('selected');
        }
      }
    });
  };

  window.selectServiceItem = function(serviceName, budgetVal) {
    const notesField = document.getElementById('client-notes');
    if (notesField) {
      notesField.value = `Selected Service: ${serviceName}. ` + (notesField.value || '');
    }
    const serviceSelect = document.getElementById('client-service');
    if (serviceSelect) {
      const sLower = serviceName.toLowerCase();
      if (sLower.includes('website') || sLower.includes('landing') || sLower.includes('e-commerce')) serviceSelect.value = 'Website';
      else if (sLower.includes('ui/ux') || sLower.includes('app')) serviceSelect.value = 'UI/UX';
      else if (sLower.includes('logo') || sLower.includes('brand') || sLower.includes('motion')) serviceSelect.value = 'Branding / Logo';
      else if (sLower.includes('ai photoshoot') || sLower.includes('ai product') || sLower.includes('ai fashion')) serviceSelect.value = 'AI Photoshoot';
      else if (sLower.includes('cgi') || sLower.includes('3d')) serviceSelect.value = 'CGI / 3D';
      else if (sLower.includes('video') || sLower.includes('reels')) serviceSelect.value = 'Video / Reels';
      else if (sLower.includes('photographer') || sLower.includes('model shoot') || sLower.includes('real photoshoot')) serviceSelect.value = 'Real Model Photoshoot';
      else if (sLower.includes('google ads')) serviceSelect.value = 'Google Ads';
      else if (sLower.includes('meta ads')) serviceSelect.value = 'Meta Ads';
      else if (sLower.includes('instagram')) serviceSelect.value = 'Instagram Management';
      else if (sLower.includes('automation') || sLower.includes('bot')) serviceSelect.value = 'AI Automation';
      else serviceSelect.value = 'Other';
    }
    const budgetSelect = document.getElementById('client-budget');
    if (budgetSelect && budgetVal) {
      if (budgetVal.includes('15') || budgetVal.includes('15K')) budgetSelect.value = '₹15K – ₹35K';
      else if (budgetVal.includes('35') || budgetVal.includes('35K')) budgetSelect.value = '₹35K – ₹50K';
      else if (budgetVal.includes('50') || budgetVal.includes('50K')) budgetSelect.value = '₹50K – ₹1L';
    }
    document.querySelectorAll('input[name="services"]').forEach(cb => {
      if (serviceName.toLowerCase().includes(cb.value.toLowerCase())) {
        cb.checked = true;
        const label = cb.closest('.pill-check-label');
        if (label) label.classList.add('selected');
      }
    });
  };

  // Cookie Consent Banner Initialization
  const cookieBanner = document.getElementById('cookie-consent-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies-btn');
  const declineCookiesBtn = document.getElementById('decline-cookies-btn');

  if (cookieBanner) {
    const consent = localStorage.getItem('zylo_cookie_consent');
    if (!consent) {
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 1200);
    }

    if (acceptCookiesBtn) {
      acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('zylo_cookie_consent', 'all');
        cookieBanner.classList.remove('show');
      });
    }

    if (declineCookiesBtn) {
      declineCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('zylo_cookie_consent', 'essential');
        cookieBanner.classList.remove('show');
      });
    }
  }

  // Hero Video Autoplay Assurance
  const heroVideo = document.querySelector('.hero-image video');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    const tryPlay = () => {
      const p = heroVideo.play();
      if (p !== undefined) {
        p.catch(() => {
          const unlock = () => {
            heroVideo.play().catch(() => {});
          };
          document.addEventListener('click', unlock, { once: true });
          document.addEventListener('touchstart', unlock, { once: true });
        });
      }
    };
    tryPlay();
  }
});

/* ==========================================================================
   Zylo Digital - 3D Interactive Fibonacci Particle Sphere & Rainbow Graphics
   ========================================================================== */
(function () {
  'use strict';

  function initOrb() {
    let canvas = document.getElementById('particle-orb-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'particle-orb-canvas';
      canvas.className = 'particle-orb-canvas';
      document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    const getRadius = () => {
      const minDim = Math.min(width, height);
      return width > 900 ? minDim * 0.28 : minDim * 0.35;
    };
    let SPHERE_RADIUS = getRadius();
    window.addEventListener('resize', () => {
      SPHERE_RADIUS = getRadius();
    }, { passive: true });

    // 1. Fibonacci Sphere Particles (340 points)
    const NUM_SPHERE = 340;
    const phi = Math.PI * (3 - Math.sqrt(5)); // ~2.39996323 rad
    const sphereParticles = [];

    for (let i = 0; i < NUM_SPHERE; i++) {
      const y = 1 - (i / (NUM_SPHERE - 1)) * 2;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = phi * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      sphereParticles.push({
        x: x,
        y: y,
        z: z,
        baseSize: Math.random() * 2.5 + 1.4,
        hueOffset: (i / NUM_SPHERE) * 120,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.025,
      });
    }

    // 2. Concentric Gyro / Planetary Orbital Rings (140 particles)
    const ringParticles = [];
    const HALF_RINGS = 70;

    // Ring 1: Inclined at ~32 degrees
    for (let i = 0; i < HALF_RINGS; i++) {
      const angle = (i / HALF_RINGS) * Math.PI * 2;
      ringParticles.push({
        ringId: 1,
        angle: angle,
        rMult: 1.38 + Math.sin(i * 3) * 0.06,
        tiltX: 0.55,
        tiltY: 0.2,
        size: Math.random() * 2.6 + 1.6,
        hueOffset: (i / HALF_RINGS) * 90,
      });
    }

    // Ring 2: Polar inclination at -65 degrees
    for (let i = 0; i < HALF_RINGS; i++) {
      const angle = (i / HALF_RINGS) * Math.PI * 2;
      ringParticles.push({
        ringId: 2,
        angle: angle,
        rMult: 1.68 + Math.cos(i * 2) * 0.08,
        tiltX: -1.15,
        tiltY: 0.45,
        size: Math.random() * 2.2 + 1.3,
        hueOffset: 140 + (i / HALF_RINGS) * 100,
      });
    }

    // 3. Floating Ambient Rainbow Micro-Dust (60 particles)
    const ambientDust = [];
    const NUM_DUST = 60;
    for (let i = 0; i < NUM_DUST; i++) {
      ambientDust.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5 - 0.2,
        size: Math.random() * 2.2 + 1.0,
        alpha: Math.random() * 0.5 + 0.2,
        hueOffset: Math.random() * 360,
      });
    }

    // 4. Interactive Mouse Parallax & Physics
    let rotX = 0.2;
    let rotY = 0.35;
    let targetRotX = 0.2;
    let targetRotY = 0.35;
    let mouseX = width / 2;
    let mouseY = height / 2;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const normX = (e.clientX / width - 0.5) * 2;
      const normY = (e.clientY / height - 0.5) * 2;
      targetRotY = normX * 0.95;
      targetRotX = -normY * 0.75;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        const normX = (t.clientX / width - 0.5) * 2;
        const normY = (t.clientY / height - 0.5) * 2;
        targetRotY = normX * 0.95;
        targetRotX = -normY * 0.75;
      }
    }, { passive: true });

    // 5. Scroll-Driven Rainbow Hue Transition
    let currentScrollY = window.scrollY || 0;
    let targetScrollY = window.scrollY || 0;
    let scrollSpeed = 0;
    const baseHue = 84;

    window.addEventListener('scroll', () => {
      targetScrollY = window.scrollY || 0;
    }, { passive: true });

    function rotatePoint3D(x, y, z, rx, ry) {
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x1 = x * cosY - z * sinY;
      const z1 = z * cosY + x * sinY;

      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const y2 = y * cosX - z1 * sinX;
      const z2 = z1 * cosX + y * sinX;

      return { x: x1, y: y2, z: z2 };
    }

    // 6. High-Performance Render Loop (60 FPS)
    let frame = 0;
    const FOV = 680;

    function render() {
      requestAnimationFrame(render);
      frame++;

      scrollSpeed = (targetScrollY - currentScrollY) * 0.08;
      currentScrollY += scrollSpeed;

      const rainbowHue = (baseHue + currentScrollY * 0.28 + frame * 0.15) % 360;

      if (frame % 3 === 0) {
        document.documentElement.style.setProperty('--rainbow-hue', rainbowHue.toFixed(1));
      }

      rotX += (targetRotX - rotX) * 0.045 + 0.001;
      rotY += (targetRotY - rotY) * 0.045 + 0.0035;

      ctx.clearRect(0, 0, width, height);

      const isDesktop = width > 900;
      const heroX = isDesktop ? width * 0.58 : width * 0.5;
      const heroY = isDesktop ? Math.min(height * 0.46, 440) : height * 0.42;

      const centerX = heroX + Math.sin(frame * 0.008) * 16;
      const centerY = heroY - currentScrollY * 0.22 + Math.cos(frame * 0.01) * 12;

      const scrollProgress = Math.min(1, currentScrollY / 1400);
      const dynamicScale = Math.max(0.65, 1 - scrollProgress * 0.32);

      // Core Nebula Aura
      const auraRadius = SPHERE_RADIUS * 1.65 * dynamicScale;
      const auraGradient = ctx.createRadialGradient(
        centerX, centerY, SPHERE_RADIUS * 0.1 * dynamicScale,
        centerX, centerY, auraRadius
      );
      auraGradient.addColorStop(0, `hsla(${rainbowHue}, 100%, 65%, 0.25)`);
      auraGradient.addColorStop(0.35, `hsla(${(rainbowHue + 45) % 360}, 95%, 55%, 0.12)`);
      auraGradient.addColorStop(0.7, `hsla(${(rainbowHue + 90) % 360}, 90%, 45%, 0.04)`);
      auraGradient.addColorStop(1, 'transparent');

      ctx.fillStyle = auraGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, auraRadius, 0, Math.PI * 2);
      ctx.fill();

      // Project Fibonacci Sphere Particles
      const projectedSphere = [];
      for (let i = 0; i < NUM_SPHERE; i++) {
        const p = sphereParticles[i];
        p.pulsePhase += p.pulseSpeed;
        const breathing = Math.sin(p.pulsePhase) * 6;
        const currentR = SPHERE_RADIUS + breathing;

        const px = p.x * currentR;
        const py = p.y * currentR;
        const pz = p.z * currentR;

        const rot = rotatePoint3D(px, py, pz, rotX, rotY);
        const scale = FOV / (FOV + rot.z);

        projectedSphere.push({
          x2d: centerX + rot.x * scale * dynamicScale,
          y2d: centerY + rot.y * scale * dynamicScale,
          z: rot.z,
          size: p.baseSize * scale * dynamicScale,
          hue: (rainbowHue + p.hueOffset) % 360,
        });
      }

      // Project Concentric Gyro / Planetary Orbital Rings
      const projectedRings = [];
      const ringSpeed1 = frame * 0.009;
      const ringSpeed2 = -frame * 0.007;

      for (let i = 0; i < ringParticles.length; i++) {
        const rp = ringParticles[i];
        const curAngle = rp.angle + (rp.ringId === 1 ? ringSpeed1 : ringSpeed2);
        const r = SPHERE_RADIUS * rp.rMult;

        let rx = Math.cos(curAngle) * r;
        let rz = Math.sin(curAngle) * r;
        let ry = 0;

        if (rp.ringId === 1) {
          ry = rz * Math.sin(rp.tiltX);
          rz = rz * Math.cos(rp.tiltX);
        } else {
          ry = rx * Math.sin(rp.tiltX);
          rx = rx * Math.cos(rp.tiltX);
        }

        const rot = rotatePoint3D(rx, ry, rz, rotX, rotY);
        const scale = FOV / (FOV + rot.z);

        projectedRings.push({
          x2d: centerX + rot.x * scale * dynamicScale,
          y2d: centerY + rot.y * scale * dynamicScale,
          z: rot.z,
          size: rp.size * scale * dynamicScale,
          hue: (rainbowHue + rp.hueOffset) % 360,
        });
      }

      const all3D = [...projectedSphere, ...projectedRings];
      all3D.sort((a, b) => b.z - a.z);

      // Constellation / Neural Lines
      ctx.lineWidth = 0.9;
      for (let i = 0; i < projectedSphere.length; i++) {
        const p1 = projectedSphere[i];
        if (p1.z > 30) continue;

        let connections = 0;
        for (let j = i + 1; j < projectedSphere.length; j++) {
          const p2 = projectedSphere[j];
          if (p2.z > 30) continue;

          const dx = p1.x2d - p2.x2d;
          const dy = p1.y2d - p2.y2d;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 52 * dynamicScale && connections < 2) {
            connections++;
            const lineAlpha = (1 - dist / (52 * dynamicScale)) * 0.35;
            ctx.strokeStyle = `hsla(${p1.hue}, 95%, 65%, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x2d, p1.y2d);
            ctx.lineTo(p2.x2d, p2.y2d);
            ctx.stroke();
          }
        }
      }

      // Draw 3D Particles with Depth Glow
      for (let i = 0; i < all3D.length; i++) {
        const p = all3D[i];
        const depthNorm = (p.z + SPHERE_RADIUS * 1.7) / (SPHERE_RADIUS * 3.4);
        const alpha = Math.max(0.18, Math.min(0.98, 1 - depthNorm * 0.68));

        ctx.beginPath();
        ctx.arc(p.x2d, p.y2d, Math.max(0.8, p.size), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${alpha})`;
        ctx.fill();

        if (p.z < -SPHERE_RADIUS * 0.2) {
          ctx.beginPath();
          ctx.arc(p.x2d, p.y2d, p.size * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 100%, 75%, ${alpha * 0.28})`;
          ctx.fill();
        }
      }

      // Ambient Floating Rainbow Micro-Dust
      for (let i = 0; i < ambientDust.length; i++) {
        const dust = ambientDust[i];
        dust.x += dust.vx;
        dust.y += dust.vy - scrollSpeed * 0.08;

        if (dust.x < 0) dust.x = width;
        if (dust.x > width) dust.x = 0;
        if (dust.y < 0) dust.y = height;
        if (dust.y > height) dust.y = 0;

        const dustHue = (rainbowHue + dust.hueOffset) % 360;
        ctx.beginPath();
        ctx.arc(dust.x, dust.y, dust.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${dustHue}, 95%, 72%, ${dust.alpha})`;
        ctx.fill();
      }
    }

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOrb);
  } else {
    initOrb();
  }
})();

