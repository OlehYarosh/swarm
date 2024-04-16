from fastapi import FastAPI, Request, WebSocket
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from typing import List
from pydantic import BaseModel
from wayfinding import way_finding

app = FastAPI()
obstacles = []
websocket_connections = set()

class WayFindingParams(BaseModel):
    startX: int
    startY: int
    goalX: int
    goalY: int

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="static/templates")

@app.get("/", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/favicon.ico")
async def favicon():
    return

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    websocket_connections.add(websocket)
    try:
        while True:
            await websocket.receive_text()
    finally:
        websocket_connections.remove(websocket)

@app.post("/process-data/")
async def process_data():
    pass

@app.post("/update_obstacles/")
async def update_obstacles(obstacles_data: List[dict]):
    global obstacles
    obstacles = obstacles_data
    print("Obstacles received:", obstacles)
    for websocket in websocket_connections:
        await websocket.send_json(obstacles)
    return JSONResponse(content={"message": "Obstacles updated successfully", "obstacles": obstacles})

@app.post("/start-way-finding/")
async def start_way_finding(params: WayFindingParams):
    websocket = next(iter(websocket_connections))
    way_result = await way_finding(params.startX, params.startY, params.goalX, params.goalY, websocket)
    return JSONResponse(content={"message": "Way finding started", "way": way_result})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
