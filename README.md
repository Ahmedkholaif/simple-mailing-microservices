
# Project Overview

A simple Mail sending microservices.




# Tech Stack

**Client:** React, mui

**Server - main :** Node, Nestjs, MySQL

**mailing service :** Node, Nestjs with nodeMailer

**Queue :** RabbitMQ

Runnig over Docker Compose



## Run Locally using docker compose
---
Clone the project

```bash
  git clone https://github.com/Ahmedkholaif/simple-mailing-microservices.git
```

Go to the project directory

```bash
  cd simple-mailing-microservices
```

you may need to install dev dependencies for local or single development for the first time

```bash
  cd frontend && yarn
  cd ../main-backend && yarn
  cd ../mailing-service && yarn && cd ..
```

Start all services with docker compose

```bash
  docker-compose up --build --remove-orphans -d
```
you can remove -d to enable logs
or use

```bash
  docker-compose logs -f
```

stop with

```bash
  docker-compose  down
```
services will be running on

Frontend
```bash
  http://localhost:3020
```

Main Backend Apis
```bash
  http://localhost:3000/api
```

RabbitMQ UI
```bash
  http://localhost:15672

  username: rabbit
  password: rabbit_pass
```