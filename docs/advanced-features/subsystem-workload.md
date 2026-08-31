---
sidebar_label: 'Subsystem workload'
title: Driving CICS, IMS, Db2 and MQ workload
description: "How the z/OS Agent controls CICS, IMS, Db2 and MQ subsystems: started task control with step-level tracking, operator commands, and batch utilities — and where the scope of that control ends."
tags:
  - Conceptual
  - Automation Engineer
  - System Administrator
  - Agents
---

# Driving CICS, IMS, Db2 and MQ workload

## What is it?

How OpCon drives work in the major z/OS subsystems, and where the boundary of that support lies. The distinction that matters is this: **the z/OS Agent manages subsystem address spaces; it does not drive transactions inside them.**

That boundary is a deliberate scope decision, and it is worth understanding before designing a schedule around a subsystem.

## What is supported

### Starting, stopping and tracking regions

A CICS region, an IMS control region, a Db2 subsystem and an MQ queue manager are all started tasks. The Started Task job type therefore applies to all of them:

- Start and stop the region on a schedule, or as a dependency of other work.
- **Track the region at step level of detail**, the same as any other started task, so the job's status in OpCon reflects what the address space is actually doing.
- Use the region's status as a dependency, so that batch work waits for the subsystem to be up before it runs.

This covers the most common requirement — orderly subsystem startup and shutdown around a batch window.

### Issuing subsystem commands

Subsystem commands can be issued through the Command job type — for example, a CICS `CEMT` transaction routed as a modify command, an IMS `/DIS` command, a Db2 `-DISPLAY` command, or an MQSC command through the queue manager's command interface.

:::note
The Command job type reports only whether the command was issued, not what it returned. Where the command's output matters — which is usual for `DISPLAY` commands — schedule it as a REXX job using the `CMDLIST` sample instead, which captures the response. Refer to [Capturing operator command output with CMDLIST](cmdlist.md).
:::

### Running subsystem batch work

Batch utilities that connect to a subsystem are ordinary batch jobs and need nothing special from the agent. Db2 utilities and application programs run under the DSN command processor, IMS batch and BMP jobs, and MQ batch applications are all scheduled as Batch jobs with full step-level tracking and restart support.

### Waiting for a subsystem event

Where a schedule has to wait for something that happens inside a subsystem, the general mechanisms apply rather than a subsystem-specific one:

- A **message trigger** can watch for a console message that the subsystem issues, and satisfy a pre-run condition when it appears.
- A **REXX job** can wait for a condition and complete when it is met, since the REXX job type can run any TSO command. This is the usual way to have a scheduled job wait on a subsystem signal.

## What is not supported

- **There is no transaction-level integration.** OpCon does not start individual CICS transactions or IMS transactions as job types, and does not route CICS messages to a transient data queue.
- **There is no MQ messaging integration.** There is no queue-arrival triggering, no queue-depth condition, and no outbound message notification. An MQ queue manager is managed as a started task, and MQSC commands are issued as commands, but the message layer itself is not an integration point.

These are scope decisions rather than defects. Where a requirement in this area arises, raise it — the shape of any future support would most likely be a general event-arrival mechanism rather than a connector for one subsystem.

## See also

- [Capturing operator command output with CMDLIST](cmdlist.md) — retrieving the response to a subsystem command
- [Message trigger and WTO support](xpswto.md) — driving schedules from console messages
- [Restarting jobs](restarting-jobs.md) — restart support for subsystem batch work
