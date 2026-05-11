---
sidebar_label: 'Release notes'
title: z/OS Agent release notes
description: "Version history and change details for the z/OS Agent, including new features, improvements, and bug fixes."
tags:
  - Reference
  - System Administrator
  - Agents
---

# z/OS Agent release notes

## 23

### 23.01.01

2023 October

:::info Note

z/OS Agent Version 23.01 is compatible with z/OS versions 1.11 - 3.1.

:::

### What's new

:eight_spoked_asterisk: **ZOS-329**: Added DETACH, ATTACH logic to the down detection routine for XPSAGENT.

:eight_spoked_asterisk: **ZOS-332**: Changed the load library for XPSPLEX to support multiple versions of the Agent.

:eight_spoked_asterisk: **ZOS-337**: Added new XPSPARM field for TRIGGER_RETPD, defaulting to 45 days. The range is between 7 and 365 days.

:eight_spoked_asterisk: **ZOS-342**: The z/OS agent will no longer attempt dataset cleanup for steps that will be skipped due to conditional JCL execution.

## 21

### 21.01.08

2022 August

### What's new

:eight_spoked_asterisk: **ZOS-2**: Implement TLS 1.2 for SMAFT Server (z/OS)

:eight_spoked_asterisk: **ZOS-71**: Remove dependency on LINKLIST

:eight_spoked_asterisk: **ZOS-73**: Add TRACK/QUEUE support for JES3

:eight_spoked_asterisk: **ZOS-78**: Rename XPSAGENT to XPSJORS for consistency with other platforms

#### Fixes

:eight_spoked_asterisk: **ZOS-296**: MSGQ display and delete were not working through XPSPF001.

:eight_spoked_asterisk: **ZOS-297**: Automation table editor (XPSPF) failed silently in ISPF split sessions.

:eight_spoked_asterisk: **ZOS-300**: Rexx and command events were not starting correctly.

:eight_spoked_asterisk: **ZOS-301**: If the JCL for a job has an eight character userid on the job card AND the OpCon job definition has a userid override with an eight character userid, a trailing comma is left on the job card, resulting in a JCL error.

:eight_spoked_asterisk: **ZOS-312**: z/OS jobs hung in "Prerun active" state.

:eight_spoked_asterisk: **ZOS-314**: AM2TDPFL received Job Not Found, but then somehow restarted itself.

:eight_spoked_asterisk: **ZOS-316**: Prevent cleanup of entries with active event name and reset reference date field for all updates from XPSPF001 (prevents cleanup).

:eight_spoked_asterisk: **ZOS-341**: In some cases when XPSUBMIT needs to requeue a job, this leads to a memory access error (S0C4-11).

### 21.01.06

2022 June

#### Fixes

:eight_spoked_asterisk: **ZOS-315**: Fix confusing JORS and start data on pre-run jobs

### 21.01.05

2021 November

### What's new

:eight_spoked_asterisk: **ZOS-305**: XPSPF enhancements

- Allow search argument with FAT and FAN commands
- Allow MSGIN processing from **T**rigger command
- Fix FIND set and clear logic on main menu
- Add XPSID *x* command to change target system
- Open event editor if the Event token changes on trigger entry
- Allow XPSPF001 to run read only when XPSPAUTH is not in linklist or steplib

#### Fixes

:eight_spoked_asterisk: **ZOS-300**: Fix BLDL list length

:eight_spoked_asterisk: **ZOS-301**: Clear trailing comma from long userids

:eight_spoked_asterisk: **ZOS-302**: Prevent UCB table underrun

:eight_spoked_asterisk: **ZOS-304**: Use A2E translation for the square brackets in XPSMACH

:eight_spoked_asterisk: **ZOS-312**: Do ENDREQ if RPLRBAR doesn't contain JOBNUM (JES3)

:eight_spoked_asterisk: **ZOS-313**: Skip move on zero length records (JORS)

### 21.00.03

2021 June

### What's new

:eight_spoked_asterisk: **ZOS-271**: Support multi-volume source datasets in file transfers

:eight_spoked_asterisk: **ZOS-281**: Add ability to execute XPSCOMM and XPSWTO as TSO commands. Add ability to call XPSPF001 with XPSID argument.

:eight_spoked_asterisk: **ZOS-284**: Map z/OS userid to OpCon userid and password through RACF custom fields.

:eight_spoked_asterisk: **ZOS-290**: Add SAF security to ISPF automation table and XPSCOMM

#### Fixes

:eight_spoked_asterisk: **ZOS-280**: Sysplex fixes and performance improvements

:eight_spoked_asterisk: **ZOS-295**: Issue console commands from MODIFY LSAM with requester's authority, not LSAM's.

:eight_spoked_asterisk: **ZOS-296**: Fixed MSGQ display in XPSPF001, hide passwords and allow delete

:eight_spoked_asterisk: **ZOS-297**: Allow XPSPF001 in split screen mode

## 20

### 20.01.02

2020 October

### What's new

:eight_spoked_asterisk: **ZOS-248**: Added filtering support for datasets ending in .G0000V00 to match members of a Generation Data Group (GDG) in file triggers and pre-runs.

:eight_spoked_asterisk: **ZOS-252**: Removed the minimum job limit of 10 on process counts to avoid not having enough storage space upon initialization. The upper limit will be either the initial value from XPSPARM or 30, whichever is greater.

:eight_spoked_asterisk: **ZOS-263**: Disable OpCon GDG resolution for jobs running with GDGBIAS=STEP.

:eight_spoked_asterisk: **ZOS-242**: Shortened the search path for pre-run checks and optimized the status updates.

:eight_spoked_asterisk: **ZOS-224**: The z/OS LSAM no longer supplies the sample IEFACTRT step messages exit. The STEPMSGS parameter will now be ignored.

:eight_spoked_asterisk: **ZOS-228**: The USEJMR parameter now defaults to NO.

#### Fixes

:eight_spoked_asterisk: **ZOS-269**: Fixed missing mount notifications.

:eight_spoked_asterisk: **ZOS-266**: Fixed intermittent tracking problem when running with USEJMR=NO.

:eight_spoked_asterisk: **ZOS-261**: Fixed GENERICP parsing errors. The GENERICP parser should accept either "-t5" or "-t 5" as valid parameters, but previously treated the value "-t 5" as if no value was provided.

:eight_spoked_asterisk: **ZOS-241**: Improved performance of pre-run processing for tape device requirements.

## 19

### 19.0

2019 July

### What's new

:eight_spoked_asterisk: If a job awaiting execution (Queued) is detected to be held, the job status will show as "Job held on queue."

:eight_spoked_asterisk: Updated the Job Output listing to provide more details and more closely resemble the SDSF listing for the job.

:eight_spoked_asterisk: Removed the row for JOB-CARD-RESTART from the Run-time parameters table in the z/OS LSAM manual.

:eight_spoked_asterisk: The $JOB:RESTART event now supports ending step and "full job restart" options for z/OS jobs.

:eight_spoked_asterisk: Added a new XPSTRACK job step program for job tracking.

:eight_spoked_asterisk: The JCL editor now supports retrieving JCL from the JES spool and tracked/queued jobs will use this source by default.

:eight_spoked_asterisk: Added an option to show jobs as "Running" at submission time, rather than when they begin executing.

:eight_spoked_asterisk: LSAM parameter displays will now use hyphens, rather than underscores.

:eight_spoked_asterisk: The "Abend Job at Step Termination" step control action will not post an abend, but allow COND=EVEN/ONLY steps to run.

:eight_spoked_asterisk: Added a new parameter to bypass the return code simulation on restart.

## 18

### 18.01.0201

2018 December

### What's new

:eight_spoked_asterisk: Updated the XPSTIMER program to support the ability to:

- run as a TSO command program.
- be set up as a REXX job type.
- not require any user JCL.
- use Windows-style arguments.

## 17

### 17.04.01

2017 April

### What's new

:eight_spoked_asterisk: Added support to enable or disable the automatic restart step selection for a job.

:eight_spoked_asterisk: Added support for inserting long job status descriptions from XPSCOMM.

:eight_spoked_asterisk: XPSTIMER can be invoked as GENERICP and has new abend options.

:eight_spoked_asterisk: Added support for 256-character single byte character translations. Contact SMA Support for more information.

#### Fixes

:eight_spoked_asterisk: If TEMP* DD allocations are concatenated, no member rename will be done.

## 16

### 16.07.01

2016 September

### What's new

:eight_spoked_asterisk: File and Message preruns will be skipped for step restarts.

:eight_spoked_asterisk: The MLWTO parameter now defaults to YES.

:eight_spoked_asterisk: Added support for matching long job class names against a mask.

:eight_spoked_asterisk: GDGOPT=C will only count positive generations that are cataloged as created.

:eight_spoked_asterisk: LSAMLOG entry timestamps now use UTC.

:eight_spoked_asterisk: Improved unique name assignment for temporary job names.

:eight_spoked_asterisk: Improved recoverability through the LSAMLOG.

:eight_spoked_asterisk: Mixed case values are now allowed for the TRACSCHD and PASSWORD parameters.

:eight_spoked_asterisk: Added comments to the JORS list to identify the fields.

:eight_spoked_asterisk: Added a new message for GDG resolution when GDGOPT=C or R.

:eight_spoked_asterisk: Allow the JCL editing agent to work (in non-TLS mode) when TLS support is enabled.

:eight_spoked_asterisk: Added Dummy job type for "file watcher" type pre-runs.

#### Fixes

:eight_spoked_asterisk: Fixed an issue where a "Target Schedule definition no longer matches saved definition'' error appeared, indicating that a schedule mismatch was encountered during the second deployment of an already deployed schedule.

:eight_spoked_asterisk: Error messages would be displayed during a warm start of the LSAM if it was started with PARM=xx.

:eight_spoked_asterisk: "Mount pending" status was not being cleared before the end of the job step.

:eight_spoked_asterisk: JORS agent could stop functioning after a security error.

:eight_spoked_asterisk: Sometimes the ENQ was not obtained before the deletion of a dataset during restart.
