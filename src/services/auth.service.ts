interface User {
  email: string;
  isVerified: boolean;
  name?: string;
  number?: string;
}

export const authService = {
  setUser(user: User): void {
    localStorage.setItem("user", JSON.stringify(user));
  },

  getUser(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  clearUser(): void {
    localStorage.removeItem("user");
  },

  isLoggedIn(): boolean {
    return !!this.getUser();
  },

  isVerified(): boolean {
    const user = this.getUser();
    return user ? user.isVerified : false;
  },

  setVerified(isVerified: boolean): void {
    const user = this.getUser();
    if (user) {
      user.isVerified = isVerified;
      this.setUser(user);
    }
  },
};
