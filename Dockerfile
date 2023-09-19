FROM golang:1.21-alpine3.17 as backenddeps

WORKDIR /src
COPY go.mod go.sum ./

RUN go mod download

FROM backenddeps as backendbuilder
COPY *.go ./
RUN ["go", "build",  "-o", "go-chatroom", "."]

FROM node:alpine as pnpm
RUN corepack enable
RUN corepack prepare pnpm@8.7.4 --activate

FROM pnpm as frontenddeps
COPY ./frontend/package.json ./
COPY ./frontend/pnpm-lock.yaml ./
RUN pnpm  install --frozen-lockfile

FROM frontenddeps as frontendbuilder
COPY ./frontend ./
RUN pnpm run build

FROM scratch
WORKDIR /app

COPY --from=frontendbuilder /dist /app/frontend/dist
COPY --from=backendbuilder /src/go-chatroom /app
CMD ["./go-chatroom"]
EXPOSE 3000
