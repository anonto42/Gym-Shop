skill-exchange-platform/
├── README.md
├── .env.example
├── .gitignore
├── docker-compose.yml          # For all services + infrastructure
├── package.json                # Optional if using workspace tools
├── infra/                      # Infrastructure configs (db, kafka, redis)
│   ├── kafka/
│   ├── postgres/
│   ├── mongo/
│   ├── redis/
│   └── coturn/
│       └── turnserver.conf
│
├── apps/
│   ├── api-gateway/            # (Optional) Node.js reverse proxy/router
│   ├── user-service/           # Node.js + MongoDB + Redis
│   ├── post-service/           # FastAPI + PostgreSQL + Kafka
│   ├── chat-service/           # Spring Boot + Kafka + Redis
│   ├── notification-service/   # Node.js + Kafka + Redis (for push)
│   ├── media-service/          # Node.js (WebSocket/Socket.IO signaling)
│   ├── webrtc-server/          # (Optional) Mediasoup or Jitsi
│
├── clients/
│   ├── web/                    # React.js app
│   ├── mobile/                 # React Native app
│   └── desktop/                # Electron app
│
├── libs/                       # Shared code (schemas, interfaces, tokens)
│   ├── auth/                   # JWT utils, shared middlewares
│   ├── constants/              # Enums, status codes
│   ├── events/                 # Kafka topics, message formats
│   └── utils/
│
└── scripts/                    # CLI utilities, init scripts
