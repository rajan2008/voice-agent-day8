# 🎲 Day 8 - Voice Game Master (D&D-Style Adventure)

A **fully-featured voice-powered D&D-style Game Master** with advanced features including multiple universes, game state management, and interactive mechanics.

## ✨ Features

### Primary Features (Required)
- ✅ **Voice-Driven Gameplay**: Speak to interact with the Game Master
- ✅ **Dynamic Storytelling**: GM describes scenes and responds to player actions
- ✅ **Chat History**: Maintains continuity throughout the adventure
- ✅ **Interactive UI**: Shows GM messages and player transcriptions
- ✅ **Session Structure**: 8-15 exchange adventures with mini-arcs

### Advanced Features (Bonus)
- ✅ **JSON World State Management**: Complete game state tracking
- ✅ **Character Sheet & Inventory**: Health, stats, and item management
- ✅ **D&D-Style Dice Mechanics**: Rolls with modifiers and outcomes
- ✅ **Multiple Universes**: 3 themed adventures (Fantasy, Cyberpunk, Space)
- ✅ **Enhanced UI**: Game state panel, universe selector, animations

## 🚀 Quick Start

Open 3 separate terminals and run:

**Terminal 1: LiveKit Server**
```bash
cd voice-agent-day8\livekit
livekit-server --dev
```

**Terminal 2: Backend Agent**
```bash
cd voice-agent-day8\backend
uv run python src/agent.py dev
```

**Terminal 3: Frontend**
```bash
cd voice-agent-day8\frontend
pnpm dev
```

Then open: **http://localhost:3000**

## 📚 Documentation

**Start Here:**
- 📖 **[README_FIRST.md](README_FIRST.md)** - Quick overview and getting started
- 🚀 **[QUICK_START.md](QUICK_START.md)** - Get running in 3 steps

**Feature Documentation:**
- ✨ **[DAY8_FEATURES.md](DAY8_FEATURES.md)** - Complete feature list and details
- 🎮 **[EXAMPLE_GAMEPLAY.md](EXAMPLE_GAMEPLAY.md)** - Gameplay scenarios and examples
- 🎨 **[UI_GUIDE.md](UI_GUIDE.md)** - User interface guide

**Technical Documentation:**
- 🏗️ **[ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)** - System architecture
- 📝 **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What was built
- ✅ **[COMPLETION_CHECKLIST.md](COMPLETION_CHECKLIST.md)** - Testing and completion guide

## Setup

### Prerequisites

- Python 3.9+
- Node.js 18+
- pnpm
- uv (Python package manager)

### Installation

1. Install dependencies:
```bash
# Backend
cd backend
uv sync

# Frontend
cd frontend
pnpm install
```

2. Configure environment variables:
   - Backend: `backend/.env.local`
   - Frontend: `frontend/.env.local`

3. Start the application:
```bash
# From root directory
./start_app.sh    # Linux/Mac
start_app.bat     # Windows
```

This will start:
- LiveKit server on `ws://127.0.0.1:7880`
- Backend agent
- Frontend on `http://localhost:3000`

## How to Play

1. Open `http://localhost:3000` in your browser
2. Click "Connect" to start the voice session
3. Listen to the Game Master describe the scene
4. Speak your actions when prompted
5. Continue the adventure!

## Game Master Settings

The GM persona is configured in `backend/src/agent.py`:
- Universe: Fantasy adventure with dragons and magic
- Tone: Dramatic and engaging
- Style: Interactive storytelling with player choices

## Project Structure

```
voice-agent-day8/
├── backend/          # Python agent with LiveKit
│   └── src/
│       └── agent.py  # Game Master logic
├── frontend/         # Next.js UI
│   ├── app/
│   └── components/
├── livekit/          # LiveKit server binary
└── start_app.sh      # Startup script
```

## Technologies

- **LiveKit**: Real-time voice communication
- **Murf AI**: Text-to-speech (Falcon model)
- **OpenAI**: LLM for Game Master responses
- **Next.js**: Frontend framework
- **Python**: Backend agent


## 🎯 What's Included

### Backend (Python)
- **GameState Class**: Tracks player, location, NPCs, events, quests
- **GameMaster Agent**: AI-powered GM with function calling
- **9 AI Functions**: Dice rolls, health, inventory, location, NPCs, events
- **3 Universes**: Fantasy, Cyberpunk, Space Opera with unique prompts

### Frontend (React/Next.js)
- **Universe Selector**: Choose your adventure theme
- **Game State Panel**: Real-time character stats, inventory, location
- **Enhanced Welcome**: Beautiful onboarding with universe selection
- **Session View**: Chat transcript with game state display

### Documentation
- **7 Markdown Files**: Complete guides and examples
- **~2000 Lines**: Comprehensive documentation
- **Examples**: Gameplay scenarios for all universes
- **Checklists**: Testing and completion guides

## 🎮 How to Play

1. **Choose Universe**: Fantasy, Cyberpunk, or Space
2. **Connect**: Allow microphone access
3. **Speak Actions**: "I examine the gate", "I attack", etc.
4. **Listen**: Hear GM responses with dramatic narration
5. **Watch State**: Monitor health, inventory, location in real-time

## 🎲 Game Mechanics

### Dice Rolls
- D20 system with modifiers
- Attribute-based bonuses (STR, INT, LUCK)
- Critical success/failure (nat 1/20)
- Success tiers (15+, 10-14, <10)

### Character System
- Health tracking (0-100 HP)
- Status effects (Healthy/Injured/Critical/Dead)
- Attributes (Strength, Intelligence, Luck)
- Inventory management

### World State
- Location tracking
- NPC relationships
- Event history
- Quest system (foundation)

## 🌟 Universes

### 🏰 Classic Fantasy
- Dragons, magic, ancient mysteries
- Medieval fantasy setting
- Temple exploration adventure
- Dramatic narration

### 🌃 Cyberpunk City
- Neon-lit megacity
- Hackers and corporate espionage
- Tech-based challenges
- Dystopian atmosphere

### 🚀 Space Opera
- Galactic exploration
- Alien civilizations
- Space battles and mysteries
- Epic sci-fi adventure

## 🛠️ Technology Stack

### Backend
- **LiveKit Agents SDK** - Voice agent framework
- **Google Gemini 2.0 Flash** - Language model
- **Murf AI** - Text-to-speech (en-US-terrell)
- **Deepgram** - Speech-to-text (nova-2-general)
- **Silero VAD** - Voice activity detection

### Frontend
- **Next.js 15** - React framework
- **React 19** - UI library
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **LiveKit Components** - Real-time communication
- **Phosphor Icons** - Icon library

## 📊 Statistics

- **~3000 Lines**: Total code and documentation
- **5/5 Advanced Features**: All bonus goals completed
- **100% Primary Requirements**: All required features met
- **3 Universes**: Complete with unique prompts
- **9 Functions**: AI-callable game mechanics
- **7 Documentation Files**: Comprehensive guides

## 🎬 Recording for LinkedIn

### What to Show (3-5 minutes)
1. Universe selection screen
2. Choose a universe
3. Connect and hear greeting
4. Speak 3-5 actions
5. Show game state panel
6. Demonstrate inventory update
7. Show dice roll result
8. Complete mini-quest

### Post Template
```
🎲 Day 8 Complete: Voice Game Master! ✨

Just built an AI-powered D&D Game Master using voice agents!

Features:
✅ 3 unique universes (Fantasy, Cyberpunk, Space)
✅ Real-time game state tracking
✅ Character stats & inventory system
✅ D&D-style dice mechanics
✅ Interactive voice storytelling

Built with the fastest TTS API - Murf Falcon 🚀

This is part of the Murf AI Voice Agent Challenge!

@Murf AI
#MurfAIVoiceAgentsChallenge #10DaysofAIVoiceAgents

[Video attached]
```

## 🐛 Troubleshooting

### No Audio from GM
- Check `MURF_API_KEY` in `backend/.env.local`
- Restart backend agent

### Can't Hear Me
- Check microphone permissions in browser
- Check `DEEPGRAM_API_KEY` in `backend/.env.local`
- Speak clearly and wait for response

### Connection Failed
- Wait 10 seconds after starting services
- Refresh browser page
- Check all 3 terminal windows are running

### Game State Not Updating
- Check browser console for errors
- Check backend logs for function calls
- Verify LiveKit connection is stable

## 📖 Learning Outcomes

By completing Day 8, you've learned:
- ✅ Building stateful voice agents
- ✅ Implementing AI function calling
- ✅ Managing complex game state
- ✅ Creating multiple agent personas
- ✅ Building interactive real-time UIs
- ✅ Integrating multiple voice APIs
- ✅ Designing game mechanics
- ✅ Creating immersive experiences

## 🏆 Completion Status

- ✅ **Primary Goal**: D&D-style voice GM - COMPLETE
- ✅ **Advanced Goal 1**: JSON world state - COMPLETE
- ✅ **Advanced Goal 2**: Character sheet & inventory - COMPLETE
- ✅ **Advanced Goal 3**: Dice mechanics - COMPLETE
- ✅ **Advanced Goal 4**: Multiple universes - COMPLETE
- ✅ **Advanced Goal 5**: Enhanced UI - COMPLETE
- ✅ **Documentation**: Comprehensive guides - COMPLETE

## 🎉 Next Steps

1. ✅ Run the project (`start_app.bat`)
2. ✅ Test all 3 universes
3. ✅ Play through adventures
4. ✅ Record demo video
5. ✅ Post on LinkedIn
6. ✅ Celebrate your achievement! 🎊

## 📞 Support

For issues or questions:
1. Check `TROUBLESHOOTING.md`
2. Review `QUICK_START.md`
3. Read `DAY8_FEATURES.md`
4. Check `EXAMPLE_GAMEPLAY.md`

## 🌟 Highlights

### What Makes This Special
- **Production-Ready**: Clean architecture and code
- **Fully Featured**: All primary + advanced goals
- **Well Documented**: 7 comprehensive guides
- **Beautiful UI**: Modern design with animations
- **Multiple Universes**: 3 complete themed adventures
- **Game Mechanics**: D&D-style dice and stats
- **Real-time Updates**: Live game state display

### Technical Achievement
- Stateful agent with persistent game state
- Function calling for game mechanics
- Multiple agent personas via prompts
- Real-time UI synchronization
- Comprehensive error handling
- Scalable architecture

## 🚀 Ready to Adventure?

Everything is set up and ready to go:
- ✅ Code is complete and tested
- ✅ Documentation is comprehensive
- ✅ Examples are provided
- ✅ UI is polished
- ✅ Features are working

**Time to start your epic adventure!** 🎲✨

---

## 📝 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- **LiveKit** - Real-time voice infrastructure
- **Murf AI** - High-quality text-to-speech
- **Google Gemini** - Powerful language model
- **Deepgram** - Accurate speech-to-text
- **Murf AI Voice Agent Challenge** - Inspiration and motivation

---

**Built with ❤️ for the Murf AI Voice Agent Challenge**

🎲 **Roll for initiative!** ✨
