---
sidebar_label: 'Overview'
title: Advanced features overview
description: "Overview of the z/OS Agent's advanced features, including CSA storage allocation, the XPSCOMM interface, ISPF automation tables, user mapping, restart support, and the utility programs."
tags:
  - Conceptual
  - System Administrator
  - Automation Engineer
  - Agents
---

# Advanced features overview

## What is it?

The Advanced features section covers z/OS Agent capabilities beyond the base install and standard scheduling. Use these pages when you need to extend the agent with utility programs, automation tables, dataset cleanup controls, or restart support.

## In this section

- [CSA storage allocation](./csa-storage.md) — sizing formulas for the agent's CSA, ECSA, and ESQA allocations and tracking queues.
- [XPSCOMM](./xpscomm.md) — interface routine for sending MSGIN requests to OpCon from JCL, TSO, or REXX.
- [ISPF Automation Table](./ispf.md) — administer DSN trigger tables, WTO trigger tables, and active event definitions through ISPF.
- [Userid mapping](./mapping.md) — map z/OS userids to OpCon event users and tokens through RACF custom fields.
- [XPSTIMER](./xpstimer.md) — utility for delays, exit codes, abends, and WTORs for testing the agent.
- [XPSTRACK](./xpstrack.md) — job step program for adding jobs to OpCon as tracked external jobs.
- [XPSWTO](./xpswto.md) — issue WTO (Write To Operator) messages from JCL or TSO.
- [XPSWTOR](./xpswtor.md) — issue WTORs and use the operator's reply as a return code.
- [Dataset cleanup filter](./xprlist.md) — XPRLIST table that controls which datasets are protected from automatic cleanup.
- [Restarting jobs](./restarting-jobs.md) — enable full OpCon restart support for external z/OS jobs.
- [XPUSER01 submit exit](./xpuser01.md) — user-written exit called for every JCL record during job submission.
