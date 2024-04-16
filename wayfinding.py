import asyncio

async def way_finding(startX: int, startY: int, goalX: int, goalY: int, websocket):
    way_iterations = []

    while abs(startX - goalX) > 10 or abs(startY - goalY) > 10:
        await asyncio.sleep(1)

        if startX < goalX:
            startX += 10
        elif startX > goalX:
            startX -= 10

        if startY < goalY:
            startY += 10
        elif startY > goalY:
            startY -= 10

        way_iterations.append({"startX": startX, "startY": startY, "goalX": goalX, "goalY": goalY})
        await websocket.send_json({"startX": startX, "startY": startY})

    # way_iterations.append({"startX": startX, "startY": startY, "goalX": goalX, "goalY": goalY})

    return {"startX": startX, "startY": startY, "goalX": goalX, "goalY": goalY, "iterations": way_iterations}
