---
sidebar_label: 'Multiple agents'
title: Multiple z/OS Agents on one system
description: "How to run multiple z/OS Agent instances on a single z/OS system: separate cataloged procedures, unique XPSIDs, INSTLIB and INITLOG separation, and SYSPLEX considerations."
tags:
  - Reference
  - System Administrator
  - Agents
---

# Multiple z/OS Agents on one system

## What is it?

Guidance for running more than one z/OS Agent (LSAM) instance on the same z/OS system. This is common when you need separate test and production agents, or multiple production agents serving different OpCon environments.

## Overview

A single z/OS system can run multiple agent instances; however, it is necessary to define a separate cataloged procedure for each agent. Each agent copy must have a unique "XPSID" and must have a separate agent log GDG.

## Impact and considerations

### The XPSID identifier

Each agent on a z/OS system must have a different XPSID. The creation of unique names for the exits and for product data areas requires the XPSID. In addition, the XPSID is used to determine the default XPSPARM member for initialization. If the member is not specified in the JCL proc, the agent will attempt to load the configuration from XPSPRMOx, where **x** is the XPSID.

The XPSID is a single alphabetic, national, or numeric character. The default XPSID is "S". The XPSID is defined with a dummy file allocation named **XPS$x**, where **x** is the XPSID.

:::tip
The following statement assigns XPSID=T to the current run:
:::

```jcl
//XPS$T DD DUMMY
```

### INSTLIB and INITLOG

The INSTLIB library contains member INITLOG to allow the definition of new agent logs. The installation parameters generated the initial log dataset name. Update the dataset name in both steps to a new, unique name. SMA recommends naming the log files with the XPSID and system name.

### SYSPLEX installation

In a SYSPLEX installation, the agents on each system with the same XPSID are considered part of the same agent group. To group agents, use the same XPSID for all related agents.

### Utilities

When multiple agents are running, utility programs select the appropriate agent by checking for the same XPSID DD statement.

:::tip
The following batch XPSCOMM step selects the XPSID of "I":
:::

```jcl
//MSGIN  EXEC PGM=XPSCOMM,PARM='$JOB:ADD,….'
//XPS$I     DD     DUMMY
```

### TSO commands

The TSO ALLOCATE command "ALLOC DD(XPS$I) DUMMY" selects the desired agent for commands issued from a TSO session. This is useful for invoking XPSCOMM from a CLIST or REXX program, or for invoking XPSPF001.

:::tip
The following is a REXX program allocating the DD statement and invoking XPSPF001:
:::

```text
/* rexx */
/*********************************************************************/
/* This exec invokes OpCon's XPSPF001 interface */
/*********************************************************************/
parse arg XPSID
if XPSID \= '' then XPSDD = 'XPS$' || XPSID
else XPSDD = 'XPS$S'
address tso 'alloc DD('XPSDD') DUMMY'
address ispexec
"LIBDEF ISPMLIB DATASET ID('OPCON.V210004.ISPMLIB') STACK"
"LIBDEF ISPLLIB DATASET ID('OPCON.V210004.LINKLIB') STACK"
"LIBDEF ISPPLIB DATASET ID('OPCON.V210004.ISPPLIB') STACK"
"select CMD(xpspf001)"
"LIBDEF ISPMLIB"
"LIBDEF ISPPLIB"
"LIBDEF ISPLLIB"
 
address tso "free DD('XPSDD')'
```
