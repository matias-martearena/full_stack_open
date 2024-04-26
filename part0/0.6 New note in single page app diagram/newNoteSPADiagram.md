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

    Note right of Browser: The Browser starts executing the JavaScript code.

    Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate Server
    Server-->>Browser: [{content: "What is all this about", date: "2024-04-26T09:09:33.099Z"}...
    deactivate Server

    Note right of Browser: User enters a note in the input field

    Browser->>Server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate Server
    Server-->>Browser: 201 Created
    deactivate Server

    Note right of Browser: Browser updates the displayed notes (using JavaScript)
```
