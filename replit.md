# RPA Generator - Recibo de Pagamento Autônomo

## Overview

This is a web-based application for generating professional RPA (Recibo de Pagamento Autônomo - Autonomous Payment Receipt) documents with PDF export functionality. The application provides an interactive form interface where users can input service provider and contractor details, service information, payment data, and generate professionally formatted receipts with automatic tax calculations (INSS, ISS, IRRF) and digital signatures.

The application is built as a full-stack TypeScript solution with a React frontend and Express backend, featuring a modern, responsive design using shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens

**Key Design Patterns:**
- Form state management using react-hook-form with Zod schema validation
- Custom hooks pattern for business logic encapsulation (use-rpa-form, use-toast)
- Component composition with shadcn/ui components
- Real-time tax calculation with automatic updates as form values change
- Local storage persistence for draft saving and recovery

**Form Validation Strategy:**
The application uses Zod schemas integrated with react-hook-form through @hookform/resolvers, providing type-safe runtime validation. The schema enforces required fields for core data (names, CPF/CNPJ, addresses, service description, dates, amounts) while keeping optional fields flexible (email, phone, bank details, Pix keys).

**State Management Approach:**
- Form state: Managed by react-hook-form with controlled inputs
- Derived calculations: Computed in real-time from form values using useMemo
- Draft persistence: localStorage API for saving/loading form data
- Toast notifications: Custom hook with React context for global notification state

### Backend Architecture

**Technology Stack:**
- Node.js with Express.js framework
- TypeScript for type safety across the stack
- Drizzle ORM for database interactions
- PostgreSQL via Neon serverless driver
- Session management with connect-pg-simple

**Server Structure:**
The backend follows a minimalist architecture with a thin API layer. Currently implements a basic user storage interface (IStorage) with both in-memory and potential database implementations. The routes system is prepared for expansion but currently minimal as the application is primarily client-side focused.

**Build Process:**
- Client: Vite bundles React application to dist/public
- Server: esbuild compiles TypeScript server code to dist/index.js
- Development: tsx provides hot-reload development experience
- Production: Compiled server serves static client assets

### Data Storage Solutions

**Database Configuration:**
- PostgreSQL database configured through Drizzle ORM
- Connection via Neon serverless driver (@neondatabase/serverless)
- Database URL configured through environment variables
- Migration system using drizzle-kit

**Schema Design:**
Currently implements a basic users table with UUID primary keys, username, and password fields. The schema uses Drizzle's PostgreSQL-specific types and includes Zod schema generation for runtime validation.

**Client-Side Storage:**
- localStorage for form draft persistence
- Session-like behavior for recovering unfinished forms
- Storage helper functions (saveFormData, loadFormData, clearFormData, hasStoredData)

### PDF Generation

**Implementation:**
Uses jsPDF library for client-side PDF generation with custom formatting. The PDF generator creates professionally formatted receipts including:
- Header with document title and generation date
- Service provider (prestador) details section
- Service contractor (tomador) details section
- Service description and location
- Itemized tax breakdown (INSS, ISS, IRRF)
- Payment information and method
- Signature areas for both parties
- Custom observations

**Tax Calculation Engine:**
Implements Brazilian autonomous worker tax rules:
- INSS: 11% of gross value
- ISS: Configurable percentage (default 5%, varies by municipality)
- IRRF: Progressive tax table based on 2024 brackets
  - Up to R$ 2,640.00: Exempt
  - R$ 2,640.01 to R$ 2,826.65: 7.5% - R$ 198.00
  - R$ 2,826.66 to R$ 3,751.05: 15% - R$ 410.28
  - R$ 3,751.06 to R$ 4,664.68: 22.5% - R$ 691.02
  - Above R$ 4,664.68: 27.5% - R$ 884.08

### External Dependencies

**UI Component Libraries:**
- Radix UI primitives for accessible, unstyled components
- shadcn/ui configuration for pre-styled component variants
- Lucide React for consistent iconography

**Form and Validation:**
- react-hook-form for performant form state management
- Zod for schema validation
- @hookform/resolvers for integration layer

**Database and ORM:**
- Neon serverless PostgreSQL for cloud database hosting
- Drizzle ORM for type-safe database queries
- drizzle-zod for automatic schema-to-Zod conversion

**Development Tools:**
- Replit-specific plugins for development banner and error overlay
- Vite plugins for enhanced development experience

**Styling:**
- Tailwind CSS with PostCSS for processing
- Custom CSS variables for theming (supports light/dark modes)
- class-variance-authority for component variant management
- clsx and tailwind-merge for conditional class composition