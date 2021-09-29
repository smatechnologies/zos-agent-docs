---
sidebar_label: 'Components and Operation'
---

# z/OS LSAM Components and Operation

## LSAM Components

The following table presents z/OS LSAM components including module names, component locations within the architecture (the LSAM task, JES2, JES3, and so forth) and component functions.

|Module|Location|Function|
|--- |--- |--- |
|XPSSUPV|LSAM Task|Initiates internal tracking queues, attaches XPSERVER, processes operator commands, logs completed SAM activity and calls XPSUBMIT as requested by XPSERVER.|
|XPSPLEX|XPSPLEX Task|SYSPLEX Management Module controls fault tolerance actions and global XCF interaction between LSAM and PSAMs.|
|XPSFETCH|All Modules|XPS Primary Control Block (XPCB) manager and XPS version control module.|
|XPFTSRVR|Batch Job<br/>Dynamic REXX <br/>Started Task|SMA file transfer server.|
|XPFTAGT|Batch Job<br/>Dynamic REXX<br/>Started task|SMA file transfer agent.|
|XPSQMGR|All Modules|LSAM Tracking and Message Queue manager.|
|XPSERVER|LSAM Task|TCP/IP communications and SAM Request Client/Server gateway for the Primary LSAM. Communicates tracking info to the SMA Opcon SAM (via IP connection).|
|XPSUBMIT|LSAM Task|JCL submission routine, Started Task (STC) initiation, operator command task and REXX task creation.|
|XPSPARM|LSAM Task|Runtime Parameter and Operator command parse routine.|
|XPSLOGQ|LSAM Task|Communications and Message logging routine.|
|XPSASCRE|IEESYSAS (Dynamic)|Address Space Create (ASCRE) Initialization routine. It is used to initialize execution tracking of Started Task (STC), operator commands and REXX jobs.|
|XPSEVENT|IEESYSAS (Dynamic)|REXX and system command task. Created by XPSUBMIT when a REXX procedure is to be executed dynamically or an operator command is to be executed.|
|XPRESTRT|LSAM Task|Interruption recovery module. Uses the RECLOG to determine jobs that were "in-process" at the time of a catastrophic machine failure and notifies SAM of job failures.|
|XPSTATUS|LSAM Task|JES2 Converter Status Routine (capture converter JCL errors, etc.), Pre-run Tape Unit, File Trigger and dependent non-scheduled task processor.|
|XPSELOAD|LSAM Task|Exit loader – establishes dynamic exits.|
|XPSU83|SYS.IEFU83 (Dynamic)|SMF Interface for File Trigger management.|
|XPSUJV|SYS.IEFUJV (Dynamic)|SMF Interface for Job Submission tracking.|
|XPSU84|SYS.IEFU84 (Dynamic)|SMF Interface for Job Execution tracking and Step Control actions.|
|XPSUSI|SYS.IEFUSI (Dynamic)|Step initiation exit interface for dataset processing.|
|XPSWTOEX|CNZ_WTOMDBEXIT|Console message processing.|
|XPSCOMM|Batch Step<br/>REXX Call<br/>Started Task|Batch update and OEM interface. Communicates MSGIN commands to SAM.|
|XPSPF001|TSO/ISPF|ISPF Trigger table editor.|
|XPSPAUTH|TSO/ISPF|TSO Authorized Command Interface (Entry in IKJTSOxx as Auth CMD).|
|XPSISPF|TSO/ISPF|ISPLINK/ISPEXEC Call Interface.|
|XPSAGENT|LSAM Task|Sysout viewing / JCL edit agent. Communicates with Enterprise Manager Host Window function.|
|XPSAFAPI|XPSAGENT|SAF Security API for JCL Edit and SYSOUT Browse.|
|XPSAUDIT|Started Task|Displays current LSAM Usage information, storage allocations, etc.|

In addition to the functional components of XPS390, an API Macro Library \[highlevel.midlevel.MACLIB\] is distributed with the product, allowing a skilled assembler programmer the ability to write additional customized API interfaces to SMA Opcon.

### LSAM Options

The XPSPRMxx member of the installation library \[*highlevel.midlevel*.INSTLIB\] is a template for configurable customer options. Other options are available to the console operator or the schedule interface. The following options are configurable for each installation:

- Define default Batch job (// JOB) execution options such as Submit Library DD.
- Define default RACF security ID for JCL submission.
- Set Sysplex cross system communication options.
- Set Wake-up Interval for log and external job recognition.
- Set concurrent activity count (determines \#of jobs SAM queues to any LSAM).
- Redirect LSAM failover operations from one machine to another.
- Display and alter XPSPRMxx options from the operator console.
- Display active Event, WTO and DSN Trigger queues from the operator console.
- Enable and disable recording of SMF records required for DSN Triggering.
- Define Machine ID and IP Port assignments.

### LSAM Process Flow

The first execution of the LSAM after an IPL establishes the XPS390 storage and tracking queue assignments for the life of that IPL (for information on CSA storage allocation, refer to [CSA Storage Allocation](advanced-features/csa-storage)). From that point on, all tracking is done \"in-storage\" and through Sysplex XCF. No file I/O is required to execute the schedule functions. This architecture makes XPS390 one of the *lowest overhead* schedulers for IBM mainframes. A transaction-logging file \[RECLOG\] records the status of each \"just completed\" job and a copy of each communication buffer received from, or sent to, SAM.

Once the log is established and the storage allocations are validated, LSAM attaches several subtasks to handle requests asynchronously. In this way, no major component is ever waiting on another component to complete a task before performing its task. This architecture makes XPS390 one of the *most responsive* schedulers for MVS. For instance, the XPSERVER communication task, the LSAM Supervisor, the XPSUBMIT Job submission and the XPSTATUS condition checking tasks are all asynchronous processes.

Even the XPSLOGQ transaction logger runs independent of other activities so that no lapses in logging can occur. At no point in the critical path of job submission, tracking or termination does your scheduled work wait on I/O, DB locks or dataset enqueues. The average time lapse between job termination and dependent job submission is 3 -- 5 seconds.

### LSAM Architecture

The LSAM on the Gateway machine is the message manager for the entire SYSPLEX environment. The Sysplex communications task, XPSPLEX, is activated by the LSAM if it is not already started.

Component Architecture Diagram

![Component Architecture Diagram](/img/Component-Architecture-Diagram.png "Component Architecture Diagram")

The SMF and console exits on each system provide all tracking and triggering data to the Gateway LSAM.

Tracking is provided through storage queues, control blocks and tables located in ECSA. The Coupling Facility is used to link these components throughout the Sysplex.

### XPSLOG Logging Function

The RECLOG DD in the OPCONxx Proc designates a sequential generation dataset that logs all significant traffic to and from the SAM. This log is a repository for current trigger table contents and provides a minute-by-minute status for system recovery after an outage. For this reason, the OPCONxx task(s) should always be one of the last tasks to terminate during planned shutdowns. If OPCONxx is terminated before all production processing is complete, or there are multiple intermediate IPLs (without starting the LSAM), it could cause SMA Opcon to post 'in-flight' jobs as errors when it is reinstated.

The log also takes "checkpoints" each hour to record changes to trigger tables and so forth. Each night at midnight (00:00:01hrs) the XPSLOGQ program log automatically spins off a new generation. The operator can also request a spin-off (F *lsamname*,SPINLOG) at any time. The SPINLOG command can also be a scheduled job; however, SMA recommends that the number of generations retained should be sufficient for a full week of processing logs to be available.

:::note
A new generation of the XPSLOG is dynamically allocated at agent startup and after each SPINLOG command. The new dataset is allocated with the equivalent of SPACE=(CYL,(80,16),RLSE) and will be allocated on an available STORAGE volume using the default dynamic allocation UNITNAME specified by the system programmer.
 
SMA recommends using DFSMS or a third-party DASD management system to override the default allocation, if necessary, but the UNIT and/or VOLUME can be specified with the LOG_UNIT and LOG_VOLUME parameters in the XPSPRMxx member, if desired.
 
If the dynamic allocation fails with the specified UNIT or VOLUME, it will be retried using the system defaults to avoid stopping the agent.
:::

## LSAM Program Operation

The OPCONxx and XPSPLEX tasks should be started as soon as possible after an IPL. No scheduled batch job submissions or executions function properly if SMA Opcon has not been initialized. If SYSPLEX=Y is coded in your XPSPRMxx member, the XPSPLEX task is automatically started by the OPCONxx task. The typical start command is:

```shell
S *lsamname*\[.\<*taskname\>*\] 
```

The PSAM-LSAM communication architecture is dynamic. You do not have to identify any z/OS IP addresses or network connections to any XPS390 component, manually. The LSAMs and PSAMs find each other during the course of normal processing.

You can use the PARM option to pass configuration settings to the LSAM during startup.

:::tip Example
The following would override the current port setting or the setting in the startup member:

```shell
S OPCON01,PARM='PORT=3200'
```

:::

A special case is to pass a two character parm (e.g., PARM=TT). In this form, the LSAM will read the parm member XPSPRMxx (where xx is the parm) to set or override the configuration for the LSAM.

## Operator Console Commands

Operator commands may be used to stop the LSAM task, display certain attributes of XPS390 or to request "temporary" parameter changes for that LSAM.

:::note
If you start the LSAM with an optional task name the lsamname in the commands below can be replaced by the task name that was used to start the LSAM. This will issue the command to each LSAM that was started with the same task name.
:::

| Command Syntax       | Description          | Response or Action   |
|--- |--- |--- |
|S lsamname[./*taskname*]|Starts the LSAM.|None.|
|F lsamname,DISP=PARMS|Returns a list of the current Stored XPS Parameters.|Refer to message XPS021R.|
|F lsamname, DISP=STOR|Displays Storage usage on the LPAR SYSLOG.|Refer to message XPS021R.|
|F lsamname, DISP=JOBS|Displays the LSAM Job Queue on the LPAR SYSLOG.|Refer to message XPS021R.|
|F lsamname, DISP=DSNT|Displays the LSAM DSN Trigger Table on the LPAR SYSLOG.|Refer to message XPS021R.|
|F lsamname, DISP=WTOT|Displays the LSAM WTO Trigger Table on the LPAR SYSLOG.|Refer to message XPS021R.|
|F lsamname, DISP=ALL|Displays all Internal Parms and Values.|Refer to message XPS021R.|
|F lsamname,SPINLOG|Spins off the current generation of the RECLOG.|Allocates a new generation of the RECLOG. By default, this occurs automatically every midnight).|
|F lsamname,REPEXIT|Exits Reinit.|Releases ECSA, re-allocates and reloads SMF exits.|
|F lsamname,REPUSERx|User Exits Reinit.|Where 'x' is the User Exit Number.|
|F lsamname,CLEARQ|Clears LSAM execution queues.|Use only as directed by SMA Support.|
|F lsamname,TRACE=<br/>[Y\|N\|0\|9\|[1-8]{1,8}|Sets SYSLOG trace options.|Use only as directed by SMA Support.|
|F lsamname,RESET=<br/>[S\|C\|(sysid)][,NOPROMPT]<br/><br/>Caution: This command should only be entered during failover recovery.|Re-initializes the LSAM.|S= System RESET – completely removes LSAM internals and restarts all tasks.<br/>C=Cycle LSAM – simply shuts down the LSAM and restarts it.<br/>If RESET=(ssss) is coded, the LSAM is reset to the Machine ID in ssss and a RESET=C is performed.|
|F lsamname,SHUTDOWN|Shuts down the SMA Opcon LSAM|Cycles down LSAM and stop the XPSPLEX Task.|
|F lsamname,REMOVEX<br/>[,NOPROMPT]<br/><br/>Caution: Do not use this command unless directed by SMA.|Removes the LSAM and internals|Shuts down the LSAM and removes all exits and storage queues.|
|F lsamname,parm=value|Resets most parameters in XPSPRMxx.|The change persists until the next IPL only. Permanent changes should be made to XPSPRMxx. Refer to Run-time Parameters.|
|F lsamname,<br/>XPRLIST,DISPLAY|Displays the dataset cleanup filter table.|None.|
|F lsamname,<br/>XPRLIST,ADD,[I\|X][DSN\|VOL]=pattern|Adds an entry to the dataset cleanup filter table.|The change persists until the next IPL only. Permanent changes should be made to XPRLSTxx.|
|F lsamname,<br/>XPRLIST,DELETE,[I\|X][DSN\|VOL]=pattern|Removes an entry from the dataset cleanup filter table.|The change persists until the next IPL only. Permanent changes should be made to XPRLSTxx.|
|F lsamname,XPRLIST=xx|Reloads the dataset filter table from member XPRLSTxx.|This action completely replaces the filter table in memory.|
|F lsamname,XPSPARM=xx|Resets parms from the settings in XPSPRMxx.|Persists until the next IPL. The xx value is not remembered.|
|P lsamname|Stops the LSAM.|Cycles down LSAM but XPSPLEX remains.|

## Audit Task Commands

When the LSAM task is down or independent data is needed, the XPSAUDIT task can provide further operational data: the data is displayed on the system log, and appears in the job log of the XPSAUDIT job.

|  Command Syntax|Description|
| --- | --- |
|S XPSAUDIT,PARM=STOR|Displays the LSAM storage assignments on the executing system.|
|S XPSAUDIT,PARM=JOBS|Displays the LSAM Job Queue on the executing system.|
|S XPSAUDIT,PARM=PARMS|Displays the LSAM stored Parms on the executing system.|
|S XPSAUDIT,PARM=DSNT|Displays the LSAM DSN Trigger Table on the executing system.|
|S XPSAUDIT,PARM=WTOT|Displays the LSAM WTO Trigger Table on the executing system.|
|S XPSAUDIT|Displays the all the above.|

## z/OS LSAM Fail-Over, Reconfiguration, and Recovery

The z/OS LSAM allows for various procedures for adopting the work of failing PSAMs or allowing a PSAM to adopt the processing of a failing LSAM. There are two basic rules for LSAM/PSAM reconfiguration:

1. Only a primary LSAM machine id can adopt the workload of a PSAM machine id.
2. A PSAM can take over the processing of an LSAM only if the ADOPT=Y parameter was set in XPSPRMxx at initiation.

The XPSPLEX task manages Adoption and Fail-Over reconfiguration. The primary LSAM always handles recovery from Fail-Over.

|  XPSPLEX Command Syntax|Description|
| --- | --- |
|F XPSPLEX,STATUS|Displays LSAM/PSAM Status.|
|F XPSPLEX,\[ADOPTWKLD\|DROPWKLD\](ssss,nn)|Reassign/release Machine Ids.|

  : Sysplex Operator Commands

For example, the command [F XPSPLEX,ADOPTWKLD(SYS2,20)]{style="font-family: 'Courier New';"} causes the LSAM on which the command was issued to add work scheduled for PSAM machine id SYS2 to the LSAM workload.

In the above example, up to 20 SYS2 processes can execute at once. SYS2 must not have an XPSPLEX or OPCONxx task running or the command fails.

The command [F XPSPLEX,DROPWKLD(SYS2)]{style="font-family: 'Courier New'"} reverses the process, and executes automatically when an XPSPLEX task starts on SYS2.

### Fail-Over Procedure

If the Primary LSAM fails, the PSAM in the Sysplex designated as the adopting member (ADOPT=Y coded in XPSPRMxx) prompts the operator with message XPS113A asking if the PSAM should assume the duties of the failed LSAM. When the operator replies \"Y\" to this message, the following process takes place on the PSAM automatically:

The PSAM adopts the machine id of the failing LSAM.

1. The LSAM=Y State is set for the PSAM (the PSAM essentially becomes the primary LSAM, machine id included).
2. The Workload of the LSAM is added to the PSAM by Adoption (same effect as ADOPTWKLD command).

No in-flight processing on the PSAM is interrupted during this process. The SAM Server must be changed to define the IP Address of the machine on which the newly configured LSAM resides.

HOST File Example - Fail-Over Preparation

![HOST File Example - Fail-Over Preparation](/img/HOST-File-Example-Fail-Over-Preparation.png "HOST File Example - Fail-Over Preparation")

It is often the practice to simply comment out the Fail-Over IP address in normal operation and swap the comment notation if z/OS Fail-Over is initiated.

### Fail-Over Recovery

When the system on which the Primary LSAM normally resides is recovered, you need to fall back to primary mode. To do this, enter Command: F LSAM,RESET=(ssss) on the Fail-Over PSAM, where ssss is the normal machine id of the PSAM. When the operator enters this command, a prompt is issued to confirm the reset request. If the operator answers "Y" to the confirmation, the following process takes place on the Fail-Over PSAM automatically:

1. The PSAM's machine id is changed to that of the command (ssss).
2. The LSAM=N State is set for the PSAM (the Fail-Over LSAM returns to a PSAM state).
3. All Workload adoptions are removed.

Now you may start the primary LSAM OPCONxx task. The HOST file on the SAM Server must be changed back to define the IP Address of the primary LSAM in normal operation.

## Defining the z/OS SMAFT Server

The z/OS SMAFT server is distributed as compiled REXX, and relies on services provided by the TSO environment, so it must be run in a TMP. It can be run as a batch job, started task or SMA Opcon dynamic REXX job (Event Name=XPFTSRVR, EXEC Parm=\"PORT=*port*).

Sample JCL:

//SMAFT EXEC PGM=IKJEFT1B,PARM='XPFTSRVR **3110**'\
//SYSTSIN DD DUMMY\
//SYSTSPRT DD SYSOUT=\*\
//SYSEXEC DD DISP=SHR,DSN=OPCON.V4R03M01.INSTLIB\
//TCPXLBIN DD DISP=SHR,DSN=TCPIP.STANDARD.TCPXLBIN (optional)

1. The SMAFT server listening port must be supplied on the command line.
2. Members XPFTSRVR, XPFTPARM and XPRXCRCC must be in the SYSEXEC library.
3. Security is determined using normal z/OS security server rules.
4. Security is determined using normal z/OS security server rules.

Stop the server with a z/OS cancel command.

## Defining the z/OS SMAFT Agent

The z/OS SMAFT agent is distributed as compiled REXX, and relies on services provided by the TSO environment, so it must be run in a TMP. It is distributed as a started task procedure: XPFTAGT.

Sample JCL:

//SMAFT EXEC PGM=IKJEFT1B\
//SYSTSIN DD DUMMY\
//SYSTSPRT DD SYSOUT=\*\
//XPSIN DD DUMMY\
//SYSEXEC DD DISP=SHR,DSN=OPCON.V140303.INSTLIB\
//TCPXLBIN DD DISP=SHR,DSN=TCPIP.STANDARD.TCPXLBIN (optional)

1. The SMAFT server listening port must be supplied on the command line.
2. Members XPFTAGT, XPFTPARM and XPRXCRC must be in the SYSEXEC library.
3. Security is determined using normal z/OS security server rules.

If "Backup then Overwrite" or "Backup then Append" is set on the File Transfer job in SMA Opcon and the target machine is a z/OS machine, the SMAFT agent attempts to call a REXX program named XPFTBACK, with the name of the target dataset. XPFTBACK is responsible for whatever actions are appropriate to back up the dataset. If it exists, and returns with a zero, the file transfer continues. If XPFTBACK is not found or it returns a non-zero value, the transfer is terminated. A sample member is included in the INSTLIB dataset, with examples of using DFSMS/hsm or SMCOPY to backup the dataset.
