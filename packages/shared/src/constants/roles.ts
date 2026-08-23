import type { UserRole } from "../types";

// ─── Role Hierarchy ─────────────────────────────────────────────────────────
// Higher number = more privilege. Used for hierarchy comparisons.

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  SUPER_ADMIN: 5,
  COLLEGE_ADMIN: 4,
  PLACEMENT_OFFICER: 3,
  RECRUITER: 2,
  STUDENT: 1,
} as const;

// ─── Role Labels ────────────────────────────────────────────────────────────
// Human-readable labels for display in the UI.

export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  COLLEGE_ADMIN: "College Admin",
  PLACEMENT_OFFICER: "Placement Officer",
  RECRUITER: "Recruiter",
  STUDENT: "Student",
} as const;

// ─── Permissions ────────────────────────────────────────────────────────────
// Machine-readable permission strings. Authorization is enforced server-side.
// This list is the single source of truth for named permissions.

export const PERMISSIONS = {
  // System
  MANAGE_SYSTEM: "manage:system",
  VIEW_AUDIT_LOGS: "view:audit_logs",

  // Users
  MANAGE_USERS: "manage:users",
  VIEW_USERS: "view:users",

  // Students
  MANAGE_STUDENTS: "manage:students",
  VIEW_ALL_STUDENTS: "view:all_students",
  VIEW_OWN_STUDENT: "view:own_student",
  IMPORT_STUDENTS: "import:students",

  // Companies
  MANAGE_COMPANIES: "manage:companies",
  VIEW_COMPANIES: "view:companies",

  // Placement Drives
  MANAGE_DRIVES: "manage:drives",
  CREATE_DRIVES: "create:drives",
  PUBLISH_DRIVES: "publish:drives",
  VIEW_DRIVES: "view:drives",

  // Applications
  MANAGE_APPLICATIONS: "manage:applications",
  VIEW_ALL_APPLICATIONS: "view:all_applications",
  VIEW_OWN_APPLICATION: "view:own_application",
  APPLY_TO_DRIVE: "apply:drive",

  // Analytics
  VIEW_ANALYTICS: "view:analytics",
  VIEW_OWN_ANALYTICS: "view:own_analytics",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// ─── Role → Permissions Map ─────────────────────────────────────────────────
// Defines which permissions each role has. Authorization is ALWAYS enforced
// server-side. This map may also be used on the client for UI rendering only.

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: Object.values(PERMISSIONS) as Permission[],

  COLLEGE_ADMIN: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.MANAGE_STUDENTS,
    PERMISSIONS.VIEW_ALL_STUDENTS,
    PERMISSIONS.IMPORT_STUDENTS,
    PERMISSIONS.MANAGE_COMPANIES,
    PERMISSIONS.VIEW_COMPANIES,
    PERMISSIONS.MANAGE_DRIVES,
    PERMISSIONS.CREATE_DRIVES,
    PERMISSIONS.PUBLISH_DRIVES,
    PERMISSIONS.VIEW_DRIVES,
    PERMISSIONS.MANAGE_APPLICATIONS,
    PERMISSIONS.VIEW_ALL_APPLICATIONS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_AUDIT_LOGS,
  ],

  PLACEMENT_OFFICER: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.MANAGE_STUDENTS,
    PERMISSIONS.VIEW_ALL_STUDENTS,
    PERMISSIONS.MANAGE_COMPANIES,
    PERMISSIONS.VIEW_COMPANIES,
    PERMISSIONS.MANAGE_DRIVES,
    PERMISSIONS.CREATE_DRIVES,
    PERMISSIONS.PUBLISH_DRIVES,
    PERMISSIONS.VIEW_DRIVES,
    PERMISSIONS.MANAGE_APPLICATIONS,
    PERMISSIONS.VIEW_ALL_APPLICATIONS,
    PERMISSIONS.VIEW_ANALYTICS,
  ],

  RECRUITER: [
    PERMISSIONS.VIEW_DRIVES,
    PERMISSIONS.VIEW_ALL_APPLICATIONS,
    PERMISSIONS.MANAGE_APPLICATIONS,
    PERMISSIONS.VIEW_OWN_ANALYTICS,
  ],

  STUDENT: [
    PERMISSIONS.VIEW_OWN_STUDENT,
    PERMISSIONS.VIEW_DRIVES,
    PERMISSIONS.APPLY_TO_DRIVE,
    PERMISSIONS.VIEW_OWN_APPLICATION,
    PERMISSIONS.VIEW_OWN_ANALYTICS,
  ],
};

// ─── Role Nav Config ─────────────────────────────────────────────────────────
// Navigation items shown per role. Used by the UI shell (sidebar).
// IMPORTANT: Never rely on this for security — only for UI presentation.

export const ROLE_NAV_AREAS: Record<UserRole, string[]> = {
  SUPER_ADMIN: ["overview", "users", "colleges", "system", "audit-logs"],
  COLLEGE_ADMIN: ["overview", "users", "students", "companies", "drives", "analytics"],
  PLACEMENT_OFFICER: ["overview", "students", "companies", "drives", "applications", "analytics"],
  RECRUITER: ["overview", "drives", "candidates"],
  STUDENT: ["overview", "drives", "applications", "profile"],
};
