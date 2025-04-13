import { supabase, useLocalStorageFallback } from "./supabase";

interface AdminUser {
  id: string;
  username: string;
  password: string; // In a real app, this would be hashed
  role: "admin" | "user";
}

// Local storage key for admin users
const ADMIN_USERS_STORAGE_KEY = "admin_users";

// Initialize with default admin user if empty
const initializeAdminUsers = () => {
  if (!localStorage.getItem(ADMIN_USERS_STORAGE_KEY)) {
    const defaultAdmin: AdminUser = {
      id: "admin-1",
      username: "admin",
      password: "admin123", // In a real app, this would be hashed
      role: "admin",
    };
    localStorage.setItem(
      ADMIN_USERS_STORAGE_KEY,
      JSON.stringify([defaultAdmin]),
    );
  }
};

// Initialize on module load
initializeAdminUsers();

// Authenticate user
export const authenticateUser = async (
  username: string,
  password: string,
): Promise<{ success: boolean; user?: { username: string; role: string } }> => {
  try {
    if (useLocalStorageFallback()) {
      // Use localStorage
      const users = JSON.parse(
        localStorage.getItem(ADMIN_USERS_STORAGE_KEY) || "[]",
      ) as AdminUser[];

      const user = users.find(
        (u) => u.username === username && u.password === password,
      );

      if (user) {
        return {
          success: true,
          user: { username: user.username, role: user.role },
        };
      }

      return { success: false };
    } else {
      // Use Supabase
      // In a real app, you would use Supabase Auth or a custom auth table
      const { data, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("username", username)
        .single();

      if (error || !data) {
        return { success: false };
      }

      // In a real app, you would use proper password hashing
      if (data.password === password) {
        return {
          success: true,
          user: { username: data.username, role: data.role },
        };
      }

      return { success: false };
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    return { success: false };
  }
};

// Create admin user
export const createAdminUser = async (
  userData: Omit<AdminUser, "id">,
): Promise<{ success: boolean; userId?: string }> => {
  try {
    if (useLocalStorageFallback()) {
      // Use localStorage
      const users = JSON.parse(
        localStorage.getItem(ADMIN_USERS_STORAGE_KEY) || "[]",
      ) as AdminUser[];

      // Check if username already exists
      if (users.some((u) => u.username === userData.username)) {
        return { success: false };
      }

      const newUser: AdminUser = {
        id: `user-${Date.now()}`,
        ...userData,
      };

      users.push(newUser);
      localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(users));

      return { success: true, userId: newUser.id };
    } else {
      // Use Supabase
      const { data, error } = await supabase
        .from("admin_users")
        .insert({
          username: userData.username,
          password: userData.password, // In a real app, this would be hashed
          role: userData.role,
        })
        .select("id")
        .single();

      if (error) {
        return { success: false };
      }

      return { success: true, userId: data.id };
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
    return { success: false };
  }
};
