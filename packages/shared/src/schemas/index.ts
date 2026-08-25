import { z } from "zod";

// ─── Enums Schemas ──────────────────────────────────────────────────────────

export const userRoleSchema = z.enum([
  "SUPER_ADMIN",
  "COLLEGE_ADMIN",
  "PLACEMENT_OFFICER",
  "RECRUITER",
  "STUDENT",
]);

export const userStatusSchema = z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]);

export const placementStatusSchema = z.enum([
  "NOT_PLACED",
  "PLACED",
  "OPTED_OUT",
]);

export const companyStatusSchema = z.enum([
  "ACTIVE",
  "INACTIVE",
  "PENDING_APPROVAL",
  "BLACKLISTED",
]);

export const employmentTypeSchema = z.enum([
  "FULL_TIME",
  "INTERNSHIP",
  "INTERN_TO_FULL_TIME",
  "CONTRACT",
]);

export const placementDriveStatusSchema = z.enum([
  "DRAFT",
  "PUBLISHED",
  "CLOSED",
  "COMPLETED",
  "CANCELLED",
]);

export const genderAllowedSchema = z.enum(["ALL", "MALE_ONLY", "FEMALE_ONLY"]);

export const applicationStatusSchema = z.enum([
  "APPLIED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "INTERVIEW",
  "SELECTED",
  "OFFERED",
  "REJECTED",
  "WITHDRAWN",
]);

export const interviewStatusSchema = z.enum([
  "SCHEDULED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "RESCHEDULED",
  "NO_SHOW",
]);

export const interviewResultSchema = z.enum([
  "PENDING",
  "PASSED",
  "FAILED",
  "ON_HOLD",
]);

export const offerStatusSchema = z.enum([
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "REVOKED",
  "EXPIRED",
]);

export const notificationTypeSchema = z.enum([
  "DRIVE_PUBLISHED",
  "APPLICATION_STATUS_CHANGED",
  "INTERVIEW_SCHEDULED",
  "INTERVIEW_RESCHEDULED",
  "OFFER_RECEIVED",
  "GENERAL_ANNOUNCEMENT",
  "SYSTEM",
]);

export const documentTypeSchema = z.enum([
  "RESUME",
  "CERTIFICATE",
  "OFFER_LETTER",
  "TRANSCRIPT",
  "ID_PROOF",
  "OTHER",
]);

// ─── Safe User Schema ───────────────────────────────────────────────────────
// Matches the SafeUser interface. Used to validate GET /api/v1/auth/me response.

export const safeUserSchema = z.object({
  id: z.string(),
  clerkUserId: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  role: userRoleSchema,
  status: userStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ─── Student Profile Schema ──────────────────────────────────────────────────

export const studentProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  enrollmentNumber: z.string(),
  branch: z.string(),
  graduationYear: z.number().int(),
  cgpa: z.number().nullable(),
  percentage: z.number().nullable(),
  backlogs: z.number().int(),
  placementStatus: placementStatusSchema,
  phone: z.string().nullable(),
  altPhone: z.string().nullable(),
  gender: z.string().nullable(),
  dateOfBirth: z.string().nullable(),
  currentAddress: z.string().nullable(),
  permanentAddress: z.string().nullable(),
  skills: z.array(z.string()),
  projects: z.unknown().nullable(),
  certifications: z.unknown().nullable(),
  resumeUrl: z.string().nullable(),
  portfolioUrl: z.string().nullable(),
  githubUrl: z.string().nullable(),
  linkedinUrl: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  user: safeUserSchema.optional(),
});

// ─── Company & Recruiter Schemas ─────────────────────────────────────────────

export const companyProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  website: z.string().nullable(),
  industry: z.string().nullable(),
  description: z.string().nullable(),
  contactEmail: z.string().nullable(),
  contactPhone: z.string().nullable(),
  address: z.string().nullable(),
  logoUrl: z.string().nullable(),
  status: companyStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const recruiterProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  companyId: z.string(),
  designation: z.string().nullable(),
  phone: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  user: safeUserSchema.optional(),
  company: companyProfileSchema.optional(),
});

// ─── Placement Drive & Eligibility Schemas ───────────────────────────────────

export const eligibilityCriteriaSchema = z.object({
  id: z.string(),
  placementDriveId: z.string(),
  minCgpa: z.number().nullable(),
  minPercentage: z.number().nullable(),
  maxBacklogs: z.number().int().nullable(),
  allowedBranches: z.array(z.string()),
  allowedGraduationYears: z.array(z.number().int()),
  genderAllowed: genderAllowedSchema,
  additionalCriteria: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const placementDriveSummarySchema = z.object({
  id: z.string(),
  companyId: z.string(),
  title: z.string(),
  description: z.string(),
  jobLocation: z.string().nullable(),
  employmentType: employmentTypeSchema,
  ctc: z.string().nullable(),
  baseSalary: z.number().nullable(),
  numberOfPositions: z.number().int().nullable(),
  applicationDeadline: z.string(),
  driveDate: z.string().nullable(),
  selectionProcess: z.string().nullable(),
  status: placementDriveStatusSchema,
  createdById: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  company: companyProfileSchema.optional(),
  eligibility: eligibilityCriteriaSchema.nullable().optional(),
});

// ─── Application Schemas ─────────────────────────────────────────────────────

export const applicationSummarySchema = z.object({
  id: z.string(),
  studentId: z.string(),
  placementDriveId: z.string(),
  status: applicationStatusSchema,
  resumeUrl: z.string().nullable(),
  coverLetter: z.string().nullable(),
  notes: z.string().nullable(),
  appliedAt: z.string(),
  updatedAt: z.string(),
  student: studentProfileSchema.optional(),
  placementDrive: placementDriveSummarySchema.optional(),
});

// ─── Interview Schemas ───────────────────────────────────────────────────────

export const interviewSummarySchema = z.object({
  id: z.string(),
  applicationId: z.string(),
  studentId: z.string(),
  placementDriveId: z.string(),
  roundNumber: z.number().int(),
  roundName: z.string(),
  scheduledAt: z.string(),
  durationMinutes: z.number().int().nullable(),
  location: z.string().nullable(),
  meetingLink: z.string().nullable(),
  status: interviewStatusSchema,
  feedback: z.string().nullable(),
  result: interviewResultSchema,
  interviewerName: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ─── Offer Schemas ───────────────────────────────────────────────────────────

export const offerSummarySchema = z.object({
  id: z.string(),
  studentId: z.string(),
  companyId: z.string(),
  placementDriveId: z.string(),
  applicationId: z.string().nullable(),
  role: z.string(),
  ctc: z.number(),
  ctcDisplay: z.string().nullable(),
  location: z.string().nullable(),
  offerDate: z.string(),
  joiningDate: z.string().nullable(),
  validUntil: z.string().nullable(),
  status: offerStatusSchema,
  offerLetterUrl: z.string().nullable(),
  remarks: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  student: studentProfileSchema.optional(),
  company: companyProfileSchema.optional(),
});

// ─── Notification & Document Schemas ─────────────────────────────────────────

export const notificationItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: notificationTypeSchema,
  title: z.string(),
  message: z.string(),
  isRead: z.boolean(),
  readAt: z.string().nullable(),
  entityType: z.string().nullable(),
  entityId: z.string().nullable(),
  actionUrl: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const documentMetadataSchema = z.object({
  id: z.string(),
  studentId: z.string().nullable(),
  uploadedById: z.string().nullable(),
  type: documentTypeSchema,
  name: z.string(),
  fileUrl: z.string(),
  fileKey: z.string().nullable(),
  mimeType: z.string().nullable(),
  sizeBytes: z.number().int().nullable(),
  isVerified: z.boolean(),
  verifiedAt: z.string().nullable(),
  verifiedById: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ─── API Response Schemas ───────────────────────────────────────────────────

export const meResponseSchema = z.object({
  success: z.literal(true),
  data: safeUserSchema,
});

// ─── Inferred Types ─────────────────────────────────────────────────────────

export type SafeUserInput = z.infer<typeof safeUserSchema>;
export type MeResponse = z.infer<typeof meResponseSchema>;
