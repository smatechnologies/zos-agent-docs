---
sidebar_label: 'Release notes'
---

# z/OS LSAM Release notes

## z/OS LSAM 21.01.05

2021 November

**New Features**

- **ZOS-305**: XPSPF enhancements
    - Allow search argument with FAT and FAN commands
    - Allow MSGIN processing from **T**rigger command
    - Fix FIND set and clear logic on main menu
    - Add XPSID *x* command to change target system
    - Open event editor if the Event token changes on trigger entry
    - Allow XPSPF001 to run read only when XPSPAUTH is not in linklist or steplib

**Fixes**

- **ZOS-300**: Fix BLDL list length
- **ZOS-301**: Clear trailing comma from long userids
- **ZOS-302**: prevent UCB table underrun
- **ZOS-304**: Use A2E translation for the square brackets in XPSMACH
- **ZOS-312**: Do ENDREQ if RPLRBAR doesn't contain JOBNUM (JES3)
- **ZOS-313**: Skip move on zero length records (JORS)

## z/OS LSAM 21.00.03

2021 June

**New Features**

- **ZOS-271**: Support multi-volume source datasets in file transfers
- **ZOS-281**: Add ability to execute XPSCOMM and XPSWTO as TSO commands. Add ability to call XPSPF001 with XPSID argument.
- **ZOS-284**: Map z/OS userid to OpCon userid and password through RACF custom fields.
- **ZOS-290**: Add SAF security to ISPF automation table and XPSCOMM

**Fixes**

- **ZOS-280**: Sysplex fixes and performance improvements
- **ZOS-295**: Issue console commands from MODIFY LSAM with requester's authority, not LSAM's.
- **ZOS-296**: Fixed MSGQ display in XPSPF001, hide passwords and allow delete
- **ZOS-297**: Allow XPSPF001 in split screen mode

## z/OS LSAM 20.01.02

2020 October

**New Features**

- **ZOS-248**: Added filtering support for datasets ending in .G0000V00 to match members of a Generation Data Group (GDG) in file triggers and pre-runs.
- **ZOS-252**: Removed the minimum job limit of 10 on process counts to avoid not having enough storage space upon initialization. The upper limit will be either the initial value from XPSPARM or 30, whichever is greater.
- **ZOS-263**: Disable OpCon GDG resolution for jobs running with GDGBIAS=STEP.
- **ZOS-242**: Shortened the search path for pre-run checks and optimized the status updates.
- **ZOS-224**: The z/OS LSAM no longer supplies the sample IEFACTRT step messages exit. The STEPMSGS parameter will now be ignored.
- **ZOS-228**: The USEJMR parameter now defaults to NO.

**Fixes**

- **ZOS-269**: Fixed missing mount notifications.
- **ZOS-266**: Fixed intermittent tracking problem when running with USEJMR=NO.
- **ZOS-261**: Fixed GENERICP parsing errors. The GENERICP parser should accept either "-t5" or "-t 5" as valid parameters, but previously treated the value "-t 5" as if no value was provided.
- **ZOS-241**: Improved performance of pre-run processing for tape device requirements.

## z/OS LSAM 19.0

2019 July

**New Features**

- If a job awaiting execution (Queued) is detected to be held, the job status will show as "Job held on queue."
- Updated the Job Output listing to provide more details and more closely resemble the SDSF listing for the job.
- Removed the row for JOB-CARD-RESTART from the Run-time parameters table in the z/OS LSAM manual.
- The $JOB:RESTART event now supports ending step and "full job restart" options for z/OS jobs.
- Added a new XPSTRACK job step program for job tracking.
- The JCL editor now supports retrieving JCL from the JES spool and tracked/queued jobs will use this source by default.
- Added an option to show jobs as "Running" at submission time, rather than when they begin executing.
- LSAM parameter displays will now use hyphens, rather than underscores.
- The "Abend Job at Step Termination" step control action will not post an abend, but allow COND=EVEN/ONLY steps to run.
- Added a new parameter to bypass the return code simulation on restart.

## z/OS LSAM 18.01.0201

2018 December

**New Features**

- Updated the XPSTIMER program to support the ability to:
  - run as a TSO command program.
  - be set up as a REXX job type.
  - not require any user JCL.
  - use Windows-style arguments.

## z/OS LSAM 17.04.01

2017 April

**New Features**

- Added support to enable or disable the automatic restart step selection for a job.
- Added support for inserting long job status descriptions from XPSCOMM.
- XPSTIMER can be invoked as GENERICP and has new abend options.
- Added support for 256-character single byte character translations. Contact SMA Support for more information.

**Fixes**

- If TEMP* DD allocations are concatenated, no member rename will be done.

## z/OS LSAM 16.07.01

2016 September

**New Features**

- File and Message preruns will be skipped for step restarts.
- The MLWTO parameter now defaults to YES.
- Added support for matching long job class names against a mask.
- GDGOPT=C will only count positive generations that are cataloged as created.
- LSAMLOG entry timestamps now use UTC.
- Improved unique name assignment for temporary job names.
- Improved recoverability through the LSAMLOG.
- Mixed case values are now allowed for the TRACSCHD and PASSWORD parameters.
- Added comments to the JORS list to identify the fields.
- Added a new message for GDG resolution when GDGOPT=C or R.
- Allow the JCL editing agent to work (in non-TLS mode) when TLS support is enabled.
- Added Dummy job type for "file watcher" type pre-runs.

**Fixes**

- Fixed an issue where a "Target Schedule definition no longer matches saved definition'' error appeared, indicating that a schedule mismatch was encountered during the second deployment of an already deployed schedule.
- Error messages would be displayed during a warm start of the LSAM if it was started with PARM=xx.
- "Mount pending" status was not being cleared before the end of the job step.
- JORS agent could stop functioning after a security error.
- Sometimes the ENQ was not obtained before the deletion of a dataset during restart.
