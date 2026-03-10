# OverView

The MCP Server is designed to provide a standardized framework for interaction between Large Language Models (LLMs) and external tools and data sources. Its core lies in a clearly defined client-server architecture and layered communication mechanism, ensuring that AI applications can securely and efficiently access and utilize external information.

## Architectural Participants

MCP follows a **client-server** architecture, primarily comprising the following three core participants:

*   **MCP Host**: Typically the AI application itself (e.g., Claude Code or Claude Desktop). It is responsible for coordinating and managing one or more MCP Clients.
*   **MCP Client**: Instantiated by the MCP Host for each MCP Server. Each client maintains a dedicated connection with its corresponding MCP Server and obtains context information from the MCP Server for the host to use.
*   **MCP Server**: A program responsible for providing context data to MCP Clients. Servers can run locally (e.g., a filesystem server) or remotely (e.g., a TRON MCP/SUN MCP server).

This architecture allows AI applications to connect to different MCP Servers simultaneously through multiple clients, thereby expanding their capabilities.

## Layered Structure

MCP protocol consists of two main layers:

*   **Data Layer**: This is the core of MCP, defining the **JSON-RPC 2.0** based client-server communication protocol. It covers lifecycle management, core primitives (tools, resources, prompts), and notification mechanisms. The data layer focuses on the structure and semantics of messages.
*   **Transport Layer**: Responsible for managing communication channels and authentication between clients and servers. It handles connection establishment, message framing, and secure communication. The transport layer abstracts communication details, allowing the data layer to use the same JSON-RPC 2.0 message format across all transport mechanisms.

### Transport Mechanisms

MCP supports two primary transport mechanisms:

*   **Standard Input/Output (Stdio) Transport**: Suitable for direct inter-process communication between local processes on the same machine. It utilizes standard input/output streams, providing optimal performance with no network overhead, typically used for local MCP Servers.
*   **Streamable HTTP Transport**: Uses HTTP POST for client-to-server messages with optional Server-Sent Events (SSE) for streaming capabilities. This mechanism supports remote server communication and standard HTTP authentication methods (such as Bearer Tokens, API Keys, etc.), with OAuth recommended for obtaining authentication tokens.

## Communication Flow and Lifecycle

MCP client and server interactions follow clear lifecycle management, primarily including initialization, tool discovery, tool execution, and notifications:

<div style={{ textAlign: 'left' }}>
  <img
    src={require('./image/mcp_communication.jpg').default}
    alt="RangeOrder1"
    width="100%"
    height="30%"
  />
</div>

### 1 Initialization Exchange

This is the starting point of MCP communication, establishing a connection through a capability negotiation handshake. The client sends an `initialize` request to the server to negotiate supported protocol versions and capabilities. The server responds with its capabilities, establishing a compatible communication session. This process ensures that clients and servers can understand each other's capabilities and communicate effectively.

### 2 Tool Discovery

Once a connection is established, the AI application needs to know what functionalities the MCP Server provides. The client uses `*/list` methods (e.g., `tools/list`, `resources/list`, `prompts/list`) to discover all tools, resources, and prompts exposed by the server. This dynamic discovery mechanism allows servers to provide different sets of functionalities as needed.

### 3 Tool Execution

When the AI application decides to perform an operation, it sends a tool execution request (e.g., `tools/call`) to the server via the MCP Client. The request includes the name of the tool to be called and necessary parameters. The server receives the request, performs the corresponding operation (e.g., querying blockchain data), and then returns structured results to the client. The AI application then interprets these results and integrates them into its response.

### 4 Notifications

MCP supports a real-time notification mechanism to enable dynamic updates between clients and servers. For example, when the set of tools provided by a server changes (new functionalities are added or existing tools are modified), the server can send tool update notifications to all connected clients. Notifications are sent as JSON-RPC 2.0 notification messages, without expecting a response, ensuring that clients can stay informed of server state changes in real-time.

## Core Concepts

MCP defines three core primitives that servers can expose:

*   **Tools**: Executable functions that AI applications can invoke to perform actions such as file operations, API calls, and database queries.
*   **Resources**: Data sources that provide contextual information to AI applications, such as file contents, database records, and API responses.
*   **Prompts**: Reusable templates that help structure interactions with language models, such as system prompts or few-shot examples.

Additionally, MCP also defines primitives that clients can expose, such as **Sampling** (allowing servers to request LLM completions), **Elicitation** (allowing servers to request user input), and **Logging** (allowing servers to send log messages to clients), to build richer interactions.


