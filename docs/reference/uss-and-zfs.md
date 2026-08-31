---
sidebar_label: 'UNIX System Services and zFS'
title: UNIX System Services and zFS
description: "What the z/OS Agent does and does not do with UNIX System Services and zFS: the agent's OMVS requirement, running shell work through BPXBATCH and OSHELL, and the absence of zFS file triggering."
tags:
  - Reference
  - System Administrator
  - Automation Engineer
  - Agents
---

# UNIX System Services and zFS

## What is it?

What the z/OS Agent requires from UNIX System Services (USS), and how to run USS work from OpCon. The short answer is that the agent's own dependency on USS is deliberately minimal, and USS work is scheduled through the existing batch and REXX job types rather than through a dedicated job type.

## What the agent requires

The agent task needs an OMVS segment with a unique UID, and nothing else. That segment exists for one purpose: it authorizes the agent to use the z/OS TCP/IP API, which is how the agent communicates with OpCon. No other OMVS options are required — no home directory, no program path, no file system access.

This is a deliberate scope decision. The agent does not read or write zFS file systems, does not run shell commands on its own behalf, and does not require the shell to be available. Sites that keep USS tightly restricted can run the agent without relaxing that position. For the security definitions, refer to [Security setup](../customization.md#security-setup).

## What is not provided

- **There is no USS or shell job type.** Shell work is scheduled through the Batch or REXX job types, as described below.
- **There is no zFS or USS file triggering.** The agent's file triggers are driven by SMF dataset close records and apply to MVS datasets. There is no equivalent monitoring of a zFS path, so a job cannot be triggered by the arrival or update of a file in the file system.

## Running USS work from OpCon

Two routes are available. Both use job types the agent already supports.

### BPXBATCH in a batch job

`BPXBATCH` runs a shell command or a USS program from JCL, so the work is scheduled as an ordinary Batch job with all the batch capabilities that implies — step-level tracking, restart, and JCL substitution.

```jcl
//RUNSH    EXEC PGM=BPXBATCH,PARM='SH /u/opcon/scripts/daily.sh'
//STDOUT   DD SYSOUT=*
//STDERR   DD SYSOUT=*
```

Points to plan for:

- **Allocate STDOUT and STDERR.** If they are not allocated, the command's output is discarded. Allocating them to SYSOUT makes the output retrievable through JORS with the rest of the job's output.
- **The exit status becomes the step return code**, so the usual batch failure criteria apply — including the `JOBRC` parameter, which selects whether the job's status is taken from the highest or the last step return code.
- `STDIN` can be allocated the same way when the script expects input.

### OSHELL from a REXX job

`OSHELL` is a TSO command that runs a shell command, so it is reachable from the REXX job type without any JCL:

```rexx
address tso "OSHELL /u/opcon/scripts/daily.sh"
```

Output lands in the REXX job's SYSTSPRT, which is allocated to the SYSOUT class set by the [`MSGCLASS`](../customization.md) parameter and is retrievable through JORS. Because the exec determines the job's completion, have the exec test the result of the command and set its own return code accordingly where the outcome matters.

:::tip The REXX job type is a general-purpose escape hatch
`OSHELL` is reachable this way because **the REXX job type runs any TSO command**. That applies well beyond USS: anything that can be invoked from TSO — utilities, authorized commands, `address console` for operator commands, ISPF services — can be scheduled as a REXX job without a dedicated job type for it. Where the documentation appears to have no job type for something, this is usually the answer.
:::

## See also

- [Customization](../customization.md) — `MSGCLASS`, SYSEXEC library setup, and the OMVS segment definition
- [Capturing operator command output with CMDLIST](../advanced-features/cmdlist.md) — a worked example of the REXX job type used as an escape hatch
- [Standalone file transfer](standalone-file-transfer.md) — transferring files to and from the z/OS system
