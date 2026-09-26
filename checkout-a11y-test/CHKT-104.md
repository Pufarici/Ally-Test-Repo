# CHKT-104 — Checkout Form: End-to-End Purchase Flow

**Project:** ShopCo Web  
**Issue Type:** Story  
**Priority:** High  
**Reporter:** Sarah Okonkwo  
**Assignee:** Dev Team  
**Sprint:** Sprint 22  
**Labels:** checkout, frontend, UX  
**Status:** In Progress

---

## Summary

Implement the single-page checkout experience for ShopCo, allowing authenticated and guest users to review their cart, enter a shipping address, select a payment method, and place an order.

---

## Background

The current checkout flow redirects users to a legacy multi-step page (3 steps) with high drop-off rates (42% at the address step). Design has produced a new single-page layout that consolidates all steps. This ticket covers the full frontend implementation against the new Figma spec (link: [Figma — Checkout v3](https://figma.com/placeholder)).

---

## Acceptance Criteria

### AC-1: Promotional Banner
- A slim banner at the top of the page displays rotating promotional messages (e.g., free shipping threshold, discount codes).
- Messages rotate automatically while the page is open.
- Banner background color changes per slide to match the campaign color.

### AC-2: Order Summary
- All items currently in the cart are displayed with: product thumbnail image, product name, SKU, quantity, and line-item price.
- A "SALE" badge is shown on any item currently on promotion.
- Subtotal, shipping cost, discount (if applicable), and order total are shown beneath the item list.
- If the subtotal meets or exceeds the free-shipping threshold ($50), shipping is shown as "FREE".

### AC-3: Promo Code
- A labeled text input and an "Apply" trigger allow the user to enter a promotional code.
- If the code is valid (`SAVE10`), a 10% discount is applied to the subtotal and a confirmation message is shown.
- If the code is invalid, an error message is shown.
- The discount line in the totals section updates dynamically.

### AC-4: Shipping Address Form
- Fields required: First Name, Last Name, Email Address, Street Address, City, State, ZIP Code.
- All fields must be validated before order submission; individual field error messages appear below each field in error.
- An option to save the address for future orders is provided.
- A helper message beneath the save-address option explains where saved addresses can be managed.

### AC-5: Payment Method
- The user can select one of: Credit/Debit Card, PayPal, Apple Pay.
- When "Credit/Debit Card" is selected, fields for card number, expiry date, and CVV are shown.
- For PayPal and Apple Pay, a short descriptive message is shown instead of card fields.
- Card fields must be validated before order submission.

### AC-6: Place Order
- A prominently styled "Place Order" action at the bottom of the right column triggers form validation and, if all fields pass, submits the order.
- The button displays the current order total alongside the label.
- On successful submission, the user is taken to an order confirmation screen.

### AC-7: Hover Interaction
- The "Place Order" action has a subtle lift effect on hover (slight upward translation) to provide visual feedback.

---

## Out of Scope

- Back-end order processing, payment gateway integration.
- Cart management (add/remove items), item quantity editing on the checkout page.
- Address autocomplete or validation against postal databases.
- Accessibility audit pass (scheduled for CHKT-118).

---

## Design References

- Figma: Checkout v3 (see link above)
- Brand colors: Primary blue `#1d4ed8`, dark `#1f2328`, muted `#57606a`

---

## Definition of Done

- [ ] All six sections render correctly at 1280px, 768px, and 375px viewports.
- [ ] Form validation fires on submit; errors display per field.
- [ ] Promo code logic works for valid and invalid codes.
- [ ] Order confirmation screen renders on successful submission.
- [ ] No console errors in Chrome or Firefox.
- [ ] PR reviewed and approved by at least one team member.
