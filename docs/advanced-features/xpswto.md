# Using XPSWTO

The XPSWTO utility issues a WTO (Write To Operator) message with user-supplied text. It can be used to send operator messages from JCL, to test WTO trigger definitions in the automation tables, or to programmatically fire WTO-based triggers from within a running job.

## Invocation

### Batch JCL

```jcl
//STEP01   EXEC PGM=XPSWTO,
// PARM='IEF404I Custom message text here'
```

### TSO Command

```
XPSWTO IEF404I Custom message text here
```

If no PARM is provided, XPSWTO issues the default message `XPSWTO message`.

## How It Works

XPSWTO issues the PARM text as a z/OS WTO message with ROUTCDE=(14). The message is visible on the operator console and in SYSLOG. If the LSAM is active, the message will be processed by the LSAM's WTO exit (XPSWTOEX) and matched against the WTO trigger table.

This makes XPSWTO useful for:

- **Testing WTO triggers**: Define a WTO trigger in the ISPF automation tables, then use XPSWTO to issue a matching message and verify the trigger fires correctly.
- **Firing triggers from JCL**: A job step can issue a WTO that triggers an LSAM action (event, auto-reply, or command) defined in the WTO table.
- **Flexible job-level triggers with $JOBTRIG**: Combined with the `$JOBTRIG` special event token, XPSWTO allows a job step to write Trigger Messages into LSAM Feedback. The LSAM's WTO trigger table matches the XPSWTO message and, because the action is `$JOBTRIG`, writes it to the Trigger Messages section of the job's LSAM Feedback (XML field 12803). This text is then available for OpCon job event triggering — it can be matched by string criteria in the Events tab of the job definition. See [Special Event Token Values](ispf.md#special-event-token-values) for details.

## Prerequisites

- No special authorization is required. XPSWTO does not need to be APF-authorized.
- For WTO trigger matching, the LSAM must be active.

## Return Codes

XPSWTO always returns RC=0.

:::tip Example

To test a WTO trigger that matches message ID `IEF285I`:

```jcl
//TEST     EXEC PGM=XPSWTO,
// PARM='IEF285I MYDATA.SET.NAME CATALOGED'
```

:::
