---
sidebar_label: 'TLS'
title: Communications with TLS
description: "How to enable TLS for the z/OS Agent and JORS through IBM AT-TLS policies, including ApplicationControlled settings for JORS and SMAFT."
tags:
  - Reference
  - System Administrator
  - Compliance Team
  - Agents
---

# Communications with TLS

## What is it?

How to secure z/OS Agent communications with TLS. The agent supports TLS through IBM's Application Transparent Transport Layer Security (AT-TLS) policies. The configuration of AT-TLS policies is described in the *z/OS Communications Server: IP Configuration Guide* and *z/OS Communications Server: IP Configuration Reference.* No configuration changes are needed in the z/OS Agent itself.

When TLS is enabled in the OpCon machine configuration, it will be required for both SMANetCom connections and the JORS connections. OpCon does not support TLS connections for the JCL editing agent, but that feature shares the JORS port. The implications of that will be discussed below.

To enable TLS support, enable a TTLS policy for the agent and JORS ports with TTLSEnabled set to "On" and HandshakeRole set to "Server" or "ServerWithClientAuth," depending on the site configuration and requirements.

For the agent port, ApplicationControlled should be set or defaulted to "Off" in the TTLSEnvironmentAdvancedParms.

For the JORS port, ApplicationControlled should be set to "On." This will allow the JORS agent in the z/OS Agent to accept both TLS and non-TLS connections, so that JORS and the JCL editor will function. The server will function correctly for JORS if ApplicationControlled is set to "Off," but connections from the JCL editing agent will fail, so JCL changes will need to be done through other means.

Similarly, the SMAFT server can be configured with TLS support. If ApplicationControlled is set "On," it will accept both encrypted and unencrypted connections. The SMAFT agent does not support TLS at this time.
