---
sidebar_label: 'TLS'
title: Communications with TLS
description: "How to enable TLS for the z/OS Agent, JORS, and JCL editing through IBM AT-TLS policies, including ApplicationControlled settings for JORS and SMAFT."
tags:
  - Reference
  - System Administrator
  - Compliance Team
  - Agents
---

# Communications with TLS

## What is it?

How to secure z/OS Agent communications with TLS. The agent supports TLS through IBM's Application Transparent Transport Layer Security (AT-TLS) policies. The configuration of AT-TLS policies is described in the *z/OS Communications Server: IP Configuration Guide* and *z/OS Communications Server: IP Configuration Reference.* No configuration changes are needed in the z/OS Agent itself.

When TLS is enabled in the OpCon machine configuration, it is required for both SMANetCom connections and JORS connections. Solution Manager makes the JCL editing connection from the OpCon server over the same connection as JORS, so the AT-TLS policy that protects JORS protects JCL editing as well.

To enable TLS support, enable a TTLS policy for the agent and JORS ports with TTLSEnabled set to "On" and HandshakeRole set to "Server" or "ServerWithClientAuth," depending on the site configuration and requirements.

For the agent port, ApplicationControlled should be set or defaulted to "Off" in the TTLSEnvironmentAdvancedParms.

For the JORS port, ApplicationControlled should also be set or defaulted to "Off." Because JCL editing shares the JORS connection, the JORS port does not need to accept both TLS and non-TLS connections, and every connection to it is encrypted.

:::note
Deployments that still use Enterprise Manager for JCL editing are the exception. Enterprise Manager opens a separate JCL editing connection that does not support TLS, so those deployments must set ApplicationControlled to "On" for the JORS port. That setting allows the JORS port to accept both TLS and non-TLS connections, so that JORS and the Enterprise Manager JCL editor both function. Setting ApplicationControlled to "Off" leaves JORS working correctly, but Enterprise Manager JCL editing connections fail and JCL changes must be made by other means.
:::

Similarly, the SMAFT server can be configured with TLS support. If ApplicationControlled is set "On," it will accept both encrypted and unencrypted connections. The SMAFT agent does not support TLS at this time.
