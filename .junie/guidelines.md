# Project Development Guidelines

**When generating code based on the following guidelines, all code comments and function descriptions (e.g., JSDoc) must be written in Japanese. The code itself (variable names, function names, etc.) must be in English.**

## Purpose and Role

This guideline provides comprehensive instructions to support the development of highly maintainable software.

**AI Assistant Role:**

* Provide specific improvement suggestions during code review based on this guideline
* Recommend appropriate design and implementation patterns for new development
* Detect violations of the guidelines and suggest alternatives
* Adjust priorities according to the project maturity level

## Core Principles \[Required]

### Top Priority Principle

The highest priority is to **write code that can be understood and modified in the shortest possible time by other developers**.

### DRY Principle

Duplicate logic must be extracted into common functions and implemented in a reusable way.

**Checklist:**

* [ ] Is the same logic repeated three or more times?
* [ ] Does the shared function have a single responsibility?
* [ ] Has generalization made the code harder to understand?

## 1. Coding Conventions

### 1.1 Naming Rules \[Required]

**Recommended Naming Patterns:**

* Use **clear and specific names** that indicate intent (e.g., `getData` → `fetchUserProfile`)
* Use **affirmative interrogative forms for booleans** (e.g., `isReady`, `hasPermission`, `canEdit`)
* Use **uppercase snake\_case for constants** to convey meaning (`MAX_RETRY_COUNT`, `API_BASE_URL`)

**Naming Checklist:**

* [ ] Can the type and purpose be inferred from variable names?
* [ ] Can return values and side effects be inferred from function names?
* [ ] Are naming patterns consistent across the project?
* [ ] Are abbreviations kept to a minimum?

### 1.2 Function Design \[Required]

**Single Responsibility Principle:**
Each function should have only one clear responsibility.

**Recommended Patterns:**

* Aim for 20–30 lines per function
* Use early return patterns to keep nesting within 2 levels
* Break down complex conditionals with descriptive variables

**Example:**

```javascript
// Before
function processUser(user) {
  if (user && user.active && user.permissions && user.permissions.length > 0) {
    // Complex logic...
  }
}

// After
function processUser(user) {
  const isValidActiveUser = user?.active === true;
  const hasPermissions = user?.permissions?.length > 0;

  if (!isValidActiveUser || !hasPermissions) {
    return;
  }

  // Main logic
}
```

### 1.3 Comment Strategy \[Recommended]

**Effective Commenting Guidelines:**

* Explain **"why"** – document rationale and constraints
* Focus on **intent rather than "what"** – complement what code can't express
* Summarize complex algorithms with overviews

**Comment Quality Checklist:**

* [ ] Business context or constraints are explained
* [ ] Reasoning behind algorithm choice is documented
* [ ] Notes on future changes or caveats are included

### 1.4 Formatting Consistency \[Required]

**Ensure Consistency:**

* Use a unified formatter configuration across the project
* Group related code blocks visually
* Use blank lines to clarify logical boundaries

## 2. Architecture and Structure

### 2.1 File Splitting Strategy \[Required]

**Splitting Criteria:**

* Limit files to **300–500 lines**; split by functionality if exceeded
* **Separate concerns** – clearly distinguish data, logic, and presentation layers
* Ensure **reusability** – isolate general-purpose logic as utilities

**File Split Checklist:**

* [ ] Does each file have a single responsibility?
* [ ] Are there no circular dependencies?
* [ ] Is common logic properly extracted?

### 2.2 Directory Structure \[Recommended]

```
src/
├── features/
│   ├── authentication/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── tests/
│   │   └── README.md
│   └── user-management/
├── shared/
│   ├── components/
│   ├── utils/
│   ├── constants/
│   ├── types/
│   └── api/
└── README.md
```

### 2.3 Documentation Management \[Required]

**Required Documents:**

| Location                      | Required Content                             | Update Timing            |
| ----------------------------- | -------------------------------------------- | ------------------------ |
| Project Root /README.md       | Project overview, setup instructions, basics | Upon major changes       |
| features/\[Feature]/README.md | Feature specs, APIs, dependencies, examples  | When the feature changes |
| shared/utils/README.md        | Function specs, usage, arguments/returns     | When functions change    |
| tests/README.md               | Test instructions, coverage, policies        | When tests are added     |

**Documentation Quality Standards:**

* [ ] Can a new developer set up the environment within 30 minutes?
* [ ] Are usage examples and limitations documented?
* [ ] Is documentation in sync with code?

## 3. Security Practices

### 3.1 Input Validation \[Required]

**Implement Layered Defense:**

* **Client-side:** For real-time user feedback
* **Server-side:** For robust security
* **Database layer:** For final enforcement via constraints

**Validation Example:**

```javascript
function validateUserInput(input) {
  const sanitized = sanitizeInput(input);
  const validated = applyBusinessRules(sanitized);
  return {
    isValid: validated.errors.length === 0,
    data: validated.data,
    errors: validated.errors
  };
}
```

### 3.2 Authentication & Authorization \[Required]

**Implementation Musts:**

* Use JWT token-based authentication
* Introduce Role-Based Access Control (RBAC)
* Perform authorization checks at API endpoints
* Manage sessions and enforce timeouts

### 3.3 Data Protection \[Required]

**Handle Sensitive Data:**

* Use environment variables for configuration
* Encrypt sensitive data
* Use HTTPS for secure communication
* Exclude sensitive info from logs

## 4. Performance & Reliability

### 4.1 Error Handling Strategy \[Required]

**Comprehensive Error Handling:**

```javascript
async function robustApiCall() {
  try {
    const result = await apiCall();
    return { success: true, data: result };
  } catch (error) {
    logger.error('API call failed', {
      endpoint: error.config?.url,
      method: error.config?.method,
      message: error.message,
      timestamp: new Date().toISOString()
    });

    return {
      success: false,
      error: getUserFriendlyMessage(error),
      retryable: isRetryableError(error)
    };
  }
}
```

### 4.2 Performance Optimization \[Recommended]

**Strategies:**

* **Caching:** Cache computations and API responses
* **Lazy Loading:** Load components/data only when needed
* **Resource Management:** Prevent memory leaks and clean up

**Optimization Checklist:**

* [ ] Are heavy computations memoized?
* [ ] Are unnecessary re-renders avoided?
* [ ] Are listeners/timers cleaned up properly?

### 4.3 Database Optimization \[Required]

**Efficient Data Access:**

* Design appropriate indexing strategies
* Query only necessary columns
* Define clear transaction boundaries
* Use connection pooling

## 5. Testing Strategy

### 5.1 Testing Pyramid \[Required]

**Test Requirements by Layer:**

* **Unit Tests:** 80%+ business logic coverage
* **Integration Tests:** Verify module interaction
* **E2E Tests:** Automate critical user flows

### 5.2 Test Quality Standards \[Recommended]

```javascript
describe('UserService', () => {
  describe('createUser', () => {
    it('creates a user with valid data', async () => {
      const validUserData = { name: 'John', email: 'john@example.com' };
      const result = await userService.createUser(validUserData);

      expect(result.success).toBe(true);
      expect(result.user.id).toBeDefined();
      expect(result.user.email).toBe(validUserData.email);
    });
  });
});
```

## 6. Frontend-Specific Items

### 6.1 State Management \[Recommended]

**Choose State Management by App Size:**

* **Simple apps:** React Context + useReducer
* **Mid-sized apps:** Zustand
* **Large/complex apps:** Redux Toolkit

**State Design Principles:**

* Manage state at the nearest common ancestor
* Minimize global state
* Use dedicated libraries for async state

### 6.2 Accessibility \[Required]

**a11y Requirements:**

* Use semantic HTML elements
* Provide ARIA attributes
* Ensure keyboard navigation
* Consider color contrast (4.5:1 or higher)

## 7. Quality Assurance

### 7.1 Prohibited Patterns \[Required]

Avoid the following patterns and use alternatives:

| Prohibited         | Alternative                      | Reason                                  |
| ------------------ | -------------------------------- | --------------------------------------- |
| Magic Numbers      | Named constants                  | Clarify intent, improve maintainability |
| Commented-out Code | Use version control history      | Keep codebase clean                     |
| Huge Functions     | Split with single responsibility | Improve testability and readability     |
| Excessive Globals  | Design proper scope              | Prevent unintended side effects         |

## 8. Continuous Improvement

### 8.1 Quality Metrics \[Recommended]

Regularly measure and improve based on:

* **Code Quality:** Cyclomatic complexity, duplication rate
* **Test Quality:** Coverage, change detection rate
* **Performance:** Page load, API response times
* **Security:** Vulnerability scan results

### 8.2 Review Process \[Required]

**Code Review Points:**

1. Compliance with this guideline
2. Fulfillment of business requirements
3. Identification of security risks
4. Performance impact
5. Test adequacy

---

## Usage Instructions

**For AI Assistants:**

* During code reviews, reference relevant section numbers and provide specific suggestions
* When proposing new implementations, consider priority levels (Required / Recommended / Contextual)
* If guideline violations are found, provide explanations with alternative code examples
* Adjust priorities flexibly based on project constraints (time, resources)

