from typing import TypedDict, List
import operator
from langgraph.graph import StateGraph, END
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_community.chat_models import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

from .tools import search_web, read_page, save_note

# Define the Agent State
class AgentState(TypedDict):
    messages: List[str]
    research_data: List[str]
    report_content: str
    steps: List[str]
    goal: str

# Define the Nodes
def planner(state: AgentState):
    """Breaks down the user's goal into research steps."""
    goal = state["goal"]
    # Simple prompt - could be smarter
    prompt = f"Given the goal: '{goal}', list 3 specific research steps as a numbered list."
    
    # In a real app, use a model call here. For MVP, we mock or use a small model.
    # steps = llm.invoke(prompt).content.split('\n')
    steps = [f"Search for {goal}", "Read top result", "Summarize findings"]
    
    return {"steps": steps, "messages": [f"Plan created: {steps}"]}

def researcher(state: AgentState):
    """Executes search and reading based on the plan."""
    steps = state["steps"]
    data = []
    
    # Simple linear execution of first step for demo
    query = state["goal"] 
    search_result = search_web.invoke(query)
    data.append(f"Search Result for {query}: {search_result[:500]}...")
    
    return {"research_data": data, "messages": ["Research completed."]}

def writer(state: AgentState):
    """Synthesizes findings into a final report."""
    data = state["research_data"]
    goal = state["goal"]
    
    report = f"# Research Report: {goal}\n\n## Findings\n"
    for item in data:
        report += f"- {item}\n"
        
    return {"report_content": report, "messages": ["Report written."]}

# Define the Graph
workflow = StateGraph(AgentState)

workflow.add_node("planner", planner)
workflow.add_node("researcher", researcher)
workflow.add_node("writer", writer)

workflow.set_entry_point("planner")

workflow.add_edge("planner", "researcher")
workflow.add_edge("researcher", "writer")
workflow.add_edge("writer", END)

# Compile the graph
app = workflow.compile()
