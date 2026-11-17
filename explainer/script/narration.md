# Narration: How ArchiTech works

English, about 150 words, 76 seconds. Times are when each line starts.

## 1. Upload (0:00)

- 0:00.5 ArchiTech starts with something flat: an image of a floor plan.
- 0:05.0 Upload it and the app takes it from there.

## 2. Extraction (0:10)

- 0:10.5 An Express backend sends the image to the Claude API.
- 0:15.0 Claude returns walls, doors, windows, stairs, and furniture as structured JSON.
- 0:20.5 That output is validated before anything is drawn.

## 3. 3D model (0:24)

- 0:24.5 React Three Fiber builds the model, up to five floors high.
- 0:30.0 Each floor gets a slab and a stairwell opening, and the roof can be flat, gable, or hip.

## 4. Cut and walk (0:37)

- 0:37.5 A clipping plane cuts the model open so you can see inside.
- 0:42.5 Or walk through it in first person at an eye height of 1.65 meters, with wall collision and stairs between floors.

## 5. Fire route (0:50)

- 0:50.5 Mark where a fire is, and Dijkstra's algorithm searches the floor grid.
- 0:56.0 It routes around the fire to an outside door, or to a window if the stairs are cut off.

## 6. Bill of materials (1:03)

- 1:03.5 Then comes a bill of materials, with quantities per floor and estimated costs.
- 1:08.5 It exports as CSV, DXF, or JSON.
- 1:12.0 186 automated tests cover the geometry, the routing, and the file import.
