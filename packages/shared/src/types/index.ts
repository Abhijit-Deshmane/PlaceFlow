// ─── Shared TypeScript Types ───────────────────────────────────────────────────
// Plain TS types (no Zod). Used for API response shapes consumed by web and mobile.
// Authentication is handled by Clerk. PlaceFlow controls roles and permissions.

// ─── Enums ──────────────────────────────────────────────────────────────────

/** The five application roles in PlaceFlow. */
export type UserRole =
  | "SUPER_ADMIN"
  | "COLLEGE_ADMIN"
  | "PLACEMENT_OFFICER"
  | "RECRUITER"
  | "STUDENT";

/** Account status for application users. */
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

/** Placement status for students. */
export type PlacementStatus = "NOT_PLACED" | "PLACED" | "OPTED_OUT";

/** Operating status for recruiting partner companies. */
export type CompanyStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "PENDING_APPROVAL"
  | "BLACKLISTED";

/** Employment types supported for placement drives. */
export type EmploymentType =
  | "FULL_TIME"
  | "INTERNSHIP"
  | "INTERN_TO_FULL_TIME"
  | "CONTRACT";

/** Lifecycle status for placement drives. */
export type PlacementDriveStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "CLOSED"
  | "COMPLETED"
  | "CANCELLED";

/** Gender eligibility criteria for drives. */
export type GenderAllowed = "ALL" | "MALE_ONLY" | "FEMALE_ONLY";

/** Lifecycle status for student applications. */
export type ApplicationStatus =
  | "APPLIED"
  | "UNDER_REVIEW"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "SELECTED"
  | "OFFERED"
  | "REJECTED"
  | "WITHDRAWN";

/** Status for candidate interview rounds. */
export type InterviewStatus =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "RESCHEDULED"
  | "NO_SHOW";

/** Evaluation result for interview rounds. */
export type InterviewResult = "PENDING" | "PASSED" | "FAILED" | "ON_HOLD";

/** Decision status for employment offers. */
export type OfferStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "REVOKED"
  | "EXPIRED";

/** Categories for in-app notifications. */
export type NotificationType =
  | "DRIVE_PUBLISHED"
  | "APPLICATION_STATUS_CHANGED"
  | "INTERVIEW_SCHEDULED"
  | "INTERVIEW_RESCHEDULED"
  | "OFFER_RECEIVED"
  | "GENERAL_ANNOUNCEMENT"
  | "SYSTEM";

/** Document types supported for storage and verification. */
export type DocumentType =
  | "RESUME"
  | "CERTIFICATE"
  | "OFFER_LETTER"
  | "TRANSCRIPT"
  | "ID_PROOF"
  | "OTHER";

// ─── User Shapes ─────────────────────────────────────────────────────────────

/**
 * The safe, public-facing PlaceFlow user shape returned by the API.
 * Never includes passwords, Clerk internals, or sensitive fields.
 */
export interface SafeUser {
  id: string;
  clerkUserId: string;
  email: string;
  name: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Student Shapes ──────────────────────────────────────────────────────────

export interface StudentProfile {
  id: string;
  userId: string;
  enrollmentNumber: string;
  branch: string;
  graduationYear: number;
  cgpa: number | null;
  percentage: number | null;
  backlogs: number;
  placementStatus: PlacementStatus;
  phone: string | null;
  altPhone: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  currentAddress: string | null;
  permanentAddress: string | null;
  skills: string[];
  projects: unknown | null;
  certifications: unknown | null;
  resumeUrl: string | null;
  portfolioUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  createdAt: string;
  updatedAt: string;
  user?: SafeUser;
}

// ─── Company & Recruiter Shapes ──────────────────────────────────────────────

export interface CompanyProfile {
  id: string;
  name: string;
  website: string | null;
  industry: string | null;
  description: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  logoUrl: string | null;
  status: CompanyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RecruiterProfile {
  id: string;
  userId: string;
  companyId: string;
  designation: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  user?: SafeUser;
  company?: CompanyProfile;
}

// ─── Placement Drive & Eligibility Shapes ───────────────────────────────────

export interface EligibilityCriteriaShape {
  id: string;
  placementDriveId: string;
  minCgpa: number | null;
  minPercentage: number | null;
  maxBacklogs: number | null;
  allowedBranches: string[];
  allowedGraduationYears: number[];
  genderAllowed: GenderAllowed;
  additionalCriteria: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlacementDriveSummary {
  id: string;
  companyId: string;
  title: string;
  description: string;
  jobLocation: string | null;
  employmentType: EmploymentType;
  ctc: string | null;
  baseSalary: number | null;
  numberOfPositions: number | null;
  applicationDeadline: string;
  driveDate: string | null;
  selectionProcess: string | null;
  status: PlacementDriveStatus;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
  company?: CompanyProfile;
  eligibility?: EligibilityCriteriaShape | null;
}

// ─── Application Shapes ──────────────────────────────────────────────────────

export interface ApplicationSummary {
  id: string;
  studentId: string;
  placementDriveId: string;
  status: ApplicationStatus;
  resumeUrl: string | null;
  coverLetter: string | null;
  notes: string | null;
  appliedAt: string;
  updatedAt: string;
  student?: StudentProfile;
  placementDrive?: PlacementDriveSummary;
}

// ─── Interview Shapes ────────────────────────────────────────────────────────

export interface InterviewSummary {
  id: string;
  applicationId: string;
  studentId: string;
  placementDriveId: string;
  roundNumber: number;
  roundName: string;
  scheduledAt: string;
  durationMinutes: number | null;
  location: string | null;
  meetingLink: string | null;
  status: InterviewStatus;
  feedback: string | null;
  result: InterviewResult;
  interviewerName: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Offer Shapes ────────────────────────────────────────────────────────────

export interface OfferSummary {
  id: string;
  studentId: string;
  companyId: string;
  placementDriveId: string;
  applicationId: string | null;
  role: string;
  ctc: number;
  ctcDisplay: string | null;
  location: string | null;
  offerDate: string;
  joiningDate: string | null;
  validUntil: string | null;
  status: OfferStatus;
  offerLetterUrl: string | null;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  student?: StudentProfile;
  company?: CompanyProfile;
}

// ─── Notification & Audit Shapes ─────────────────────────────────────────────

export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  readAt: string | null;
  entityType: string | null;
  entityId: string | null;
  actionUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string | null;
  actorRole: UserRole | null;
  actorEmail: string | null;
  action: string;
  resourceType: string;
  resourceId: string | null;
  oldValues: unknown | null;
  newValues: unknown | null;
  metadata: unknown | null;
  ipAddress: string | null;
  userAgent: string | null;
  requestId: string | null;
  createdAt: string;
}

export interface DocumentMetadata {
  id: string;
  studentId: string | null;
  uploadedById: string | null;
  type: DocumentType;
  name: string;
  fileUrl: string;
  fileKey: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  isVerified: boolean;
  verifiedAt: string | null;
  verifiedById: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── API Response Envelope ───────────────────────────────────────────────────
// All API responses MUST use this envelope. See apps/api/AGENTS.md.

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationMeta;
}
