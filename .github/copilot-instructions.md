# Project Instructions & Architecture Guidelines

You are an expert software architect acting as a coding assistant. This project follows a strict **Clean Architecture** approach using **Next.js 16**, **Server Actions**, and **Dependency Injection**.

## 1. Core Architectural Layers
The project is divided into strictly separated layers. Respect the dependency rule: **Dependencies only point inwards.**

### Domain Layer (`src/entities`)
*   **Purpose:** Contains pure business logic and enterprise rules.
*   **Dependencies:** ZERO dependencies. No external libraries, no React, no database code.
*   **Contents:**
    *   `models/`: Zod schemas and TypeScript types defining core entities.
    *   `errors/`: Custom domain errors.

### Application Layer (`src/application` or `src/use-cases`)
*   **Purpose:** Orchestrates the flow of data. Contains specific business rules.
*   **Dependencies:** Depends ONLY on the Domain Layer.
*   **Contents:**
    *   **Use Cases:** Pure functions or classes implementing a single business action (e.g., `create-project.use-case.ts`).
    *   **Input/Output Ports:** Interfaces defining how data enters/exits.

### Interface Adapters Layer (`src/interface-adapters` or `src/controllers`)
*   **Purpose:** Converts data from the format most convenient for the Use Cases to the format most convenient for the UI/Web.
*   **Contents:**
    *   **Controllers:** Receive input, call Use Cases, and return **DTOs** (Data Transfer Objects) or **ViewModels**.
    *   **Presenters:** (Optional) Helper functions inside controllers to format data for the View.
    *   **Gateways/Repositories:** Implementations of interfaces defined in the Application layer (e.g., database access).

### Frameworks & Drivers Layer (`src/infrastructure`, `app/`, `features/`)
*   **Purpose:** The "glue" code. Next.js pages, Database connections, UI Components.
*   **Contents:**
    *   `app/`: Next.js App Router pages (Server Components).
    *   `features/`: Feature-Sliced Design folders containing UI components and Server Actions.
    *   `di/`: Dependency Injection container setup.

***

## 2. Rules for Clean Code & Next.js 16

### Server Actions as Entry Points
*   **NEVER** write business logic inside a Server Action (`.actions.ts`).
*   Server Actions must act as **Gateways** only. They retrieve a Controller from the DI Container and execute it.
    ```typescript
    // CORRECT:
    'use server';
    import { getInjection } from '@/di/container';

    export async function createProjectAction(data: InputType) {
        const controller = getInjection('ICreateProjectController');
        return controller(data);
    }
    ```

### Controllers & ViewModels
*   **Presenters are mandatory for complex views.** Controllers should return ready-to-consume DTOs (Data Transfer Objects) or ViewModels.
*   **No Logic in UI:** The React Page/Component should NOT perform data aggregation (e.g., `reduce`, `filter` to calculate stats). The Controller must return the calculated stats.
*   **Page Controllers:** For complex pages, create a dedicated Page Controller (e.g., `get-dashboard-page.controller.ts`) that aggregates all necessary data for that page in a single call.

### ViewModels vs DTOs (Where to put what)
In this Clean Architecture (aligned with Lazar Nikolov's approach), there are exactly two correct places depending on what you are modeling.

**1. ViewModels (`src/entities/view-models/`)**
Reusable, display-focused domain objects that describe how a "thing" should generally appear in the UI.

*   **Location:** `src/entities/view-models/`
*   **Use when:** A single entity (e.g., `TestFile`) is shown in multiple UI contexts (list, detail page, sidebar, modal).
*   **Example:** `TestFileViewModel` with `id`, `path`, `status`.

**Why in `entities`?** They are often shared across multiple use cases or controllers, so they are enterprise-wide UI definitions.

**2. DTOs (`src/controllers/...`)**
One-off data packages for a specific request or a specific component.

*   **Location:** In the controller that produces it.
    *   `src/controllers/dashboard/get-dashboard-stats.controller.ts`
*   **Use when:** The data shape exists only for that purpose (e.g., "Dashboard statistics"). Nobody else needs that exact combination.

**Recommended structure:**

```text
src/
├── entities/
│   ├── models/            <-- Real domain models (e.g., TestFile, Repository)
│   └── view-models/       <-- Reusable UI models (TestFileViewModel)
│
├── controllers/
│   └── dashboard/
│       └──  get-dashboard-stats.controller.ts
```

**Rule of thumb:**
*   **General object** (User, TestFile, Branch) -> `src/entities/view-models`
*   **Specific response** for a page or component (dashboard numbers, form validation result) -> `src/controllers/.../*.controller.ts`

### Dependency Injection (DI)
*   Use the custom container in `src/di/container.ts`.
*   Always define interfaces for dependencies (e.g., `IRepository`) in the Application layer, and implement them in Infrastructure.
*   Inject dependencies into Use Cases and Controllers.

***

## 3. Coding Standards

### File Naming
*   Use `kebab-case` for all files: `user-profile.component.tsx`, `get-users.use-case.ts`.
*   Suffix files with their type:
    *   `.model.ts`
    *   `.use-case.ts`
    *   `.controller.ts`
    *   `.dto.ts`
    *   `.repository.ts`
    *   `.actions.ts`

### UI Components (Shadcn/UI + Tailwind)
*   **Dumb Components:** UI components (under `components/` or `features/*/components`) should focus on **rendering** and **user interaction**.
*   **Props:** Use explicit Interfaces for props. Prefer passing flat DTOs over complex objects.
*   **Client vs. Server:** Default to Server Components. Use `'use client'` only when hook usage (`useState`, `useEffect`) or event listeners are strictly necessary.

### Error Handling
*   Use a `Result` pattern or try/catch blocks in the **Controller** layer to catch Domain Errors and convert them to UI-friendly error messages.
*   Never leak database errors or internal stack traces to the frontend.

***

## 4. Workflow for New Features

When asked to implement a feature (e.g., "Add a User List"), follow this order:

1.  **Domain:** Define the `User` entity/model in `src/entities`.
2.  **Application:** Define the `IUserRepository` interface and the `get-user-list.use-case.ts`.
3.  **Infrastructure:** Implement `PrismaUserRepository` (or similar).
4.  **Interface Adapter:** Create `get-user-list.controller.ts` + `UserListDto`.
5.  **DI:** Register the new classes in `src/di/modules`.
6.  **Framework:** Create the Server Action wrapper in `features/users/user.actions.ts`.
7.  **UI:** Create the Page (`app/users/page.tsx`) calling the action, and dumb components to display the `UserListDto`.

***

## 5. Specific Anti-Patterns to Avoid

* **No Direct DB Access in Pages:** Never import Prisma/DB clients directly in `app/*.tsx`.
* **No "Shared" Dump:** Avoid putting logic in `features/shared` unless it is truly generic utility code.
* **No Fat Components:** If a component is > 200 lines or contains complex `useEffect` logic, refactor.
* **No Business Logic in Views:** Do not calculate "Success Rates" or "Totals" in React. Do it in the Controller.

***

## 6. Testing Strategy
*   **Unit Tests:** Focus on Use Cases and Domain logic. Mock repositories.
*   **Integration Tests:** Focus on Controllers and Repositories.