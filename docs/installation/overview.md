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

## Installation method

The z/OS Agent is installed with XMIT and TSO RECEIVE, followed by the `BUILDJOB`, STAGE1 and STAGE2 jobs described in [Process](./process.md). It is not installed with SMP/E, and it does not define an FMID, ship SYSMODs and PTFs, or supply HOLDDATA.

This is a deliberate choice, made on feedback from the earliest z/OS Agent customers, who preferred the simpler receive-and-run path. The trade-off is a straightforward one:

- There is no consolidated software inventory (CSI) to allocate and maintain, and no SMP/E zone to define, manage, or keep in step with the rest of the software estate.
- Maintenance is applied by installing a new release of the agent rather than by receiving and applying SYSMODs, so the SMP/E APPLY, ACCEPT and RESTORE facilities are not available for it.

Sites with a standard that requires all products to be installed under SMP/E should take this into account when planning the installation.

For information on installing and configuring multiple agents on a single z/OS system, refer to [Customization process](../customization).
