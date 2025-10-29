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

- **Premise Input**: Users can provide story premises, genres, or themes
- **Multi-Agent Collaboration**: Three specialized AI agents work in sequence
- **Branching Narratives**: Stories can have multiple paths and endings
- **Interactive Reading**: Users can make choices that affect story direction
- **Story Management**: Save, load, and continue stories across sessions
- **Real-time Updates**: See story development as it happens

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Dockerized)
- **AI**: Google Gemini API
- **Development**: Docker, Git

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
   cp .env.example .env
   # Edit .env and add your Gemini API key
   GEMINI_API_KEY=your_api_key_here
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

7. **Install dependencies**
   ```bash
   npm install
   ```

8. **Start the development server**
   ```bash
   npm run dev
   ```

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
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── types/          # TypeScript type definitions
│   └── package.json
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── models/         # MongoDB models
│   │   ├── agents/         # AI agent implementations
│   │   └── utils/          # Utility functions
│   └── package.json
├── docker-compose.yml       # MongoDB container setup
├── .env.example            # Environment variables template
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

1. **Start a New Story**: Provide a premise, genre, or theme
2. **Character Creation**: Agent 1 develops characters and setting
3. **Story Writing**: Agent 2 writes chapters with branching paths
4. **Review & Refinement**: Agent 3 suggests improvements
5. **Interactive Reading**: Navigate through branching story paths

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- MongoDB for flexible document storage
- React and TypeScript communities for excellent tooling