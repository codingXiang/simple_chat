ARG GO_VERSION
ARG PORT
FROM golang:${GO_VERSION}-alpine
WORKDIR /simple_chat

COPY . .
ENV GO111MODULE=on
RUN go get -u

RUN CGO_ENABLED=0 GOOS=linux go build -o main
EXPOSE ${PORT}

ENTRYPOINT ./main