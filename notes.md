- app.use handles for all https requests (get, post, put, patch, delete)
- Order of the route defination matters
- app.get handles only get http request
- We can use the regex for defining the routes, we can also use ?, +, *, ().
- we can pass query params(/user?username=abc) and dynamic routing (/user/:userId)
- we can add multiple route/request handlers in app.use or app.get
- when ever the request comes from the client then express check the matching route and goes throuth the chain of middleware/ request handler and the response handler to send the data back to the client -- how the express handle the request behind the scenes
- What is middleware? why do we need it? --> It sits between incoming https request and the final processing of the request by application. It often used to process or transaform the request and response 
    Middleware is often used for:
    Authentication & Authorization – Verifying if a user is logged in or has permission to access a resource.
    Logging – Recording request data for debugging or analytics.
    Input Validation – Checking if the request body contains valid data.
    Error Handling – Catching and responding to errors in a standardized way.
    Compression – Compressing responses to improve speed.
    Parsing Request Data – JSON parsing, URL-encoded data parsing, etc.
- Difference between JSON object and javascript object --> 
Text-based format for data exchange.  | In-memory data structure in JavaScript.
Strict syntax: keys and strings must use double quotes. | Keys can be unquoted, and both single and double quotes are allowed for strings.
It supports only limited data types such as strings, numbers, booleans, arrays, objects, and null. | Supports all JavaScript types: functions, undefined, symbols, etc.
JSON	JavaScript
Commonly used for data transmission (e.g., API responses) | Used for logic and computation in JavaScript code
- Why do we get undefined when we console request.body without app.use(express.json()) --> Data comes in chuck and You’ll see that req is a readable stream. This means the data hasn't been read or parsed yet. It’s just a raw stream of bytes.
So to parse it into json we use middlware app.use(express.json()) to get the request.body



Best Practice 
- Always make connection with database first then connect it with server