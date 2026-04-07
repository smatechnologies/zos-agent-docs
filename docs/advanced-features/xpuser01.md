# XPUSER01 JCL Streaming Exit

XPUSER01 is a user-written exit that is called for every JCL record during job submission. It allows you to inspect, modify, insert, or cancel JCL before it reaches the z/OS internal reader.

The exit is optional. If the XPUSER01 load module is not found in the LSAM STEPLIB or LINKLIST, submission proceeds normally with no overhead.

## When the Exit Is Called

During job submission, the LSAM reads JCL from the source library and streams it to the internal reader one record at a time. For each 80-byte JCL record, the LSAM calls XPUSER01 (if present) before writing the record. This gives the exit a chance to:

- Examine the JCL record and the job's scheduling metadata
- Modify the JCL record in place
- Insert an additional JCL record after the current one
- Cancel the entire job submission

The exit is loaded once at the start of submission and deleted when submission completes or is cancelled.

## Entry Conventions

| Register | Contents |
|----------|----------|
| R1 | Address of a two-word parameter list |
| R13 | Address of a standard 72-byte save area |
| R14 | Return address |
| R15 | Entry point address |

### Parameter List (addressed by R1)

| Offset | Length | Contents |
|--------|--------|----------|
| +0 | 4 | Address of the 80-byte JCL buffer. This is the JCL record about to be written to the internal reader. |
| +4 | 4 | Address of a copy of the XPJOBQ tracking record for the job being submitted. Mapped by the `@XPJOBQ` DSECT. |

:::note
The XPJOBQ record passed to the exit is a copy. Changes to it are not reflected back to the LSAM.
:::

## Return Codes

Set the return code in R15 before returning.

| RC | Action |
|----|--------|
| 0 | **Continue** — The original JCL record is written to the internal reader unchanged. |
| 4 | **Use altered buffer** — The exit has modified the 80-byte JCL buffer in place. The LSAM writes the modified buffer instead of the original. |
| 8 | **Insert record** — The original JCL record is written first, then the contents of the JCL buffer (as modified by the exit) are written as an additional record. Use this to insert JCL cards after the current record. |
| 12 | **Cancel submission** — The LSAM aborts submission of this job. A `/*DEL` purge card is written to the internal reader. |

Any return code other than 0, 4, 8, or 12 is treated as an error. The LSAM issues message `XPS801E` and forces RC=12 (cancel).

:::warning
RC=12 writes a `/*DEL` card to the internal reader to purge the job. If the first JOB card has already been accepted by JES, the purge may not take effect and results can be unpredictable. If you need to guarantee the job fails after partial submission, insert an invalid JCL record (RC=8) instead of cancelling (RC=12).
:::

## Programming Considerations

### Attributes

- **AMODE 31, RMODE 24** — The exit must be AMODE 31 and RMODE 24.
- **Reusable, not reentrant** — The exit is loaded once per submission and called repeatedly. Because it is not required to be reentrant, you can use static storage areas within the module to maintain counters, flags, or accumulated state across JCL records within a single job and across multiple jobs.

### Linkage

Use standard OS linkage conventions. Save the caller's registers on entry and restore them before returning:

```hlasm
         STM   R14,R12,12(R13)       Save caller's registers
         ...
         L     R13,SAVEA+4           Restore caller's save area
         LM    R14,R12,12(R13)       Restore caller's registers
         LA    R15,retcode           Set return code
         BSM   0,R14                 Return to caller
```

Use `BSM 0,R14` (not `BR R14`) to preserve the caller's addressing mode.

### Error Recovery

The LSAM establishes an ESTAE recovery environment before calling the exit. If the exit abends:

- The LSAM issues message `XPS801E - Abend in User Exit - Submission Aborted`
- The exit is deactivated for subsequent submissions
- The current job submission is aborted

### Resetting the Exit

If the exit has been deactivated due to an abend, or if you have installed a new version, use the operator command:

```
F LSAM,REPUSER1
```

This unloads the current copy and forces a fresh BLDL/LOAD on the next submission.

## XPJOBQ Fields Available to the Exit

The second parameter points to a copy of the job's tracking record mapped by the `@XPJOBQ` DSECT. Key fields include:

| Field | Offset | Length | Description |
|-------|--------|--------|-------------|
| SCHDJOB | +0 | 12 | Short job name (from schedule) |
| SCHDID | +17 | 10 | Unique schedule key |
| JOBNAME | +27 | 8 | z/OS job name |
| JOBNUM | +35 | 8 | JES job number (blank until submitted) |
| JOBFLG1 | +51 | 1 | Primary job status flags |
| JOBETYPE | +148 | 1 | Event type: `B`=batch, `S`=STC, `C`=command, `R`=REXX, `T`=tracked, `F`=file transfer |
| JOBSECID | +161 | 8 | Security user ID for the job |
| JOBJCLDD | +169 | 8 | DDNAME used for JCL source |
| JOBJSCHD | +190 | 20 | Schedule name |
| JOBJLONG | +210 | 20 | Long job name |

For the complete field map, refer to the `@XPJOBQ` DSECT in `hlevel.midlevel.MACLIB`.

## Example

The sample XPUSER01 in `hlevel.midlevel.INSTLIB` demonstrates a simple use case: intercepting job `IVPJOB01` and altering its name to `IVPJOBX1`.

```hlasm
*        Trigger on a specific job name in the JCL JOB card
         CLC   0(10,R7),=C'//IVPJOB01'
         BNE   RETURN0                Skip if not our target job
*
         MVC   TESTWTO+12(35),0(R7)   Display JCL record (debugging)
         WTO   MF=(E,TESTWTO)
         MVI   8(R7),C'X'             Change IVPJOB01 to IVPJOBX1
         B     RETURN4                Tell LSAM to use altered buffer
```

:::tip
Use WTO messages during development to trace which JCL records the exit sees. Remove or conditionalize WTO calls before production use to avoid flooding the console.
:::

## Related Messages

| Message | Description |
|---------|-------------|
| XPS801I - Submit Exit XPUSER01 Active | The exit was found and loaded successfully. |
| XPS801I - User Exit XPUSER01 Reset | The exit was reset via operator command or internal recovery. |
| XPS801A - [jobname] Submission Cancelled by User Exit | The exit returned RC=12, cancelling submission. |
| XPS801E - Abend in User Exit - Submission Aborted | The exit abended. It is deactivated and submission is aborted. |
| XPS801E - Load Failed For XPUSER01 | BLDL succeeded but LOAD failed. Check STEPLIB. |
| XPS801E - Invalid Return Code From User Exit | The exit returned a value other than 0, 4, 8, or 12. |
