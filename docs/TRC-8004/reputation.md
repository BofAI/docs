# Reputation
## How does reputation work on TRC-8004?
TRC-8004 is not a reputation system or algorithm: it is a standard for storing reputation data in a public registry (so it becomes a public good), so that it can be used by anyone building platforms, systems, or reputation algorithms.


## How is feedback structured?
Feedback is signed by any clientAddress and targets the agent's agentId on the chain whose registry the feedback is recorded on. The same clientAddress can provide feedback to the same agent multiple times, so feedback on a chain is identified as: agentId:clientAddress:feedbackIndex

A feedback entry includes:
- value (int128) - the feedback score (required)
- valueDecimals (uint8) - decimal precision for the value
- tag1 and tag2 (string) - labels to add dimensions to the feedback (optional)
- endpoint (string) - the exact endpoint/route of the service the feedback refers to (optional)
- feedbackURI (string) - a link to an off-chain file with additional feedback details (optional)
- feedbackHash (bytes32) - hash of the off-chain content for integrity verification (optional)

If you need to store more information, you can put it in the JSON linked by feedbackURI and verify its integrity with feedbackHash.


	
## What are the reputation use cases?
The tag1 field defines what the value measures. Common examples:


- starred - Quality rating
- reachable - Endpoint reachable
- ownerVerified - Endpoint owned by agent owner
- uptime - Endpoint uptime %
- successRate - Endpoint success rate %
- responseTime - Response time in ms
- blocktimeFreshness - Avg block delay in blocks
- revenues - Cumulative revenues
- tradingYield - Yield with tag2 for period (day, week, month, year)


## Who aggregates reputation?
Anyone—the data is public. Not only agents and platforms: we expect (as is already the case in traditional finance) that specialized companies will emerge for trust ranking of agents and services, using data provided by TRC-8004 as well.




## How do you prevent spam attacks?
Reputation in open systems is an open and very complex problem for which there is no single winning recipe. Rather than enforcing specific identity or staking requirements—which would only fit some use cases and stakeholders—TRC-8004 makes the non-opinionated choice to be information rails and delegate anti-spam filtering to whoever implements platforms and algorithmic aggregations.


In the short term, we expect builders to filter by the clientAddresses of organizations/raters they trust. In the long term, more advanced approaches may develop—for example, evaluating feedback by automatically computing the reputation of raters based on the feedback the raters themselves receive (recursive reputation).
