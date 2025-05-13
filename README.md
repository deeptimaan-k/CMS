# 🌟 CRM Hub

<div align="center">

![CRM Hub Banner](https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js Version](https://img.shields.io/badge/Node.js-≥16.0.0-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

A modern, AI-powered CRM platform for next-generation customer relationship management

[Features](#-features) • [Tech Stack](#%EF%B8%8F-tech-stack) • [Installation](#-installation) • [API Reference](#-api-reference) • [Contact](#-contact)

</div>

## 🎯 Overview

CRM Hub is a comprehensive customer relationship management solution that empowers businesses to:

- 📊 Manage customer data efficiently
- 🎯 Create targeted customer segments
- 📧 Run multi-channel marketing campaigns
- 🤖 Get AI-powered customer insights
- 📈 Track campaign performance

## ✨ Features

<details>
<summary><b>🔐 Authentication & Authorization</b></summary>

- Google OAuth 2.0 integration
- JWT-based secure authentication
- Role-based access control
- Profile management
</details>

<details>
<summary><b>👥 Customer Management</b></summary>

- Detailed customer profiles
- Order history tracking
- Activity monitoring
- Customer insights dashboard
</details>

<details>
<summary><b>🎯 Segmentation Engine</b></summary>

- Intuitive rule-based builder
- Real-time audience estimation
- Multiple condition types
- Dynamic filtering
</details>

<details>
<summary><b>📢 Campaign Management</b></summary>

- Multi-channel support
  - Email campaigns
  - SMS notifications
  - Push notifications
  - Social media posts
- Message personalization
- Campaign scheduling
- Performance tracking
</details>

<details>
<summary><b>🤖 AI-Powered Features</b></summary>

- Campaign performance analysis
- Message optimization
- Behavior pattern detection
- Smart scheduling recommendations
</details>

## 🛠️ Tech Stack

### Frontend
```javascript
{
  "framework": "React 18 + TypeScript",
  "styling": "TailwindCSS",
  "routing": "React Router DOM",
  "state": "React Context",
  "animations": "Framer Motion",
  "forms": "React Hook Form",
  "icons": "Lucide React"
}
```

### Backend
```javascript
{
  "runtime": "Node.js",
  "framework": "Express.js",
  "database": "MongoDB + Mongoose",
  "authentication": "JWT + Google Auth",
  "validation": "Joi",
  "logging": "Morgan"
}
```

### AI Integration
```javascript
{
  "provider": "Google Gemini API",
  "features": [
    "Performance Analysis",
    "Content Optimization",
    "Smart Scheduling",
    "Audience Insights"
  ]
}
```

## 📂 Project Structure

```bash
crm-hub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── context/      # State management
│   │   ├── pages/        # Route components
│   │   └── utils/        # Helper functions
│   └── public/           # Static files
│
└── server/               # Node.js backend
    ├── config/          # Configuration
    ├── controllers/     # Route handlers
    ├── middleware/      # Custom middleware
    ├── models/          # Database models
    ├── routes/          # API routes
    └── validation/      # Request schemas
```

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/deeptimaan-k/CMS.git
   cd CMS
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client && npm install

   # Install server dependencies
   cd ../server && npm install
   ```

3. **Configure environment**
   ```bash
   # Copy example env files
   cp .env.example .env
   cd client && cp .env.example .env
   cd ../server && cp .env.example .env
   ```

4. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   ```

## 🔑 Environment Variables

### Client
```env
VITE_API_URL=http://localhost:5001/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Server
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5001
NODE_ENV=development
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GEMINI_API_KEY=your_gemini_api_key
```

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/google` | Google OAuth |
| GET | `/api/auth/profile` | Get profile |
| PUT | `/api/auth/profile` | Update profile |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers` | List customers |
| POST | `/api/customers` | Create customer |
| GET | `/api/customers/:id` | Get customer |
| PUT | `/api/customers/:id` | Update customer |
| DELETE | `/api/customers/:id` | Delete customer |

### Campaigns
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/campaigns` | List campaigns |
| POST | `/api/campaigns` | Create campaign |
| GET | `/api/campaigns/:id` | Get campaign |
| POST | `/api/campaigns/:id/send` | Send campaign |

### Segments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/segments` | List segments |
| POST | `/api/segments` | Create segment |
| GET | `/api/segments/:id` | Get segment |
| PUT | `/api/segments/:id` | Update segment |
| DELETE | `/api/segments/:id` | Delete segment |
| POST | `/api/segments/preview` | Preview audience |

## 🤔 Technical Decisions

### Why MongoDB?
- Flexible schema for varying customer data
- Faster development iteration
- Better handling of nested data structures
- Excellent Node.js integration

### Why Client-Side Rendering?
- Rich interactive features
- Smooth user experience
- Reduced server load
- Better state management

### Authentication Strategy
- Real Google OAuth implementation
- JWT for secure sessions
- Role-based access control
- Scalable user management

## 👨‍💻 Developer

<div align="center">
  <img src="https://avatars.githubusercontent.com/u/deeptimaan-k" width="100" style="border-radius: 50%"/>
  
  **Deeptimaan Krishnajadaun**

  [![GitHub](https://img.shields.io/badge/GitHub-deeptimaan--k-181717?style=flat-square&logo=github)](https://github.com/deeptimaan-k)
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-Deeptimaan%20K-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/deeptimaan-k/)
</div>

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Made with ❤️ by Deeptimaan Krishnajadaun
</div>