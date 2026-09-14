// Multi-User Central Store with Secure Username & Password Authentication
class AppStore {
  constructor() {
    this.storageKey = 'food_verification_store_v4';
    this.themeKey = 'food_verification_theme';
    this.currentUserIdKey = 'food_verification_current_user_id';
    this.isLoggedInKey = 'food_verification_is_logged_in';
    this.listeners = [];
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.users && parsed.checks && parsed.complaints) {
          // Always guarantee the admin account has username admin (and siva45 alias) and password admin / siva@2006
          let admin = parsed.users.find(u => u.role === 'admin' || u.id === 'user-admin' || u.username === 'siva45' || u.username === 'admin');
          if (admin) {
            admin.id = admin.id || 'user-admin';
            admin.username = admin.username || 'admin';
            admin.password = admin.password || 'admin';
            admin.role = 'admin';
            admin.name = 'Administrator';
            admin.email = admin.email || 'admin@foodcheck.ai';
          } else {
            parsed.users.unshift({
              id: 'user-admin',
              username: 'admin',
              name: 'Administrator',
              email: 'admin@foodcheck.ai',
              password: 'admin',
              role: 'admin',
              tag: 'Platform Administrator',
              avatar: '👑',
              color: '#8b5cf6'
            });
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not load stored data', e);
    }

    return {
      users: [
        {
          id: 'user-admin',
          username: 'admin',
          name: 'Administrator',
          email: 'admin@foodcheck.ai',
          password: 'admin',
          role: 'admin',
          tag: 'Platform Administrator',
          avatar: '👑',
          color: '#8b5cf6'
        },
        {
          id: 'user-siva',
          username: 'siva',
          name: 'siva',
          email: 'siva.prediction@gmail.com',
          password: 'password123',
          role: 'user',
          tag: 'prediction',
          avatar: 'S',
          color: '#00a86b'
        },
        {
          id: 'user-priya',
          username: 'priya',
          name: 'Priya Sharma',
          email: 'priya.k@gmail.com',
          password: 'password123',
          role: 'user',
          tag: 'Quality Inspector',
          avatar: 'P',
          color: '#0284c7'
        },
        {
          id: 'user-alex',
          username: 'alex',
          name: 'Alex Miller',
          email: 'alex.m@gmail.com',
          password: 'password123',
          role: 'user',
          tag: 'Receiving Staff',
          avatar: 'A',
          color: '#f59e0b'
        }
      ],
      checks: [
        {
          id: 'chk-101',
          userId: 'user-siva',
          userName: 'siva',
          type: 'Quantity',
          productName: 'Tomatoes',
          unit: 'kg',
          expectedQty: 2.0,
          receivedQty: 1.6,
          difference: -0.4,
          diffPercent: -20,
          status: 'Shortage',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          notes: 'Received 1.6 kg instead of ordered 2.0 kg (-400g)'
        },
        {
          id: 'chk-102',
          userId: 'user-siva',
          userName: 'siva',
          type: 'Quality',
          productName: 'Honeycrisp Apples',
          qualityScore: 96,
          qualityStatus: 'Fresh',
          image: '/images/fresh_apple.jpg',
          timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
          notes: 'Crisp taut skin, high firmness, optimal freshness.'
        },
        {
          id: 'chk-103',
          userId: 'user-priya',
          userName: 'Priya Sharma',
          type: 'Quality',
          productName: 'Cavendish Banana',
          qualityScore: 54,
          qualityStatus: 'Overripe / Brown Spots',
          image: '/images/overripe_banana.jpg',
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          notes: 'Advanced sugar spots, softening skin. Best for baking.'
        },
        {
          id: 'chk-104',
          userId: 'user-alex',
          userName: 'Alex Miller',
          type: 'Quantity',
          productName: 'Basmati Rice 5kg bag',
          unit: 'kg',
          expectedQty: 5.0,
          receivedQty: 4.2,
          difference: -0.8,
          diffPercent: -16,
          status: 'Shortage',
          timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
          notes: 'Shortage of 800g on delivery package.'
        }
      ],
      complaints: [
        {
          id: 'cmp-201',
          userId: 'user-siva',
          userName: 'siva',
          vendor: 'InstaGrocer App',
          orderId: 'ORD-8921-X',
          issueType: 'Short Quantity',
          productName: 'Tomatoes',
          shortage: '0.4 kg missing (20% deficit)',
          claimAmount: '$2.50',
          status: 'Pending Review',
          date: new Date(Date.now() - 3600000 * 1).toISOString(),
          description: 'Package contained only 1.6kg of tomatoes against the paid order of 2.0kg.'
        },
        {
          id: 'cmp-202',
          userId: 'user-alex',
          userName: 'Alex Miller',
          vendor: 'FreshMart Wholesaler',
          orderId: 'ORD-4412-B',
          issueType: 'Short Quantity',
          productName: 'Basmati Rice 5kg bag',
          shortage: '0.8 kg missing',
          claimAmount: '$4.20',
          status: 'Under Investigation',
          date: new Date(Date.now() - 3600000 * 36).toISOString(),
          description: 'Deficit of 800g detected upon weigh scale inspection.'
        }
      ]
    };
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not save data', e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  // Session & Authentication
  isLoggedIn() {
    const isLogged = localStorage.getItem(this.isLoggedInKey) === 'true';
    const currentId = this.getCurrentUserId();
    const user = currentId ? this.state.users.find(u => u.id === currentId) : null;
    return isLogged && !!user;
  }

  getCurrentUserId() {
    return localStorage.getItem(this.currentUserIdKey) || null;
  }

  getCurrentUser() {
    const currentId = this.getCurrentUserId();
    if (!currentId) return null;
    return this.state.users.find(u => u.id === currentId) || null;
  }

  switchUser(userId) {
    const user = this.state.users.find(u => u.id === userId);
    if (user) {
      localStorage.setItem(this.currentUserIdKey, user.id);
      localStorage.setItem(this.isLoggedInKey, 'true');
      this.notify();
      return { success: true, user };
    }
    return { success: false, error: 'User not found' };
  }

  // Authenticate Regular User with Username/Email and Password
  authenticateUser(identifier, password) {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check if logging in with admin credentials via regular form
    const admin = this.state.users.find(u => u.role === 'admin' || u.id === 'user-admin' || (u.username && u.username.toLowerCase() === 'siva45'));
    if (admin) {
      const isAdminUserMatch = (
        cleanId === 'admin' ||
        cleanId === 'siva45' ||
        cleanId === 'admin@foodcheck.ai' ||
        cleanId === 'siva45@foodcheck.ai' ||
        cleanId === (admin.username || '').toLowerCase() ||
        cleanId === (admin.email || '').toLowerCase()
      );
      const isAdminPassMatch = (
        cleanPass === admin.password ||
        cleanPass === 'admin' ||
        cleanPass === 'admin123' ||
        cleanPass === 'siva@2006'
      );
      if (isAdminUserMatch && isAdminPassMatch) {
        localStorage.setItem(this.currentUserIdKey, admin.id);
        localStorage.setItem(this.isLoggedInKey, 'true');
        this.notify();
        return { success: true, user: admin };
      }
    }

    // Check all users
    const user = this.state.users.find(u => 
      (u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId) &&
      u.password === cleanPass
    );

    if (user) {
      localStorage.setItem(this.currentUserIdKey, user.id);
      localStorage.setItem(this.isLoggedInKey, 'true');
      this.notify();
      return { success: true, user };
    }

    return { success: false, error: 'Invalid username/email or password.' };
  }

  // Authenticate Administrator with Email/Username and Password
  authenticateAdmin(identifier, password) {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    const admin = this.state.users.find(u => 
      u.role === 'admin' || u.id === 'user-admin' || (u.username && u.username.toLowerCase() === 'siva45')
    );

    if (admin) {
      const isAdminUserMatch = (
        cleanId === 'admin' ||
        cleanId === 'siva45' ||
        cleanId === 'admin@foodcheck.ai' ||
        cleanId === 'siva45@foodcheck.ai' ||
        cleanId === (admin.username || '').toLowerCase() ||
        cleanId === (admin.email || '').toLowerCase()
      );
      const isAdminPassMatch = (
        cleanPass === admin.password ||
        cleanPass === 'admin' ||
        cleanPass === 'admin123' ||
        cleanPass === 'siva@2006'
      );

      if (isAdminUserMatch && isAdminPassMatch) {
        localStorage.setItem(this.currentUserIdKey, admin.id);
        localStorage.setItem(this.isLoggedInKey, 'true');
        this.notify();
        return { success: true, admin };
      }
    }

    return { success: false, error: 'Invalid admin credentials. Use username: admin (or siva45) and password: admin (or siva@2006).' };
  }

  // Register New User Account with Password
  registerUser({ name, username, email, password }) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = (username || cleanEmail.split('@')[0]).trim().toLowerCase();
    const cleanPass = password.trim();

    if (this.state.users.some(u => u.email.toLowerCase() === cleanEmail || u.username.toLowerCase() === cleanUsername)) {
      return { success: false, error: 'An account with this email or username already exists.' };
    }

    const newUser = {
      id: 'user-' + Date.now(),
      username: cleanUsername,
      name: name.trim(),
      email: cleanEmail,
      password: cleanPass,
      role: 'user',
      tag: 'Staff Inspector',
      avatar: name.trim()[0].toUpperCase(),
      color: '#059669'
    };

    this.state.users.push(newUser);
    this.saveState();

    localStorage.setItem(this.currentUserIdKey, newUser.id);
    localStorage.setItem(this.isLoggedInKey, 'true');
    this.notify();
    return { success: true, user: newUser };
  }

  logout() {
    localStorage.setItem(this.isLoggedInKey, 'false');
    localStorage.removeItem(this.currentUserIdKey);
    this.notify();
  }

  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  }

  getAllUsers() {
    return this.state.users;
  }

  // Strict Filter: Regular users can ONLY see their own checks!
  getChecksForCurrentUser(filterUserId = null) {
    const user = this.getCurrentUser();
    if (!user) return [];

    if (user.role === 'admin') {
      if (filterUserId && filterUserId !== 'all') {
        return this.state.checks.filter(c => c.userId === filterUserId);
      }
      return this.state.checks;
    }
    // Regular users strictly restricted to own data
    return this.state.checks.filter(c => c.userId === user.id);
  }

  // Strict Filter: Regular users can ONLY see their own complaints!
  getComplaintsForCurrentUser(filterUserId = null) {
    const user = this.getCurrentUser();
    if (!user) return [];

    if (user.role === 'admin') {
      if (filterUserId && filterUserId !== 'all') {
        return this.state.complaints.filter(c => c.userId === filterUserId);
      }
      return this.state.complaints;
    }
    // Regular users strictly restricted to own data
    return this.state.complaints.filter(c => c.userId === user.id);
  }

  addCheck(check) {
    const user = this.getCurrentUser();
    if (!user) return null;

    const newCheck = {
      id: 'chk-' + Date.now(),
      userId: user.id,
      userName: user.name,
      timestamp: new Date().toISOString(),
      ...check
    };
    this.state.checks.unshift(newCheck);
    this.saveState();
    return newCheck;
  }

  deleteCheck(id) {
    const user = this.getCurrentUser();
    if (!user) return;

    // Users can only delete their own checks (Admin can delete any)
    if (user.role === 'admin') {
      this.state.checks = this.state.checks.filter(c => c.id !== id);
    } else {
      this.state.checks = this.state.checks.filter(c => c.id !== id && c.userId === user.id);
    }
    this.saveState();
  }

  addComplaint(complaint) {
    const user = this.getCurrentUser();
    if (!user) return null;

    const newComplaint = {
      id: 'cmp-' + Date.now(),
      userId: user.id,
      userName: user.name,
      date: new Date().toISOString(),
      status: 'Pending Review',
      ...complaint
    };
    this.state.complaints.unshift(newComplaint);
    this.saveState();
    return newComplaint;
  }

  updateComplaintStatus(id, newStatus, adminNote = '') {
    const cmp = this.state.complaints.find(c => c.id === id);
    if (cmp) {
      cmp.status = newStatus;
      if (adminNote) cmp.adminNote = adminNote;
      this.saveState();
    }
  }

  deleteComplaint(id) {
    const user = this.getCurrentUser();
    if (!user) return;

    if (user.role === 'admin') {
      this.state.complaints = this.state.complaints.filter(c => c.id !== id);
    } else {
      this.state.complaints = this.state.complaints.filter(c => c.id !== id && c.userId === user.id);
    }
    this.saveState();
  }

  getTheme() {
    return localStorage.getItem(this.themeKey) || 'light';
  }

  setTheme(theme) {
    localStorage.setItem(this.themeKey, theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.notify();
  }

  toggleTheme() {
    const next = this.getTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
    return next;
  }

  getStats(filterUserId = null) {
    const checks = this.getChecksForCurrentUser(filterUserId);
    const totalChecks = checks.length;
    
    const issuesCount = checks.filter(c => {
      if (c.type === 'Quantity' && c.status === 'Shortage') return true;
      if (c.type === 'Quality' && c.qualityScore < 70) return true;
      if (c.type === 'Order' && c.missingItemsCount > 0) return true;
      return false;
    }).length;

    const qualityChecks = checks.filter(c => c.type === 'Quality' && typeof c.qualityScore === 'number');
    const avgQuality = qualityChecks.length > 0
      ? Math.round(qualityChecks.reduce((sum, c) => sum + c.qualityScore, 0) / qualityChecks.length) + '%'
      : '—';

    return {
      totalChecks,
      issuesCount,
      avgQuality
    };
  }

  getAdminOrgStats() {
    const totalTeamChecks = this.state.checks.length;
    const totalStaffMembers = this.state.users.filter(u => u.role !== 'admin').length;
    const totalComplaints = this.state.complaints.length;
    const pendingComplaints = this.state.complaints.filter(c => c.status === 'Pending Review').length;

    const totalClaimMoney = this.state.complaints.reduce((acc, c) => {
      const match = c.claimAmount ? c.claimAmount.replace(/[^0-9.]/g, '') : '0';
      return acc + (parseFloat(match) || 0);
    }, 0).toFixed(2);

    return {
      totalTeamChecks,
      totalStaffMembers,
      totalComplaints,
      pendingComplaints,
      totalClaimMoney: `$${totalClaimMoney}`
    };
  }
}

export const store = new AppStore();
