import net from "node:net";

const server = net.createServer();
server.on("connection", (socket) => {
  socket.on("data", (data) => {
    // [object Uint8Array]
    log("socket data type", Object.prototype.toString.call(data));
    // HTTP request message
    log("data.toString()", data.toString());

    const request = parseHTTPRequest(data);
    log("parsed request", request);

    /* handle request here */

    const response = new HTTPResponse(200, "OK", `I received: ${request.body}`);

    // send message back
    socket.write(response.toString());
    socket.end((err) => console.error(err));
  });
});
server.listen(8080);

function parseHTTPRequest(data) {
  const content = data.toString();
  const [metaInfo, bodyInfo] = content.split("\r\n\r\n");
  /**
   * meta info
   */
  const [firstLine, ...headerLines] = metaInfo.split("\r\n");
  // GET / HTTP/1.1
  const [method, path, version] = firstLine.split(" ");
  const request = new HTTPRequest(method, path, version);
  // HOST: localhost:3000
  headerLines.forEach((line) => {
    const splitIndex = line.indexOf(":");
    const headerName = line.substr(0, splitIndex);
    const headerValue = line.substr(splitIndex + 1).trim();
    request.headers[headerName] = headerValue;
  });
  /**
   * body info
   */
  request.body = bodyInfo;
  // you can parse body info in advance according to `Content-Type`

  return request;
}

class HTTPRequest {
  headers = {};
  body = null;
  constructor(method, path, version) {
    this.method = method;
    this.path = path;
    this.version = version;
  }
}

class HTTPResponse {
  constructor(statusCode, statusText, body) {
    this.statusCode = statusCode;
    this.statusText = statusText;
    if (typeof body !== "string") {
      throw new Error("HTTPResponse only support body of `string`");
    }
    this.body = body;
  }

  toString() {
    return `HTTP/1.1 ${this.statusCode} ${this.statusText}\n\n${this.body}`;
  }
}

function log(hint, ...args) {
  console.log("===========================");
  console.log(hint);
  console.log("===========================");
  console.log(...args);
  console.log("");
}
