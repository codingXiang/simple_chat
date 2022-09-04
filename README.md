# simple_chat
簡易聊天室

## Usage

### Development environment
```bash
go run main.go
```

---

## Build

### Windows
> 你將獲得main.exe
> 如果有需要移動到別台windows上運行，
> 請記得將template資料夾帶上
```bash
CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build main.go
```

### Linux
```
go build main.go 
./main
```

### Docker
> 640.86MB
```bash
docker build --build-arg GO_VERSION=1.19 --build-arg PORT=5000 -t simple_chat -f Dockerfile .
docker run -d --name simple_chat -p 5000:5000 simple_chat
```

#### 最小化 Dockerfile
> 14.48MB
```bash
CGO_ENABLED=0 GOOS=linux go build -o main

docker build --build-arg PORT=5000 -t simple_chat:small -f Dockerfile.scratch .
docker run --rm -d -p 5000:5000 --name simple_chat simple_chat:small
```