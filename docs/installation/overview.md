---
sidebar_label: 'Overview'
title: Installation overview
description: "Overview of the z/OS Agent installation process: pre-installation checklist, the installation procedure, post-installation verification, and where to find customization guidance."
tags:
  - Conceptual
  - System Administrator
  - Agents
---

# Installation overview

## What is it?

The Installation section walks you through the z/OS Agent installation process from start to finish. Each phase has its own page:

- [Checklist](./checklist.md) — pre-installation worksheet covering file allocations, communications, parameters, security, SMF, performance, TSO/ISPF setup, and the IVP schedule import.
- [Process](./process.md) — step-by-step installation procedure, from extracting the XMIT file through running STAGE1 and STAGE2.
- [Verifying](./verifying.md) — post-installation verification: start the agent, verify storage, add the machine to OpCon, import the IVP schedules, and run the IVP jobs.

:::note

SMA supplies the agent Started Task OPCON01 for the installation process; however, the task name can be user-defined. If the task name is changed, adapt the installation procedures accordingly.

:::

For information on installing and configuring multiple agents on a single z/OS system, refer to [Customization process](../customization).
