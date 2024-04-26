```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Server

    User---->>Browser: Open https://studies.cs.helsinki.fi/exampleapp/spa
    activate Browser
    Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    deactivate Browser
    activate Server
    Server-->>Browser: HTML document
    deactivate Server

    Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate Server
    Server-->>Browser: The css file
    deactivate Server

    Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    activate Server
    Server-->>Browser: The JavaScript file
    deactivate Server

    Note right of Browser: The Browser starts executing the JavaScript code that fetches the JSON from the Server.

    Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate Server
    Server-->>Browser: [{content: "What is all this about", date: "2024-04-26T09:09:33.099Z"}...
    deactivate Server
```