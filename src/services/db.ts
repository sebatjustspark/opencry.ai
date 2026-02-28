export interface User {
  email: string;
  passwordHash: string;
  createdAt: number;
}

export const db = {
  getUsers: (): User[] => {
    const users = localStorage.getItem('opencry_users');
    return users ? JSON.parse(users) : [];
  },
  
  saveUsers: (users: User[]) => {
    localStorage.setItem('opencry_users', JSON.stringify(users));
  },

  signUp: async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = db.getUsers();
        if (users.find(u => u.email === email)) {
          resolve({ success: false, error: 'User already exists' });
          return;
        }
        
        users.push({
          email,
          passwordHash: btoa(password), // Simple mock hash
          createdAt: Date.now()
        });
        
        db.saveUsers(users);
        resolve({ success: true });
      }, 1000);
    });
  },

  signIn: async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = db.getUsers();
        const user = users.find(u => u.email === email);
        
        if (!user) {
          resolve({ success: false, error: 'User not found' });
          return;
        }
        
        if (user.passwordHash !== btoa(password)) {
          resolve({ success: false, error: 'Invalid password' });
          return;
        }
        
        resolve({ success: true });
      }, 1000);
    });
  }
};
