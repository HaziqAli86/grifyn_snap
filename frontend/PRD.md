---
title: Product Requirements Document
app: cozy-mantis-slide
created: 2025-12-21T18:26:35.770Z
version: 1
source: Deep Mode PRD Generation
---

# PRODUCT REQUIREMENTS DOCUMENT

**EXECUTIVE SUMMARY**

*   **Product Vision:** Grifyn aims to be the modern piggy bank for modern parenting households, providing a unified celebration registry that simplifies gift-giving for children, reduces clutter, and fosters intentionality.
*   **Core Purpose:** To solve the stress and friction parents experience around children's gift-giving events by offering a socially acceptable way to guide friends and family toward meaningful gifts (cash funds, 529 contributions, curated physical items) without handling payments directly on the platform. It also provides clarity and confidence for gift-givers.
*   **Target Users:**
    *   **Parents:** Dual-working, co-parents, single parents who value minimalism, intentionality, experiences, and education.
    *   **Gift-Givers:** Grandparents, aunts/uncles, close friends, classmate parents seeking clarity and confidence in their gift choices.
*   **Key Features:**
    *   Parent can create and manage a Child Profile (User-Generated Content).
    *   Parent can add and manage various Gift types (Cash Fund, 529 Plan Link, Physical Gift) (User-Generated Content).
    *   Gift-givers can view a public registry and make Pledges/Claims for gifts (User-Generated Content).
    *   Parent can view a real-time Activity Feed of pledges and claims (Communication/System).
*   **Complexity Assessment:** Simple
    *   **State Management:** Local (each parent manages their own registries, no complex distributed state across multiple users collaborating on the same registry).
    *   **External Integrations:** 2 (External payment links, best-effort URL scraping). These are simple HTTP calls, not complex integrations.
    *   **Business Logic:** Simple (creating profiles, adding gifts, making pledges, viewing feeds, marking pledges as fulfilled/received). No complex financial calculations or multi-party workflows *within* the platform.
    *   **Data Synchronization:** Basic (polling for activity feed updates). Not real-time websockets.
*   **MVP Success Metrics:**
    *   Parents can complete registry creation in under 3 minutes.
    *   Gift-givers can complete a pledge in under 15 seconds.
    *   Parents see pledge updates in their activity feed immediately (via polling).
    *   The core workflow (Parent creates registry -> Gift-giver pledges -> Parent views pledge) functions end-to-end without errors.

**1. USERS & PERSONAS**

*   **Primary Persona: Parent / Modern Parenting Household**
    *   **Name:** Sarah Chen
    *   **Context:** Sarah is a dual-working parent with two young children. She values experiences and education over excessive material possessions. She often feels overwhelmed by the sheer volume of toys her children receive during birthdays and holidays, and finds it awkward to communicate gift preferences to well-meaning friends and family.
    *   **Goals:** To easily guide friends and family towards meaningful gifts (cash, 529 contributions, specific items) for her children, reduce clutter in her home, and minimize the mental load associated with gift coordination.
    *   **Needs:** A simple, socially acceptable platform to create and share gift registries, track contributions, and avoid awkward conversations.
*   **Secondary Persona: Gift Giver**
    *   **Name:** Aunt Carol
    *   **Context:** Carol is Sarah's aunt and loves to spoil her nieces and nephews. However, she often struggles with what to buy, fearing she'll either duplicate a gift or purchase something the children don't need or already have. She wants to give something truly meaningful.
    *   **Goals:** To confidently choose a gift that is genuinely desired and appreciated by the child and their parents, feel included in the child's celebrations, and avoid wasting time or money on unwanted items.
    *   **Needs:** Clear, easy-to-access gift suggestions and a straightforward way to indicate her intention to contribute or purchase a gift.

**2. FUNCTIONAL REQUIREMENTS**

*   **2.1 User-Requested Features (All are Priority 0)**

    *   **FR-001: Parent Account Management**
        *   **Description:** Parents can register for a Grifyn account, log in, manage their profile information, and delete their account.
        *   **Entity Type:** Configuration/System
        *   **User Benefit:** Provides secure access to their registries and personalizes their experience.
        *   **Primary User:** Parent
        *   **Lifecycle Operations:**
            *   **Create:** Register new account with email/password.
            *   **View:** View profile information (e.g., email).
            *   **Edit:** Update profile information (e.g., password).
            *   **Delete:** Account deletion option (with confirmation).
            *   **Additional:** Password reset, session management.
        *   **Acceptance Criteria:**
            *   - [ ] Given valid credentials, when a parent logs in, then access is granted to their dashboard.
            *   - [ ] Given invalid credentials, when a parent attempts login, then access is denied with a clear error message.
            *   - [ ] Parents can register a new account successfully.
            *   - [ ] Parents can reset forgotten passwords via email.
            *   - [ ] Parents can update their account password.
            *   - [ ] Parents can initiate account deletion, which requires confirmation.

    *   **FR-002: Child Profile Management**
        *   **Description:** Parents can create, view, edit, and delete profiles for each child, including their name, birthday or age, an optional photo, and interests (as tags/chips).
        *   **Entity Type:** User-Generated Content
        *   **User Benefit:** Organizes registries by child and provides context for gift-givers.
        *   **Primary User:** Parent
        *   **Lifecycle Operations:**
            *   **Create:** Parent provides child's name, birthday/age, optional photo, and interests.
            *   **View:** Parent can see a list of their children and view individual child profiles.
            *   **Edit:** Parent can modify any details of an existing child profile.
            *   **Delete:** Parent can remove a child profile (with confirmation, which also removes associated gifts and pledges).
            *   **List/Search:** Parent can view a list of all their children.
        *   **Acceptance Criteria:**
            *   - [ ] Given required information, when a parent creates a child profile, then the profile is saved and displayed.
            *   - [ ] Given an existing child profile, when a parent views it, then all details (name, age, photo, interests) are displayed.
            *   - [ ] Given an existing child profile, when a parent edits its details, then changes are saved and reflected.
            *   - [ ] Given an existing child profile, when a parent deletes it, then the profile and all associated gifts/pledges are removed after confirmation.
            *   - [ ] Parents can upload an image for the child's photo.
            *   - [ ] Parents can add multiple interests as tags/chips to a child's profile.

    *   **FR-003: Gift Management (Cash Fund, 529 Plan, Physical Gift)**
        *   **Description:** Parents can add, view, edit, delete, and reorder different types of gifts for a child's registry.
            *   **Cash Fund:** Requires Fund Name, optional Target Amount, "Why this matters" description, and an External Payment Link (parent-provided).
            *   **529 Plan Link:** Requires Plan Name, 529 Contribution URL, and "Why this matters" description.
            *   **Physical Gift:** Requires Product URL (which triggers an auto-scrape for title, price, image), "Why this matters" description, and Quantity.
        *   **Entity Type:** User-Generated Content
        *   **User Benefit:** Allows parents to curate a diverse and meaningful gift list.
        *   **Primary User:** Parent
        *   **Lifecycle Operations:**
            *   **Create:** Parent selects gift type and provides required details. For physical gifts, the system attempts to scrape product details from the provided URL.
            *   **View:** Parent can see a list of all gifts for a child, including their details and current status (pledged amount, claimed count).
            *   **Edit:** Parent can modify details of an existing gift (e.g., fund name, target amount, URL, description, quantity).
            *   **Delete:** Parent can remove a gift from the registry (with confirmation, which also removes associated pledges).
            *   **List/Search:** Parent can view all gifts associated with a child.
            *   **Additional:** Parent can reorder gifts within a child's registry.
        *   **Acceptance Criteria:**
            *   - [ ] Given valid input, when a parent adds a Cash Fund, then it is created with the specified details.
            *   - [ ] Given valid input, when a parent adds a 529 Plan Link, then it is created with the specified details.
            *   - [ ] Given a valid product URL, when a parent adds a Physical Gift, then the system attempts to auto-scrape title, price, and image.
            *   - [ ] Parents can view all gifts for a child, displaying relevant details for each type.
            *   - [ ] Parents can edit the details of any existing gift.
            *   - [ ] Parents can delete any existing gift after confirmation.
            *   - [ ] Parents can drag-and-drop or use controls to reorder gifts in the list.

    *   **FR-004: Public Registry View & Share**
        *   **Description:** Parents can generate a unique, public shareable URL for a child's registry. Gift-givers can access this URL to view the child's information and a list of gifts.
        *   **Entity Type:** Communication/System
        *   **User Benefit:** Enables easy sharing of the registry with friends and family.
        *   **Primary User:** Parent, Gift-Giver
        *   **Lifecycle Operations:**
            *   **Create:** System generates a unique URL when a child's registry is created.
            *   **View:** Gift-givers can view the registry page.
            *   **Additional:** Parent can copy the share URL.
        *   **Acceptance Criteria:**
            *   - [ ] When a child's registry is created, a unique, public shareable URL is generated.
            *   - [ ] Parents can easily copy the shareable URL.
            *   - [ ] When a gift-giver visits the shareable URL, they see the child's profile information and the list of gifts.
            *   - [ ] The public registry displays gift cards with appropriate CTAs for each gift type.

    *   **FR-005: Gift-Giver Pledge/Claim**
        *   **Description:** Gift-givers can interact with the public registry to pledge a contribution to a cash fund or 529 plan, or claim a physical gift. This involves a modal where they provide their name, an optional note, and an optional amount (for funds only).
        *   **Entity Type:** User-Generated Content
        *   **User Benefit:** Provides a clear and easy way for gift-givers to indicate their intentions.
        *   **Primary User:** Gift-Giver
        *   **Lifecycle Operations:**
            *   **Create:** Gift-giver clicks a CTA, fills out the pledge modal, and submits.
            *   **View:** (Parent views pledges in activity feed - FR-006)
        *   **Acceptance Criteria:**
            *   - [ ] When a gift-giver clicks "Contribute" for a Cash Fund, a modal appears requesting giver name, optional note, and optional amount.
            *   - [ ] When a gift-giver clicks "Contribute" for a 529 Plan, a modal appears requesting giver name and optional note, and then redirects to the external URL.
            *   - [ ] When a gift-giver clicks "I'll buy this" for a Physical Gift, a modal appears requesting giver name and optional note.
            *   - [ ] Upon successful submission of the pledge modal, the gift-giver receives a confirmation message.
            *   - [ ] For Cash Funds, the "Contribute" CTA should link to the external payment URL provided by the parent.
            *   - [ ] For 529 Plans, the "Contribute" CTA should link to the external contribution URL provided by the parent.

    *   **FR-006: Parent Activity Feed & Gift Tracking**
        *   **Description:** Parents have a real-time (polling-based) activity feed showing new pledges, gift claims, notes, and timestamps. This feed also provides an overview of who gave what, progress on fund goals, and claimed/unclaimed items. Parents can mark physical gifts as "received" and cash fund pledges as "fulfilled" after external payment.
        *   **Entity Type:** Communication/System
        *   **User Benefit:** Provides parents with an "A-ha moment" and reduces mental load by centralizing gift tracking.
        *   **Primary User:** Parent
        *   **Lifecycle Operations:**
            *   **View:** Parent can see a chronological list of all pledges and claims for a child's registry.
            *   **Edit (Status):** Parent can mark a claimed physical gift as "received" or a cash fund pledge as "fulfilled."
        *   **Acceptance Criteria:**
            *   - [ ] When a gift-giver makes a pledge/claim, the parent's activity feed updates to show the new entry within seconds (via polling).
            *   - [ ] The activity feed displays the giver's name, gift type, amount (if applicable), note, and timestamp.
            *   - [ ] The activity feed shows progress updates for fund goals (e.g., "X% of target amount pledged").
            *   - [ ] Parents can see which physical gifts have been claimed and how many remain.
            *   - [ ] Parents can mark a claimed physical gift as "received."
            *   - [ ] Parents can mark a cash fund pledge as "fulfilled."

*   **2.2 Essential Market Features**

    *   **FR-XXX: User Authentication**
        *   **Description:** Secure user login and session management.
        *   **Entity Type:** Configuration/System
        *   **User Benefit:** Protects user data and personalizes experience.
        *   **Primary User:** All personas
        *   **Lifecycle Operations:**
            *   **Create:** Register new account.
            *   **View:** View profile information.
            *   **Edit:** Update profile and preferences.
            *   **Delete:** Account deletion option (with data export).
            *   **Additional:** Password reset, session management.
        *   **Acceptance Criteria:**
            *   - [ ] Given valid credentials, when user logs in, then access is granted.
            *   - [ ] Given invalid credentials, when user attempts login, then access is denied with clear error.
            *   - [ ] Users can reset forgotten passwords.
            *   - [ ] Users can update their profile information.
            *   - [ ] Users can delete their account (with confirmation and data export option).

**3. USER WORKFLOWS**

*   **3.1 Primary Workflow: Parent Creates Registry & Gift-Giver Pledges**
    *   **Trigger:** Parent lands on Grifyn website.
    *   **Outcome:** Parent has a shareable registry, and a gift-giver successfully pledges a gift.
    *   **Steps:**
        1.  Parent lands on Grifyn.
        2.  Parent clicks "Create Registry" or starts filling out the "Instant Builder" form.
        3.  Parent provides Child's Name, Birthday/Age, optional Photo, and Interests.
        4.  Parent selects a gift type (Cash Fund, 529, Physical Gift).
        5.  Parent fills in details for the chosen gift type (e.g., Fund Name, Target Amount, External Link).
        6.  Parent clicks "Create Registry."
        7.  System displays the live registry page with child info, the created gift card, and a copyable share URL.
        8.  Parent copies the share URL.
        9.  Parent shares the URL with a Gift-Giver.
        10. Gift-Giver visits the URL, sees the child's registry.
        11. Gift-Giver clicks a CTA (e.g., "Contribute" for Cash Fund).
        12. Gift-Giver fills out the pledge modal (name, optional note, optional amount).
        13. Gift-Giver submits the pledge.
        14. System records the pledge and updates the parent's activity feed.
        15. Parent views the new pledge in their activity feed.
    *   **Alternative Paths:**
        *   If parent is already logged in, they skip registration/login.
        *   If gift-giver provides invalid input in pledge modal, system shows error.

*   **3.2 Entity Management Workflows**

    *   **Child Management Workflow**
        *   **Create Child:**
            1.  Parent navigates to "My Children" or starts new registry.
            2.  Parent clicks "Add New Child."
            3.  Parent fills in child's name, birthday/age, uploads photo (optional), adds interests.
            4.  Parent saves child profile.
            5.  System confirms creation and displays the child in the list.
        *   **Edit Child:**
            1.  Parent locates existing child profile.
            2.  Parent clicks "Edit" option for the child.
            3.  Parent modifies name, birthday/age, photo, or interests.
            4.  Parent saves changes.
            5.  System confirms update.
        *   **Delete Child:**
            1.  Parent locates child profile to delete.
            2.  Parent clicks "Delete" option.
            3.  System asks for confirmation, warning about associated gifts/pledges.
            4.  Parent confirms deletion.
            5.  System removes child profile and associated data, then confirms.

    *   **Gift Management Workflow**
        *   **Create Gift:**
            1.  Parent navigates to a child's registry page.
            2.  Parent clicks "Add New Gift."
            3.  Parent selects gift type (Cash Fund, 529, Physical).
            4.  Parent fills in required information for the chosen gift type.
            5.  Parent saves gift.
            6.  System confirms creation and adds the gift to the child's registry list.
        *   **Edit Gift:**
            1.  Parent locates existing gift on a child's registry.
            2.  Parent clicks "Edit" option for the gift.
            3.  Parent modifies information (e.g., target amount, URL, description).
            4.  Parent saves changes.
            5.  System confirms update.
        *   **Delete Gift:**
            1.  Parent locates gift to delete.
            2.  Parent clicks "Delete" option.
            3.  System asks for confirmation, warning about associated pledges.
            4.  Parent confirms deletion.
            5.  System removes gift and associated pledges, then confirms.
        *   **Reorder Gifts:**
            1.  Parent navigates to a child's registry page.
            2.  Parent uses drag-and-drop or reorder controls.
            3.  System updates the display order of gifts.

*   **3.5 CONVERSATION SIMULATIONS (Not applicable for Grifyn MVP as it does not feature AI chat interfaces.)**

**4. BUSINESS RULES**

*   **Entity Lifecycle Rules:**
    *   **User (Parent):**
        *   **Who can create:** Any individual via registration.
        *   **Who can view:** Only the registered user.
        *   **Who can edit:** Only the registered user.
        *   **Who can delete:** Only the registered user.
        *   **What happens on deletion:** Hard delete of user account and all associated Child, Gift, and Pledge data.
    *   **Child:**
        *   **Who can create:** Only the parent who owns the account.
        *   **Who can view:** Only the parent (in dashboard), or anyone with the public share URL (public registry view).
        *   **Who can edit:** Only the parent who created it.
        *   **Who can delete:** Only the parent who created it.
        *   **What happens on deletion:** Hard delete of the child profile and all associated Gifts and Pledges.
    *   **Gift:**
        *   **Who can create:** Only the parent who owns the child profile.
        *   **Who can view:** Only the parent (in dashboard), or anyone with the public share URL (public registry view).
        *   **Who can edit:** Only the parent who created it.
        *   **Who can delete:** Only the parent who created it.
        *   **What happens on deletion:** Hard delete of the gift and all associated Pledges for that gift.
    *   **Pledge:**
        *   **Who can create:** Any gift-giver via the public registry link.
        *   **Who can view:** Only the parent (in their activity feed). Gift-givers do not have an identity or a way to view their past pledges.
        *   **Who can edit:** Not allowed by gift-giver. Parent can update status (mark as "received" or "fulfilled").
        *   **Who can delete:** Not allowed by gift-giver. Not allowed by parent for MVP (deferred for V2 to avoid complexity with external payments).
        *   **What happens on deletion:** (N/A for MVP, as deletion is not allowed).
*   **Access Control:**
    *   Parents can only access and manage their own child profiles and gifts.
    *   Public registry links grant read-only access to child and gift details, and the ability to create pledges.
    *   Gift-givers have no authenticated access or identity within the platform.
*   **Data Rules:**
    *   Child Name: Required, max 100 characters.
    *   Birthday/Age: Required.
    *   Gift Title/Name: Required, max 200 characters.
    *   "Why this matters": Optional, max 500 characters.
    *   External Payment/Contribution URL: Required for Cash Fund and 529 Plan, must be a valid URL.
    *   Product URL: Required for Physical Gift, must be a valid URL.
    *   Target Amount (Cash Fund): Optional, positive number.
    *   Quantity (Physical Gift): Required, positive integer.
    *   Giver Name (Pledge): Required, max 100 characters.
    *   Pledge Amount (Cash Fund Pledge): Optional, positive number.
    *   Pledge Note: Optional, max 250 characters.
    *   Interests: Max 10 tags per child, max 50 characters per tag.
*   **Process Rules:**
    *   Physical gift auto-scrape is best-effort; parents can manually edit details if scrape fails or is inaccurate.
    *   Activity feed updates via polling, not real-time websockets, for MVP.
    *   Pledges are recorded immediately upon submission by the gift-giver.
    *   Parents are responsible for verifying external payments for Cash Funds and 529 Plans before marking pledges as "fulfilled."

**5. DATA REQUIREMENTS**

*   **Core Entities:**
    *   **User (Parent)**
        *   **Type:** System/Configuration
        *   **Attributes:** `id` (UUID), `email` (string, unique), `password_hash` (string), `created_at` (timestamp), `last_modified_at` (timestamp)
        *   **Relationships:** Has many Children
        *   **Lifecycle:** Full CRUD with account deletion option
        *   **Retention:** User-initiated deletion with all associated data.
    *   **Child**
        *   **Type:** User-Generated Content
        *   **Attributes:** `id` (UUID), `user_id` (UUID, FK to User), `name` (string), `photo_url` (string, optional), `birthday_or_age` (string/date), `interests` (array of strings), `created_at` (timestamp), `last_modified_at` (timestamp)
        *   **Relationships:** Belongs to User, Has many Gifts
        *   **Lifecycle:** Full CRUD
        *   **Retention:** Deleted when parent deletes child or account.
    *   **Gift**
        *   **Type:** User-Generated Content
        *   **Attributes:** `id` (UUID), `child_id` (UUID, FK to Child), `type` (enum: "fund", "529", "physical"), `title` (string), `description` (string, "why this matters"), `sort_order` (integer), `created_at` (timestamp), `last_modified_at` (timestamp)
        *   **Type-Specific Attributes:**
            *   `fund`: `target_amount` (decimal, optional), `pledged_amount` (decimal, calculated), `external_payment_url` (string)
            *   `529`: `plan_name` (string), `contribution_url` (string)
            *   `physical`: `product_url` (string), `image_url` (string, scraped), `merchant` (string, scraped), `price` (decimal, scraped), `quantity` (integer), `claimed_count` (integer, calculated)
        *   **Relationships:** Belongs to Child, Has many Pledges
        *   **Lifecycle:** Full CRUD
        *   **Retention:** Deleted when parent deletes gift, child, or account.
    *   **Pledge**
        *   **Type:** User-Generated Content
        *   **Attributes:** `id` (UUID), `child_id` (UUID, FK to Child), `gift_id` (UUID, FK to Gift), `giver_name` (string), `amount` (decimal, optional, for funds), `note` (string, optional), `status` (enum: "pending", "fulfilled", "received"), `created_at` (timestamp)
        *   **Relationships:** Belongs to Gift, Belongs to Child
        *   **Lifecycle:** Create (by gift-giver), View (by parent), Update Status (by parent)
        *   **Retention:** Deleted when parent deletes associated gift, child, or account.

**6. INTEGRATION REQUIREMENTS**

*   **External Systems:**
    *   **Email Service:**
        *   **Purpose:** Sending password reset emails, account confirmation.
        *   **Data Exchange:** User email address, password reset token/link.
        *   **Frequency:** On user request (password reset, registration).
    *   **Product URL Scraper (Internal/External Library):**
        *   **Purpose:** To extract product title, image, and price from a provided URL for physical gifts.
        *   **Data Exchange:** Input: Product URL. Output: Title, Image URL, Price.
        *   **Frequency:** When a parent adds a new physical gift.

**7. FUNCTIONAL VIEWS/AREAS**

*   **Primary Views:**
    *   **Landing Page / Instant Builder:** Combines marketing value proposition with a step-by-step wizard for parents to create their first child profile and gift.
    *   **Parent Dashboard:** After login, displays a list of children, quick access to their registries, and an overview of recent activity.
    *   **Child Registry Page (Parent View):** Detailed view of a specific child's profile, list of gifts, and the activity feed. Includes options to add/edit/delete gifts, reorder, and copy share URL.
    *   **Public Registry Page (Gift-Giver View):** Displays child's info and gift cards with CTAs for pledging/claiming.
    *   **Pledge Modal:** Overlay for gift-givers to input their name, note, and amount (for funds).
    *   **Settings Area:** For parent account management (password change, account deletion).
*   **Modal/Overlay Needs:**
    *   Confirmation dialogs for deleting children, gifts, or accounts.
    *   Pledge/Claim modal for gift-givers.
    *   Photo upload modal/component for child profile.
*   **Navigation Structure:**
    *   **Persistent access to:** Logo (Grifyn), "Sign In" (optional), "How it works" (optional).
    *   **Default landing:** For unauthenticated users, the Landing Page/Instant Builder. For authenticated users, the Parent Dashboard.
    *   **Entity management:** From Parent Dashboard, navigate to individual Child Registry Pages. From there, access gift management.

**8. MVP SCOPE & CONSTRAINTS**

*   **MVP Success Definition:**
    *   The core workflow (Parent creates registry -> Gift-giver pledges -> Parent views pledge) can be completed end-to-end by a new user.
    *   All features defined in Section 2.1 are fully functional and reliable.
    *   Basic user authentication and profile management work correctly.
    *   The system handles expected user load for an MVP (e.g., 10-50 concurrent users).
*   **Technical Constraints for MVP:**
    *   **Expected concurrent users:** Up to 50.
    *   **Data volume limits:** Reasonable for an initial launch (e.g., thousands of children/gifts/pledges).
    *   **Performance:** Good enough for a smooth user experience, not highly optimized for extreme scale.
    *   Activity feed updates will use polling, not real-time websockets.
    *   Physical gift scraping is "best-effort" and may not always be perfect; manual editing by parents is the fallback.
*   **Explicitly Excluded from MVP:**
    *   **Payments processed inside platform (DF-001):** Not essential for the core validation flow of coordinating gifts; adds significant complexity (security, compliance, financial integrations).
    *   **Stripe Connect / ACH / Card Payments (DF-002):** Directly related to in-platform payments, deferred for the same reasons.
    *   **Multi-child registry (DF-003):** The MVP supports multiple children, but the concept of a *single* registry spanning multiple children or events is deferred. Each child has their own distinct registry.
    *   **Multi-event registry (DF-004):** Deferred to focus on the primary use case of a single celebration registry per child.
    *   **Notifications (Email/SMS push) (DF-005):** Adds secondary value; polling for activity feed is sufficient for MVP.
    *   **Affiliate integrations (DF-006):** Monetization/enhancement feature, not part of the core value proposition for MVP.
    *   **Identity for gift-givers (DF-007):** Adds significant complexity (user management, privacy, data retention) and is not essential for gift-givers to make a pledge.
    *   **Real-time websockets (DF-008):** Polling is acceptable for MVP to achieve "real-time enough" updates without the complexity of websockets.
    *   **Deep 529 Integration (DF-009):** API-based contribution handling and plan lookup are complex integrations, deferred to focus on the simple external link model.
    *   **Advanced Physical Gift Handling (DF-010):** Better scraping, price tracking, and affiliate integrations are enhancements to the basic scraping functionality.
    *   **Thank You Manager (DF-011):** A valuable post-event feature, but not part of the core "guide gifts and track contributions" flow.

**9. MVP SCOPE & DEFERRED FEATURES**

*   **8.1 MVP Success Definition**
    *   The core workflow (Parent creates registry -> Gift-giver pledges -> Parent views pledge) can be completed end-to-end by a new user.
    *   All features defined in Section 2.1 are fully functional and reliable.
    *   Basic user authentication and profile management work correctly.
    *   The system handles expected user load for an MVP (e.g., 10-50 concurrent users).

*   **8.2 In Scope for MVP**
    *   FR-001: Parent Account Management
    *   FR-002: Child Profile Management
    *   FR-003: Gift Management (Cash Fund, 529 Plan, Physical Gift)
    *   FR-004: Public Registry View & Share
    *   FR-005: Gift-Giver Pledge/Claim
    *   FR-006: Parent Activity Feed & Gift Tracking
    *   FR-XXX: User Authentication (as defined in 2.2)

*   **8.3 Deferred Features (Post-MVP Roadmap)**
    *   **DF-001: Payments processed inside platform**
        *   **Description:** Allowing gift-givers to make payments directly within the Grifyn platform.
        *   **Reason for Deferral:** Not essential for the core validation flow ("without moving money through the platform"); adds significant complexity related to financial regulations, security, and payment gateway integrations.
    *   **DF-002: Stripe Connect / ACH / Card Payments**
        *   **Description:** Specific payment integration methods.
        *   **Reason for Deferral:** Dependent on DF-001; deferred as part of the broader in-platform payment strategy.
    *   **DF-003: Multi-child registry**
        *   **Description:** A single registry that can combine gifts for multiple children.
        *   **Reason for Deferral:** The MVP focuses on individual child registries; multi-child registries add complexity to gift allocation and display.
    *   **DF-004: Multi-event registry**
        *   **Description:** Support for different types of events (e.g., birthday, holiday, graduation) within a single child's profile or across multiple children.
        *   **Reason for Deferral:** Not essential for the core validation flow; adds complexity to organization and filtering.
    *   **DF-005: Notifications (Email/SMS push)**
        *   **Description:** Automated email or SMS notifications for new pledges, gift claims, or other activity.
        *   **Reason for Deferral:** Adds secondary value; the polling-based activity feed is sufficient for MVP.
    *   **DF-006: Affiliate integrations**
        *   **Description:** Integrating with retailers for commission on physical gift purchases.
        *   **Reason for Deferral:** Monetization/enhancement feature, not part of the core value proposition for MVP.
    *   **DF-007: Identity for gift-givers**
        *   **Description:** Allowing gift-givers to create accounts, track their pledges, or edit/delete their pledges.
        *   **Reason for Deferral:** Adds significant complexity (user management, privacy, data retention, pledge immutability) and is not essential for gift-givers to make a pledge.
    *   **DF-008: Real-time websockets**
        *   **Description:** Using websockets for instant, push-based updates to the activity feed.
        *   **Reason for Deferral:** Polling is acceptable for MVP to achieve "real-time enough" updates without the added complexity of websockets.
    *   **DF-009: Deep 529 Integration**
        *   **Description:** API-based contribution handling, plan lookup, and more robust tracking for 529 plans.
        *   **Reason for Deferral:** Complex integration with external financial institutions; MVP relies on simple external links.
    *   **DF-010: Advanced Physical Gift Handling**
        *   **Description:** Improved scraping accuracy, price tracking, and integration with affiliate programs for physical gifts.
        *   **Reason for Deferral:** Enhancements to the basic scraping functionality; "best-effort" scraping is sufficient for MVP.
    *   **DF-011: Thank You Manager**
        *   **Description:** A feature to help parents effortlessly send thank-you notes by auto-compiling who gave what, providing message templates, and export options.
        *   **Reason for Deferral:** A valuable post-event feature, but not part of the core "guide gifts and track contributions" flow for MVP.

**10. ASSUMPTIONS & DECISIONS**

*   **Business Model:** Grifyn MVP operates on a freemium model, with the core registry functionality being free. Monetization (e.g., through integrated payments or affiliate links) is deferred.
*   **Access Model:** Individual parent accounts manage their own children's registries. Public registries are viewable by anyone with the unique URL.
*   **Entity Lifecycle Decisions:**
    *   **User (Parent):** Full CRUD. Account deletion cascades to all associated data (children, gifts, pledges) to ensure data integrity and user privacy.
    *   **Child:** Full CRUD. Deletion cascades to associated gifts and pledges.
    *   **Gift:** Full CRUD. Deletion cascades to associated pledges.
    *   **Pledge:** Create (by gift-giver), View (by parent), Update Status (by parent to "fulfilled" or "received"). No direct edit or delete by gift-giver or parent in MVP to simplify the initial data model and avoid complex scenarios with external payments.
*   **From User's Product Idea:**
    *   **Product:** Grifyn, a unified celebration registry for children.
    *   **Technical Level:** The user provided a detailed data model and explicit out-of-scope items, indicating a good understanding of technical scope.
*   **Key Assumptions Made:**
    *   Parents are responsible for sharing the public registry link with gift-givers.
    *   Parents are responsible for verifying external payments for cash funds and 529 contributions. Grifyn does not confirm these payments.
    *   The "best-effort scrape" for physical gifts is acceptable for MVP, meaning occasional manual correction by parents is expected.
    *   Gift-givers do not require an account or identity to make a pledge. Their name and optional note are sufficient.
    *   The MVP will focus on a single celebration type per child (e.g., a general birthday/holiday registry), not distinct events within a child's profile.
*   **Questions Asked & Answers:** (No clarification questions were needed for this product idea.)

PRD Complete - Ready for development