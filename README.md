# Compliz - Online Coding Platform[Live Link](https://compliz.vercel.app/)

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js" alt="Next.js Version" />
  <img src="https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react" alt="React Version" />
  <img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js" alt="Backend" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-blue?style=for-the-badge&logo=postgresql" alt="Database" />
  <img src="https://img.shields.io/badge/Supabase-Auth-green?style=for-the-badge&logo=supabase" alt="Authentication" />
</div>

<br>

**Compliz** is a comprehensive online coding platform designed for developers who aspire to master algorithms, solve complex problems, and build their skills with confidence. Built with modern web technologies, it provides an integrated environment for coding practice, competition, and learning.

## ✨ Features

### 🎯 Core Functionality

- **Practice Problems**: Curated coding challenges ranging from beginner to expert level
- **Online Compiler**: Execute code instantly across multiple programming languages (C++, C, Java, Python, JavaScript)
- **Progress Tracking**: Detailed analytics and achievements to monitor your growth
- **Question Creation**: Create your own questions and contribute to the community

### 🚀 Advanced Features

- **Real-time Code Execution**: Powered by Judge0 API for instant code compilation and execution
- **User Authentication**: Secure OAuth integration with Google and GitHub
- **Code Saving**: Save and manage your code snippets with custom names
- **Submission History**: Track all your submissions with detailed performance metrics
- **Interactive Code Editor**: Monaco Editor with syntax highlighting and IntelliSense
- **Responsive Design**: Optimized for desktop and tablet devices

### 📊 Analytics & Insights

- **Performance Metrics**: Runtime, memory usage, and execution statistics
- **Progress Visualization**: Charts and graphs showing your coding journey
- **Topic-based Analytics**: Track your progress across different algorithm topics
- **Daily Activity Tracking**: Monitor your coding streak and consistency

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15.5.4 with App Router
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4.0
- **Components**: Radix UI primitives
- **Code Editor**: Monaco Editor
- **Charts**: Recharts for data visualization
- **Authentication**: Supabase Auth

### Backend

- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth with JWT
- **Code Execution**: Judge0 API integration
- **File Storage**: MongoDB for additional data storage

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint with Next.js config
- **Build Tool**: Turbopack (Next.js)
- **Version Control**: Git

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database
- Supabase account for authentication
- MongoDB (optional, for additional storage)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Itz-Varshith/compliz.git
   cd compliz
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

4. **Environment Setup**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   Create a `.env` file in the backend directory:

   ```env
   DATABASE_URL=your_postgresql_connection_string
   MONGODB_URI=your_mongodb_connection_string
   FRONTEND_URL=http://localhost:3000
   PORT=5000
   ```

5. **Database Setup**

   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

6. **Start the development servers**

   Terminal 1 (Frontend):

   ```bash
   npm run dev
   ```

   Terminal 2 (Backend):

   ```bash
   cd backend
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Heroku)

1. Connect your GitHub repository
2. Set environment variables
3. Configure PostgreSQL database
4. Deploy with automatic builds


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Varshith**  - [@Itz-Varshith](https://github.com/Itz-Varshith)
- **Harshith**  - [@Yagami-light45](https://github.com/Yagami-light45)


<div align="center">
  <p>Made with ❤️ by Varshith & Harshith</p>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>
