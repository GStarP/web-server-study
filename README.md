# Understand Web Server

Web server is mainly known as HTTP Server, which receives HTTP request and send back HTTP response.

We often use `express` which based on Node.js `node:http` module to launch a HTTP server, but what's behind them?

## Simplest HTTP Server

> see [server.js](./http-text/server.js)

Dig one layer more, `node:http` depends on `http:net`, which represent a TCP connection.

We can receive bytes from net.createServer, then parse HTTP request message and send back HTTP response message according to [RFC2616](https://www.rfc-editor.org/rfc/rfc2616#section-5). When we assume that all data is `string`, we can easily build a simplest HTTP server.

```bash
node server.js

curl --location --request GET 'http://localhost:8080/' --header 'Content-Type: text/plain' --data-raw 'Hello World'
```
