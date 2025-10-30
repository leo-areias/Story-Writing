# Story Writing Collaboration System

A fullstack application that leverages AI agents to collaboratively create interactive stories with branching narratives. Users provide a premise or genre, and multiple AI agents work together to develop characters, write chapters, and refine the plot.

## 🎯 Project Overview

This system uses a multi-agent approach where different AI agents specialize in different aspects of story creation:

- **Agent 1**: Character & Setting Creator - Develops compelling characters and immersive settings
- **Agent 2**: Story Writer - Crafts engaging chapters with branching narrative paths
- **Agent 3**: Plot Reviewer - Analyzes and suggests improvements to enhance story flow and coherence

## 🏗️ Architecture

### Frontend
- **React with TypeScript** - Modern, type-safe user interface
- **Interactive Reading Interface** - Supports branching story paths
- **Real-time Collaboration** - Live updates as agents work on stories

### Backend
- **Node.js/Express** - RESTful API for story management
- **MongoDB** - Document-based storage for stories, characters, and plot elements
- **Docker** - Containerized MongoDB for easy development setup

### AI Integration
- **Google Gemini API** - Powers all three specialized agents
- **Environment Configuration** - Secure API key management via `.env`

## 🚀 Features

### Current Implementation
- **🎨 Beautiful Landing Page**: Clean, beige-themed design with paper texture
- **📊 Interactive Dashboard**: Card-based layout showing story progress and statistics
- **📝 Story Creation Modal**: Elegant form for creating new stories with AI assistance
- **📖 Story Viewer**: Professional reading interface with chapter formatting
- **🤖 AI Agent Workflow**: Automated character creation, chapter writing, and story review
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

### Core Functionality
- **Premise Input**: Users provide story titles, premises, and genres
- **Multi-Agent Collaboration**: Three specialized AI agents work in sequence
- **Character Development**: AI creates detailed character profiles and relationships
- **Chapter Writing**: AI generates engaging story chapters with proper formatting
- **Story Review**: AI analyzes and improves story flow and consistency
- **Real-time Progress**: Visual indicators show AI agent completion status
- **Story Management**: Save, view, and manage multiple stories

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB (Dockerized)
- **AI**: Google Gemini API (gemini-2.0-flash-exp)
- **Development**: Docker, Git
- **Styling**: Custom beige theme with paper texture effects

## 🎨 UI/UX Design

### Design Philosophy
- **Warm & Literary**: Beige color scheme with paper texture for a book-like feel
- **Clean & Minimalist**: Uncluttered interface focusing on content
- **Professional**: Sophisticated typography and spacing
- **Accessible**: High contrast and readable text

### Color Palette
- **Primary Background**: Beige gradient (`stone-100` to `amber-50` to `stone-200`)
- **Text Colors**: Soft black (`gray-800`) for headings, `gray-700` for body text
- **Accent Colors**: Brown (`amber-800`) for primary buttons
- **Cards**: Clean white backgrounds with subtle stone borders

### Typography
- **Headings**: Serif fonts for literary feel
- **Body Text**: Clean, readable sans-serif
- **Chapter Titles**: Large, elegant formatting
- **Code**: Monospace for technical content

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Consistent styling with hover effects
- **Forms**: Clean inputs with focus states
- **Modals**: Elegant overlays with backdrop blur

## 📋 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Docker and Docker Compose
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Story-Writing
   ```

2. **Verify Docker Installation**
   ```bash
   # Check Docker version
   docker --version
   
   # Check Docker Compose version
   docker-compose --version
   
   # Check if Docker daemon is running
   docker info
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your Gemini API key
   # GEMINI_API_KEY=your_api_key_here
   ```

4. **Start MongoDB with Docker**
   ```bash
   # Start the services in detached mode (runs in background)
   docker-compose up -d
   
   # Alternative: Start with logs visible (for debugging)
   docker-compose up
   ```

5. **Verify MongoDB is running**
   ```bash
   # Check running containers
   docker ps
   
   # Check container logs if needed
   docker-compose logs mongodb
   ```

6. **Test MongoDB Connection**
   ```bash
   # Option A: Using MongoDB Shell
   docker exec -it story-writing-mongodb mongosh
   
   # Option B: Using Mongo Express (Web Interface)
   # Open browser: http://localhost:8081
   # Login: admin / admin123
   
   # Option C: From local machine (if mongosh installed)
   mongosh "mongodb://admin:password123@localhost:27017/story_writing?authSource=admin"
   ```

## 🚀 Running the Application

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Set up backend environment**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your Gemini API key
   # GEMINI_API_KEY=your_api_key_here
   # MONGODB_URI=mongodb://admin:password123@localhost:27017/story_writing?authSource=admin
   # PORT=3000
   ```

4. **Start the backend server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Or production mode
   npm start
   ```

   The backend will be available at `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory** (in a new terminal)
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Set up frontend environment**
   ```bash
   # If an example env file exists
   [ -f .env.example ] && cp .env.example .env || true

   # If no example exists, create a minimal .env with Vite vars
   # echo "VITE_API_BASE_URL=http://localhost:3000" > .env
   ```

4. **Build the frontend (recommended before first run)**
   ```bash
   npm run build
   ```

5. **Start the frontend development server**
   ```bash
   # Development mode with hot reload
   npm run dev
   
   # Or build for production
   npm run build
   ```

   The frontend will be available at `http://localhost:5173`

### Complete Application Stack

To run the complete application, you need **3 terminals**:

**Terminal 1 - MongoDB:**
```bash
# Start MongoDB and Mongo Express
docker-compose up -d
```

**Terminal 2 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm install
npm run build    # build once before first run (recommended)
npm run dev
```

### Access Points

- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Mongo Express (Database UI)**: http://localhost:8081
- **API Health Check**: http://localhost:3000/health

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=mongodb://localhost:27017/story-writing
PORT=3000
NODE_ENV=development
```

### MongoDB Setup
The project includes a `docker-compose.yml` file for easy MongoDB setup:

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

## 🛠️ Useful Docker Commands

### Basic Operations
```bash
# Stop the services
docker-compose down

# Stop and remove volumes (WARNING: This deletes all data)
docker-compose down -v

# Restart services
docker-compose restart

# View logs
docker-compose logs -f mongodb

# Execute commands in the MongoDB container
docker exec -it story-writing-mongodb mongosh
```

### Troubleshooting
```bash
# Check what's using port 27017
lsof -i :27017

# Kill process using port 27017 (if needed)
sudo kill -9 <PID>

# Reset everything (clean slate)
docker-compose down -v
docker system prune -a
docker-compose up -d

# Check container status
docker ps -a

# View container logs
docker-compose logs mongodb
docker-compose logs mongo-express
```

## 📁 Project Structure

```
Story-Writing/
├── frontend/                    # React TypeScript frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── ui/            # Reusable UI components
│   │   │   ├── StoryCard.tsx  # Story display component
│   │   │   ├── CharacterCard.tsx
│   │   │   └── CreateStoryModal.tsx
│   │   ├── pages/             # Page components
│   │   │   ├── LandingPage.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── StoryViewer.tsx
│   │   │   ├── StoryDetail.tsx
│   │   │   └── StoryReader.tsx
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useStories.ts
│   │   │   └── useStory.ts
│   │   ├── services/          # API service layer
│   │   │   └── api.ts
│   │   ├── types/             # TypeScript type definitions
│   │   │   └── index.ts
│   │   ├── utils/             # Utility functions
│   │   │   └── index.ts
│   │   ├── App.tsx            # Main app component
│   │   ├── main.tsx           # App entry point
│   │   └── index.css          # Global styles
│   ├── package.json
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   ├── vite.config.ts         # Vite build configuration
│   └── tsconfig.json          # TypeScript configuration
├── backend/                    # Node.js backend
│   ├── src/
│   │   ├── routes/            # API routes
│   │   │   ├── stories.js
│   │   │   ├── chapters.js
│   │   │   ├── characters.js
│   │   │   └── agents.js
│   │   ├── models/            # MongoDB models
│   │   │   ├── Story.js
│   │   │   ├── Chapter.js
│   │   │   └── Character.js
│   │   ├── agents/            # AI agent implementations
│   │   │   ├── CharacterCreatorAgent.js
│   │   │   ├── StoryWriterAgent.js
│   │   │   └── PlotReviewerAgent.js
│   │   ├── utils/             # Utility functions
│   │   │   ├── database.js
│   │   │   └── gemini.js
│   │   └── server.js          # Express server setup
│   ├── package.json
│   └── .env.example
├── docker-compose.yml         # MongoDB and Mongo Express setup
├── .env.example              # Environment variables template
└── README.md
```

## 🤖 AI Agents

### Agent 1: Character & Setting Creator
- Analyzes user premise and genre
- Creates detailed character profiles
- Develops immersive world-building elements
- Establishes story tone and atmosphere

### Agent 2: Story Writer
- Takes character and setting information
- Writes engaging story chapters
- Creates branching narrative paths
- Maintains story consistency and pacing

### Agent 3: Plot Reviewer
- Reviews completed chapters
- Identifies plot holes and inconsistencies
- Suggests improvements for character development
- Enhances story flow and narrative structure

## 🏗️ Architecture Decision: Custom Agents vs. Frameworks

### Why We Built Custom Agents Instead of Using CrewAI/LangChain

This project uses **custom-built AI agents** rather than popular frameworks like CrewAI or LangChain. Here's why this approach was chosen:

#### **Our Custom Approach Benefits:**
- **🎯 Domain-Specific**: Tailored specifically for story writing workflows
- **🔧 Full Control**: Complete control over agent behavior and logic
- **⚡ Performance**: No framework overhead or unnecessary abstractions
- **🐛 Easy Debugging**: Simple, transparent code that's easy to troubleshoot
- **📦 Minimal Dependencies**: Lightweight with fewer external dependencies
- **🔗 Direct Integration**: Seamless MongoDB and Gemini API integration

#### **Framework Comparison:**

| Aspect | Custom Agents | LangChain.js | CrewAI (Python) |
|--------|---------------|--------------|-----------------|
| **Control** | ✅ Full | ⚠️ Limited | ⚠️ Limited |
| **Dependencies** | ✅ Minimal | ❌ Heavy | ❌ Heavy |
| **Debugging** | ✅ Easy | ❌ Complex | ❌ Complex |
| **Customization** | ✅ Complete | ⚠️ Limited | ⚠️ Limited |
| **Learning Curve** | ✅ Simple | ❌ Steep | ❌ Steep |
| **Ecosystem** | ✅ Self-contained | ⚠️ JS version limited | ✅ Rich (Python) |
| **Story-Specific Logic** | ✅ Native | ❌ Generic | ❌ Generic |
| **Performance** | ✅ Optimized | ⚠️ Framework overhead | ⚠️ Framework overhead |

#### **When to Use Each Approach:**

**Use Custom Agents When:**
- Building domain-specific applications (like story writing)
- Need tight control over agent behavior
- Want minimal dependencies and maximum performance
- Have specific workflow requirements
- Need custom error handling and validation

**Use CrewAI/LangChain When:**
- Building generic AI applications
- Need complex agent orchestration
- Want pre-built tools and integrations
- Have Python backend (for CrewAI)
- Need rapid prototyping

#### **Our Implementation:**
```javascript
// Custom agents with story-specific methods
class CharacterCreatorAgent {
  async createCharactersAndSetting(storyId, storyData) {
    // Direct Gemini API calls
    // Custom validation and error handling
    // Tailored for story creation workflow
  }
}

class StoryWriterAgent {
  async writeChapter(storyData, chapterNumber, previousChapters) {
    // Chapter writing with branching logic
    // Story continuity management
    // Choice generation for interactive narratives
  }
}
```

This custom approach gives us exactly what we need for story writing without the complexity of forcing a general-purpose framework into our domain-specific requirements.

## 🎮 Usage

1. **Visit Landing Page**: Start at `http://localhost:5173`
2. **Create New Story**: Click "New Story" and fill in title, premise, and genre
3. **AI Processing**: Watch as three AI agents work automatically:
   - Agent 1: Creates characters and setting
   - Agent 2: Writes story chapters
   - Agent 3: Reviews and improves the story
4. **View Progress**: Check the dashboard for real-time progress updates
5. **Read Story**: Click "View" to read the completed story with beautiful formatting

## 🔧 Troubleshooting

### Common Issues

**Frontend not loading:**
```bash
# Clear Vite cache and reinstall
cd frontend
rm -rf node_modules .vite
npm install
npm run dev
```

**Backend connection errors:**
```bash
# Check if backend is running
curl http://localhost:3000/health

# Restart backend
cd backend
npm run dev
```

**MongoDB connection issues:**
```bash
# Check if MongoDB is running
docker ps | grep mongo

# Restart MongoDB
docker-compose down
docker-compose up -d
```

**Port conflicts:**
```bash
# Check what's using ports
lsof -i :3000  # Backend
lsof -i :5173  # Frontend
lsof -i :27017 # MongoDB

# Kill processes if needed
sudo kill -9 <PID>
```

**API key issues:**
- Ensure your Gemini API key is correctly set in `backend/.env`
- Check the health endpoint: `http://localhost:3000/health`
- Verify the key has proper permissions for Gemini API

**Build errors:**
```bash
# Clear all caches and reinstall
cd frontend
rm -rf node_modules .vite dist
npm install
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- MongoDB for flexible document storage
- React and TypeScript communities for excellent tooling
