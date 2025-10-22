# Compliz - Online Coding Platform

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

## 📁 Project Structure

```
compliz/
├── src/                          # Frontend source code
│   ├── app/                      # Next.js App Router pages
│   │   ├── compiler/            # Online compiler page
│   │   ├── problem-set/         # Practice problems listing
│   │   ├── solve/[id]/          # Individual problem solving page
│   │   ├── profile/             # User profile and analytics
│   │   ├── question/            # Question creation page
│   │   └── login/               # Authentication page
│   ├── components/              # Reusable React components
│   │   ├── ui/                  # UI component library
│   │   └── code-editor.jsx      # Monaco editor wrapper
│   ├── lib/                     # Utility libraries
│   │   ├── supabase/           # Supabase client configuration
│   │   └── utils.js            # Helper functions
│   └── hooks/                   # Custom React hooks
├── backend/                     # Backend API server
│   ├── controllers/            # Route controllers
│   ├── models/                 # Database models
│   ├── routes/                 # API route definitions
│   ├── middleware/             # Express middleware
│   ├── helpers/                # Utility functions
│   ├── prisma/                 # Database schema and migrations
│   └── generated/             # Prisma generated client
├── public/                     # Static assets
└── package.json               # Frontend dependencies
```

## 🔧 API Endpoints

### Authentication

- `POST /auth/login` - User authentication
- `POST /auth/logout` - User logout

### Questions

- `GET /question/all` - Fetch all questions
- `GET /question/one/:id` - Fetch specific question
- `POST /question/new` - Create new question

### Code Execution

- `POST /code/compile` - Compile and run code
- `POST /code/submit` - Submit solution for evaluation
- `POST /code/self` - Save user code with execution
- `GET /code/saved` - Fetch saved code snippets

### Submissions

- `GET /submission/all` - Fetch user's submission history
- `GET /submission/one/:id` - Fetch submissions for specific question

## 🎨 UI Components

The project uses a custom component library built on Radix UI primitives:

- **Button**: Customizable button component with variants
- **Card**: Container component for content organization
- **Input/Textarea**: Form input components
- **Tabs**: Tabbed interface component
- **Collapsible**: Expandable content sections
- **Badge**: Status and category indicators
- **Avatar**: User profile images
- **Popover**: Overlay components for additional content

## 🔐 Authentication Flow

1. **OAuth Integration**: Users can sign in with Google or GitHub
2. **Session Management**: Supabase handles session tokens and refresh
3. **Protected Routes**: Middleware protects authenticated routes
4. **User Data**: User information stored in PostgreSQL via Prisma

## 📊 Database Schema

### Core Models

- **User**: User profiles and authentication data
- **Question**: Coding problems with metadata
- **Submissions**: User code submissions and results
- **UserCodes**: Saved code snippets

### Relationships

- Users have many Submissions
- Questions have many Submissions
- Users have many UserCodes

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

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Varshith** - _Initial work_ - [@Itz-Varshith](https://github.com/Itz-Varshith)
- **Harshith** - _Co-developer_ - [GitHub Profile]

## 🙏 Acknowledgments

- [Judge0 API](https://judge0.com/) for code execution services
- [Supabase](https://supabase.com/) for authentication and database
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for code editing
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/Itz-Varshith/compliz/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

---

<div align="center">
  <p>Made with ❤️ by Varshith & Harshith</p>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>
