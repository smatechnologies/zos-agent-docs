# Using the XPSCOMM Interface Routine

The XPSCOMM routine is an OpCon/xps API interface to the MSGIN service available to all platform LSAMs. Via XPSCOMM you may add, release, reschedule, delete or mark complete, any OpCon/xps job on the Schedule server. You may also hold, release or start OpCon/xps jobs and schedules and send notifications to event logs.

The PARM field of the execute statement can contain any valid MSGIN string, or \'\$EVENT=eventname\' where eventname is an entry in the OpCon/xps ISPF Event Table. If the PARM is omitted or empty, XPSCOMM will attempt to read the events from the MSGIN DD. This file may be instream data, PDS or sequential file. Both fixed and variable length records are supported. The **\$EVENT=\...** syntax is not supported for file input.

Example XPSCOMM JCL Job Step

![Sample Image](/img/Example-XPSCOMM-JCL-Job-Step.png "Sample Image")

In the above example, a sample job step executes a request to add a job named "IVPJOB17" to the schedule named "IVPMVS1" with frequency code "ONDEMAND".

Security is provided by the source of the "USER=" on the job card or the security ID created by the Started Task or other caller of XPSCOMM. This user-id is passed to OpCon/xps along with the event. This user-id must be defined to OpCon/xps Administration with the necessary authority to the schedule named on the command. Refer to [Working with Security](https://help.smatechnologies.com/opcon/core/latest/UI/Enterprise-Manager/Working-with-Security.md#top) for information regarding setting up OpCon/xps Users and setting up privileges within the **Enterprise Manager** online help.

See the [Mapping z/OS users to OpCon user and token definitions] for details about defining OpCon userids and external event tokens for each user.</p>

XPSCOMM may be executed via batch job, started task, internal called routine or REXX procedure.

Records or parms starting with dollar sign '\$' are passed to OpCon/xps through the MSGIN mechanism after adding the user-id and password. Records from file input that do not start with '\$' are treated as comments and ignored. Parm values that do not start with '\$' will be returned to OpCon/xps in one of two ways, depending on the job's status.

- If the job is being executed by the same OpCon/xps instance, the string will be used to insert a job status description for the job.
- If the job is not being executed by the same OpCon/xps instance, the string will be displayed in the SAM log.

## OpCon MSGIN

XPSCOMM and other functions in the z/OS LSAM (such as step condition code messaging) use what is known as the OpCon/xps "MSGIN" service. This service is available to all LSAM agents, regardless of platform. For more information, refer to [External Events](https://help.smatechnologies.com/opcon/core/latest/OpCon-Events/Defining-Events.md#External) in the **OpCon Events** online help.

The z/OS LSAM provides additional usability to the MSGIN service by allowing the definition of pre-defined MSGIN events in the ISPF Event Table.
