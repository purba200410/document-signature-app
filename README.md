# Digital Signature Platform

A full-stack document signing platform that enables users to upload PDF documents, invite participants, collect signatures in a controlled workflow, and generate signed PDF files with complete audit tracking.

---

## Live Demo

### Frontend
https://document-signature-app-w2bz.vercel.app

### Backend API
https://document-signature-app-3wmw.onrender.com

---

## Features

### Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes

### Document Management

- Upload PDF Documents
- View Uploaded Documents
- Document Status Tracking
- Download Signed PDFs

### Participant Workflow

- Add Participants by Email
- Assign Roles:
  - SIGNER
  - WITNESS
  - AUTHENTICATOR
- Remove Participants
- Invitation Email System

### Signature Process

- Sequential Approval Workflow
- Signer completes first
- Witness completes after signer
- Authenticator completes after witness
- Automatic PDF Signature Generation

### Audit Logs

- Document Creation Logs
- Participant Activity Logs
- Signature Logs
- Authentication Logs
- Timestamp Tracking

### Signature Profile

- Custom Full Name
- Signature Style Selection
- Personalized Signature Appearance

### Cloud Integration

- Supabase Storage for PDF Files
- Neon PostgreSQL Database
- Render Backend Hosting
- Vercel Frontend Hosting

---

## Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- React Router
- Axios

### Backend

- Node.js
- Express.js
- Prisma ORM
- JWT Authentication
- Nodemailer

### Database

- Neon PostgreSQL

### Storage

- Supabase Storage

### PDF Processing

- PDF-Lib

### Deployment

- Vercel
- Render

---

## Architecture

```text
                 ┌─────────────┐
                 │    User     │
                 └──────┬──────┘
                        │
                        ▼
        ┌─────────────────────────┐
        │ Frontend (React + Vercel)│
        └───────────┬─────────────┘
                    │ API Calls
                    ▼
        ┌─────────────────────────┐
        │ Backend (Express.js)    │
        │ Hosted on Render        │
        └──────┬─────────┬────────┘
               │         │
               │         │
               ▼         ▼
    ┌────────────────┐  ┌─────────────────┐
    │ Neon Database  │  │ Supabase Storage│
    │ PostgreSQL     │  │ PDF Files       │
    └────────────────┘  └─────────────────┘
               │
               ▼
      PDF Signature Generation
               │
               ▼
         Signed PDF Download
```

---

## Workflow

### Step 1

Document Owner uploads PDF.

### Step 2

Owner adds participants.

### Step 3

Invitation email is sent.

### Step 4

Participant opens invite link.

### Step 5

Participant completes assigned action.

### Step 6

Signature is added to PDF.

### Step 7

Audit log is recorded.

### Step 8

Completed document becomes downloadable.

---

## Database Schema

### User

- id
- name
- email
- password

### Document

- id
- title
- originalFileUrl
- signedFileUrl
- status
- ownerId

### Participant

- id
- email
- role
- status
- actedAt

### AuditLog

- id
- action
- documentId
- userId
- createdAt

### SignatureProfile

- id
- fullName
- signatureStyle
- userId

---

## Installation

### Clone Repository

```bash
git clone https://github.com/purba200410/document-signature-app.git
```

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run dev
```

---

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=

JWT_SECRET=

EMAIL_USER=
EMAIL_PASS=

CLIENT_URL=

SUPABASE_URL=
SUPABASE_ANON_KEY=
```

### Frontend (.env)

```env
VITE_API_URL=
```

---

## Future Improvements

- Drag & Drop Signature Placement
- OTP Verification
- Real Digital Certificates
- Reminder Emails
- Multi-Document Signing
- Team Management
- Real-Time Notifications

---

## Author

Purba Dey

GitHub:
https://github.com/purba200410

---

## License

This project was developed for educational and internship purposes.
