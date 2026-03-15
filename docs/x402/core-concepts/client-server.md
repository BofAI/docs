# Client and Server

Understanding these roles in depth is essential when designing, building, or integrating x402-based programmable payment services on-chain.

> **Note**
>
> - **Client**: The technical component that initiates an HTTP request. In real-world business scenarios, this typically represents the **buyer** of a resource.
> - **Server**: The technical component that responds to requests. In real-world business scenarios, this typically represents the **seller** of a resource.

---

## Client Role

The client is the entity that initiates requests to access paid resources.

Clients can take many forms, including:

- User-facing applications  
- Autonomous agents  
- Backend services acting on behalf of users or systems  

### Core Responsibilities

- **Initiate Requests**: Send the initial HTTP request to the resource server.  
- **Handle Payment Requirements**: Parse the `402 Payment Required` response and extract payment details.  
- **Manage Token Approvals**: Approve the `PaymentPermit` contract to transfer tokens from the client’s wallet for settlement.  
- **Prepare Payment Payload**: Construct and sign a payment payload according to server requirements.  
- **Retry with Payment**: Attach the `PAYMENT-SIGNATURE` header and resend the request.  

The client **does not** need to maintain any account system, login credentials, or session tokens beyond its wallet. All interactions are **stateless** and fully based on standard HTTP protocols.

---

## Server Role

The server is the provider that requires payment before granting access to its resources.

Servers may include:

- API services  
- Digital content providers  
- Any HTTP-accessible resource seeking monetization  

### Core Responsibilities

- **Define Payment Requirements**: Respond with HTTP `402 Payment Required` when a request lacks valid payment credentials, detailing payment requirements in the response body.  
- **Validate Payment Payload**: Call the Facilitator service to verify the incoming signed payload.  
- **Settle Transactions**: Upon successful validation, submit the transaction via the Facilitator to complete on-chain settlement.  
- **Deliver Resources**: After confirming payment, return the requested resource to the client.  

The server **does not** need to manage client identity or maintain session state. Validation and settlement are handled independently for each request through the Facilitator.

---

## Communication Flow

In the x402 protocol, a typical interaction between client and server proceeds as follows:

1. **Client Initiates Request**: Sends a request for a paid resource to the server.  
2. **Server Requires Payment**: Responds with `402 Payment Required`, including payment details in the `PAYMENT-REQUIRED` header (Base64-encoded).  
3. **Client Submits Payment**: Generates a signature and resends the request with the signed payload in the `PAYMENT-SIGNATURE` header (Base64-encoded).  
4. **Server Validates Payment**: Calls the Facilitator service to verify the received payment payload.  
5. **Server Executes Settlement**: Submits the transaction to the blockchain via the Facilitator.  
6. **Server Delivers Resource**: Returns the requested resource and includes settlement confirmation (with transaction hash) in the `PAYMENT-RESPONSE` header.  

---

## Summary

Within the x402 protocol architecture:

- **Client**: Initiates resource requests and provides a signed payment payload.  
- **Server**: Enforces payment policy, verifies transaction validity, and delivers resources upon successful payment confirmation.  

This interaction model is fully based on native HTTP, maintains a **stateless** architecture, and is compatible with both user-facing applications and autonomous agents.

---

## Next Steps

Continue exploring:

- [Facilitator](./facilitator.md) — Learn how servers validate and settle payments  
- [Wallet](./wallet.md) — Learn how to manage wallets used for payments  
