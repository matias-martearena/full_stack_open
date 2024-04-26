```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Server

    User---->>Browser: Open https://studies.cs.helsinki.fi/exampleapp/notes
    activate Browser
    Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    deactivate Browser
    activate Server
    Server-->>Browser: HTML document
    deactivate Server

    Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate Server
    Server-->>Browser: The css file
    deactivate Server

    Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate Server
    Server-->>Browser: The JavaScript file
    deactivate Server

    Note right of Browser: The Browser starts executing the JavaScript code that fetches the JSON from the Server.

    Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate Server
    Server-->>Browser: [{ "content": "blah", "date": "2024-04-26T08:34:39.437Z"}...
    deactivate Server

    Note right of Browser: User enters a note in the input field

    Browser->>Server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate Server
    Server-->>Browser: 201 Created
    deactivate Server

    Note right of Browser: Browser reloads the notes page to see the update

    Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    deactivate Browser
    activate Server
    Server-->>Browser: HTML document (including the new note)
    deactivate Server
```