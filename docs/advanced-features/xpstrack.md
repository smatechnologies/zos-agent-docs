# Using XPSTRACK

The XPSTRACK job step program can be used to add jobs to OpCon as tracked external jobs. When a job executes XPSTRACK, it creates a tracking record in the LSAM's job queue and sends a `$JOB:TRACK` event to OpCon, allowing the job's status and completion to be monitored.

:::tip Example

```jcl
//OPCON EXEC PGM=XPSTRACK,
// PARM='[[$NOW]],L1Test,IVPJOB08,ONRequest,PROP1=Val1'
```

:::

The parameters are separated by commas, and are similar to those used in $JOB:ADD events:

| Position | Parameter | Max Length | Description |
|----------|-----------|-----------|-------------|
| 1 | Schedule date | 20 | Schedule date or keyword (`CURRENT`, `[[$NOW]]`, etc.) |
| 2 | Schedule name | 40 | OpCon schedule name |
| 3 | Job name | 64 | OpCon job name. If omitted, the z/OS job name is used |
| 4 | Frequency | 20 | OpCon frequency code |
| 5 | Job instance properties | 100 | Name=value pairs separated by semicolons |

All parameters are optional, but if later parameters are needed, any skipped parameters must be added by commas (e.g.: To specify job instance variables but accept the defaults for everything else, specify: **PARM=',,,,,MyParm=MyValue'**)

:::tip Example

Track the current job with only job instance properties:

```jcl
//OPCON EXEC PGM=XPSTRACK,
// PARM=',,,,PROP1=Val1;PROP2=Val2'
```

:::

If XPSTRACK is executed in a job already being tracked, it will be ignored (RC=0 with message "exists").

## Prerequisites

- The LSAM must be active (XPCB must be initiated).
- XPSTRACK must be in an APF-authorized library (LINKLIB or authorized STEPLIB), as it requires KEY=ZERO to write to the ECSA job tracking queue.

## Return Codes

| RC | Message | Description |
|----|---------|-------------|
| 0 | XPS100I - *jobname*: Tracking record added. | Job tracking record was created and the `$JOB:TRACK` event was sent |
| 0 | XPS100I - *jobname*: exists. | Job is already being tracked — no action taken |
| 4 | XPS050E - XPSTRACK PARM or MSGIN Error | Parameter processing error |
| 8 | XPS051E - XPSTRACK Tracking Error. | LSAM is not active or the PCB could not be located |
