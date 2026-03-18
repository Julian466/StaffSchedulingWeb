# StaffSchedulingWeb

StaffSchedulingWeb is the official web interface for the StaffScheduling ecosystem. It supports case management,
preference input, schedule comparison, and final schedule selection for deployment workflows.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## Overview

This application is designed as a companion UI to the solver project:

- Solver and optimization logic: [StaffScheduling](https://github.com/CombiRWTH/StaffScheduling)
- Web workflow and operational UI: this repository

Core capabilities:

- Manage case-specific employee data inputs
- Capture wishes and blocked periods
- Import and compare multiple generated schedules
- Select and export the preferred schedule

## Quick Start

### Prerequisites

- Node.js 20+
- npm 9+

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create local configuration:

   - Copy `config.template.json` to `config.json`
   - Set `casesDirectory` to your cases path, for example:

   ```json
   {
     "casesDirectory": "../StaffScheduling/cases"
   }
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Data Layout (Simplified)

```
cases/
└── [case_id]/
    ├── case_information.json
    ├── employees.json
    ├── wishes_and_blocked.json
    ├── schedule_[timestamp].json
    └── schedules.json
```

## Documentation

This README intentionally stays concise. For full documentation and detailed workflows, see:

- Project docs site: https://julian466.github.io/StaffSchedulingWeb/
- Solver docs: https://combirwth.github.io/StaffScheduling/
- Local docs folder: `docs/`

## Contributing

Contributions and issue reports are welcome through GitHub Issues and Pull Requests.
