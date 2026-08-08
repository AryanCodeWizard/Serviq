# 🚀 Serviq

### On-Demand Local Services Marketplace

> **Discover. Book. Match. Serve.**

Serviq is a full-stack, microservice-oriented **on-demand home services marketplace** designed to connect customers with trusted service professionals for everyday household services.

The platform is being built with a focus on **scalability, service isolation, secure authentication, intelligent booking workflows, automated professional assignment, and a seamless customer experience**.

Serviq aims to bring the convenience of platforms such as Urban Company to local markets by providing a technology-driven infrastructure for discovering services, scheduling bookings, matching professionals, and managing the complete service lifecycle.

---

## 📌 Project Status

🚧 **Actively Under Development**

Serviq is currently being developed incrementally, with the core backend architecture and authentication infrastructure already established.

### Current progress

* ✅ Monorepo structure
* ✅ Frontend application setup
* ✅ Microservice-oriented backend
* ✅ API Gateway
* ✅ Authentication service
* ✅ User service foundation
* ✅ Booking service foundation
* ✅ Mail service
* ✅ Signup flow
* ✅ OTP verification
* ✅ Login flow
* ✅ Forgot-password flow
* ✅ Password reset flow
* 🚧 Service marketplace
* 🚧 Professional management
* 🚧 Booking workflow
* 🚧 Automated professional assignment
* 🚧 Location-based matching
* 🚧 Notifications
* 🚧 Payments
* 🚧 Reviews & ratings

> Features marked 🚧 are part of the active development roadmap and are not represented as completed functionality.

---

# 🎯 Vision

Local home-service businesses are often fragmented across phone calls, WhatsApp messages, personal contacts, and manual scheduling.

Serviq aims to provide a centralized platform where customers can:

```text
Discover a Service
        ↓
View Service Details
        ↓
Choose Date & Time
        ↓
Create Booking
        ↓
Professional Matching
        ↓
Service Fulfillment
        ↓
Completion & Review
```

The long-term goal is to build a scalable infrastructure capable of supporting multiple service categories, professionals, locations, and concurrent bookings.

---

# ✨ Core Features

## 🔐 Authentication & Security

Serviq uses a dedicated authentication service responsible for managing user authentication workflows.

### Implemented

* User registration
* OTP verification
* Login
* Forgot password
* Password reset
* Authentication middleware
* Centralized authentication through API Gateway

### Planned

* Refresh token rotation
* Role-based access control
* Professional authentication
* Session management
* Device/session tracking
* Advanced authorization policies

---

# 👤 User Management

The User Service is responsible for user-related functionality and provides a foundation for managing customer accounts independently from authentication.

### Planned capabilities

* User profiles
* Profile updates
* Address management
* Saved locations
* Service history
* Booking history
* Account preferences

---

# 🛠️ Service Marketplace

Serviq is designed around a marketplace model where customers can discover and book different categories of local services.

Examples include:

* 🧹 Home Cleaning
* 🔧 Plumbing
* 💡 Electrical Work
* ❄️ AC Service
* 🪚 Carpentry
* 🎨 Painting
* 🧺 Laundry
* 🛠️ Appliance Repair
* 💇 Personal Services
* 🏠 Other Local Services

### Planned functionality

* Service categories
* Service listing
* Search
* Filtering
* Service details
* Pricing
* Service duration
* Service availability
* Location-based service discovery

---

# 📅 Booking System

The Booking Service is being designed as the core transactional component of the platform.

The intended customer flow is:

```text
Customer
   │
   ▼
Select Service
   │
   ▼
Select Date
   │
   ▼
Select Time Slot
   │
   ▼
Create Booking
   │
   ▼
Find Eligible Professionals
   │
   ▼
Assign Professional
   │
   ▼
Service Begins
   │
   ▼
Service Completed
```

### Planned booking states

```text
PENDING
   ↓
CONFIRMED
   ↓
ASSIGNED
   ↓
IN_PROGRESS
   ↓
COMPLETED
```

Alternative states:

```text
CANCELLED
RESCHEDULED
REJECTED
EXPIRED
```

The booking lifecycle will be handled independently from authentication and user management to keep the system modular and scalable.

---

# 👨‍🔧 Professional Management

A major part of Serviq's marketplace architecture is the professional layer.

Professionals will be able to:

* Create professional profiles
* Select service categories
* Define service areas
* Manage availability
* Accept/reject bookings
* View upcoming jobs
* Track completed services
* Manage working schedules
* Receive notifications

### Professional matching

The planned matching engine will consider multiple factors:

```text
                 ┌────────────────────┐
                 │  New Booking       │
                 └─────────┬──────────┘
                           ↓
                 ┌────────────────────┐
                 │ Eligible Service   │
                 │ Professionals      │
                 └─────────┬──────────┘
                           ↓
              ┌────────────┼────────────┐
              ↓            ↓            ↓
          Location      Skills      Availability
              │            │            │
              └────────────┼────────────┘
                           ↓
                 ┌────────────────────┐
                 │ Matching / Ranking │
                 │      Engine        │
                 └─────────┬──────────┘
                           ↓
                 ┌────────────────────┐
                 │ Assigned Worker    │
                 └────────────────────┘
```

Future versions can extend this system using workload, distance, ratings, service history, and real-time availability.

---

# 🏗️ System Architecture

Serviq follows a **microservice-oriented architecture**.

```text
                           ┌─────────────────────┐
                           │      Customer       │
                           │      Browser        │
                           └──────────┬──────────┘
                                      │
                                      ▼
                           ┌─────────────────────┐
                           │      Frontend       │
                           │ React + TypeScript  │
                           └──────────┬──────────┘
                                      │
                                      ▼
                           ┌─────────────────────┐
                           │     API Gateway     │
                           │                     │
                           │ Routing / Proxy     │
                           │ Auth Middleware     │
                           └──────────┬──────────┘
                                      │
             ┌────────────────────────┼────────────────────────┐
             │                        │                        │
             ▼                        ▼                        ▼
      ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
      │    Auth     │          │    User     │          │   Booking   │
      │   Service   │          │   Service   │          │   Service   │
      └─────────────┘          └─────────────┘          └──────┬──────┘
             │                        │                        │
             │                        │                        ▼
             │                        │                 ┌─────────────┐
             │                        │                 │  Matching   │
             │                        │                 │   Engine    │
             │                        │                 └──────┬──────┘
             │                        │                        │
             └────────────────────────┼────────────────────────┘
                                      │
                                      ▼
                              ┌───────────────┐
                              │ Mail Service  │
                              │ Notifications │
                              └───────────────┘
```

---

# 🧩 Microservices

## API Gateway

The API Gateway acts as the primary entry point into the backend.

Responsibilities include:

* Request routing
* Service proxying
* Authentication handling
* Centralized API entry point
* Future rate limiting
* Future request logging
* Future service discovery

---

## Auth Service

Responsible for identity and authentication.

```text
Signup
   ↓
OTP Generation
   ↓
OTP Verification
   ↓
Account Activation
   ↓
Login
   ↓
Authenticated Session
```

It also handles:

* Login
* Signup
* OTP verification
* Password reset
* Forgot password

---

## User Service

Responsible for user-domain functionality.

The service is intentionally separated from authentication so that identity management and user-domain data can evolve independently.

---

## Booking Service

Responsible for the booking domain.

Future responsibilities include:

* Booking creation
* Booking validation
* Availability checks
* Time-slot management
* Professional assignment
* Booking status
* Cancellation
* Rescheduling
* Booking history

---

## Mail Service

A dedicated service handles application email delivery.

Potential use cases include:

* OTP emails
* Welcome emails
* Password reset
* Booking confirmation
* Booking cancellation
* Professional assignment
* Service reminders
* Completion notifications

---

# 📁 Repository Structure

```text
Serviq/
│
├── serviq-frontend/
│   │
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── ...
│
├── serviq-backend/
│   │
│   └── services/
│       │
│       ├── api-gateway/
│       │
│       ├── auth-service/
│       │
│       ├── booking-service/
│       │
│       ├── mail-service/
│       │
│       └── user-service/
│
├── .gitignore
│
└── README.md
```

---

# 💻 Technology Stack

## Frontend

| Technology      | Purpose                     |
| --------------- | --------------------------- |
| React           | UI development              |
| TypeScript      | Type safety                 |
| Vite            | Development & build tooling |
| React Router    | Client-side routing         |
| Redux Toolkit   | Global state management     |
| React Query     | Server state management     |
| Axios           | HTTP communication          |
| Tailwind CSS    | Styling                     |
| Material UI     | UI components               |
| GSAP            | Animations                  |
| React Hot Toast | Notifications               |

---

## Backend

| Technology  | Purpose                       |
| ----------- | ----------------------------- |
| Node.js     | Runtime                       |
| Express.js  | HTTP services                 |
| TypeScript  | Type-safe backend development |
| MongoDB     | Database                      |
| Mongoose    | MongoDB ODM                   |
| REST APIs   | Service communication         |
| API Gateway | Centralized request routing   |

---

## Planned Infrastructure

The architecture is designed to support technologies such as:

* Redis
* BullMQ
* RabbitMQ
* Docker
* Nginx
* AWS / Cloud infrastructure
* Object storage
* Centralized logging
* Monitoring
* Distributed tracing

These will be introduced as the platform evolves and actual scaling requirements emerge.

---

# 🔄 Authentication Architecture

Authentication is isolated into its own service.

```text
                    ┌───────────────┐
                    │    Client     │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ API Gateway   │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Auth Service  │
                    └───────┬───────┘
                            │
                ┌───────────┼───────────┐
                │           │           │
                ▼           ▼           ▼
             Signup       Login       Reset
                │
                ▼
           OTP Service
                │
                ▼
         Account Verification
```

This separation allows authentication logic to be scaled, secured, and maintained independently.

---

# 🔌 API Architecture

The frontend communicates with the backend through the API Gateway rather than directly communicating with individual internal services.

```text
Frontend
   │
   │ HTTP Request
   ▼
API Gateway
   │
   ├──── /auth/* ────────► Auth Service
   │
   ├──── /users/* ───────► User Service
   │
   ├──── /bookings/* ────► Booking Service
   │
   └──── /mail/* ────────► Mail Service
```

This provides a single public API surface while keeping internal services independently deployable.

---

# 🧠 Scalability Strategy

Serviq is being designed with scalability in mind from the beginning.

## Horizontal Scaling

Each service can eventually be scaled independently.

For example:

```text
                  API Gateway
                       │
             ┌─────────┼─────────┐
             │         │         │
             ▼         ▼         ▼
          Auth #1   Auth #2   Auth #3
```

If authentication traffic increases, additional Auth Service instances can be introduced without scaling unrelated services.

---

## Caching

Redis can eventually be introduced for:

* Service listings
* Frequently accessed user data
* Availability
* Session data
* Rate limiting
* Temporary booking state

---

## Background Processing

Long-running or non-critical operations can be moved to background workers.

```text
Booking Created
      │
      ▼
Message / Queue
      │
      ├────► Email Worker
      │
      ├────► Notification Worker
      │
      └────► Analytics Worker
```

Potential technologies:

* Redis + BullMQ
* RabbitMQ

---

# 📍 Location-Based Matching

One of Serviq's long-term goals is location-aware professional assignment.

A booking can be matched using:

```text
Customer Location
       │
       ▼
Service Area
       │
       ▼
Available Professionals
       │
       ▼
Distance Calculation
       │
       ▼
Availability + Skill
       │
       ▼
Ranking
       │
       ▼
Best Candidate
```

This can eventually evolve into a sophisticated matching engine using:

* Geographic distance
* Service specialization
* Working hours
* Current workload
* Professional rating
* Estimated travel time
* Historical performance

---

# 🗃️ Data & Domain Separation

The backend follows domain-oriented separation.

```text
Auth Domain
   ├── Identity
   ├── Credentials
   ├── OTP
   └── Password Reset

User Domain
   ├── Profile
   ├── Address
   └── Preferences

Booking Domain
   ├── Booking
   ├── Time Slot
   ├── Assignment
   └── Status

Communication Domain
   ├── Email
   ├── Notifications
   └── Templates
```

This makes it easier to evolve individual domains without tightly coupling the entire application.

---

# 🛡️ Security Considerations

Security is a core part of the architecture.

Planned and implemented security practices include:

* Environment-based secrets
* Authentication middleware
* OTP verification
* Password reset workflows
* Service-level separation
* API Gateway protection
* Input validation
* Secure password handling
* Token-based authentication
* Rate limiting
* Request validation
* CORS configuration
* Secure HTTP headers

Future improvements will include:

* Refresh token rotation
* Token revocation
* Role-based permissions
* API rate limiting
* Audit logging
* Security monitoring

---

# ⚡ Performance Strategy

Performance optimization will be introduced progressively as the application grows.

Potential optimizations include:

### Frontend

* Code splitting
* Lazy loading
* Image optimization
* React Query caching
* Optimistic UI updates
* Component memoization

### Backend

* Database indexing
* Query optimization
* Redis caching
* Pagination
* Connection pooling
* Background jobs
* Horizontal service scaling

### Infrastructure

* Reverse proxy
* CDN
* Containerization
* Load balancing
* Service replication

---

# 🧪 Development Workflow

Serviq follows a modular development approach where features are introduced incrementally.

Example:

```text
Feature
  │
  ▼
Domain Design
  │
  ▼
Service Implementation
  │
  ▼
API Integration
  │
  ▼
Frontend Integration
  │
  ▼
Testing
  │
  ▼
Performance Optimization
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

* Node.js
* npm
* MongoDB
* Git

Optional for future infrastructure:

* Docker
* Redis
* RabbitMQ

---

## 1. Clone Repository

```bash
git clone https://github.com/AryanCodeWizard/Serviq.git
```

```bash
cd Serviq
```

---

# 2. Frontend Setup

```bash
cd serviq-frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

---

# 3. Backend Setup

Navigate to the backend:

```bash
cd ../serviq-backend
```

Each service is independently maintained.

Example:

```bash
cd services/auth-service
npm install
npm run dev
```

Repeat the setup for the required backend services.

---

# 🔐 Environment Configuration

Create the appropriate `.env` files for each service.

Example:

```env
NODE_ENV=development

PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

MAIL_HOST=your_mail_host
MAIL_PORT=your_mail_port
MAIL_USER=your_mail_username
MAIL_PASSWORD=your_mail_password
```

> ⚠️ Never commit real credentials, API keys, database credentials, or secrets to Git.

---

# 🧪 Testing

Testing will be progressively introduced across individual services.

Planned coverage:

```text
Unit Tests
    ↓
Integration Tests
    ↓
API Tests
    ↓
End-to-End Tests
    ↓
Load / Performance Tests
```

Future testing areas include:

* Authentication
* Booking lifecycle
* Professional assignment
* API Gateway
* Database operations
* Service-to-service communication

---

# 📊 Observability Roadmap

As Serviq scales, observability will become an important part of the infrastructure.

Planned capabilities:

* Structured logging
* Request tracing
* Error tracking
* Service health checks
* Metrics
* Performance monitoring
* Distributed tracing

Potential tooling:

* OpenTelemetry
* Prometheus
* Grafana
* ELK / OpenSearch
* Application monitoring platforms

---

# 🗺️ Roadmap

## Phase 1 — Architecture & Foundation

* [x] Repository initialization
* [x] Frontend setup
* [x] Backend service structure
* [x] API Gateway
* [x] Authentication Service
* [x] User Service foundation
* [x] Booking Service foundation
* [x] Mail Service

---

## Phase 2 — Authentication

* [x] Signup
* [x] OTP verification
* [x] Login
* [x] Forgot password
* [x] Password reset
* [ ] Refresh tokens
* [ ] Session management
* [ ] Role-based authorization

---

## Phase 3 — Marketplace

* [ ] Service categories
* [ ] Service listing
* [ ] Service details
* [ ] Search
* [ ] Filters
* [ ] Pricing
* [ ] Service availability

---

## Phase 4 — Professionals

* [ ] Professional onboarding
* [ ] Professional profiles
* [ ] Service specialization
* [ ] Availability
* [ ] Working schedules
* [ ] Service areas
* [ ] Professional dashboard

---

## Phase 5 — Booking

* [ ] Date selection
* [ ] Time-slot selection
* [ ] Booking creation
* [ ] Booking confirmation
* [ ] Booking cancellation
* [ ] Rescheduling
* [ ] Booking history
* [ ] Booking status lifecycle

---

## Phase 6 — Matching Engine

* [ ] Availability matching
* [ ] Location matching
* [ ] Service-skill matching
* [ ] Distance ranking
* [ ] Workload balancing
* [ ] Automatic professional assignment

---

## Phase 7 — Payments & Trust

* [ ] Payment gateway
* [ ] Online payments
* [ ] Cash payments
* [ ] Refunds
* [ ] Invoices
* [ ] Ratings
* [ ] Reviews
* [ ] Professional verification

---

## Phase 8 — Scale

* [ ] Redis
* [ ] BullMQ
* [ ] RabbitMQ
* [ ] Docker
* [ ] Load balancing
* [ ] CDN
* [ ] Centralized logging
* [ ] Monitoring
* [ ] Distributed tracing
* [ ] CI/CD

---

# 🧭 Long-Term Architecture

The eventual architecture is expected to evolve toward an event-driven, highly scalable platform.

```text
                              ┌─────────────────┐
                              │     Client      │
                              └────────┬────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │  API Gateway    │
                              └────────┬────────┘
                                       │
          ┌────────────────────────────┼────────────────────────────┐
          │                            │                            │
          ▼                            ▼                            ▼
   ┌──────────────┐             ┌──────────────┐             ┌──────────────┐
   │ Auth Service │             │ User Service │             │Booking Service│
   └──────────────┘             └──────────────┘             └───────┬──────┘
                                                                       │
                                                                       ▼
                                                               ┌──────────────┐
                                                               │   Matching   │
                                                               │    Engine    │
                                                               └───────┬──────┘
                                                                       │
                                                                       ▼
                                                               ┌──────────────┐
                                                               │ Professional │
                                                               │   Service    │
                                                               └──────────────┘

                                       │
                                       ▼
                              ┌─────────────────┐
                              │ Message Broker  │
                              └────────┬────────┘
                                       │
                     ┌─────────────────┼─────────────────┐
                     ▼                 ▼                 ▼
              ┌────────────┐    ┌────────────┐    ┌────────────┐
              │   Mail     │    │Notification│    │ Analytics  │
              │  Service   │    │  Service   │    │  Service   │
              └────────────┘    └────────────┘    └────────────┘
```

---

# 📈 Engineering Principles

Serviq is being developed around several engineering principles:

### 1. Separation of Concerns

Each service owns a specific business responsibility.

### 2. Independent Scalability

Services should be independently scalable based on traffic and workload.

### 3. Fault Isolation

A failure in one non-critical service should not bring down the entire platform.

### 4. API-First Development

Services communicate through well-defined APIs.

### 5. Asynchronous Processing

Non-blocking operations can be moved to background workers.

### 6. Security by Design

Authentication, authorization and secret management are considered from the beginning.

### 7. Performance

Caching, indexing, pagination and asynchronous processing will be introduced where they provide measurable benefits.

### 8. Maintainability

The codebase is structured around clear domains and service boundaries.

---

# 💡 Key Engineering Challenges

Some of the interesting engineering problems Serviq aims to solve include:

### Concurrent Bookings

Preventing multiple customers from successfully booking the same professional/time slot.

### Professional Assignment

Finding the best professional based on:

```text
Service
+
Location
+
Availability
+
Skill
+
Workload
+
Distance
+
Performance
```

### Distributed Transactions

Maintaining consistency when a booking interacts with multiple services.

### Notifications

Ensuring booking events reliably trigger email and notification workflows.

### Scalability

Allowing individual services to scale independently as traffic grows.

### Reliability

Designing the system so temporary failures can be retried without creating duplicate bookings or notifications.

---

# 🔮 Future Improvements

Potential future improvements include:

* Real-time booking updates
* WebSocket-based notifications
* GPS/location tracking
* Dynamic pricing
* Surge pricing
* Professional ETA
* AI-assisted service recommendations
* Intelligent professional matching
* Fraud detection
* Demand prediction
* Service analytics
* Customer loyalty
* Subscription-based services
* Multi-city expansion

---

# 🤝 Contributing

Contributions and ideas are welcome.

### Fork the repository

```bash
git fork https://github.com/AryanCodeWizard/Serviq.git
```

### Create a branch

```bash
git checkout -b feature/your-feature
```

### Make your changes

```bash
git add .
git commit -m "feat: add your feature"
```

### Push your branch

```bash
git push origin feature/your-feature
```

Then open a Pull Request.

---

# 🐛 Issues

If you find a bug or have a feature request, please open an issue in the repository.

When reporting a bug, include:

* Description
* Steps to reproduce
* Expected behavior
* Actual behavior
* Environment
* Screenshots/logs where applicable

---

# 📜 Development Changelog

Current development milestones include:

```text
chore: initialize project structure and dependencies
feat(auth): add signup and OTP verification
feat(auth): add login flow
feat(auth): add forgot password reset flow
feat(mail): add email delivery service
feat(gateway): add auth proxy gateway
```

---

# 📄 License

This project is currently under active development.

License information will be added before the production/public release.

---

# 👨‍💻 Author

## AryanCodeWizard

Full-Stack Developer focused on:

* Backend Engineering
* Microservices
* Distributed Systems
* REST API Design
* System Architecture
* Scalability
* Performance Optimization
* React
* TypeScript
* Node.js

---

# 🔗 Repository

**GitHub**

https://github.com/AryanCodeWizard/Serviq

---

# ⭐ Support the Project

If you find Serviq interesting, consider giving the repository a ⭐.

It helps the project gain visibility and motivates further development.

---

<div align="center">

### 🚀 Serviq

**Building the infrastructure for smarter local services.**

**Discover → Book → Match → Serve**

</div>
