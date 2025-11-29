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
        "title": "The Old Treasure Map",
        "desc": (
            "You find an old treasure map in your attic. It shows a path to hidden gold! "
            "The map has three starting locations marked: a dark cave, an old lighthouse, or a mysterious forest."
        ),
        "choices": {
            "go_cave": {
                "desc": "Go to the dark cave",
                "result_scene": "cave",
            },
            "go_lighthouse": {
                "desc": "Go to the old lighthouse",
                "result_scene": "lighthouse",
            },
            "go_forest": {
                "desc": "Go to the mysterious forest",
                "result_scene": "forest",
            },
        },
    },
    "sphere": {
        "title": "Stormglass Memory",
        "desc": (
            "The stormglass sphere is warm, humming faintly. When you lift it, an image flickers inside: "
            "a figure cloaked in sea-mist whispering, 'Find the Heartlight before the storms return.'\n\n"
            "On its base, a sigil glows dimly."
        ),
        "choices": {
            "take_sphere": {
                "desc": "Take the sphere with you.",
                "result_scene": "beacon_path",
                "effects": {"add_inventory": "cracked_stormglass", "add_journal": "Recovered a cracked stormglass sphere showing a warning vision."},
            },
            "leave_sphere": {
                "desc": "Leave the sphere on the sand.",
                "result_scene": "intro",
            },
        },
    },
    "beacon": {
        "title": "The Silent Beacon",
        "desc": (
            "The beacon tower leans slightly, its crystal core dark. Strange metallic roots curl across its base. "
            "There is a hatch partially buried in sand, a shattered lens on the ground, and faint footsteps leading inland."
        ),
        "choices": {
            "open_hatch": {
                "desc": "Try opening the buried hatch.",
                "result_scene": "hatch_fail",
            },
            "investigate_lens": {
                "desc": "Examine the shattered lens.",
                "result_scene": "lens",
            },
            "follow_footsteps": {
                "desc": "Follow the footsteps deeper into the isle.",
                "result_scene": "forest",
            },
        },
    },
    "beacon_path": {
        "title": "Path of Resonance",
        "desc": (
            "Holding the stormglass, you notice the lighthouse beacon responds—its dead crystal flickers. "
            "The sphere vibrates in your hand as if guiding you toward the tower’s base."
        ),
        "choices": {
            "sync_sphere_with_beacon": {
                "desc": "Press the stormglass sphere against the beacon core.",
                "result_scene": "beacon_awakened",
                "effects": {"add_journal": "Synced the stormglass with the dormant beacon."},
            },
            "follow_footsteps": {
                "desc": "Ignore the beacon and follow the footsteps toward the forest.",
                "result_scene": "forest",
            },
            "return_shore": {
                "desc": "Return to the glittering shoreline.",
                "result_scene": "intro",
            },
        },
    },
    "hatch_fail": {
        "title": "The Stubborn Hatch",
        "desc": (
            "The hatch refuses to budge. When you pull harder, a jolt of static arcs across your fingers. "
            "Something mechanical stirs beneath the sand."
        ),
        "choices": {
            "step_back": {
                "desc": "Retreat before anything emerges.",
                "result_scene": "intro",
            },
            "brace_for_emergence": {
                "desc": "Stand ready for whatever is waking beneath the tower.",
                "result_scene": "guardian_encounter",
            },
        },
    },
    "lens": {
        "title": "The Focus Lens",
        "desc": (
            "The shattered lens once belonged to the beacon's focusing mechanism. Its edges shimmer with "
            "residual stormlight. Beneath the fragments, you uncover a tiny metal shard engraved with a spiral rune."
        ),
        "choices": {
            "take_shard": {
                "desc": "Take the engraved shard.",
                "result_scene": "forest_path",
                "effects": {"add_inventory": "spiral_shard", "add_journal": "Found a spiral-rune shard beneath the lens."},
            },
            "leave_it": {
                "desc": "Leave the fragment untouched.",
                "result_scene": "beacon",
            },
        },
    },
    "beacon_awakened": {
        "title": "Beacon of Echoes",
        "desc": (
            "When sphere meets crystal, a resonant chime rings out. The beacon awakens briefly, projecting a holographic map "
            "showing a glowing point labeled 'Heartlight'. The image shatters like mist.\n\n"
            "A whisper follows: 'The isle remembers.'"
        ),
        "choices": {
            "descend_hatch": {
                "desc": "Try the hatch again now that the beacon is active.",
                "result_scene": "undercell",
            },
            "head_forest": {
                "desc": "Take the clue and head into the glowing forest.",
                "result_scene": "forest",
            },
        },
    },
    "forest": {
        "title": "The Luminous Mangroves",
        "desc": (
            "The mangrove forest glows with bioluminescent veins. Strange mechanical insects hum overhead. "
            "A small stone altar stands in a clearing, holding a brass ring and a sealed note."
        ),
        "choices": {
            "take_ring": {
                "desc": "Pick up the brass ring.",
                "result_scene": "ring_scene",
                "effects": {"add_inventory": "brass_ring", "add_journal": "Collected a brass ring from the mangrove altar."},
            },
            "read_note": {
                "desc": "Unseal and read the note.",
                "result_scene": "forest_note",
                "effects": {"add_journal": "Read a note warning: 'Trust not the hollow storm.'"},
            },
            "return_shore": {
                "desc": "Head back toward the shoreline.",
                "result_scene": "intro",
            },
        },
    },
    "forest_note": {
        "title": "Message in Twilight",
        "desc": (
            "The note speaks in elegant script: 'The Heartlight sleeps beneath the isle. Only resonance awakens truth.'"
        ),
        "choices": {
            "search_for_path": {
                "desc": "Search around for a hidden path.",
                "result_scene": "undercell",
            },
            "return_forest": {
                "desc": "Return to the altar.",
                "result_scene": "forest",
            },
        },
    },
    "ring_scene": {
        "title": "Ring of Recall",
        "desc": (
            "The ring emits a faint glow, revealing footprints of someone who passed recently. They lead downward "
            "toward a hidden root tunnel."
        ),
        "choices": {
            "follow_tunnel": {
                "desc": "Follow the hidden root tunnel.",
                "result_scene": "undercell",
            },
            "step_back": {
                "desc": "Return to the forest clearing.",
                "result_scene": "forest",
            },
        },
    },
    "guardian_encounter": {
        "title": "Guardian of the Hatch",
        "desc": (
            "A crystalline guardian rises from the sand, its voice a mix of wind and static. "
            "'Access restricted. Identify your resonance.' It raises a faceted blade-arm."
        ),
        "choices": {
            "attempt_resonance": {
                "desc": "Try to mimic the stormglass hum.",
                "result_scene": "guardian_pass",
            },
            "flee": {
                "desc": "Retreat before the guardian attacks.",
                "result_scene": "intro",
            },
        },
    },
    "guardian_pass": {
        "title": "A Harmonic Success",
        "desc": (
            "Your tone matches the faint hum of the stormglass. The guardian freezes, then slowly steps aside. "
            "The hatch lights up with a spiraling symbol."
        ),
        "choices": {
            "descend": {
                "desc": "Enter the hatch and climb below.",
                "result_scene": "undercell",
            },
            "leave_guardian": {
                "desc": "Retreat while the guardian remains dormant.",
                "result_scene": "intro",
            },
        },
    },
    "undercell": {
        "title": "The Heartlight Undercell",
        "desc": (
            "You descend into a vast cavern of crystal columns and metallic vines. At the center floats a pulsating core—"
            "the Heartlight. Its glow brightens as you approach.\n\n"
            "Beside it rests a pedestal containing a small prism and an engraved locket."
        ),
        "choices": {
            "take_prism": {
                "desc": "Take the resonance prism.",
                "result_scene": "ending",
                "effects": {"add_inventory": "resonance_prism", "add_journal": "Retrieved the resonance prism, source of Heartlight focus."},
            },
            "take_locket": {
                "desc": "Examine the engraved locket.",
                "result_scene": "ending",
                "effects": {"add_inventory": "engraved_locket", "add_journal": "Collected an ancient locket left by a previous seeker."},
            },
            "retreat": {
                "desc": "Retreat from the undercell.",
                "result_scene": "intro",
            },
        },
    },
    "ending": {
        "title": "A Light Restored",
        "desc": (
            "As you touch the artifact, the Heartlight pulses in agreement. A wave of warmth sweeps outward, "
            "restoring clarity to the isle. You feel a quiet victory settle around you.\n\n"
            "Your role in the Stormglass Isles is only beginning, but this chapter closes."
        ),
        "choices": {
            "end_session": {
                "desc": "Conclude the session.",
                "result_scene": "intro",
            },
            "continue_exploring": {
                "desc": "Return to the shoreline and continue wandering.",
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
        f"Welcome, {userdata.player_name}! Let's go on a treasure hunt! "
        f"Your goal: find the hidden treasure in just 5 choices. Good luck!\n\n"
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
        "Hello! I'm Aurek, your treasure hunt guide! "
        "What's your name, adventurer?",
        allow_interruptions=True
    )

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
