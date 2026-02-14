import asyncio
import json
from typing import Dict, Any, AsyncGenerator
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
import uvicorn
from researcher.graph import app as research_graph

app = FastAPI()

# Store active runs (simplistic implementation)
active_runs = {}

@app.post("/run")
async def run_agent(request: Request):
    """Starts a new research session."""
    data = await request.json()
    goal = data.get("goal")
    config = data.get("config", {})
    
    # Simple unique ID
    run_id = f"run_{len(active_runs) + 1}"
    
    # Store initial state
    active_runs[run_id] = {
        "goal": goal,
        "config": config,
        "status": "pending",
        "messages": []
    }
    
    return {"run_id": run_id, "message": "Research started.", "status": "pending"}

@app.get("/stream/{run_id}")
async def stream_agent(run_id: str):
    """Streams events from the graph execution."""
    if run_id not in active_runs:
        return {"error": "Run not found"}
        
    goal = active_runs[run_id]["goal"]
    
    async def event_generator():
        # Initialize state with user goal
        initial_state = {
            "goal": goal, 
            "messages": [], 
            "research_data": [], 
            "report_content": "", 
            "steps": []
        }
        
        try:
            # Execute the graph
            # We iterate over the stream of updates from the graph
            async for event in research_graph.astream(initial_state):
                # Format event as SSE data
                # event is a dict of node_name -> state_update
                formatted_data = json.dumps(event, default=str)
                yield f"data: {formatted_data}\n\n"
                
            yield "data: [DONE]\n\n"
        except Exception as e:
            error_data = json.dumps({"error": str(e)})
            yield f"data: {error_data}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
