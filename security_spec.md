# Security Specification: Kairoo CRM Multi-Tenant Cloud Architecture

## 1. Data Invariants
1. **Tenant Isolation**: Every CRM resource (customers, leads, deals, tasks, calls, communications, appointments, tickets, activity logs, subscriptions) MUST contain a non-empty `tenantId`.
2. **Access Control**: A user may only read, create, update, or delete records where `tenantId == request.auth.uid` (or matching their verified tenant).
3. **User Profile Ownership**: A user document at `/users/{userId}` can only be created/updated by the user whose `request.auth.uid == userId`.
4. **Subscription Integrity**: Plans and payment records can only be updated with authorized fields.
5. **No Cross-Tenant Leaks**: Blanket queries without tenant filter are blocked by security rules `resource.data.tenantId == request.auth.uid`.

## 2. The Dirty Dozen Malicious Payloads
1. **Cross-Tenant Hijack**: Attempt to create a customer with another user's `tenantId`.
2. **Ghost Field Injection**: Attempt to inject unallowed administrative fields into customer payload.
3. **Identity Spoofing**: Attempt to overwrite another user's profile at `/users/victim_uid`.
4. **ID Poisoning Attack**: Attempt to create document with 10KB string ID.
5. **Unauthenticated Read**: Attempt to read `/customers` without valid Firebase Auth token.
6. **Plan Escalation**: Attempt to self-assign enterprise plan without payment verification.
7. **Negative Deal Value**: Attempt to create deal with invalid monetary value.
8. **Orphaned Write**: Attempt to create ticket message for a non-existent ticket.
9. **Denial of Wallet Attack**: Attempt to write 2MB string into task notes.
10. **Admin Claim Bypass**: Attempt to read admin settings without administrative privilege.
11. **Immutable Field Modification**: Attempt to change `createdAt` or `tenantId` during update.
12. **Blind List Scraping**: Attempt to list all customers without specifying tenant filter.

## 3. Security Assertions
- All 12 attack vectors are blocked by Firestore ABAC rules.
- Strict payload schema check via `isValid*` functions.
