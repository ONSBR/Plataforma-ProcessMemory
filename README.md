# API da Memória de Processamento

Este documento descreve a API para acessar o serviço de Memória de Processamento, para a Prova de Conceito (POC) da Plataforma de Desenvolvimento de Aplicações do Operador Nacional do Sistema Elétrico (ONS).

## Setup do ambiente

### Repositório

O reposítório se encontra em [ONS - Memória do Processo](https://github.com/ONSBR/Plataforma-ProcessMemory).

### Programas e Módulos 

Primeiramente instale o [Node.js](https://nodejs.org/en/ "NodeJS").

Em seguida execute ```npm install``` no diretório onde o **Repositório** foi instalado.

### Executando
Para iniciar a aplicação, execute ```node index.js```

## CREATE

Cria uma instância de uma entidade

### Request

#### HTTP
```
POST /teste/create HTTP/1.1
Host: localhost:9091
Content-Type: application/json
Cache-Control: no-cache
Postman-Token: 211576c8-2539-aefe-f899-1f37bf3780b2

{
	"numero" : "123",
	"correntista" : "José",
	"saldo" : 400
}
```

#### NodeJS

```
var http = require("http");

var options = {
  "method": "POST",
  "hostname": [
    "localhost"
  ],
  "port": "9091",
  "path": [
    "teste",
    "create"
  ],
  "headers": {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    "Postman-Token": "b3e4feee-f910-6e04-6c90-12982381619a"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.write(JSON.stringify({ numero: '123', correntista: 'José', saldo: 400 }));
req.end();
```

#### Python

```python
import requests

url = "http://localhost:9091/teste/create"

payload = "{\n\t\"numero\" : \"123\",\n\t\"correntista\" : \"José\",\n\t\"saldo\" : 100\n}\n\t"
headers = {
    'Content-Type': "application/json",
    'Cache-Control': "no-cache",
    'Postman-Token': "1bc5a1da-dcd1-5112-187a-49bda2c41ea8"
    }

response = requests.request("POST", url, data=payload, headers=headers)

print(response.text)
```

### Response

```
{
    "instanceId": "869f6dc8-40cb-188c-fcab-163a9239893f",
    "timestamp": 1512756474862
}
```


## COMMIT

Inserção de uma nova versão da instância

### Request

#### HTTP 
```
POST /teste/869f6dc8-40cb-188c-fcab-163a9239893f/commit HTTP/1.1
Host: localhost:9091
Content-Type: application/json
{
	"numero" : "123",
	"correntista" : "José",
	"saldo" : 300
}
```

#### NodeJS

```
var http = require("http");

var options = {
  "method": "POST",
  "hostname": [
    "localhost"
  ],
  "port": "9091",
  "path": [
    "teste",
    "869f6dc8-40cb-188c-fcab-163a9239893f",
    "commit"
  ],
  "headers": {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    "Postman-Token": "208ba37f-d192-87ae-0126-103bfefa4489"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.write(JSON.stringify({ numero: '123', correntista: 'José', saldo: 300 }));
req.end();
```

#### Python

```python
import http.client

conn = http.client.HTTPConnection("localhost")

payload = "{\n\t\"numero\" : \"123\",\n\t\"correntista\" : \"José\",\n\t\"saldo\" : 300\n}"

headers = {
    'Content-Type': "application/json",
    'Cache-Control': "no-cache",
    'Postman-Token': "2b63df83-ed5c-d0d0-742f-e1b14850be89"
    }

conn.request("POST", "teste,869f6dc8-40cb-188c-fcab-163a9239893f,commit", payload, headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))
```

### Response

```
{
    "instanceId": "869f6dc8-40cb-188c-fcab-163a9239893f",
    "timestamp": 1512756584117
}
```

## HEAD

Recuperação da última ocorrência na história da instância

### Request

#### HTTP 
```
GET /teste/869f6dc8-40cb-188c-fcab-163a9239893f/head HTTP/1.1
Host: localhost:9091
Content-Type: application/json
Cache-Control: no-cache
Postman-Token: 2e8963dd-6d32-e2bd-f710-3554866b3c4e
```

#### NodeJS

```
var http = require("http");

var options = {
  "method": "GET",
  "hostname": [
    "localhost"
  ],
  "port": "9091",
  "path": [
    "teste",
    "869f6dc8-40cb-188c-fcab-163a9239893f",
    "head"
  ],
  "headers": {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    "Postman-Token": "e5d2e435-98d3-1140-96b3-9f810de5bfff"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.write(JSON.stringify({ numero: '789', correntista: 'José', saldo: 300 }));
req.end();
```

#### Python

```python
import http.client

conn = http.client.HTTPConnection("localhost")

payload = "{\n\t\"numero\" : \"789\",\n\t\"correntista\" : \"José\",\n\t\"saldo\" : 300\n}\n\t"

headers = {
    'Content-Type': "application/json",
    'Cache-Control': "no-cache",
    'Postman-Token': "e2285ef7-273d-d159-28ac-3f8ca6f0be17"
    }

conn.request("GET", "teste,869f6dc8-40cb-188c-fcab-163a9239893f,head", payload, headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))
```

### Response

```
{
    "numero": "123",
    "correntista": "José",
    "saldo": 300,
    "_type": "teste",
    "id": "869f6dc8-40cb-188c-fcab-163a9239893f"
}
```

## HISTORY

Recuperação de toda a história da instância

### Request

#### HTTP 
```
GET /teste/869f6dc8-40cb-188c-fcab-163a9239893f/history HTTP/1.1
Host: localhost:9091
Cache-Control: no-cache
Postman-Token: c24c1852-6e61-4b49-9e26-0c7f859f904a
```

#### NodeJS

```
var http = require("http");

var options = {
  "method": "GET",
  "hostname": [
    "localhost"
  ],
  "port": "9091",
  "path": [
    "teste",
    "869f6dc8-40cb-188c-fcab-163a9239893f",
    "history"
  ],
  "headers": {
    "Cache-Control": "no-cache",
    "Postman-Token": "c8ebca7a-75d8-71da-9f3b-e99215c6b934"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.end();
```

#### Python

```python
import http.client

conn = http.client.HTTPConnection("localhost")

headers = {
    'Cache-Control': "no-cache",
    'Postman-Token': "b3174c80-46f5-3146-b5f5-fc70c308833a"
    }

conn.request("GET", "teste,869f6dc8-40cb-188c-fcab-163a9239893f,history", headers=headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))
```

### Response

```
[
    {
        "numero": "123",
        "correntista": "José",
        "saldo": 400,
        "_type": "teste",
        "id": "869f6dc8-40cb-188c-fcab-163a9239893f",
        "timestamp": 1512756474859
    },
    {
        "numero": "123",
        "correntista": "José",
        "saldo": 300,
        "_type": "teste",
        "id": "869f6dc8-40cb-188c-fcab-163a9239893f",
        "timestamp": 1512756584115
    }
]
```
