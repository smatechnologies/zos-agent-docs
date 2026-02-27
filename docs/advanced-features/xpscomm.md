# Using the XPSCOMM Interface Routine

The XPSCOMM routine is an OpCon/xps API interface to the MSGIN service available to all platform LSAMs. Via XPSCOMM you may add, release, reschedule, delete or mark complete, any OpCon/xps job on the Schedule server. You may also hold, release or start OpCon/xps jobs and schedules, set properties and thresholds, display console messages, and send notifications to event logs.

XPSCOMM may be executed via batch job, started task, internal called routine, TSO command or REXX procedure. The only requirement is that the LSAM must be active (XPCB must be initiated).

## PARM Input

The PARM field of the execute statement can contain any valid MSGIN string, or `$EVENT=eventname` where eventname is an entry in the OpCon/xps ISPF Event Table.

```jcl
//STEP01   EXEC PGM=XPSCOMM,
// PARM='$JOB:ADD,[[$NOW]],IVPMVS1,IVPJOB17,ONDEMAND'
```

In the above example, a sample job step executes a request to add a job named "IVPJOB17" to the schedule named "IVPMVS1" with frequency code "ONDEMAND".

### Named Events

The `$EVENT=` syntax looks up the named event in the LSAM's Event Table and builds the complete MSGIN string from the event definition:

```jcl
//STEP01   EXEC PGM=XPSCOMM,
// PARM='$EVENT=ADDJOB17'
```

An optional comma-delimited data value may follow the event name. If the event definition's token value or message field contains `&TEXT`, the data value replaces it:

```jcl
//STEP01   EXEC PGM=XPSCOMM,
// PARM='$EVENT=MYEVENT,substitution data here'
```

:::note
The `$EVENT=` syntax is not supported for file input via the MSGIN DD.
:::

### Non-Event Text

PARM values that do not start with `$` will be returned to OpCon/xps in one of two ways, depending on the job's status:

- If the job is being executed by the same OpCon/xps instance, the string will be sent as a job status description for the job. Descriptions up to 4000 characters are supported when running authorized.
- If the job is not being executed by the same OpCon/xps instance, the string will be displayed in the SAM log via a `$CONSOLE:DISPLAY` event.

:::tip Example
```jcl
//STEP01   EXEC PGM=XPSCOMM,
// PARM='Processing complete: 1500 records loaded successfully'
```
:::

:::note
Commas in non-event text are translated to pipes (`|`) to avoid conflict with MSGIN field delimiters.
:::

## MSGIN DD File Input

If the PARM is omitted or empty, XPSCOMM will attempt to read the events from the MSGIN DD. This file may be instream data, a PDS member, or a sequential file. Both fixed and variable length records are supported.

```jcl
//STEP01   EXEC PGM=XPSCOMM
//MSGIN    DD   *
$JOB:ADD,[[$NOW]],MySchedule,JOB001,Daily
$JOB:ADD,[[$NOW]],MySchedule,JOB002,Daily
$PROPERTY:SET,BatchComplete,YES
/*
```

Processing rules for the MSGIN file:

- Each record is processed as a separate event.
- Only records beginning with `$` are processed as events. Records that do not start with `$` are treated as comments and ignored.
- Leading and trailing sequence numbers (8-digit numeric fields) are automatically stripped from both fixed-length and variable-length records.
- Trailing blanks are trimmed from each record.

## Selecting the Target LSAM

In a multiple LSAM environment, the destination LSAM can be selected by:

### @x PARM Prefix

Prefix the PARM with `@x,` where *x* is the single-character XPSID. The remaining parms will be processed as if the `@x,` were not present.

```jcl
//STEP01   EXEC PGM=XPSCOMM,
// PARM='@A,$JOB:ADD,[[$NOW]],IVPMVS1,IVPJOB17,ONDEMAND'
```

This directs the event to the LSAM instance identified by XPSID `A` (control block name `XPA`).

### XPS$x DD Statement

Allocate a DD with the name `XPS$x` where *x* is the XPSID character. This is particularly useful when invoking XPSCOMM from TSO or REXX:

```
ALLOC DD(XPS$A) DUMMY
CALL 'hlq.LINKLIB(XPSCOMM)' '$JOB:ADD,...'
```

### Default

If neither method is specified, XPSCOMM uses the default LSAM instance located by the XPSFETCH routine.

## TSO Invocation

XPSCOMM can also be called as a TSO command. The TSO command arguments will be treated as PARM input.

```
XPSCOMM $JOB:ADD,[[$NOW]],IVPMVS1,IVPJOB17,ONDEMAND
```

:::note
For TSO command invocation, optionally add XPSCOMM to the `AUTHCMD NAMES` section of the IKJTSOxx parmlib member. This enables authorized execution from TSO, which removes the 117-character message length limitation.
:::

## Security

Security is provided by the source of the `USER=` on the job card or the security ID created by the Started Task or other caller of XPSCOMM. This user-id is passed to OpCon/xps along with the event. This user-id must be defined to OpCon/xps Administration with the necessary authority to the schedule named on the command. Refer to [Working with Security](https://help.smatechnologies.com/opcon/core/latest/UI/Enterprise-Manager/Working-with-Security.md#top) for information regarding setting up OpCon/xps Users and setting up privileges within the **Enterprise Manager** online help.

See [Mapping z/OS users to OpCon user and token definitions](mapping.md) for details about defining OpCon userids and external event tokens for each user.

### Authorized vs. Unauthorized Execution

XPSCOMM operates in one of two modes depending on APF authorization:

| Mode | Message Delivery | Message Length |
|------|-----------------|----------------|
| **Authorized** (APF) | Writes directly to the ECSA message queue | No practical limit |
| **Unauthorized** | Sends via WTO, which the LSAM intercepts | Maximum 117 characters |


### Event Table Security Overrides

If a `$EVENT=` reference resolves to an event with a Security ID override, XPSCOMM enforces RACF SURROGAT class authorization. The calling user must have READ access to one of:

- *override-userid*`.SUBMIT` in the SURROGAT class
- *override-userid*`.OPCON` in the SURROGAT class

If authorization fails, message XPS051W is issued and the override is ignored — the event is sent with the calling user's own identity. This check is only performed when running authorized; in unauthorized mode the override is always silently ignored.

>For backward compatibility, READ access is assumed for *override*`.OPCON` if the profile is not defined.

## OpCon MSGIN

XPSCOMM and other functions in the z/OS LSAM (such as step condition code messaging) use what is known as the OpCon/xps "MSGIN" service. This service is available to all LSAM agents, regardless of platform. For more information, refer to [External Events](https://help.smatechnologies.com/opcon/core/latest/OpCon-Events/Defining-Events.md#External) in the **OpCon Events** online help.

The z/OS LSAM provides additional usability to the MSGIN service by allowing the definition of pre-defined MSGIN events in the ISPF Event Table.

### Supported Event Types

Any valid OpCon MSGIN event string may be passed to XPSCOMM. The supported event types and their syntax are:

#### $JOB Events

```
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

#### $SCHEDULE Events

```
$SCHEDULE:BUILD,schedule-date,schedule-name
$SCHEDULE:HOLD,schedule-date,schedule-name
$SCHEDULE:RELEASE,schedule-date,schedule-name
$SCHEDULE:START,schedule-date,schedule-name
```

#### $MACHINE Events

```
$MACHINE:STATUS,machine-id,U|D|LIMITED
```

#### $PROPERTY Events

```
$PROPERTY:SET,property-name,property-value
$PROPERTY:ADD,property-name,property-value
$PROPERTY:DELETE,property-name
```

#### $THRESHOLD Events

```
$THRESHOLD:SET,threshold-name,threshold-value
```

#### $CONSOLE Events

```
$CONSOLE:DISPLAY,message
```

#### $NOTIFY Events

```
$NOTIFY:LOG,severity,event-number,message
```

Where severity is `I` (Information), `W` (Warning), or `E` (Error), and event-number is a 5-digit number (00001-99999).

### Schedule Date Values

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

## Return Codes

| RC | Message | Description |
|----|---------|-------------|
| 0 | XPS052I - XPSCOMM Processing Successful | All events processed successfully |
| 4 | XPS050E - XPSCOMM PARM or MSGIN Error | The MSGIN DD could not be opened, or no valid input was found |
| 8 | XPS065E - XPSCOMM Event *eventname* Not Found | A `$EVENT=` reference specified an event name that does not exist in the Event Table |

## Messages

| Message ID | Text | Description |
|------------|------|-------------|
| XPS047I | *(event text)* | Echoes the MSGIN event string being sent (issued for `$EVENT=` lookups) |
| XPS050E | XPSCOMM PARM or MSGIN Error | Input error — no PARM provided and the MSGIN DD failed to open |
| XPS051W | Userid override not authorized for *userid* | A `$EVENT=` event had a Security ID override, but the calling user lacks SURROGAT authorization |
| XPS052I | XPSCOMM Processing Successful | Normal completion |
| XPS065E | XPSCOMM Event *eventname* Not Found | The named event does not exist in the Event Table |
