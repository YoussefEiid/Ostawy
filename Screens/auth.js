// ========== Ostawy Auth System ==========
const Auth = {
  register(name, email, phone, password, role) {
    const users = JSON.parse(localStorage.getItem('ostawy_users') || '[]');
    if (users.find(u => u.email === email)) return { ok: false, msg: 'البريد الإلكتروني مسجل مسبقاً' };
    const user = { id: Date.now(), name, email, phone, password, role, createdAt: new Date().toISOString() };
    users.push(user);
    localStorage.setItem('ostawy_users', JSON.stringify(users));
    return { ok: true, user };
  },

  login(emailOrPhone, password, role) {
    const users = JSON.parse(localStorage.getItem('ostawy_users') || '[]');
    const user = users.find(u =>
      (u.email === emailOrPhone || u.phone === emailOrPhone) &&
      u.password === password &&
      u.role === role
    );
    if (!user) return { ok: false, msg: 'بيانات الدخول غير صحيحة أو النوع غير مطابق' };
    localStorage.setItem('ostawy_current_user', JSON.stringify(user));
    return { ok: true, user };
  },

  logout() {
    localStorage.removeItem('ostawy_current_user');
    window.location.href = 'sign_in.html';
  },

  currentUser() {
    return JSON.parse(localStorage.getItem('ostawy_current_user') || 'null');
  },

  requireAuth(redirectTo = 'sign_in.html') {
    const user = this.currentUser();
    if (!user) { window.location.href = redirectTo; return null; }
    return user;
  },

  requireRole(role) {
    const user = this.requireAuth();
    if (user && user.role !== role) {
      window.location.href = user.role === 'worker' ? 'worker_dashbord.html' : 'home_page.html';
      return null;
    }
    return user;
  }
};
