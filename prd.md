# EventsVedika Product Requirements Document (PRD)

## 1. Overview
EventsVedika is a modern web application designed to simplify the event planning process. It allows users to browse predefined event packages based on occasions, plan custom events through an intuitive multi-step form, and manage their planned events in a centralized dashboard.

## 2. Objectives
- Provide a visually appealing, premium, and seamless user experience for event discovery and planning.
- Allow users to input event details (occasion, location, date, guests, budget, special requirements) and receive tailored package recommendations.
- Implement a robust data management system (CRUD) to store, retrieve, update, and delete user-planned events.

## 3. Target Audience
Individuals and corporate clients looking for hassle-free, transparent, and quick event planning services without the need for endless back-and-forth communication.

## 4. Key Features & User Flows

### 4.1 Discover Page
- **Hero Section:** Clear value proposition ("Plan it in two minutes") with a call-to-action to start planning.
- **Occasion Categories:** Quick filters for different event types (Wedding, Engagement, Birthday, Corporate, etc.).
- **Popular Packages:** A curated list of trending packages showing key details (title, tags, features, estimated price).

### 4.2 Plan Event Flow (Create)
- A streamlined form interface with the following inputs:
  - **Occasion:** Selectable pills (required).
  - **Location:** Dropdown menu (required).
  - **Date:** Date picker (optional).
  - **Guest Count:** Range slider/input (required).
  - **Budget:** Range slider/input (required).
  - **Special Requirements:** Textarea for additional notes (optional).
- Upon submission, the event data is saved to the database.

### 4.3 My Events Dashboard (Read, Update, Delete)
- **Empty State:** Friendly messaging encouraging users to plan their first event if the database is empty.
- **Event List:** Displays all user-created events retrieved from the database.
- **Manage Events:** Users can modify event details (Update) or cancel/remove events (Delete).

### 4.4 Updates Page
- A notification center for reminders, countdowns, and pending actions related to planned events.

## 5. Technical Stack
- **Frontend Framework:** React (initialized via Vite) with TypeScript.
- **Styling:** Vanilla CSS focusing on modern design aesthetics, vibrant colors, and smooth micro-animations.
- **Routing:** React Router DOM for single-page application navigation.
- **Backend / Database:** `json-server` for rapid local development, providing a full REST API mocking a database (`db.json`) for CRUD operations.

## 6. Future Enhancements (Out of Scope for v1)
- Real-time chat with event planners (Vedika AI).
- Integration with actual payment gateways for package booking.
- User authentication and role-based access control.
