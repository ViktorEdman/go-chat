FROM golang:alpine as backendbuilder

WORKDIR /src
COPY go.mod go.sum ./

RUN go mod download
COPY *.go ./
RUN ["go", "build",  "-o", "go-chatroom", "."]

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
EXPOSE 3000
