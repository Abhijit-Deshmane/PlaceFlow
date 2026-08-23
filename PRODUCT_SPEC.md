# PlaceFlow — Product Specification

> Single source of truth for PlaceFlow product requirements, users, permissions,
> domain concepts, business rules, workflows, and V1 feature scope.

---

# 1. Product Overview

PlaceFlow is a Training and Placement Management System for colleges.

The platform centralizes the complete college placement lifecycle:

Student
→ Profile
→ Eligibility
→ Placement Drive
→ Application
→ Shortlisting
→ Interviews
→ Selection
→ Offer
→ Placement

The goal is to replace fragmented spreadsheets, forms, messaging,
and manual placement workflows with a single reliable system.

---

# 2. V1 Deployment Scope

PlaceFlow V1 is designed for ONE college.

Multi-college / multi-tenant functionality is NOT part of V1.

The architecture should remain clean enough to support multiple colleges
in a future version, but no multi-tenancy infrastructure should be
introduced unless explicitly required.

Do NOT introduce:

- organization switching
- tenant middleware
- tenant-aware caching
- cross-tenant authorization
- multi-tenant database architecture

for V1.

---

# 3. Product Goals

PlaceFlow V1 must:

1. Provide students with a single place to manage placement activities.
2. Allow placement officers to manage the entire recruitment lifecycle.
3. Allow companies/recruiters to participate in authorized placement drives.
4. Allow college administrators to manage users and college data.
5. Automatically determine student eligibility.
6. Prevent invalid or duplicate applications.
7. Provide a clear recruitment pipeline.
8. Provide useful placement analytics.
9. Maintain an audit trail for important administrative actions.
10. Provide a foundation for future mobile and web experiences.

---

# 4. User Types

PlaceFlow has five application roles:

- SUPER_ADMIN
- COLLEGE_ADMIN
- PLACEMENT_OFFICER
- RECRUITER
- STUDENT

Authentication is handled by Clerk.

Application roles and permissions are controlled by PlaceFlow.

The client must never be trusted to determine its own role.

---

# 5. Role Definitions

## 5.1 SUPER_ADMIN

### Purpose

System-level administrator.

### Responsibilities

- Manage system configuration
- Manage administrators
- Manage system users
- View system health
- View audit logs
- Perform privileged administrative operations

### Access

Can perform all administrative operations unless a feature
explicitly restricts the operation.

SUPER_ADMIN should be used sparingly.

---

# 5.2 COLLEGE_ADMIN

### Purpose

Manage the college's PlaceFlow environment.

### Responsibilities

- Manage users
- Manage students
- Manage placement officers
- Manage college configuration
- Monitor placement operations
- View placement analytics

### Can

- Create users
- Disable users
- Reactivate users
- Import students
- Update administrative student data
- Manage companies
- View placement drives
- View applications
- View analytics

### Cannot

- Create another SUPER_ADMIN
- Modify Clerk authentication configuration

---

# 5.3 PLACEMENT_OFFICER

### Purpose

Primary operational user of PlaceFlow.

### Responsibilities

- Manage students for placement purposes
- Manage companies
- Create placement drives
- Define eligibility
- Manage applications
- Shortlist candidates
- Schedule interviews
- Record recruitment outcomes
- Manage offers
- View placement analytics

This is the primary role responsible for running the
college placement process.

---

# 5.4 RECRUITER

### Purpose

Company representative participating in recruitment.

### Responsibilities

- Manage company information
- Participate in authorized placement drives
- View authorized candidates
- Review candidates
- Shortlist candidates
- Participate in interview/recruitment stages
- Provide recruitment outcomes

A recruiter must only access data associated with their company
and authorized placement drives.

---

# 5.5 STUDENT

### Purpose

Student participating in placement activities.

### Responsibilities

- Maintain permitted profile information
- View placement opportunities
- Check eligibility
- Apply to placement drives
- Track applications
- View interviews
- View offers
- Receive notifications

A student can only access their own private placement data.

---

# 6. Permission Model

Authorization is enforced by the backend.

Frontend restrictions are NOT security boundaries.

| Permission | Super Admin | College Admin | Placement Officer | Recruiter | Student |
|---|---:|---:|---:|---:|---:|
| Manage system | Yes | No | No | No | No |
| Manage users | Yes | Yes | Limited | No | No |
| Manage students | Yes | Yes | Placement data | No | Own data |
| Import students | Yes | Yes | Optional | No | No |
| Manage companies | Yes | Yes | Yes | Own company | No |
| Create drives | Yes | Yes | Yes | No* | No |
| Publish drives | Yes | Yes | Yes | No | No |
| Configure eligibility | Yes | Yes | Yes | No | No |
| View eligible students | Yes | Yes | Yes | Authorized drives | No |
| Apply to drive | No | No | No | No | Yes |
| Manage applications | Yes | Yes | Yes | Authorized drives | Own |
| Shortlist candidates | Yes | Yes | Yes | Authorized drives | No |
| Schedule interviews | Yes | Yes | Yes | Authorized drives | No |
| Record interview results | Yes | Yes | Yes | Authorized drives | No |
| Manage offers | Yes | Yes | Yes | Authorized drives | No |
| View analytics | Yes | Yes | Yes | Limited | Personal |
| Manage college settings | Yes | Yes | Limited | No | No |
| View audit logs | Yes | Yes | Limited | No | No |

\* Recruiter drive creation may be introduced later. In V1,
placement officers control placement drives.

---

# 7. Core Domain Concepts

PlaceFlow revolves around these concepts.

## User

Represents an authenticated application user.

Authentication identity comes from Clerk.

PlaceFlow stores:

- clerkUserId
- email
- role
- status
- timestamps

---

## Student

Represents a college student.

Typical information:

- Name
- Enrollment number
- Branch
- Graduation year
- CGPA
- Percentage
- Backlogs
- Skills
- Projects
- Certifications
- Resume
- Documents

Academic information is authoritative college data.

Students should not freely modify authoritative academic records.

---

## Company

Represents a company participating in placements.

Information may include:

- Company name
- Website
- Industry
- Description
- Contact information
- Recruiters
- Recruitment history

---

## Placement Drive

Represents a specific recruitment opportunity from a company.

A drive contains:

- Company
- Job title
- Job description
- Compensation
- Location
- Eligibility criteria
- Application deadline
- Drive date
- Selection process
- Number of positions
- Status

---

## Eligibility Criteria

Defines which students can apply to a placement drive.

V1 supports:

- Minimum CGPA
- Maximum backlogs
- Allowed branches
- Graduation year
- Minimum percentage

Eligibility is calculated by the backend.

---

## Application

Represents a student's participation in a placement drive.

An application belongs to:

- One student
- One placement drive

A student must not be able to create duplicate applications.

Database constraints must enforce this invariant.

---

## Interview

Represents an interview/recruitment stage.

Contains:

- Candidate
- Placement drive
- Round
- Date/time
- Location or meeting link
- Status
- Feedback/result

---

## Offer

Represents an employment offer received through a placement drive.

Contains:

- Student
- Company
- Placement drive
- Role
- CTC
- Location
- Offer date
- Status

---

## Notification

Represents a message/event that requires user attention.

Examples:

- New placement drive
- Application status change
- Shortlisting
- Interview scheduled
- Offer received
- Placement announcement

---

## Audit Log

Records important administrative/system actions.

Examples:

- User role changed
- Student imported
- Drive published
- Eligibility changed
- Candidate shortlisted
- Offer created

---

# 8. Placement Drive Lifecycle

A placement drive follows:

DRAFT
→ PUBLISHED
→ CLOSED
→ COMPLETED

A drive may also become:

CANCELLED

---

## DRAFT

Drive is being prepared.

Students cannot apply.

---

## PUBLISHED

Drive is visible to eligible students.

Students can apply until the application deadline.

---

## CLOSED

Applications are no longer accepted.

Recruitment activities may continue.

---

## COMPLETED

The recruitment process has finished.

Final outcomes should be recorded.

---

## CANCELLED

Drive has been cancelled.

Applications should no longer be accepted.

---

# 9. Application Lifecycle

The initial application lifecycle is:

APPLIED
→ UNDER_REVIEW
→ SHORTLISTED
→ INTERVIEW
→ SELECTED
→ OFFERED

Possible terminal states:

- REJECTED
- WITHDRAWN

The backend must enforce valid state transitions.

Clients cannot arbitrarily change application status.

---

# 10. Student Workflow

Typical student journey:

1. Sign in with Clerk.
2. Complete profile.
3. Verify academic information.
4. Upload resume.
5. Add skills/projects/certifications.
6. View available placement drives.
7. View eligibility.
8. Open a placement drive.
9. Apply if eligible.
10. Track application.
11. Receive shortlist notification.
12. View interview details.
13. Attend recruitment process.
14. View selection/offer.
15. View placement history.

---

# 11. Placement Officer Workflow

Typical placement workflow:

1. Sign in.
2. View placement dashboard.
3. Manage students.
4. Manage companies.
5. Create placement drive.
6. Configure eligibility.
7. Publish drive.
8. Monitor applications.
9. Review candidates.
10. Shortlist candidates.
11. Schedule interviews.
12. Record outcomes.
13. Create/update offers.
14. Complete drive.
15. Review analytics.

---

# 12. Recruiter Workflow

Typical recruiter workflow:

1. Sign in.
2. View company profile.
3. View authorized placement drives.
4. View eligible/applying candidates.
5. Review candidate information.
6. Shortlist candidates.
7. Participate in recruitment stages.
8. Provide interview/recruitment outcomes.
9. View final recruitment results.

Recruiters must never access unrelated college data.

---

# 13. College Admin Workflow

Typical workflow:

1. Sign in.
2. View college dashboard.
3. Manage users.
4. Import/manage students.
5. Manage placement officers.
6. Manage companies.
7. Monitor placement drives.
8. View placement analytics.
9. Review audit activity.

---

# 14. Student Profile Features

V1 profile sections:

### Personal

- Name
- Email
- Phone
- Profile photo where supported

### Academic

- Enrollment number
- Branch
- Graduation year
- CGPA
- Percentage
- Backlogs

### Professional

- Skills
- Projects
- Certifications
- Resume
- Portfolio links
- GitHub
- LinkedIn

Students may edit permitted professional information.

College-controlled academic information should be managed by authorized staff.

---

# 15. Placement Drive Features

Placement officers can configure:

### Basic information

- Company
- Role
- Description
- Location
- Employment type

### Compensation

- CTC
- Salary details where applicable

### Eligibility

- Branch
- CGPA
- Percentage
- Backlogs
- Graduation year

### Recruitment

- Application deadline
- Drive date
- Selection rounds
- Number of positions

---

# 16. Application Features

V1 must support:

- Apply
- Prevent duplicate applications
- Eligibility validation
- Application status
- Application history
- Withdrawal where permitted
- Officer review
- Shortlisting
- Rejection

The backend must validate eligibility at application time.

---

# 17. Interview Features

V1:

- Create interview round
- Schedule candidate
- Set date/time
- Set location/link
- Update interview status
- Record result
- Record feedback

---

# 18. Offer Features

V1:

- Create offer
- Update offer
- View offer
- Track offer status
- View student placement history
- View company placement history

---

# 19. Notification Features

V1 starts with in-app notifications.

Important notifications:

- New drive published
- Application submitted
- Application status changed
- Student shortlisted
- Interview scheduled
- Interview rescheduled
- Selected
- Offer created
- Important placement announcement

Email and push notifications are future extensions.

---

# 20. Dashboard Features

## Student Dashboard

Show:

- Profile completion
- Eligible drives
- Active applications
- Upcoming interviews
- Recent notifications
- Offers
- Placement status

---

## Placement Officer Dashboard

Show:

- Total students
- Active drives
- Applications
- Shortlisted students
- Interviews
- Offers
- Students placed
- Placement percentage
- Company statistics

---

## College Admin Dashboard

Show:

- Total students
- Total companies
- Active drives
- Applications
- Students placed
- Placement percentage
- Package statistics

---

## Recruiter Dashboard

Show:

- Assigned drives
- Eligible candidates
- Applications
- Shortlisted candidates
- Interviews
- Selected candidates

---

# 21. Placement Analytics

V1 should provide basic analytics.

Examples:

- Total students
- Eligible students
- Students placed
- Placement percentage
- Total companies
- Total drives
- Applications
- Shortlisted candidates
- Offers
- Average package
- Highest package
- Company-wise placement statistics
- Branch-wise placement statistics

Analytics must be calculated from authoritative database data.

---

# 22. Documents

V1 may support:

- Resume
- Certificates
- Offer letters
- Other placement documents

Large files should be stored in object storage.

PostgreSQL stores document metadata and references.

---

# 23. Search and Filtering

Large collections must support server-side:

- Search
- Filtering
- Sorting
- Pagination

Examples:

Students:

- Branch
- Graduation year
- CGPA
- Placement status

Companies:

- Industry
- Name

Placement drives:

- Company
- Status
- Branch
- Graduation year

Applications:

- Drive
- Status
- Branch

---

# 24. Pagination

Collection endpoints must be paginated.

Example:

GET /api/v1/students?page=1&limit=25

The API must enforce a maximum page size.

Do not return thousands of records in a single request.

---

# 25. Security Rules

The backend is the security boundary.

Never trust:

- Client-provided roles
- Client-provided user IDs
- Client-provided ownership
- Client-provided application status
- Client-provided eligibility status

The backend must derive identity from Clerk authentication.

The backend must enforce authorization.

The backend must validate all external input.

---

# 26. Business Invariants

The following must always be true.

### Applications

A student cannot apply twice to the same placement drive.

### Eligibility

An ineligible student cannot submit an application.

### Closed drives

Students cannot apply after the application deadline or
after the drive stops accepting applications.

### Authorization

A student cannot access another student's private data.

### Recruiters

A recruiter cannot access another company's recruitment data.

### Application status

Clients cannot arbitrarily transition application states.

### Offers

Offers must be associated with valid students and placement drives.

### Interviews

Interview records must belong to authorized recruitment processes.

Important invariants must be enforced both in application logic
and, where appropriate, with database constraints.

---

# 27. V1 Feature Priority

## P0 — Required

These features define the minimum viable production system.

- Clerk authentication
- Role-based authorization
- User management
- Student management
- Student profile
- Company management
- Placement drives
- Eligibility engine
- Applications
- Shortlisting
- Interview scheduling
- Offers
- Basic notifications
- Basic dashboards
- Basic analytics
- Audit logging
- Document/resume management

---

## P1 — Important

Can be implemented after the core P0 workflow is stable.

- Bulk student import
- Advanced filtering
- Advanced analytics
- Email notifications
- Push notifications
- Export reports
- Company recruitment history
- Advanced interview management

---

## P2 — Future

Do not implement in V1 unless explicitly requested.

- AI resume analysis
- AI candidate recommendations
- Automated candidate ranking
- Multi-college support
- Advanced workflow automation
- Microservices
- Event-driven architecture
- Kafka/RabbitMQ
- Advanced recommendation systems

---

# 28. Explicit Non-Goals

The following are NOT part of PlaceFlow V1:

- Payroll
- Employee management after hiring
- Full HR management
- Attendance management
- College ERP
- Learning management
- Payment processing
- Generic job marketplace
- Social networking
- AI recruitment automation
- Multi-tenant SaaS infrastructure

---

# 29. Feature Development Rule

When implementing a feature, the agent must first determine:

1. Which user uses the feature?
2. What problem does it solve?
3. What data does it require?
4. Which role can perform the action?
5. What permissions are required?
6. What business rules apply?
7. What state transitions are possible?
8. What API endpoints are required?
9. What database changes are required?
10. What web/mobile UI is required?
11. What notifications are required?
12. What tests are required?

Do not implement features based solely on UI requirements.

---

# 30. Source of Truth Hierarchy

When requirements conflict, use this priority:

1. Explicit product requirements from the project owner
2. This PRODUCT_SPEC.md
3. Root AGENTS.md
4. Application-specific AGENTS.md
5. Existing implementation

Existing code must NOT automatically override documented requirements.

If the implementation conflicts with this specification, identify
the conflict before making a destructive change.

---

# 31. Change Management

When a feature changes product behavior:

1. Update PRODUCT_SPEC.md.
2. Update relevant architecture documentation.
3. Update shared types/validators.
4. Implement backend changes.
5. Implement web/mobile changes.
6. Add/update tests.

The product specification must remain synchronized with the implementation.

---

# 32. Definition of Done

A feature is complete only when:

- Product behavior is documented.
- Permissions are defined.
- Backend API exists.
- Validation exists.
- Authorization exists.
- Database changes are implemented.
- Business rules are enforced.
- Web UI is implemented where required.
- Mobile UI is implemented where required.
- Loading states exist.
- Empty states exist.
- Error states exist.
- Relevant notifications exist.
- Tests exist.
- Type checking passes.
- Lint passes.
- Build passes.

---

# 33. Product Principle

PlaceFlow should always prioritize:

1. Correctness
2. Security
3. Simplicity
4. User experience
5. Maintainability
6. Scalability

Do not introduce complexity merely because the system
might need it someday.

Build the simplest architecture capable of reliably supporting
the current product requirements.

---

# 34. Current V1 Product Definition

The core PlaceFlow V1 experience is:

Student
→ maintains profile
→ discovers eligible placement drives
→ applies
→ tracks application
→ attends interviews
→ receives offer

Placement Officer
→ manages students
→ manages companies
→ creates drives
→ defines eligibility
→ reviews applications
→ shortlists
→ schedules interviews
→ records results
→ manages offers
→ tracks placement statistics

Recruiter
→ participates in authorized drives
→ reviews candidates
→ shortlists candidates
→ participates in recruitment
→ provides outcomes

College Admin
→ manages users
→ manages college data
→ monitors placement operations
→ views analytics

Super Admin
→ manages system-level administration

This lifecycle represents the core product that all V1 implementation
decisions should support.