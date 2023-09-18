FROM golang:alpine as backendbuilder

WORKDIR /src
COPY . .

RUN go mod download
RUN ["go", "build",  "-o", "go-chatroom", "."]

EXPOSE 3000

FROM node:alpine as frontendbuilder

WORKDIR /src
COPY ./frontend .
RUN npm install
RUN npm run build

FROM scratch
WORKDIR /app

COPY --from=frontendbuilder /src/dist /app/frontend/dist
COPY --from=backendbuilder /src/go-chatroom /app
CMD ["./go-chatroom"]
