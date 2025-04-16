
import { UserProfile, UserRole } from "@/types/user";

export const hasRole = (userProfile: UserProfile | null, roles: UserRole | UserRole[]): boolean => {
  if (!userProfile) return false;
  
  if (Array.isArray(roles)) {
    return roles.includes(userProfile.role);
  }
  
  return userProfile.role === roles;
};

export const isAdmin = (userProfile: UserProfile | null): boolean => hasRole(userProfile, 'admin');
export const isConsultant = (userProfile: UserProfile | null): boolean => hasRole(userProfile, 'consultant');
export const isClientOwner = (userProfile: UserProfile | null): boolean => hasRole(userProfile, 'client');
export const isProjectManager = (userProfile: UserProfile | null): boolean => false;
