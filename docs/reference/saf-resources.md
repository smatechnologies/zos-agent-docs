---
sidebar_label: 'SAF resources'
title: SAF resource reference
description: "Consolidated reference for the SAF resource checks the z/OS Agent performs, including SURROGAT, FACILITY, DATASET, and STARTED classes, and EXTRACT calls."
tags:
  - Reference
  - System Administrator
  - Compliance Team
  - Agents
---

# SAF resource reference

## What is it?

The z/OS Agent uses the System Authorization Facility (SAF) to enforce security in several areas. This page consolidates all SAF resource checks the agent performs.

## Summary

| Resource Class | Resource Name | Access | Purpose |
|---|---|---|---|
| SURROGAT | *userid*`.SUBMIT` | READ | LSAM job submission on behalf of a user |
| FACILITY | `OPCON.XPS$`*x*`.XPSPF` | UPDATE | ISPF automation table maintenance |
| DATASET | *(user-specified DSN)* | READ/UPDATE/CONTROL/ALTER | User authority to dataset before saving JCL |
| STARTED | *procname*`.`*evname* or *evname*`.`*evname* | N/A (STDATA assignment) | USERID for dynamic REXX and Operator Command event address spaces |
| SURROGAT | *userid*`.SUBMIT` or *userid*`.OPCON` | READ | XPSCOMM userid override for event submission |
| *(EXTRACT)* | CSDATA fields `XPSUSER` / `XPSTOKEN` | N/A | z/OS-to-OpCon userid and token mapping |

## Job type USERID assignment

The agent assigns a USERID differently for each z/OS job type. This table maps each job type to the mechanism that determines its run-time USERID and links to the detailed section.

| Job type | USERID source | Details |
|---|---|---|
| Batch (B) | `USER=` on the JOB card, set by a 4-level precedence; submission authorized via the SURROGAT class | [USER= assignment on the JOB card](../customization.md#user-assignment-on-the-job-card); [SURROGAT class — job submission](#surrogat-class--job-submission) |
| Started Task (S) | Standard z/OS started-task identity from the STARTED class, keyed on the PROC name issued by `S procname` | IBM *Security Server RACF Security Administrator's Guide* |
| Operator Command (C) | STARTED class for the dynamic `XPSEVENT` address space | [STARTED class — dynamic event address space USERID](#started-class-dynamic-event-userid) |
| REXX (R) | STARTED class for the dynamic `XPSEVENT` address space | [STARTED class — dynamic event address space USERID](#started-class-dynamic-event-userid) |
| Tracked (T) | Inherited from the actual submitter — the agent does not assign a USERID for jobs it only tracks | n/a |
| File Transfer (F) | STARTED class for the dynamic `XPFTAGT` address space, keyed on `XPFTAGT.`*jobname* (same ASCRE pattern as REXX and Operator Command events, with the proc fixed to `XPFTAGT`) | [STARTED class — dynamic event address space USERID](#started-class-dynamic-event-userid) |

## SURROGAT class — job submission

The agent submits batch jobs on behalf of z/OS users. SAF SURROGAT class authorization is required so the agent started task can submit jobs with another user's identity on the job card.

This must be defined for each execution userid that the agent will submit jobs for.

See [Security setup](../customization.md#security-setup) for setup instructions and example RACF commands.

## FACILITY class — ISPF automation table updates

Automation table updates through the ISPF interface (XPSPF001) can be secured through the FACILITY class.

**Resource name:** `OPCON.XPS$`*x*`.XPSPF`, where *x* is the XPSID of the system being accessed.

**Access required:** UPDATE to modify tables; READ access (or no profile defined) allows read-only access.

Generic and discrete profiles are supported.

See [ISPF table security](../advanced-features/ispf.md) for setup examples.

## DATASET class — JCL save authorization

When an OpCon user saves JCL to a mainframe dataset through the JCL editor, the agent maps the OpCon userid to a z/OS userid and checks that user's authority to the target dataset before allowing the save.

**Access required:** Varies by operation (READ, UPDATE, CONTROL, or ALTER).

The userid mapping process is described in [OpCon userid in the z/OS Agent](../customization.md#opcon-userid-in-the-zos-agent).

## STARTED class — dynamic event address space USERID {#started-class-dynamic-event-userid}

REXX, Operator Command, and File Transfer events each run in a dynamic address space that XPSUBMIT creates with `ASCRE`. SAF assigns the USERID for the address space from the **STARTED** class, keyed on the start command XPSUBMIT issues. The assigned USERID is the identity that all subsequent SAF checks — `OPERCMDS` for issued commands, `DATASET` for files the address space opens, and so on — evaluate against.

### REXX and Operator Command events

These events run under module `XPSEVENT`. The proc portion of the start command is controlled by the [`XPSDYNAM`](../customization.md) parameter:

| `XPSDYNAM` setting | Start command issued | STARTED-class key matched |
|---|---|---|
| Set to a customer proc (for example, `XPSDYNAM`) | `XPSDYNAM,JOBNAME=`*evname*`,PROG=XPSEVENT,...` | `XPSDYNAM.`*evname* |
| Unset, or set to `IEESYSAS` (default) | `IEESYSAS.`*evname*`,PROG=XPSEVENT,...` | *evname*`.`*evname* |

In both cases, *evname* is the REXX procedure name (for REXX events) or the command name (for Operator Command events) taken from the OpCon event definition.

### File Transfer events

OpCon File Transfer events follow the same ASCRE-based pattern but run under module `XPFTAGT`. The proc portion of the start command is hardcoded to `XPFTAGT`, so the STARTED-class key always resolves to `XPFTAGT.`*jobname*, where *jobname* is the OpCon job name:

| Start command issued | STARTED-class key matched |
|---|---|
| `XPFTAGT,JOBNAME=`*jobname*`,...` | `XPFTAGT.`*jobname* |

### Per-event USERIDs

Because the STARTED-class key includes the JOBNAME portion, every run with the same event name (or, for File Transfer, the same OpCon job name) resolves to the same USERID. To assign different USERIDs to different events — for example, a low-authority USERID for `DISPLAY` commands and a higher-authority USERID for action commands — define separate STARTED-class profiles for each event name:

```
RDEFINE STARTED DSPCMD.DSPCMD STDATA(USER(OPCONDSP) GROUP(OPCONGRP) TRACE(YES))
RDEFINE STARTED OPRCMD.OPRCMD STDATA(USER(OPCONOPR) GROUP(OPCONGRP) TRACE(YES))
SETROPTS RACLIST(STARTED) REFRESH
```

The OpCon event definition then references the matching name (`DSPCMD`, `OPRCMD`) as the REXX procedure or command name. For File Transfer, vary the USERID by varying the OpCon job name and defining a matching `XPFTAGT.`*jobname* profile.

For STARTED-class profile syntax, see the IBM *Security Server RACF Security Administrator's Guide*. The CA-Top Secret and CA-ACF2 STC equivalents apply the same model — refer to the appropriate product manuals.

## SURROGAT class — XPSCOMM event userid override

When a `$EVENT=` reference in XPSCOMM resolves to an event with a Security ID override, the agent checks SURROGAT class authorization. The calling user must have READ access to one of:

- *override-userid*`.SUBMIT` in the SURROGAT class
- *override-userid*`.OPCON` in the SURROGAT class

If authorization fails, message XPS051W is issued and the override is ignored — the event is sent with the calling user's own identity.

For backward compatibility, READ access is assumed for *override-userid*`.OPCON` if the profile is not defined.

See [XPSCOMM security](../advanced-features/xpscomm.md#security) for details.

## SAF EXTRACT — OpCon userid and token mapping

The agent can extract custom fields from a user's SAF profile to map z/OS userids to OpCon event userids and tokens.

| Field | Default Name | Max Length | Purpose |
|---|---|---|---|
| OpCon user | `XPSUSER` | 128 characters | OpCon event userid (if omitted, the z/OS userid is used) |
| OpCon token | `XPSTOKEN` | 36 characters | OpCon external event token |

These values are extracted using a standard SAF EXTRACT call against the CSDATA (custom segment data) section of the user profile.

See [Mapping z/OS users to OpCon user and token definitions](../advanced-features/mapping.md) for custom field definitions and setup instructions.
