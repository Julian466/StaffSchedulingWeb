# 🏥 Shift Schedule Manager

A modern web application for managing employee shift schedules in healthcare environments. This tool serves as an interface between automated schedule generation and manual adjustment, allowing administrators to set employee preferences and select the optimal schedule from multiple generated options.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Internationalization](#internationalization)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This application is part of a larger shift scheduling system and serves a specific role in the workflow:

### The Workflow

1. **Data Fetching** (External Tool)
   - Fetches employee data from database using a case ID for a specific month
   - Generates JSON files (employees, etc.)
   - **Note:** `wishes_and_blocked.json` is NOT generated automatically as it requires manual input

2. **Manual Preference Management** (This Application)
   - Administrators define employee wishes and blocked periods
   - Manage employee data and case information
   - Prepare data for schedule generation

3. **Schedule Generation** (External Tool)
   - Generates multiple shift schedules based on case ID and seed value
   - Different seeds produce different valid schedules
   - Takes into account all constraints and employee wishes
   - Outputs `schedule_[timestamp].json` files

4. **Schedule Selection & Analysis** (This Application)
   - Compare multiple generated schedules side-by-side
   - Analyze schedule quality metrics
   - Select the optimal schedule for the month
   - Visualize assignments and constraint violations

## ✨ Features

### 👥 Employee Management
- View all employees with their roles
- Browse employee information by case
- Clean, responsive table interface

### 💝 Wishes & Blocked Periods
- Define preferred shifts for employees
- Block specific days or shifts
- Visual calendar interface for easy selection
- Supports multiple wish types:
  - Wish days (preferred days off)
  - Wish shifts (preferred shift assignments)
  - Blocked days (unavailable days)
  - Blocked shifts (unavailable shifts)

### 📅 Schedule Analysis & Selection
- **Upload Multiple Schedules**: Import schedule JSON files with different seeds
- **Quality Metrics Display**:
  - Forward rotation violations
  - Consecutive working days (>5)
  - Free weekend violations
  - Consecutive night shifts (>3)
  - Wish fulfillment rates
  - Overtime hours
- **Visual Schedule Table**: Color-coded shift assignments with employee-day matrix
- **Interactive Selection**: Mark and select the best schedule for deployment
- **Schedule Legend**: Clear indication of shift types and special markers

### 🗂️ Case Management
- Switch between different monthly cases
- Create new cases
- View case information (month, year)
- Automatic case-based data isolation


## 🏗️ Architecture

### System Context

```
┌─────────────────────┐
│  Database System    │
└──────────┬──────────┘
           │ fetch
           ▼
┌─────────────────────┐
│  External Tool      │◄─── Case ID
│  (Data Fetcher)     │
└──────────┬──────────┘
           │ generates
           ▼
┌─────────────────────┐
│  JSON Files         │
│  - employees.json   │
│  - case_info.json   │
│  (NOT wishes.json)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  This Web App       │◄─── Manual Input
│  (Schedule Manager) │
│  - Set Wishes       │
│  - Block Periods    │
│  - Select Schedule  │
└──────────┬──────────┘
           │ creates wishes.json
           ▼
┌─────────────────────┐
│  External Tool      │◄─── Case ID + Seed
│  (Schedule Gen.)    │
└──────────┬──────────┘
           │ generates multiple
           ▼
┌─────────────────────┐
│  Schedule Files     │
│  - schedule_[1].json│
│  - schedule_[2].json│
│  - schedule_[n].json│
└─────────────────────┘
           │
           └──────────► Back to Web App
                        for comparison
                        & selection
```

### Data Flow

1. **Case Selection**: User selects a case (month/year combination)
2. **Employee Review**: View fetched employee data
3. **Wish Management**: Create/edit wishes and blocked periods → `wishes_and_blocked.json`
4. **External Generation**: Schedules generated with various seeds
5. **Schedule Upload**: Import generated schedules into the app
6. **Analysis**: Compare schedules based on quality metrics
7. **Selection**: Mark the optimal schedule as "selected"

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 16** (App Router) - React framework with server-side rendering
- **React 19** - UI library
- **TypeScript** - Type-safe development

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Shadcn/ui** - Beautiful component library

### State Management & Data Fetching
- **TanStack Query (React Query)** - Async state management
- Server-side data fetching with Next.js

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 20.x or higher)
  - Developed with Node.js **v24.11.0**
- **npm** (comes with Node.js)
  - Developed with npm **11.6.1**

Check your versions:
```bash
node --version
npm --version
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Julian466/StaffSchedulingWeb.git
   cd StaffSchedulingWeb
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up data structure**
   
   Edit the configuration file (`config.json`) and set the paths for cases folder:
   ```json
   {
     "casesDirectory": "./cases"
   }
   ```
   You may need to set the `cases` folder to the desired location for storing case data (StaffScheduling-Project).


4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
StaffScheduling_Website/
├── app/
│   ├── employees/         # Employee management page
│   ├── schedule/          # Schedule analysis page
│   ├── wishes-and-blocked/ # Wishes management page
│   ├── api/                   # API routes
│   │   ├── cases/             # Case management endpoints
│   │   ├── employees/         # Employee endpoints
│   │   ├── schedule/          # Schedule endpoints
│   │   └── wishes-and-blocked/ # Wishes endpoints
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page redirect
├── components/                # Shared components
│   ├── ui/                    # UI primitives (shadcn)
│   ├── app-navigation.tsx     # Main navigation
│   └── case-selector.tsx      # Case switching
├── features/                  # Feature-specific components
│   ├── employees/
│   ├── schedule/
│   └── wishes_and_blocked/
├── lib/                       # Utilities and helpers
│   ├── data/                  # Data repositories
│   └── services/              # Business logic
├── types/                     # TypeScript type definitions
├── cases/                     # Data storage (gitignored)
└── package.json
```

## 📖 Usage

### Managing Cases

1. Use the **Case Selector** in the navigation to switch between months
2. Click **"+"** to create a new case
3. View case information by clicking the calendar icon

### Setting Employee Wishes

1. Navigate to **"Wishes & Blocked"**
2. Click **"New Entry"** or edit existing entries
3. Use the calendar interface to:
   - Mark wish days (preferred days off)
   - Select wish shifts (preferred assignments)
   - Block unavailable days
   - Block unavailable shifts
4. Changes are automatically saved to `wishes_and_blocked.json`

### Analyzing Schedules

1. Navigate to **"Schedule"**
2. Upload schedule files using **"Upload Schedule"**
   - Enter the seed value used for generation
   - File is saved and metadata recorded
3. Use the **Schedule Selector** to:
   - Switch between different schedules
   - Compare statistics
   - View detailed metrics
4. Click **"Select"** to mark the optimal schedule
5. View the full schedule table with:
   - Employee assignments per day
   - Color-coded shifts
   - Wish fulfillment indicators
   - Constraint violations highlighted

### Comparing Multiple Schedules

1. Open the **Schedule Dialog** (click "All Schedules")
2. View all generated schedules with their metrics:
   - Seed values
   - Generation timestamps
   - Violation counts
   - Wish fulfillment rates
3. Select or delete schedules from the comparison view

### URLs

- German: `http://localhost:3000/*`
- English: `http://localhost:3000/*`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

1. Follow TypeScript best practices
2. Use the existing component structure
3. Ensure responsive design works on mobile
## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

## 📞 Contact

For questions or support, please open an issue on GitHub.
---
