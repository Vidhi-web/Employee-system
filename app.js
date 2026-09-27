/**
 * ZAKVID HR — ENTERPRISE ENGINE (S1)
 * Multi-Page Architecture, Indian Currency (INR), Real-Time JavaScript Form Validation, 
 * Fluid Ambient Motion Background, and Dynamic Workforce Analytics.
 * Connected to PHP + MySQL Backend (REST API Endpoints).
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. STATE & THEME INITIALIZATION
  // --------------------------------------------------------------------------
  const THEME_KEY = 'zakvid_theme_pref';

  let employees = [];
  let currentView = 'grid'; // 'grid' | 'table'
  let activePage = 'view';  // 'view' | 'add' | 'contact'
  let activeFilters = {
    search: '',
    department: 'All',
    workMode: 'All',
    status: 'All',
    sortBy: 'name-asc'
  };
  let activeDrawerEmpId = null;

  // Fetch employees from PHP MySQL backend API
  async function fetchEmployees() {
    try {
      const res = await fetch('api/get_employees.php');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        employees = data;
      } else {
        console.error('Expected array from get_employees.php:', data);
        employees = [];
      }
      renderApp();
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      showToast('Failed to load employee records from database.', 'error');
    }
  }

  // --------------------------------------------------------------------------
  // 2. DOM SELECTION
  // --------------------------------------------------------------------------
  const searchInput = document.getElementById('searchInput');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const exportBtn = document.getElementById('exportBtn');
  const exportMenu = document.getElementById('exportMenu');
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  const exportJsonBtn = document.getElementById('exportJsonBtn');
  const brandHomeTrigger = document.getElementById('brandHomeTrigger');

  // Navigation Tabs
  const navTabs = document.querySelectorAll('.nav-tab');
  const pages = {
    view: document.getElementById('pageView'),
    add: document.getElementById('pageAdd'),
    contact: document.getElementById('pageContact')
  };
  const navBackToViewBtn = document.getElementById('navBackToViewBtn');

  // KPI Elements
  const valTotalEmployees = document.getElementById('valTotalEmployees');
  const valActiveEmployees = document.getElementById('valActiveEmployees');
  const valActivePercent = document.getElementById('valActivePercent');
  const valAvgSalary = document.getElementById('valAvgSalary');
  const valMonthlyPayroll = document.getElementById('valMonthlyPayroll');
  const valTopDept = document.getElementById('valTopDept');

  // Toolbar & Filters
  const deptFilterContainer = document.getElementById('deptFilterContainer');
  const workModeFilter = document.getElementById('workModeFilter');
  const statusFilter = document.getElementById('statusFilter');
  const sortBySelect = document.getElementById('sortBySelect');
  const viewGridBtn = document.getElementById('viewGridBtn');
  const viewTableBtn = document.getElementById('viewTableBtn');
  const visibleCount = document.getElementById('visibleCount');
  const totalCount = document.getElementById('totalCount');
  const activeFiltersContainer = document.getElementById('activeFiltersContainer');
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');

  // Views
  const employeeGrid = document.getElementById('employeeGrid');
  const tableView = document.getElementById('tableView');
  const employeeTableBody = document.getElementById('employeeTableBody');
  const emptyState = document.getElementById('emptyState');
  const emptyResetBtn = document.getElementById('emptyResetBtn');

  // Standalone Add Form (Page 2)
  const standaloneAddForm = document.getElementById('standaloneAddForm');
  const pageEmpId = document.getElementById('pageEmpId');
  const pageFullName = document.getElementById('pageFullName');
  const pageEmail = document.getElementById('pageEmail');
  const pagePhone = document.getElementById('pagePhone');
  const pageDepartment = document.getElementById('pageDepartment');
  const pageDesignation = document.getElementById('pageDesignation');
  const pageLocation = document.getElementById('pageLocation');
  const pageSalary = document.getElementById('pageSalary');
  const pageJoiningDate = document.getElementById('pageJoiningDate');
  const pageStatus = document.getElementById('pageStatus');
  const pageSkills = document.getElementById('pageSkills');
  const pageValidationSummary = document.getElementById('pageValidationSummary');
  const pageResetFormBtn = document.getElementById('pageResetFormBtn');

  // Contact Form (Page 3)
  const contactForm = document.getElementById('contactForm');
  const contactName = document.getElementById('contactName');
  const contactEmail = document.getElementById('contactEmail');
  const contactSubject = document.getElementById('contactSubject');
  const contactMessage = document.getElementById('contactMessage');

  // Modals & Drawers
  const employeeModal = document.getElementById('employeeModal');
  const employeeForm = document.getElementById('employeeForm');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelFormBtn = document.getElementById('cancelFormBtn');
  const editEmployeeId = document.getElementById('editEmployeeId');

  const profileDrawer = document.getElementById('profileDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const drawerAvatar = document.getElementById('drawerAvatar');
  const drawerInitials = document.getElementById('drawerInitials');
  const drawerName = document.getElementById('drawerName');
  const drawerDesignation = document.getElementById('drawerDesignation');
  const drawerDeptBadge = document.getElementById('drawerDeptBadge');
  const drawerWorkModeBadge = document.getElementById('drawerWorkModeBadge');
  const drawerStatusBadge = document.getElementById('drawerStatusBadge');
  const drawerEmpId = document.getElementById('drawerEmpId');
  const drawerLocation = document.getElementById('drawerLocation');
  const drawerEmail = document.getElementById('drawerEmail');
  const drawerPhone = document.getElementById('drawerPhone');
  const drawerTenure = document.getElementById('drawerTenure');
  const drawerAnnualSalary = document.getElementById('drawerAnnualSalary');
  const drawerEstimatedTax = document.getElementById('drawerEstimatedTax');
  const drawerSkillsContainer = document.getElementById('drawerSkillsContainer');
  const drawerEditBtn = document.getElementById('drawerEditBtn');
  const drawerDeleteBtn = document.getElementById('drawerDeleteBtn');

  const toastContainer = document.getElementById('toastContainer');

  // Set today's date max bound
  const todayStr = new Date().toISOString().split('T')[0];
  if (pageJoiningDate) pageJoiningDate.setAttribute('max', todayStr);

  // --------------------------------------------------------------------------
  // 3. THEME ENGINE
  // --------------------------------------------------------------------------
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  themeToggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
    showToast(`Switched to ${next.toUpperCase()} atmosphere`, 'info');
  });

  initTheme();

  // --------------------------------------------------------------------------
  // 4. MULTI-PAGE TAB NAVIGATION
  // --------------------------------------------------------------------------
  function switchPage(pageName) {
    activePage = pageName;
    navTabs.forEach(tab => {
      if (tab.getAttribute('data-page') === pageName) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    Object.keys(pages).forEach(key => {
      if (key === pageName) {
        pages[key].classList.remove('hidden-page');
        pages[key].classList.add('active-page');
      } else {
        pages[key].classList.remove('active-page');
        pages[key].classList.add('hidden-page');
      }
    });

    if (pageName === 'add') {
      pageEmpId.value = generateNextEmployeeId();
    }
  }

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchPage(tab.getAttribute('data-page'));
    });
  });

  if (navBackToViewBtn) {
    navBackToViewBtn.addEventListener('click', () => switchPage('view'));
  }

  if (brandHomeTrigger) {
    brandHomeTrigger.addEventListener('click', () => switchPage('view'));
  }

  // --------------------------------------------------------------------------
  // 5. REAL-TIME FORM VALIDATION SYSTEM
  // --------------------------------------------------------------------------
  const validationRules = {
    empId: {
      validate: (val) => /^ZAK-\d{4}$/.test(val.trim()),
      errorMsg: 'Must follow ZAK-XXXX format (e.g., ZAK-1042).'
    },
    fullName: {
      validate: (val) => val.trim().length >= 3 && /^[A-Za-z\s\.\'-]+$/.test(val.trim()),
      errorMsg: 'At least 3 characters; letters, spaces, dots and hyphens only.'
    },
    email: {
      validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
      errorMsg: 'Enter a valid work email address.'
    },
    phone: {
      validate: (val) => /^(\+?91[\s-]?)?[6-9]\d{9}$|^[6-9]\d{9}$/.test(val.trim().replace(/[\s-]/g, '')),
      errorMsg: 'Enter a valid 10-digit Indian mobile number (+91).'
    },
    department: {
      validate: (val) => val !== '',
      errorMsg: 'Please select a department.'
    },
    designation: {
      validate: (val) => val.trim().length >= 2,
      errorMsg: 'Designation is required (at least 2 characters).'
    },
    salary: {
      validate: (val) => !isNaN(val) && Number(val) >= 100000 && Number(val) <= 100000000,
      errorMsg: 'CTC must be a positive amount between ₹1,00,000 and ₹10,00,00,000.'
    },
    joiningDate: {
      validate: (val) => {
        if (!val) return false;
        const selected = new Date(val);
        const now = new Date();
        now.setHours(23, 59, 59, 999);
        return selected <= now;
      },
      errorMsg: 'Joining date cannot be in the future.'
    },
    status: {
      validate: (val) => val !== '',
      errorMsg: 'Please select an employment status.'
    },
    // Contact Form Rules
    contactName: {
      validate: (val) => val.trim().length >= 3,
      errorMsg: 'Name is required (at least 3 characters).'
    },
    contactEmail: {
      validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
      errorMsg: 'Valid email address required.'
    },
    contactSubject: {
      validate: (val) => val !== '',
      errorMsg: 'Please select an inquiry category.'
    },
    contactMessage: {
      validate: (val) => val.trim().length >= 10,
      errorMsg: 'Message must be at least 10 characters.'
    }
  };

  function validateField(inputElement) {
    const name = inputElement.name || inputElement.id;
    const rule = validationRules[name];
    if (!rule) return true;

    const formGroup = inputElement.closest('.form-group');
    const isValid = rule.validate(inputElement.value);

    if (formGroup) {
      if (isValid) {
        formGroup.classList.remove('is-invalid');
        formGroup.classList.add('is-valid');
      } else {
        formGroup.classList.remove('is-valid');
        formGroup.classList.add('is-invalid');
      }
    }
    return isValid;
  }

  function attachLiveValidation(inputsList) {
    inputsList.forEach(input => {
      if (!input) return;
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        const formGroup = input.closest('.form-group');
        if (formGroup && formGroup.classList.contains('is-invalid')) {
          validateField(input);
        }
      });
      if (input.tagName === 'SELECT') {
        input.addEventListener('change', () => validateField(input));
      }
    });
  }

  // Attach live validation to Standalone Form & Contact Form
  const addFormInputs = [pageEmpId, pageFullName, pageEmail, pagePhone, pageDepartment, pageDesignation, pageSalary, pageJoiningDate, pageStatus];
  attachLiveValidation(addFormInputs);

  const contactInputs = [contactName, contactEmail, contactSubject, contactMessage];
  attachLiveValidation(contactInputs);

  function generateNextEmployeeId() {
    const existingNums = employees.map(e => {
      const match = e.id ? e.id.match(/^ZAK-(\d+)$/) : null;
      return match ? parseInt(match[1], 10) : 1000;
    });
    const maxNum = existingNums.length > 0 ? Math.max(...existingNums) : 1000;
    return `ZAK-${maxNum + 1}`;
  }

  // Standalone Add Employee Form Submit Handler (Calls add_employee.php)
  standaloneAddForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isFormValid = true;
    addFormInputs.forEach(input => {
      if (!validateField(input)) isFormValid = false;
    });

    if (!isFormValid) {
      pageValidationSummary.classList.remove('hidden');
      showToast('Validation failed. Please correct highlighted errors.', 'error');
      return;
    }

    pageValidationSummary.classList.add('hidden');

    const selectedWorkMode = document.querySelector('input[name="pageWorkMode"]:checked')?.value || 'Remote';
    const skillsArray = pageSkills.value
      ? pageSkills.value.split(',').map(s => s.trim()).filter(Boolean)
      : ['Engineering'];

    // Select distinct jewel tone background gradient
    const jewelGradients = [
      "linear-gradient(135deg, #a855f7 0%, #d946ef 100%)",
      "linear-gradient(135deg, #c084fc 0%, #ec4899 100%)",
      "linear-gradient(135deg, #818cf8 0%, #c084fc 100%)",
      "linear-gradient(135deg, #9333ea 0%, #4f46e5 100%)",
      "linear-gradient(135deg, #e879f9 0%, #a855f7 100%)"
    ];
    const randomGrad = jewelGradients[Math.floor(Math.random() * jewelGradients.length)];

    const newEmp = {
      id: pageEmpId.value.trim(),
      fullName: pageFullName.value.trim(),
      email: pageEmail.value.trim(),
      phone: pagePhone.value.trim(),
      location: pageLocation.value,
      department: pageDepartment.value,
      designation: pageDesignation.value.trim(),
      salary: parseFloat(pageSalary.value),
      joiningDate: pageJoiningDate.value,
      workMode: selectedWorkMode,
      status: pageStatus.value,
      avatarColor: randomGrad,
      skills: skillsArray
    };

    try {
      const response = await fetch('api/add_employee.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmp)
      });
      const result = await response.json();

      if (result.success) {
        showToast(`Registered employee ${newEmp.fullName} (${newEmp.id})!`, 'success');
        await fetchEmployees();
        resetAddForm();
        switchPage('view');
      } else {
        showToast(result.message || 'Failed to add employee.', 'error');
        if (result.message && result.message.includes('ID')) {
          pageEmpId.closest('.form-group').classList.add('is-invalid');
        }
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      showToast('Server error while adding employee.', 'error');
    }
  });

  pageResetFormBtn.addEventListener('click', resetAddForm);

  function resetAddForm() {
    standaloneAddForm.reset();
    pageValidationSummary.classList.add('hidden');
    addFormInputs.forEach(input => {
      const grp = input.closest('.form-group');
      if (grp) grp.classList.remove('is-valid', 'is-invalid');
    });
    pageEmpId.value = generateNextEmployeeId();
  }

  // Contact Form Submit Handler
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    contactInputs.forEach(input => {
      if (!validateField(input)) isValid = false;
    });

    if (!isValid) {
      showToast('Please fix errors in the contact form.', 'error');
      return;
    }

    showToast(`Ticket submitted successfully! We will contact ${contactEmail.value.trim()}.`, 'success');
    contactForm.reset();
    contactInputs.forEach(i => i.closest('.form-group')?.classList.remove('is-valid', 'is-invalid'));
  });

  // Modal Edit Form Handlers
  function openEditModal(empId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;

    editEmployeeId.value = emp.id;
    document.getElementById('empId').value = emp.id;
    document.getElementById('fullName').value = emp.fullName;
    document.getElementById('email').value = emp.email;
    document.getElementById('phone').value = emp.phone;
    document.getElementById('department').value = emp.department;
    document.getElementById('designation').value = emp.designation;
    document.getElementById('salary').value = emp.salary;
    document.getElementById('joiningDate').value = emp.joiningDate;
    document.getElementById('status').value = emp.status;

    employeeModal.showModal();
  }

  closeModalBtn.addEventListener('click', () => employeeModal.close());
  cancelFormBtn.addEventListener('click', () => employeeModal.close());

  // Edit Form Submit Handler (Calls update_employee.php)
  employeeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const empId = editEmployeeId.value;
    const emp = employees.find(e => e.id === empId);

    const updatedEmp = {
      id: empId,
      fullName: document.getElementById('fullName').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      department: document.getElementById('department').value,
      designation: document.getElementById('designation').value.trim(),
      salary: parseFloat(document.getElementById('salary').value),
      joiningDate: document.getElementById('joiningDate').value,
      status: document.getElementById('status').value,
      location: emp ? emp.location : 'Bengaluru',
      workMode: emp ? emp.workMode : 'Remote',
      avatarColor: emp ? emp.avatarColor : '',
      skills: emp ? emp.skills : []
    };

    try {
      const response = await fetch('api/update_employee.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEmp)
      });
      const result = await response.json();

      if (result.success) {
        employeeModal.close();
        showToast(`Updated record for ${updatedEmp.fullName}!`, 'success');
        await fetchEmployees();
      } else {
        showToast(result.message || 'Failed to update employee.', 'error');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      showToast('Server error while updating employee.', 'error');
    }
  });

  // Delete Employee (Calls delete_employee.php)
  async function deleteEmployee(empId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;

    if (confirm(`Are you sure you want to delete ${emp.fullName} (${emp.id})?`)) {
      try {
        const response = await fetch('api/delete_employee.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: empId })
        });
        const result = await response.json();

        if (result.success) {
          if (profileDrawer.open) profileDrawer.close();
          showToast(`Deleted employee ${emp.fullName}`, 'info');
          await fetchEmployees();
        } else {
          showToast(result.message || 'Failed to delete employee.', 'error');
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        showToast('Server error while deleting employee.', 'error');
      }
    }
  }

  // Profile Drawer
  function openProfileDrawer(empId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;

    activeDrawerEmpId = emp.id;
    drawerAvatar.style.background = emp.avatarColor || 'linear-gradient(135deg, #a855f7, #d946ef)';
    drawerInitials.textContent = getInitials(emp.fullName);
    drawerName.textContent = emp.fullName;
    drawerDesignation.textContent = emp.designation;
    drawerDeptBadge.textContent = emp.department;
    drawerWorkModeBadge.textContent = emp.workMode;
    drawerStatusBadge.textContent = emp.status;

    drawerEmpId.textContent = emp.id;
    drawerLocation.textContent = emp.location || 'Bengaluru';
    drawerEmail.textContent = emp.email;
    drawerPhone.textContent = emp.phone;

    // Tenure
    const joinYear = new Date(emp.joiningDate).getFullYear();
    const tenureYears = Math.max(0, new Date().getFullYear() - joinYear);
    drawerTenure.textContent = `${tenureYears} ${tenureYears === 1 ? 'Year' : 'Years'}`;

    // INR Formatting
    drawerAnnualSalary.textContent = formatINR(emp.salary);

    // Tax Scribe Bracket
    drawerEstimatedTax.textContent = emp.salary > 1500000 ? '30%' : (emp.salary > 1000000 ? '20%' : '10%');

    drawerSkillsContainer.innerHTML = (emp.skills || []).map(s => `<span class="skill-tag">${escapeHTML(s)}</span>`).join('');
    profileDrawer.showModal();
  }

  closeDrawerBtn.addEventListener('click', () => profileDrawer.close());
  drawerEditBtn.addEventListener('click', () => {
    profileDrawer.close();
    if (activeDrawerEmpId) openEditModal(activeDrawerEmpId);
  });
  drawerDeleteBtn.addEventListener('click', () => {
    if (activeDrawerEmpId) deleteEmployee(activeDrawerEmpId);
  });

  // Global Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement !== searchInput)) {
      e.preventDefault();
      switchPage('view');
      searchInput.focus();
    }
  });

  // --------------------------------------------------------------------------
  // 6. FILTERING, SORTING & RENDERING ENGINE
  // --------------------------------------------------------------------------
  searchInput.addEventListener('input', (e) => {
    activeFilters.search = e.target.value.toLowerCase().trim();
    if (activePage !== 'view') switchPage('view');
    renderApp();
  });

  deptFilterContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('pill-btn')) {
      document.querySelectorAll('#deptFilterContainer .pill-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      activeFilters.department = e.target.getAttribute('data-dept');
      renderApp();
    }
  });

  workModeFilter.addEventListener('change', (e) => {
    activeFilters.workMode = e.target.value;
    renderApp();
  });

  statusFilter.addEventListener('change', (e) => {
    activeFilters.status = e.target.value;
    renderApp();
  });

  sortBySelect.addEventListener('change', (e) => {
    activeFilters.sortBy = e.target.value;
    renderApp();
  });

  clearFiltersBtn.addEventListener('click', resetFilters);
  emptyResetBtn.addEventListener('click', resetFilters);

  function resetFilters() {
    activeFilters = { search: '', department: 'All', workMode: 'All', status: 'All', sortBy: 'name-asc' };
    searchInput.value = '';
    workModeFilter.value = 'All';
    statusFilter.value = 'All';
    sortBySelect.value = 'name-asc';

    document.querySelectorAll('#deptFilterContainer .pill-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('#deptFilterContainer .pill-btn[data-dept="All"]').classList.add('active');
    renderApp();
  }

  viewGridBtn.addEventListener('click', () => {
    currentView = 'grid';
    viewGridBtn.classList.add('active');
    viewTableBtn.classList.remove('active');
    employeeGrid.classList.remove('hidden');
    tableView.classList.add('hidden');
  });

  viewTableBtn.addEventListener('click', () => {
    currentView = 'table';
    viewTableBtn.classList.add('active');
    viewGridBtn.classList.remove('active');
    employeeGrid.classList.add('hidden');
    tableView.classList.remove('hidden');
  });

  exportBtn.addEventListener('click', () => exportMenu.parentElement.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!exportBtn.contains(e.target) && !exportMenu.contains(e.target)) {
      exportMenu.parentElement.classList.remove('open');
    }
  });

  exportCsvBtn.addEventListener('click', exportToCSV);
  exportJsonBtn.addEventListener('click', exportToJSON);

  function getFilteredEmployees() {
    return employees.filter(emp => {
      if (activeFilters.search) {
        const query = activeFilters.search;
        const matches = 
          emp.fullName.toLowerCase().includes(query) ||
          emp.id.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query) ||
          (emp.location && emp.location.toLowerCase().includes(query)) ||
          emp.designation.toLowerCase().includes(query) ||
          emp.department.toLowerCase().includes(query);
        if (!matches) return false;
      }
      if (activeFilters.department !== 'All' && emp.department !== activeFilters.department) return false;
      if (activeFilters.workMode !== 'All' && emp.workMode !== activeFilters.workMode) return false;
      if (activeFilters.status !== 'All' && emp.status !== activeFilters.status) return false;
      return true;
    }).sort((a, b) => {
      switch (activeFilters.sortBy) {
        case 'name-asc': return a.fullName.localeCompare(b.fullName);
        case 'name-desc': return b.fullName.localeCompare(a.fullName);
        case 'salary-desc': return b.salary - a.salary;
        case 'salary-asc': return a.salary - b.salary;
        case 'date-desc': return new Date(b.joiningDate) - new Date(a.joiningDate);
        case 'date-asc': return new Date(a.joiningDate) - new Date(b.joiningDate);
        default: return 0;
      }
    });
  }

  function renderApp() {
    const filtered = getFilteredEmployees();

    updateKPICards(employees, filtered);

    visibleCount.textContent = filtered.length;
    totalCount.textContent = employees.length;
    renderActiveFilterTags();

    if (filtered.length === 0) {
      employeeGrid.classList.add('hidden');
      tableView.classList.add('hidden');
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
      if (currentView === 'grid') {
        employeeGrid.classList.remove('hidden');
        tableView.classList.add('hidden');
        renderGridCards(filtered);
      } else {
        tableView.classList.remove('hidden');
        employeeGrid.classList.add('hidden');
        renderTableView(filtered);
      }
    }
  }

  function updateKPICards(allEmps, filteredEmps) {
    const total = allEmps.length;
    valTotalEmployees.textContent = total;

    const activeCount = allEmps.filter(e => e.status === 'Active').length;
    valActiveEmployees.textContent = activeCount;

    const activePct = total > 0 ? Math.round((activeCount / total) * 100) : 0;
    valActivePercent.textContent = `${activePct}% Active`;

    const totalSalary = allEmps.reduce((sum, e) => sum + (e.salary || 0), 0);
    const avgSalary = total > 0 ? Math.round(totalSalary / total) : 0;
    valAvgSalary.textContent = formatINR(avgSalary);

    const monthlyPayroll = Math.round(totalSalary / 12);
    valMonthlyPayroll.textContent = formatINR(monthlyPayroll);

    const deptCounts = {};
    allEmps.forEach(e => { deptCounts[e.department] = (deptCounts[e.department] || 0) + 1; });
    let topDept = 'N/A';
    let maxCount = 0;
    for (const [dept, count] of Object.entries(deptCounts)) {
      if (count > maxCount) { maxCount = count; topDept = dept; }
    }
    valTopDept.textContent = `Top: ${topDept}`;
  }

  function renderActiveFilterTags() {
    const tags = [];
    if (activeFilters.search) tags.push(`Query: "${activeFilters.search}"`);
    if (activeFilters.department !== 'All') tags.push(`Dept: ${activeFilters.department}`);
    if (activeFilters.workMode !== 'All') tags.push(`Mode: ${activeFilters.workMode}`);
    if (activeFilters.status !== 'All') tags.push(`Status: ${activeFilters.status}`);

    if (tags.length > 0) {
      clearFiltersBtn.classList.remove('hidden');
      activeFiltersContainer.innerHTML = tags.map(t => `<span class="tag-badge">${escapeHTML(t)}</span>`).join('');
    } else {
      clearFiltersBtn.classList.add('hidden');
      activeFiltersContainer.innerHTML = '';
    }
  }

  function renderGridCards(empList) {
    employeeGrid.innerHTML = empList.map(emp => {
      const statusClass = emp.status === 'Active' ? 'status-active' : (emp.status === 'On Leave' ? 'status-on-leave' : 'status-inactive');
      const initials = getInitials(emp.fullName);
      const bgStyle = emp.avatarColor || 'linear-gradient(135deg, #a855f7, #d946ef)';
      const skillsHtml = (emp.skills || []).slice(0, 3).map(s => `<span class="skill-pill">${escapeHTML(s)}</span>`).join('');

      return `
        <article class="employee-card" data-id="${emp.id}">
          <div class="card-header-row">
            <div class="card-avatar-group">
              <div class="emp-avatar" style="background: ${bgStyle};">${initials}</div>
              <div class="emp-info">
                <h3>${escapeHTML(emp.fullName)}</h3>
                <p class="emp-designation">${escapeHTML(emp.designation)}</p>
              </div>
            </div>
            <span class="emp-id-tag">${emp.id}</span>
          </div>

          <div class="card-meta-list">
            <div class="meta-item">
              <span>Department:</span>
              <strong>${escapeHTML(emp.department)}</strong>
            </div>
            <div class="meta-item">
              <span>Location:</span>
              <span><i class="fa-solid fa-location-dot text-xs"></i> ${escapeHTML(emp.location || 'Bengaluru')}</span>
            </div>
            <div class="meta-item">
              <span>Annual CTC:</span>
              <strong>${formatINR(emp.salary)}</strong>
            </div>
            <div class="meta-item">
              <span>Status:</span>
              <span class="status-pill ${statusClass}">${emp.status}</span>
            </div>
          </div>

          <div class="card-skills">
            ${skillsHtml}
          </div>

          <div class="card-actions">
            <button class="btn btn-secondary text-xs" data-action="profile" data-id="${emp.id}">
              <i class="fa-solid fa-id-card"></i> Profile
            </button>
            <div>
              <button class="btn btn-secondary text-xs" data-action="edit" data-id="${emp.id}" title="Edit"><i class="fa-solid fa-pen"></i></button>
              <button class="btn btn-danger text-xs" data-action="delete" data-id="${emp.id}" title="Delete"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  function renderTableView(empList) {
    employeeTableBody.innerHTML = empList.map(emp => {
      const statusClass = emp.status === 'Active' ? 'status-active' : (emp.status === 'On Leave' ? 'status-on-leave' : 'status-inactive');
      const initials = getInitials(emp.fullName);
      const bgStyle = emp.avatarColor || 'linear-gradient(135deg, #a855f7, #d946ef)';

      return `
        <tr data-id="${emp.id}">
          <td>
            <div class="table-emp-cell">
              <div class="table-avatar" style="background: ${bgStyle};">${initials}</div>
              <div>
                <strong>${escapeHTML(emp.fullName)}</strong>
                <div class="text-xs color-muted">${emp.id} • ${escapeHTML(emp.email)}</div>
              </div>
            </div>
          </td>
          <td>
            <div>${escapeHTML(emp.department)}</div>
            <div class="text-xs color-muted">${escapeHTML(emp.designation)}</div>
          </td>
          <td>${escapeHTML(emp.location || 'Bengaluru')}</td>
          <td><strong>${formatINR(emp.salary)}</strong></td>
          <td>${emp.workMode}</td>
          <td>${formatDate(emp.joiningDate)}</td>
          <td><span class="status-pill ${statusClass}">${emp.status}</span></td>
          <td class="text-right">
            <button class="btn btn-secondary text-xs" data-action="profile" data-id="${emp.id}"><i class="fa-solid fa-eye"></i></button>
            <button class="btn btn-secondary text-xs" data-action="edit" data-id="${emp.id}"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-danger text-xs" data-action="delete" data-id="${emp.id}"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Delegated Actions
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    const id = btn.getAttribute('data-id');
    if (action === 'profile') openProfileDrawer(id);
    else if (action === 'edit') openEditModal(id);
    else if (action === 'delete') deleteEmployee(id);
  });

  // Table sorting headers
  document.querySelectorAll('.th-sortable').forEach(th => {
    th.addEventListener('click', () => {
      const sortKey = th.getAttribute('data-sort');
      if (sortKey === 'name') {
        activeFilters.sortBy = activeFilters.sortBy === 'name-asc' ? 'name-desc' : 'name-asc';
      } else if (sortKey === 'salary') {
        activeFilters.sortBy = activeFilters.sortBy === 'salary-desc' ? 'salary-asc' : 'salary-desc';
      }
      sortBySelect.value = activeFilters.sortBy;
      renderApp();
    });
  });

  // Export functions
  function exportToCSV() {
    const filtered = getFilteredEmployees();
    if (filtered.length === 0) return showToast('No workforce records to export.', 'error');
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Location', 'Department', 'Designation', 'CTC INR', 'Joining Date', 'Status'];
    const rows = filtered.map(e => [e.id, `"${e.fullName}"`, `"${e.email}"`, `"${e.phone}"`, `"${e.location || 'Bengaluru'}"`, `"${e.department}"`, `"${e.designation}"`, e.salary, e.joiningDate, e.status]);
    const csvStr = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvStr);
    link.download = `ZAKVID_HR_Employees_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast('Exported CSV dataset!', 'success');
  }

  function exportToJSON() {
    const filtered = getFilteredEmployees();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filtered, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = `ZAKVID_HR_Employees_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showToast('Exported JSON dataset!', 'success');
  }

  // Utilities
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-triangle-exclamation' : 'fa-info-circle');
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${escapeHTML(message)}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  }

  function getInitials(name) {
    if (!name) return 'ZK';
    const parts = name.trim().split(' ');
    let init = parts[0].charAt(0).toUpperCase();
    if (parts.length > 1) init += parts[parts.length - 1].charAt(0).toUpperCase();
    return init;
  }

  function formatINR(amount) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
  }

  // Initial Run: Fetch employees from PHP MySQL Backend
  fetchEmployees();
});
