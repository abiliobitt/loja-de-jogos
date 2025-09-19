# NestJS Packaging Service

Microservice that receives orders (pedidos) and returns how products should be packed into available cardboard boxes.
- Node.js + NestJS (minimal)
- Swagger UI available at `/api-docs`
- Docker-ready

## How to run (development)
1. `npm install`
2. `npm run start:dev`
3. Open `http://localhost:3000/api-docs`

## How to build and run production
1. `npm install`
2. `npm run build`
3. `npm start`

## Docker
Build:
```
docker build -t nestjs-packaging .
```
Run:
```
docker run -p 3000:3000 nestjs-packaging
```

## Endpoint
POST `/pack`  
Body: `{ "pedidos": [ ... ] }` (see example in problem statement)  
Response: `{ "pedidos": [ { "pedido_id": ..., "caixas": [ ... ] } ] }`

