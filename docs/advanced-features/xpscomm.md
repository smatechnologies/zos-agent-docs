---
sidebar_label: 'XPSCOMM'
title: Using the XPSCOMM interface routine
description: "How to use the XPSCOMM utility to send MSGIN events and user messages to OpCon from JCL, TSO, or REXX, including input sources, character limits, authorization modes, security, and return codes."
tags:
  - Procedural
  - Automation Engineer
  - Agents
---

# Using the XPSCOMM interface routine

## What is it?

XPSCOMM is the OpCon interface to the MSGIN service available to all platform agents. With XPSCOMM you can add, release, reschedule, delete, or mark complete any OpCon job on the schedule server. You can also hold, release, or start OpCon jobs and schedules, set properties and thresholds, display console messages, and send notifications to event logs.

XPSCOMM sends two kinds of input:

- **MSGIN events** — any string beginning with `$`. These are requests to OpCon, and they work whether or not the calling job is part of an OpCon schedule
- **User messages** — any string that does not begin with `$`. These are reported back as Agent Feedback for the calling job, where they can be matched by OpCon event criteria

XPSCOMM can be run as a batch job step, a started task, an internal called routine, a TSO command, or from a REXX procedure. The agent must be active (XPCB must be initiated) for the input to reach OpCon. See [When the agent is not active](#when-the-agent-is-not-active).

## Input sources

XPSCOMM accepts its input from four sources:

| Source | Use for |
|---|---|
| `PARM=` on the EXEC statement | A single event or user message coded directly in the JCL |
| `PARMDD=` on the EXEC statement | A single event or user message too long for `PARM=` |
| TSO command arguments | Interactive or REXX use |
| The `MSGIN` DD | Multiple events in one job step |

The first three sources all deliver a parm value, and XPSCOMM treats them identically. The `MSGIN` DD is the fallback: XPSCOMM reads it only when no parm is supplied or the parm is empty. If a parm is present, the `MSGIN` DD is ignored even when it is allocated.

### PARM=

The `PARM=` field can contain any valid MSGIN string, or `$EVENT=eventname` where *eventname* is an entry in the agent's ISPF Event Table.

```jcl
//STEP01   EXEC PGM=XPSCOMM,
// PARM='$JOB:ADD,[[$NOW]],IVPMVS1,IVPJOB17,ONDEMAND'
```

The above example adds a job named `IVPJOB17` to the schedule named `IVPMVS1` with frequency code `ONDEMAND`.

z/OS limits `PARM=` to 100 characters. For longer input, use `PARMDD=` or the `MSGIN` DD.

### PARMDD=

`PARMDD=` names a DD whose contents z/OS passes to XPSCOMM as the parm value. Use it when a single event or user message exceeds the 100-character `PARM=` limit. Instream data is the most convenient form, because the message text sits in the JCL where you can read and change it without editing a separate data set.

```jcl
//STEP01   EXEC PGM=XPSCOMM,PARMDD=LONGPARM
//LONGPARM DD   *
Nightly reconciliation complete - 148220 items posted with no exceptions
/*
```

XPSCOMM processes a `PARMDD=` value exactly as it processes a `PARM=` value, so every rule in this page that applies to `PARM=` also applies to `PARMDD=`. The practical ceiling is the 32,000-character message buffer rather than the larger limit z/OS places on `PARMDD=` itself.

:::note
`PARMDD=` delivers one parm value, not one value per record. To send several events in a single job step, use the `MSGIN` DD instead.
:::

### TSO command arguments

XPSCOMM can be run as a TSO command. The command arguments are treated as parm input.

```text
XPSCOMM $JOB:ADD,[[$NOW]],IVPMVS1,IVPJOB17,ONDEMAND
```

:::note
Add XPSCOMM to the `AUTHCMD NAMES` section of the `IKJTSOxx` parmlib member to allow authorized runs from TSO. Without this entry, TSO runs are unauthorized and subject to the 117-character limit described in [Character limits](#character-limits).
:::

### The MSGIN DD

If no parm is supplied, XPSCOMM reads events from the `MSGIN` DD. This file may be instream data, a partitioned data set member, or a sequential data set. Both fixed-length and variable-length records are supported.

```jcl
//STEP01   EXEC PGM=XPSCOMM
//MSGIN    DD   *
$JOB:ADD,[[$NOW]],MySchedule,JOB001,Daily
$JOB:ADD,[[$NOW]],MySchedule,JOB002,Daily
$PROPERTY:SET,BatchComplete,YES
/*
```

Processing rules for the `MSGIN` file:

- Each record is processed as a separate event
- Only records beginning with `$` are processed. Records that do not begin with `$` are ignored, so you can use them as comments
- Trailing blanks are trimmed from each record
- Sequence numbers are stripped according to the record format, as described in the following table

| Record format | Sequence numbers stripped |
|---|---|
| Variable-length | Leading 8-digit numeric fields only |
| Fixed-length | Trailing 8-digit numeric fields only |

:::caution
Sequence number handling depends on the record format. A variable-length file with numbers in columns 73–80 retains them in the event string, and a fixed-length file with numbers in columns 1–8 retains them at the start of the event string. Match the numbering style of your editor to the record format of the file.
:::

:::note
The `$EVENT=` syntax is not supported in the `MSGIN` DD. Use it only with `PARM=`, `PARMDD=`, or a TSO command.
:::

### Named events

The `$EVENT=` syntax looks up the named event in the agent's Event Table and builds the complete MSGIN string from the event definition:

```jcl
//STEP01   EXEC PGM=XPSCOMM,
// PARM='$EVENT=ADDJOB17'
```

An optional comma-delimited data value may follow the event name. If the event definition's token value or message field contains `&TEXT`, the data value replaces it:

```jcl
//STEP01   EXEC PGM=XPSCOMM,
// PARM='$EVENT=MYEVENT,substitution data here'
```

The substitution data value can be up to 254 characters.

## User messages

Input that does not begin with `$` is a user message. XPSCOMM reports a user message back to OpCon as Agent Feedback, where OpCon event criteria can match it by string.

```jcl
//STEP01   EXEC PGM=XPSCOMM,
// PARM='Processing complete: 1500 records loaded successfully'
```

Where the message is delivered depends on whether the calling job is an OpCon job or an external job.

### OpCon jobs and external jobs

An **OpCon job** is a job this agent started for this OpCon instance, so the agent holds a tracking queue entry for it. An **external job** is any other job — one submitted by another scheduler, by a user, or by a different OpCon instance.

XPSCOMM determines which case applies by looking up the calling job in the agent's tracking queue:

| Calling job | Delivery | Where you see it |
|---|---|---|
| OpCon job | Written to the job's status record | The **Job Status Description** and **User Message** Agent Feedback values for that job instance |
| External job | Sent as a `$CONSOLE:DISPLAY` event | The SAM Log |

:::note
The lookup only succeeds when XPSCOMM runs authorized. An unauthorized run is always treated as an external job, even when the calling job is an OpCon job. See [Authorization modes](#authorization-modes).
:::

### Agent Feedback values for an OpCon job

For an OpCon job, XPSCOMM writes the message to the job's status record. Two Agent Feedback values are involved:

| Agent Feedback name | Contents | Use for |
|---|---|---|
| **Job Status Description** | The full message text, up to 4000 characters | New event definitions |
| **User Message** | The full message text, up to 4000 characters | Event definitions created before **Job Status Description** was available |

Both values carry the complete message text and both are available as event criteria. Use **Job Status Description** when you define a new event. The z/OS Agent continues to write **User Message** so that automation built before **Job Status Description** existed keeps working without change.

:::note
OpCon derives **Job Status Description** from the job's exit description automatically for every agent. The z/OS Agent supplies the value itself only when the message is too long for the 20-character exit description, so that the full text is preserved instead of the truncated version.
:::

For the value formats of all z/OS Agent Feedback values and how to match them in an event, refer to **z/OS Agent Feedback** in the **OpCon** online help.

### Message text for an external job

For an external job, XPSCOMM builds a `$CONSOLE:DISPLAY` event in the following format and sends it to the SAM Log:

```text
$CONSOLE:DISPLAY,machine|jobname|userid|message text,SYSTEM
```

Where *machine* is the agent's machine name, *jobname* is the calling job name, and *userid* is the z/OS user ID of the caller. Use this format when you build SAM Log searches or OpCon external event criteria that match XPSCOMM output.

:::note
Commas in the message text are translated to pipes (`|`) on this path only, so they do not conflict with MSGIN field delimiters. Commas are preserved when the message is written to an OpCon job's Agent Feedback.
:::

## Selecting the target agent

In a multiple agent environment, the destination agent can be selected by:

### @x PARM prefix

Prefix the PARM with `@x,` where *x* is the single-character XPSID. The remaining parms will be processed as if the `@x,` were not present.

```jcl
//STEP01   EXEC PGM=XPSCOMM,
// PARM='@A,$JOB:ADD,[[$NOW]],IVPMVS1,IVPJOB17,ONDEMAND'
```

This directs the event to the agent instance identified by XPSID `A` (control block name `XPA`).

### XPS$x DD statement

Allocate a DD with the name `XPS$x` where *x* is the XPSID character. This is particularly useful when invoking XPSCOMM from TSO or REXX:

```text
ALLOC DD(XPS$A) DUMMY
CALL 'hlq.LINKLIB(XPSCOMM)' '$JOB:ADD,...'
```

### Default

If neither method is specified, XPSCOMM uses the default agent instance located by the XPSFETCH routine.

## Authorization modes

XPSCOMM runs in one of two modes depending on whether it is APF-authorized. The mode determines how input reaches the agent, how long it can be, and whether user identity is sent with it.

| | Authorized | Unauthorized |
|---|---|---|
| Delivery | Written directly to the ECSA message queue | Issued as a WTO message that the agent intercepts |
| Maximum length | 32,000 characters (the message buffer size) | 117 characters |
| Over-length input | Truncated | Discarded |
| OpCon user ID and token | Sent with the event | Not sent |
| User messages for OpCon jobs | Written to the job's Agent Feedback | Treated as an external job |
| Event table Security ID override | Enforced through SURROGAT | Ignored |

To run authorized, install XPSCOMM in an APF-authorized library. Refer to the [z/OS Agent installation checklist](../installation/checklist.md) for the library requirements. For TSO use, also add XPSCOMM to the `AUTHCMD NAMES` section of the `IKJTSOxx` parmlib member.

:::caution
An unauthorized run discards input longer than 117 characters without issuing an error, and still ends with return code 0 and message XPS052I. Run XPSCOMM authorized whenever the input can exceed 117 characters.
:::

## Character limits

The limit that applies depends on the input source, the authorization mode, and whether the calling job is an OpCon job.

| Input | Limit | Behavior when exceeded |
|---|---|---|
| `PARM=` | 100 characters | z/OS rejects the JCL |
| `PARMDD=` | 32,000 characters, the size of the message buffer | Truncated |
| `MSGIN` DD record | 31,900 characters | Truncated |
| `$EVENT=` substitution data | 254 characters | Truncated |
| MSGIN event, authorized | 32,000 characters, including the appended OpCon user ID and token | Truncated |
| MSGIN event, unauthorized | 117 characters | Discarded |
| User message, OpCon job | 4000 characters | Truncated |
| User message, external job | 117 characters total, including the `$CONSOLE:DISPLAY` prefix and the `,SYSTEM` suffix | Discarded |

The 4000-character limit for a user message on an OpCon job matches the size of the OpCon Agent Feedback value, so the full message is preserved.

The **Job Status Description** Agent Feedback value carries the message text in full, but the job's exit description holds only the first 20 characters. Keep a user message to 20 characters or fewer if you need the text to appear in the exit description as well.

:::note
The external job limit of 117 characters covers the whole `$CONSOLE:DISPLAY` string. The prefix consumes 20 characters plus the lengths of the machine name, job name, and user ID, and the suffix consumes 7 more. With eight-character names throughout, the usable message text is 66 characters.
:::

## When the agent is not active

If the agent is not active, XPSCOMM cannot locate the agent control block. It falls back to WTO delivery, and because no agent is listening, the input is not sent to OpCon. XPSCOMM still ends with return code 0 and issues message XPS052I.

:::caution
A successful return code does not confirm that OpCon received the input. Verify that the agent is active before relying on XPSCOMM in a critical job step.
:::

## Security

Security is provided by the source of the `USER=` on the job card or the security ID created by the Started Task or other caller of XPSCOMM. This user-id is passed to OpCon/xps along with the event. This user-id must be defined to OpCon/xps Administration with the necessary authority to the schedule named on the command. Refer to [Working with Security](https://help.smatechnologies.com/opcon/core/latest/UI/Enterprise-Manager/Working-with-Security.md#top) for information regarding setting up OpCon/xps Users and setting up privileges within the **Enterprise Manager** online help.

See [Mapping z/OS users to OpCon user and token definitions](mapping.md) for details about defining OpCon userids and external event tokens for each user.

### Event table security overrides

If a `$EVENT=` reference resolves to an event with a Security ID override, XPSCOMM enforces RACF SURROGAT class authorization. The calling user must have READ access to one of:

- *override-userid*`.SUBMIT` in the SURROGAT class
- *override-userid*`.OPCON` in the SURROGAT class

If authorization fails, message XPS051W is issued and the override is ignored — the event is sent with the calling user's own identity. This check is only performed when running authorized; in unauthorized mode the override is always silently ignored.

>For backward compatibility, READ access is assumed for *override*`.OPCON` if the profile is not defined.

## OpCon MSGIN

XPSCOMM and other functions in the z/OS Agent (such as step condition code messaging) use what is known as the OpCon "MSGIN" service. This service is available to all agents, regardless of platform. For more information, refer to [External Events](https://help.smatechnologies.com/opcon/core/latest/OpCon-Events/Defining-Events.md#External) in the **OpCon Events** online help.

The z/OS Agent provides additional usability to the MSGIN service by allowing the definition of pre-defined MSGIN events in the ISPF Event Table.

### Supported event types

Any valid OpCon MSGIN event string may be passed to XPSCOMM. The supported event types and their syntax are:

#### $JOB events

```text
$JOB:ADD,schedule-date,schedule-name,job-name,frequency
$JOB:DELETE,schedule-date,schedule-name,job-name
$JOB:HOLD,schedule-date,schedule-name,job-name
$JOB:RELEASE,schedule-date,schedule-name,job-name
$JOB:START,schedule-date,schedule-name,job-name
$JOB:CANCEL,schedule-date,schedule-name,job-name
$JOB:RESTART,schedule-date,schedule-name,job-name
$JOB:TRACK,schedule-date,schedule-name,job-name,frequency
$JOB:GOOD,schedule-date,schedule-name,job-name
$JOB:BAD,schedule-date,schedule-name,job-name
```

#### $SCHEDULE events

```text
$SCHEDULE:BUILD,schedule-date,schedule-name
$SCHEDULE:HOLD,schedule-date,schedule-name
$SCHEDULE:RELEASE,schedule-date,schedule-name
$SCHEDULE:START,schedule-date,schedule-name
```

#### $MACHINE events

```text
$MACHINE:STATUS,machine-id,U|D|LIMITED
```

#### $PROPERTY events

```text
$PROPERTY:SET,property-name,property-value
$PROPERTY:ADD,property-name,property-value
$PROPERTY:DELETE,property-name
```

#### $THRESHOLD events

```text
$THRESHOLD:SET,threshold-name,threshold-value
```

#### $CONSOLE events

```text
$CONSOLE:DISPLAY,message
```

#### $NOTIFY events

```text
$NOTIFY:LOG,severity,event-number,message
```

Where severity is `I` (Information), `W` (Warning), or `E` (Error), and event-number is a 5-digit number (00001-99999).

### Schedule date values

The schedule-date field accepts:

| Value | Description |
|-------|-------------|
| `CURRENT` | Current OpCon processing date |
| `NEXT` | Next calendar day |
| `LATEST` | Latest available schedule date |
| `EARLIEST` | Earliest available schedule date |
| `[[$NOW]]` | OpCon token resolved at processing time |
| *MM/DD/YYYY* | Explicit date |
| *(blank)* | Equivalent to `CURRENT` |

## Return codes

| RC | Message | Description |
|----|---------|-------------|
| 0 | XPS052I - XPSCOMM Processing Successful | Processing completed |
| 4 | XPS050E - XPSCOMM PARM or MSGIN Error | No parm was supplied and the MSGIN DD could not be opened |
| 8 | XPS065E - XPSCOMM Event *eventname* Not Found | A `$EVENT=` reference specified an event name that does not exist in the Event Table |

:::caution
Return code 0 means processing completed, not that OpCon received the input. XPSCOMM also ends with return code 0 when the agent is not active, when an unauthorized run discards over-length input, and when a `MSGIN` file opens successfully but contains no records beginning with `$`.
:::

## Messages

| Message ID | Text | Description |
|------------|------|-------------|
| XPS047I | *(event text)* | Echoes the MSGIN event string being sent (issued for `$EVENT=` lookups) |
| XPS050E | XPSCOMM PARM or MSGIN Error | No parm was supplied and the MSGIN DD failed to open |
| XPS051W | Userid override not authorized for *userid* | A `$EVENT=` event had a Security ID override, but the calling user lacks SURROGAT authorization |
| XPS052I | XPSCOMM Processing Successful | Processing completed |
| XPS065E | XPSCOMM Event *eventname* Not Found | The named event does not exist in the Event Table |

## Related topics

- [Using the ISPF Automation Table Administrator](ispf.md) — define entries in the Event Table used by `$EVENT=`
- [Mapping z/OS users to OpCon user and token definitions](mapping.md) — define the OpCon user ID and token sent with each event
- [Using XPSWTO](xpswto.md) — write Trigger Messages to Agent Feedback from a job step
- [Multiple z/OS Agents on one system](../reference/multiple-lsams.md) — select a target agent instance
- [SAF resource reference](../reference/saf-resources.md) — SURROGAT profiles for event user ID overrides
