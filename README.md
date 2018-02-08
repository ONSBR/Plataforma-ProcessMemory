# API da Memória de Processamento

Este documento descreve a API para acessar o serviço de Memória de Processamento da Plataforma de Desenvolvimento de Aplicações do Operador Nacional do Sistema Elétrico (ONS).

## Setup do ambiente
 
### Repositório

O reposítório se encontra em [ONS - Process Memory](https://github.com/ONSBR/Plataforma-ProcessMemory).

### Programas e Módulos 

Primeiramente instale o [Node.js](https://nodejs.org/en/ "NodeJS").

Em seguida execute ```npm install``` no diretório onde o **Repositório** foi instalado.

### Executando
Para iniciar a aplicação, execute ```node index.js```


## *Atenção*

Nos exemplos que seguem, *869f6dc8-40cb-188c-fcab-163a9239893f* é o identicador de uma instância (de uma aplicação) que está manipulando uma entidade


## CREATE

Cria uma instância de uma entidade

### Request

#### HTTP

```
POST /869f6dc8-40cb-188c-fcab-163a9239893f/create HTTP/1.1
Host: localhost:9091
Content-Type: application/json
Cache-Control: no-cache
Postman-Token: 62d8e686-cfaf-1cca-fdfb-3c36667ad0e7

{
	"conta" : "456",
	"nome" : "Manoel",
	"saldo" : 65
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
    "869f6dc8-40cb-188c-fcab-163a9239893f",
    "create"
  ],
  "headers": {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    "Postman-Token": "9a37a224-f807-cf89-1af0-ac6a4c130945"
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

req.write(JSON.stringify({ conta: '456', nome: 'Manoel', saldo: 65 }));
req.end();
```

#### Python


```
import requests

url = "http://localhost:9091/869f6dc8-40cb-188c-fcab-163a9239893f/create"

payload = "{\n\t\"conta\" : \"456\",\n\t\"nome\" : \"Manoel\",\n\t\"saldo\" : 65\n}"
headers = {
    'Content-Type': "application/json",
    'Cache-Control': "no-cache",
    'Postman-Token': "29e08f14-46eb-c17d-5698-f88100b97b6a"
    }

response = requests.request("POST", url, data=payload, headers=headers)

print(response.text)
```

### Response


```
Status : 200
```


## COMMIT

Inserção de uma nova versão da instância

### Request

#### HTTP 

```
POST /869f6dc8-40cb-188c-fcab-163a9239893f/commit HTTP/1.1
Host: localhost:9091
Content-Type: application/json
Cache-Control: no-cache
Postman-Token: 117dce33-b1d2-548f-1256-3ac85005f5e0

{
	"conta" : "456",
	"nome" : "Manoel",
	"saldo" : 888
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
    "869f6dc8-40cb-188c-fcab-163a9239893f",
    "commit"
  ],
  "headers": {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    "Postman-Token": "3b5e73dd-1d6f-7d7d-d874-36fc57142da6"
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

req.write(JSON.stringify({ conta: '456', nome: 'Manoel', saldo: 888 }));
req.end();
```

#### Python


```
import requests

url = "http://localhost:9091/869f6dc8-40cb-188c-fcab-163a9239893f/commit"

payload = "{\n\t\"conta\" : \"456\",\n\t\"nome\" : \"Manoel\",\n\t\"saldo\" : 888\n}"
headers = {
    'Content-Type': "application/json",
    'Cache-Control': "no-cache",
    'Postman-Token': "6e54ba27-88c9-cb61-944d-0945be7d3c2f"
    }

response = requests.request("POST", url, data=payload, headers=headers)

print(response.text)
```

### Response


```
Status : 200

```

## HEAD

Recuperação da última ocorrência na história da instância

### Request

#### HTTP 


```
GET /869f6dc8-40cb-188c-fcab-163a9239893f/head HTTP/1.1
Host: localhost:9091
Cache-Control: no-cache
Postman-Token: 12607c8f-082f-26b5-b54d-7e57906d1666
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
    "869f6dc8-40cb-188c-fcab-163a9239893f",
    "head"
  ],
  "headers": {
    "Cache-Control": "no-cache",
    "Postman-Token": "5d3cb49a-061c-19f2-6813-4b2e2d9f600a"
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


```
import requests

url = "http://localhost:9091/869f6dc8-40cb-188c-fcab-163a9239893f/head"

headers = {
    'Cache-Control': "no-cache",
    'Postman-Token': "8ca30ae1-e412-6ce0-c43d-aee4c99b1c23"
    }

response = requests.request("GET", url, headers=headers)

print(response.text)
```

### Response


```
[
    {
        "data": {
            "conta": "456",
            "nome": "Manoel",
            "saldo": 888
        }
    }
]
```

## FIRST

Recuperação da última ocorrência na história da instância

### Request

#### HTTP 


```
GET /869f6dc8-40cb-188c-fcab-163a9239893f/first HTTP/1.1
Host: localhost:9091
Cache-Control: no-cache
Postman-Token: 3c471fb9-3e09-c66d-723a-dd5ba10241de
```

#### NodeJS


```
var request = require("request");

var options = { method: 'GET',
  url: 'http://localhost:9091/869f6dc8-40cb-188c-fcab-163a9239893f/first',
  headers: 
   { 'Postman-Token': '2c40e271-d8b8-7162-6616-b8056d0d878c',
     'Cache-Control': 'no-cache' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

#### Python


```
import requests

url = "http://localhost:9091/869f6dc8-40cb-188c-fcab-163a9239893f/first"

headers = {
    'Cache-Control': "no-cache",
    'Postman-Token': "c137f210-7210-fa52-0f8b-977c3eadab1c"
    }

response = requests.request("GET", url, headers=headers)

print(response.text)
```

### Response


```
[
    {
        "data": {
            "conta": "456",
            "nome": "Manoel",
            "saldo": 250
        }
    }
]
```

## HISTORY

Recuperação de toda, ou parte, a história da instância

### Toda a hisória

#### Request

##### HTTP 


```
GET /869f6dc8-40cb-188c-fcab-163a9239893f/history HTTP/1.1
Host: localhost:9091
Cache-Control: no-cache
Postman-Token: 1b0bc8bf-30f0-0be3-6201-4f29b1c2f670
```

##### NodeJS


```
var http = require("http");

var options = {
  "method": "GET",
  "hostname": [
    "localhost"
  ],
  "port": "9091",
  "path": [
    "869f6dc8-40cb-188c-fcab-163a9239893f",
    "history"
  ],
  "headers": {
    "Cache-Control": "no-cache",
    "Postman-Token": "3a46d652-a54d-d7a0-9f40-7efe26575316"
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

##### Python


```
import requests

url = "http://localhost:9091/869f6dc8-40cb-188c-fcab-163a9239893f/history"

headers = {
    'Cache-Control': "no-cache",
    'Postman-Token': "53ec75e1-0a6d-fe15-1c92-2b75f5ca750e"
    }

response = requests.request("GET", url, headers=headers)

print(response.text)
```

#### Response


```
[
    {
        "data": {
            "conta": "456",
            "nome": "Manoel",
            "saldo": 250
        }
    },
    {
        "data": {
            "conta": "456",
            "nome": "Manoel",
            "saldo": 255
        }
    },
    {
        "data": {
            "conta": "456",
            "nome": "Manoel",
            "saldo": 100
        }
    },
    {
        "data": {
            "conta": "456",
            "nome": "Manoel",
            "saldo": 580
        }
    },
    {
        "data": {
            "conta": "456",
            "nome": "Manoel",
            "saldo": 4200
        }
    },
    {
        "data": {
            "conta": "456",
            "nome": "Manoel",
            "saldo": 750
        }
    },
    {
        "data": {
            "conta": "456",
            "nome": "Manoel",
            "saldo": 650
        }
    },
    {
        "data": {
            "conta": "456",
            "nome": "Manoel",
            "saldo": 620
        }
    },
    {
        "data": {
            "conta": "456",
            "nome": "Manoel",
            "saldo": 65
        }
    },
    {
        "data": {
            "conta": "456",
            "nome": "Manoel",
            "saldo": 888
        }
    }
]
```

### Os 'N' mais antigos

#### Request

##### HTTP 


```
GET /869f6dc8-40cb-188c-fcab-163a9239893f/history?first=3 HTTP/1.1
Host: localhost:9091
Cache-Control: no-cache
Postman-Token: d92df832-f214-8dd4-58c3-8fb16b7e7db2
```

##### NodeJS


```
var http = require("http");

var options = {
  "method": "GET",
  "hostname": [
    "localhost"
  ],
  "port": "9091",
  "path": [
    "869f6dc8-40cb-188c-fcab-163a9239893f",
    "history"
  ],
  "headers": {
    "Cache-Control": "no-cache",
    "Postman-Token": "4140545d-3b0c-86d1-6418-6e682592d105"
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

##### Python


```
import requests

url = "http://localhost:9091/869f6dc8-40cb-188c-fcab-163a9239893f/history"

querystring = {"first":"3"}

headers = {
    'Cache-Control': "no-cache",
    'Postman-Token': "7d6f7f4d-0a50-e808-0ef7-2d94b8f02e04"
    }

response = requests.request("GET", url, headers=headers, params=querystring)

print(response.text)
```

#### Response


```
[
    {
        "data": {
            "conta": "456",
            "nome": "Manoel",
            "saldo": 250
        }
    },
    {
        "data": {
            "conta": "456",
            "nome": "Manoel",
            "saldo": 255
        }
    },
    {
        "data": {
            "conta": "456",
            "nome": "Manoel",
            "saldo": 100
        }
    }
]
```

### Os 'N' mais novos

#### Request

##### HTTP 


```
GET /869f6dc8-40cb-188c-fcab-163a9239893f/history?last=3 HTTP/1.1
Host: localhost:9091
Cache-Control: no-cache
Postman-Token: 59fcdfec-f99a-21a2-5e55-7a30968fc996
```

##### NodeJS


```
var http = require("http");

var options = {
  "method": "GET",
  "hostname": [
    "localhost"
  ],
  "port": "9091",
  "path": [
    "869f6dc8-40cb-188c-fcab-163a9239893f",
    "history"
  ],
  "headers": {
    "Cache-Control": "no-cache",
    "Postman-Token": "8c47ee05-c62c-2d3c-583a-0a1456e9b9a5"
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

##### Python


```
import requests

url = "http://localhost:9091/869f6dc8-40cb-188c-fcab-163a9239893f/history"

querystring = {"last":"3"}

headers = {
    'Cache-Control': "no-cache",
    'Postman-Token': "8783878e-5ce5-20a6-9ac4-2de5daf171ef"
    }

response = requests.request("GET", url, headers=headers, params=querystring)

print(response.text)
```

#### Response


```
[
    {
        "data": {
            "conta": "456",
            "nome": "Manoel",
            "saldo": 620
        }
    },
    {
        "data": {
            "conta": "456",
            "nome": "Manoel",
            "saldo": 65
        }
    },
    {
        "data": {
            "conta": "456",
            "nome": "Manoel",
            "saldo": 888
        }
    }
]
```