import { useEffect, useState } from "react";
import type { AuthUser, UserRole } from "../types/auth";

const authKey = "jobboard-auth-user";
const registeredUsersKey = "jobboard-registered-users";

function readUser() {
  try {
    const user = sessionStorage.getItem(authKey);
    return user ? (JSON.parse(user) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function readRegisteredUsers() {
  try {
    const users = localStorage.getItem(registeredUsersKey);
    return users ? (JSON.parse(users) as AuthUser[]) : [];
  } catch {
    return [];
  }
}

function saveRegisteredUser(user: AuthUser) {
  const users = readRegisteredUsers();
  const nextUsers = [user, ...users.filter((item) => item.email.toLowerCase() !== user.email.toLowerCase())];
  localStorage.setItem(registeredUsersKey, JSON.stringify(nextUsers));
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => readUser());
  const [hasRegisteredAccount, setHasRegisteredAccount] = useState(() => readRegisteredUsers().length > 0);

  useEffect(() => {
    const syncUser = () => {
      setUser(readUser());
      setHasRegisteredAccount(readRegisteredUsers().length > 0);
    };
    window.addEventListener("jobboard:auth", syncUser);
    return () => window.removeEventListener("jobboard:auth", syncUser);
  }, []);

  const login = (payload: {
    name: string;
    email: string;
    role: UserRole;
    company?: string;
    primarySkill?: string;
    profileImage?: string;
    whatsapp?: string;
    facebook?: string;
    x?: string;
    linkedin?: string;
    portfolio?: string;
  }) => {
    const nextUser: AuthUser = {
      id: crypto.randomUUID(),
      name: payload.name.trim(),
      email: payload.email.trim(),
      role: payload.role,
      company: payload.company?.trim(),
      primarySkill: payload.primarySkill?.trim(),
      profileImage: payload.profileImage,
      whatsapp: payload.whatsapp?.trim(),
      facebook: payload.facebook?.trim(),
      x: payload.x?.trim(),
      linkedin: payload.linkedin?.trim(),
      portfolio: payload.portfolio?.trim(),
    };

    sessionStorage.setItem(authKey, JSON.stringify(nextUser));
    saveRegisteredUser(nextUser);
    setUser(nextUser);
    setHasRegisteredAccount(true);
    window.dispatchEvent(new Event("jobboard:auth"));
    return nextUser;
  };

  const logout = () => {
    sessionStorage.removeItem(authKey);
    setUser(null);
    window.dispatchEvent(new Event("jobboard:auth"));
  };

  return { user, login, logout, hasRegisteredAccount };
}

export function useRegisteredUsers() {
  const [registeredUsers, setRegisteredUsers] = useState<AuthUser[]>(() => readRegisteredUsers());

  useEffect(() => {
    const syncUsers = () => setRegisteredUsers(readRegisteredUsers());
    window.addEventListener("jobboard:auth", syncUsers);
    window.addEventListener("storage", syncUsers);
    return () => {
      window.removeEventListener("jobboard:auth", syncUsers);
      window.removeEventListener("storage", syncUsers);
    };
  }, []);

  return registeredUsers;
}
