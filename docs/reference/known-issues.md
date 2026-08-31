---
sidebar_label: 'Known Issues'
title: z/OS Agent known issues
description: "Known issues and unsupported configurations for the z/OS Agent."
tags:
  - Reference
  - System Administrator
  - Operations Staff
  - Agents
---

# z/OS Agent known issues

## What is it?

A list of known limitations and unsupported configurations in the current z/OS Agent release.

- Automatic external job tracking is not available under JES3. The TRACMASK, TRACLASS, TRACLAS8 and job card column 72 recognition methods all depend on the IEFUJV exit, and JES3 does not call IEFUJV early enough, or in a state that allows the agent to identify the job, for those methods to work. Jobs running under JES3 can still be tracked by adding an XPSTRACK step to the job's JCL, which registers the running job with OpCon directly. Refer to [Using XPSTRACK](../advanced-features/xpstrack.md).
- The Encryption and Compression options are not supported in this release of SMAFT for z/OS.
- RUNMODE=TEST only applies to batch jobs. Other job types run normally.
