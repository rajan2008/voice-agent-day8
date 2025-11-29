import json
import logging
import os
import asyncio
import uuid
from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Dict, Optional, Annotated

from dotenv import load_dotenv
from pydantic import Field
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    JobProcess,
    RoomInputOptions,
    WorkerOptions,
    cli,
    function_tool,
    RunContext,
)

from livekit.plugins import murf, silero, google, deepgram, noise_cancellation
from livekit.plugins.turn_detector.multilingual import MultilingualModel

# -------------------------
# Logging
# -------------------------
logger = logging.getLogger("voice_game_master")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(message)s"))
logger.addHandler(handler)

load_dotenv(".env.local")

# -------------------------
# SIMPLE TREASURE HUNT - 5 Choices to Win
# -------------------------
WORLD = {
    "intro": {
        "title": "The Fallen Kingdom",
        "desc": (
            "You stand before the ruins of Valdris, once the greatest kingdom in the realm. "
            "A dark sorcerer has stolen the Crown of Eternity, plunging the land into eternal night. "
            "Ancient texts speak of three paths to the Shadow Citadel where the crown is held: "
            "the Crimson Catacombs beneath the old palace, the Whispering Woods to the east, "
            "or the Frozen Peaks where dragons once nested."
        ),
        "choices": {
            "enter_catacombs": {
                "desc": "Descend into the Crimson Catacombs",
                "result_scene": "catacombs",
            },
            "enter_woods": {
                "desc": "Journey through the Whispering Woods",
                "result_scene": "woods",
            },
            "climb_peaks": {
                "desc": "Scale the Frozen Peaks",
                "result_scene": "peaks",
            },
        },
    },
    "catacombs": {
        "title": "The Crimson Catacombs",
        "desc": (
            "Ancient bones line the walls, and the air reeks of decay. "
            "You hear whispers echoing from deeper within. Two passages lie ahead: "
            "one marked with royal seals, the other carved with warning runes in an old tongue."
        ),
        "choices": {
            "royal_passage": {
                "desc": "Take the passage with royal seals",
                "result_scene": "shadow_gate",
            },
            "runed_passage": {
                "desc": "Enter the passage with warning runes",
                "result_scene": "dead_end",
            },
        },
    },
    "woods": {
        "title": "The Whispering Woods",
        "desc": (
            "The trees seem alive, their branches reaching toward you like skeletal fingers. "
            "Ghostly voices call your name from all directions. You spot two trails: "
            "one illuminated by strange blue fireflies, another shrouded in complete darkness."
        ),
        "choices": {
            "firefly_trail": {
                "desc": "Follow the blue fireflies",
                "result_scene": "shadow_gate",
            },
            "dark_trail": {
                "desc": "Brave the pitch-black trail",
                "result_scene": "dead_end",
            },
        },
    },
    "peaks": {
        "title": "The Frozen Peaks",
        "desc": (
            "Howling winds cut through you like blades of ice. Ancient dragon bones jut from the snow. "
            "You discover two paths carved into the mountainside: "
            "one leading to a collapsed dragon's lair, another to a mysterious ice cave glowing with ethereal light."
        ),
        "choices": {
            "ice_cave": {
                "desc": "Enter the glowing ice cave",
                "result_scene": "shadow_gate",
            },
            "dragon_lair": {
                "desc": "Explore the collapsed dragon's lair",
                "result_scene": "dead_end",
            },
        },
    },
    "dead_end": {
        "title": "A Fatal Mistake",
        "desc": (
            "The path crumbles beneath your feet. Shadow creatures emerge from the darkness, "
            "forcing you to retreat. You must find another way."
        ),
        "choices": {
            "retreat": {
                "desc": "Retreat and try a different path",
                "result_scene": "intro",
            },
        },
    },
    "shadow_gate": {
        "title": "The Shadow Gate",
        "desc": (
            "You emerge before a massive obsidian gate, pulsing with dark energy. "
            "The Shadow Citadel looms beyond. Two guardian statues flank the entrance. "
            "One holds a sword, the other a shield. Ancient text reads: 'Only the worthy may pass.'"
        ),
        "choices": {
            "touch_sword": {
                "desc": "Touch the statue holding the sword",
                "result_scene": "trial_of_courage",
            },
            "touch_shield": {
                "desc": "Touch the statue holding the shield",
                "result_scene": "dead_end",
            },
            "force_gate": {
                "desc": "Try to force the gate open",
                "result_scene": "dead_end",
            },
        },
    },
    "trial_of_courage": {
        "title": "Trial of Courage",
        "desc": (
            "The sword statue comes alive! It challenges you to prove your worth. "
            "A spectral blade materializes in your hand. The guardian attacks with blinding speed. "
            "You must choose your fighting stance."
        ),
        "choices": {
            "defensive_stance": {
                "desc": "Take a defensive stance and wait for an opening",
                "result_scene": "throne_room",
            },
            "aggressive_attack": {
                "desc": "Launch an aggressive assault",
                "result_scene": "dead_end",
            },
        },
    },
    "throne_room": {
        "title": "The Dark Throne Room",
        "desc": (
            "You've passed the trial! The gate opens to reveal the sorcerer's throne room. "
            "The Crown of Eternity sits on a pedestal, radiating pure light in this realm of darkness. "
            "The sorcerer himself stands before you, dark magic crackling around his hands. "
            "'You dare challenge me?' he snarls."
        ),
        "choices": {
            "grab_crown": {
                "desc": "Ignore him and grab the Crown of Eternity",
                "result_scene": "victory",
            },
            "fight_sorcerer": {
                "desc": "Engage the sorcerer in combat first",
                "result_scene": "dead_end",
            },
            "negotiate": {
                "desc": "Try to negotiate with the sorcerer",
                "result_scene": "dead_end",
            },
        },
    },
    "victory": {
        "title": "The Kingdom Restored",
        "desc": (
            "You seize the Crown of Eternity! Brilliant light explodes from it, banishing the darkness. "
            "The sorcerer screams as his power dissolves into nothingness. "
            "Dawn breaks over Valdris for the first time in years. The kingdom is saved, "
            "and you are hailed as the legendary hero who restored the light. "
            "Your name will echo through history forever!"
        ),
        "choices": {
            "new_adventure": {
                "desc": "Begin a new adventure",
                "result_scene": "intro",
            },
        },
    },
}

# ------------------------------------------------
# Session Data
# ------------------------------------------------
@dataclass
class Userdata:
    player_name: Optional[str] = None
    current_scene: str = "intro"
    history: List[Dict] = field(default_factory=list)
    journal: List[str] = field(default_factory=list)
    inventory: List[str] = field(default_factory=list)
    named_npcs: Dict[str, str] = field(default_factory=dict)
    choices_made: List[str] = field(default_factory=list)
    session_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    started_at: str = field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")

# ------------------------------------------------
# Helper Functions
# ------------------------------------------------
def scene_text(scene_key: str, userdata: Userdata) -> str:
    scene = WORLD.get(scene_key)
    if not scene:
        return "You stand in a blank fragment of unreality. What do you do?"

    desc = f"{scene['desc']}\n\nChoices:\n"
    for cid, cmeta in scene.get("choices", {}).items():
        desc += f"- {cmeta['desc']} (say: {cid})\n"
    desc += "\nWhat do you do?"
    return desc

def apply_effects(effects: dict, userdata: Userdata):
    if not effects:
        return
    if "add_journal" in effects:
        userdata.journal.append(effects["add_journal"])
    if "add_inventory" in effects:
        userdata.inventory.append(effects["add_inventory"])

def summarize_scene_transition(old_scene: str, action_key: str, result_scene: str, userdata: Userdata) -> str:
    entry = {
        "from": old_scene,
        "action": action_key,
        "to": result_scene,
        "time": datetime.utcnow().isoformat() + "Z",
    }
    userdata.history.append(entry)
    userdata.choices_made.append(action_key)
    return f"You chose '{action_key}'."

# ------------------------------------------------
# Agent Tools
# ------------------------------------------------
@function_tool
async def start_adventure(
    ctx: RunContext[Userdata],
    player_name: Annotated[str, Field(description="Player name")] = "traveler",
) -> str:
    userdata = ctx.userdata
    userdata.player_name = player_name
    userdata.current_scene = "intro"
    userdata.history = []
    userdata.journal = []
    userdata.inventory = []
    userdata.named_npcs = {}
    userdata.choices_made = []
    userdata.session_id = str(uuid.uuid4())[:8]
    userdata.started_at = datetime.utcnow().isoformat() + "Z"

    opening = (
        f"Welcome, {userdata.player_name}! The fate of the kingdom rests in your hands. "
        f"A dark sorcerer has stolen the Crown of Eternity. You must reclaim it and restore the light!\n\n"
        + scene_text("intro", userdata)
    )
    return opening

@function_tool
async def get_scene(ctx: RunContext[Userdata]) -> str:
    userdata = ctx.userdata
    return scene_text(userdata.current_scene, userdata)

@function_tool
async def player_action(
    ctx: RunContext[Userdata],
    action: Annotated[str, Field(description="Player action or choice code")],
) -> str:
    userdata = ctx.userdata
    current = userdata.current_scene
    scene = WORLD.get(current)
    action_text = (action or "").strip().lower()

    chosen_key = None

    # Exact key
    if action_text in (scene.get("choices") or {}):
        chosen_key = action_text

    # Fuzzy match
    if not chosen_key:
        for cid, cmeta in scene.get("choices", {}).items():
            if cid in action_text or any(w in action_text for w in cmeta["desc"].lower().split()[:4]):
                chosen_key = cid
                break

    # Keyword fallback
    if not chosen_key:
        for cid, cmeta in scene.get("choices", {}).items():
            for keyword in cmeta["desc"].lower().split():
                if keyword and keyword in action_text:
                    chosen_key = cid
                    break
            if chosen_key:
                break

    if not chosen_key:
        return (
            "I didn't understand that action. Try using one of the listed choices.\n\n"
            + scene_text(current, userdata)
        )

    choice_meta = scene["choices"][chosen_key]
    result_scene = choice_meta["result_scene"]

    apply_effects(choice_meta.get("effects", {}), userdata)

    _note = summarize_scene_transition(current, chosen_key, result_scene, userdata)

    userdata.current_scene = result_scene

    next_desc = scene_text(result_scene, userdata)

    reply = (
        "The Game Master speaks softly:\n\n"
        f"{_note}\n\n{next_desc}"
    )
    return reply

@function_tool
async def show_journal(ctx: RunContext[Userdata]) -> str:
    userdata = ctx.userdata
    lines = []
    lines.append(f"Session: {userdata.session_id} | Started: {userdata.started_at}")
    if userdata.player_name:
        lines.append(f"Player: {userdata.player_name}")
    if userdata.journal:
        lines.append("\nJournal entries:")
        for j in userdata.journal:
            lines.append(f"- {j}")
    else:
        lines.append("\nJournal is empty.")
    if userdata.inventory:
        lines.append("\nInventory:")
        for i in userdata.inventory:
            lines.append(f"- {i}")
    else:
        lines.append("\nNo items in inventory.")
    lines.append("\nRecent choices:")
    for h in userdata.history[-6:]:
        lines.append(f"- {h['time']} | {h['from']} -> {h['to']} via {h['action']}")
    lines.append("\nWhat do you do?")
    return "\n".join(lines)

@function_tool
async def restart_adventure(ctx: RunContext[Userdata]) -> str:
    userdata = ctx.userdata
    userdata.current_scene = "intro"
    userdata.history = []
    userdata.journal = []
    userdata.inventory = []
    userdata.choices_made = []
    userdata.session_id = str(uuid.uuid4())[:8]
    userdata.started_at = datetime.utcnow().isoformat() + "Z"
    return (
        "The isle resets around you. A new tide washes the sand.\n\n"
        + scene_text("intro", userdata)
    )

# ------------------------------------------------
# The Agent
# ------------------------------------------------
class GameMasterAgent(Agent):
    def __init__(self):
        instructions = """
        You are 'Aurek', a friendly Game Master for a simple treasure hunt adventure.
        
        IMPORTANT RULES:
        1. First, greet the player and ask for their name
        2. When they tell you their name, call start_adventure with their name
        3. ALWAYS read out ALL the available choices clearly before asking what they want to do
        4. Say each choice option clearly: "You can: [choice 1], [choice 2], or [choice 3]"
        5. Then ask "What do you choose?"
        6. Use player_action to handle their choice
        
        Keep descriptions SHORT (1-2 sentences). Always list ALL choices before asking for their decision.
        Be encouraging and friendly. The goal is to find treasure in 5 choices!
        """
        super().__init__(
            instructions=instructions,
            tools=[start_adventure, get_scene, player_action, show_journal, restart_adventure],
        )

# ------------------------------------------------
# Prewarm & Entrypoint
# ------------------------------------------------
def prewarm(proc: JobProcess):
    try:
        proc.userdata["vad"] = silero.VAD.load()
    except Exception:
        logger.warning("VAD prewarm failed.")

async def entrypoint(ctx: JobContext):
    ctx.log_context_fields = {"room": ctx.room.name}
    logger.info("🌀 Starting Stormglass Isles Voice Game Master")

    userdata = Userdata()

    session = AgentSession(
        stt=deepgram.STT(model="nova-3"),
        llm=google.LLM(model="gemini-2.5-flash"),
        tts=murf.TTS(
            voice="en-US-marcus",
            style="Conversational",
            text_pacing=True,
        ),
        turn_detection=MultilingualModel(),
        vad=ctx.proc.userdata.get("vad"),
        userdata=userdata,
    )

    await session.start(
        agent=GameMasterAgent(),
        room=ctx.room,
        room_input_options=RoomInputOptions(noise_cancellation=noise_cancellation.BVC()),
    )

    await ctx.connect()
    
    # Send initial greeting asking for player name
    await session.say(
        "Greetings, brave warrior! I am Aurek, chronicler of legends. "
        "The kingdom needs a hero. What is your name?",
        allow_interruptions=True
    )

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
