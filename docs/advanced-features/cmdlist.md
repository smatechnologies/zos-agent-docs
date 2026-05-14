# Capturing Operator Command Output with CMDLIST

OpCon **Command-type** events issue a z/OS operator command via the LSAM's internal `MGCRE` interface but do not capture the response — the only feedback the user sees is "Command Issued" or "Command Failed" on the event. When you need to see what the command actually produced (for example, the output of `D T`, `D A,L`, or `$D Q`), schedule the command as a **REXX-type** event that runs the `CMDLIST` sample exec instead. `CMDLIST` activates an Extended MCS console, issues the command, harvests the responses, and writes them to SYSTSPRT — which is retrievable through the standard JORS interface alongside the event.

## Where to Get It

`CMDLIST` ships as a sample, not as an installed module. Copy [`samples/cmdlist.rexx`](https://github.com/smatechnologies/Agent-zOS/blob/master/samples/cmdlist.rexx) from the LSAM source distribution into a library that is concatenated to the LSAM's `SYSEXEC` DD (the same library used for any other dynamic REXX event — typically `OPCON.`*ver*`.INSTLIB` or a customer-owned exec library).

:::note
The exec must be named `CMDLIST` (or whatever name you choose to invoke from OpCon). REXX names are case-insensitive on z/OS.
:::

:::note
If your LSAM release package does not include a `samples` directory, contact Continuous support to obtain `cmdlist.rexx`.
:::

## How It Works

`CMDLIST` is 51 lines of REXX:

1. Activates an Extended MCS console for the REXX session via `console activate`.
2. Sets a console profile that suppresses solicited/unsolicited display routing (`consprof soldisplay(no) unsoldisplay(no)`) so responses come back through the message queue, not the operator console.
3. Issues each command via `address console <cmd>`.
4. Drains the response queue with the REXX built-in `getmsg("resp.",,,,1)` (1-second poll, looped until idle).
5. `say`s each captured line — which lands in SYSTSPRT.
6. Deactivates the console.

Because each REXX event runs in its own XPSEVENT address space, its console is private to that run.

## Invocation Modes

### Mode 1 — Inline Command

Use this for ad-hoc commands defined entirely within the OpCon event.

**Form:**

```
CMDLIST % <z/OS command>
```

The `%` argument tells `CMDLIST` to skip the command dataset and use the rest of the parm as a single command.

**OpCon event definition:**

| Field | Value |
|---|---|
| Job Type | REXX (R) |
| Procedure | `CMDLIST` |
| Parameters | `% D T` |

**Resulting SYSTSPRT:**

```
D T
 IEE136I LOCAL: TIME=14.23.07 DATE=2026.134  UTC: TIME=18.23.07 DATE=2026.134
```

The first line is echoed from the exec's `say cmdstring`; the second line is the captured response.

### Mode 2 — Command List in a Dataset

Use this when you want a single event to issue several commands, or when the command text is too long or sensitive to keep in the event definition.

**Form:**

```
CMDLIST <member>
```

`CMDLIST` reads `opcon.commands(<member>)` and issues each line whose first word is `MVSCMD`. Lines without that prefix are ignored, so you can mix comments in.

**Default command dataset:**

The exec hardcodes the command dataset name as:

```rexx
cmddsn = 'opcon.commands'
```

The TSO `ALLOC` command wraps the value in single quotes, so it is treated as fully qualified — TSO does **not** prepend the running userid. By default the exec opens `OPCON.COMMANDS(<member>)` literally. To use a different name, edit the exec — there is no parameter for it.

**Example member contents** (`opcon.commands(DAILYCHK)`):

```text
* Daily system check
MVSCMD D T
MVSCMD D A,L
MVSCMD D ASM
MVSCMD $D Q
```

**OpCon event definition:**

| Field | Value |
|---|---|
| Job Type | REXX (R) |
| Procedure | `CMDLIST` |
| Parameters | `DAILYCHK` |

## Retrieving the Captured Output

Output goes to the REXX event's SYSTSPRT, which is allocated as a SYSOUT dataset under the class set by the [`MSGCLASS`](../customization.md) parameter in `XPSPRMxx` (default `A`). The event's spool output is retrievable through the standard JORS interface — OpCon users see the captured response lines next to the event in the job-output viewer with no extra configuration.

## Authorization

Commands routed through `address console` are subject to standard z/OS SAF checks. Two classes typically apply:

| Class | Resource | Required Access |
|---|---|---|
| `OPERCMDS` | The specific MVS or JES command being issued (e.g., `MVS.DISPLAY.TIME`) | READ (or higher for action commands) |
| `OPERCMDS` | `MVS.MCSOPER.`*consname* | READ (granted automatically for dynamically-named consoles in most shops) |

### Which USERID Runs the Command

Each REXX event runs in its own dynamic address space created by `ASCRE`. The USERID of that address space — and therefore the USERID the `OPERCMDS` checks are evaluated against — is assigned by SAF from the **STARTED** class, keyed on the start command that XPSUBMIT issues:

| `XPSDYNAM` setting | Start command issued | STARTED-class key matched |
|---|---|---|
| Set to a customer proc (e.g., `XPSDYNAM`) | `XPSDYNAM,JOBNAME=CMDLIST,PROG=XPSEVENT,...` | `XPSDYNAM.CMDLIST` |
| Unset, or set to `IEESYSAS` (default) | `IEESYSAS.CMDLIST,PROG=XPSEVENT,...` | `CMDLIST.CMDLIST` |

The JOBNAME portion is the REXX procedure name from the OpCon event definition — `CMDLIST` in the examples on this page.

See [Customization → XPSDYNAM](../customization.md) for the parameter, and the IBM *Security Server RACF Security Administrator's Guide* for STARTED-class profile syntax.

### Per-Exec USERIDs

Because the STARTED-class key includes the JOBNAME, every invocation of a given exec name resolves to the same USERID. If you need different USERIDs for different command categories (e.g., a low-authority USERID for `DISPLAY` commands and a higher-authority USERID for action commands), create copies or aliases of `CMDLIST` under distinct names and define separate STARTED-class entries for each:

```
RDEFINE STARTED CMDLDISP.CMDLDISP STDATA(USER(OPCONDSP) GROUP(OPCONGRP) TRACE(YES))
RDEFINE STARTED CMDLOPER.CMDLOPER STDATA(USER(OPCONOPR) GROUP(OPCONGRP) TRACE(YES))
SETROPTS RACLIST(STARTED) REFRESH
```

The OpCon event definition then references the chosen alias (`CMDLDISP`, `CMDLOPER`) as the REXX procedure name.

See [SAF Resource Reference](../reference/saf-resources.md) for the LSAM's overall SAF model.

## Limitations

- **Quiet-period heuristic.** `getmsg` returns when the response queue is idle for 1 second. Commands that produce delayed output (some `START`, async DB2/IMS commands) may exit before all lines arrive. Edit the exec to increase the timeout or add a hard wait if needed.
- **No WTOR capture.** Commands that issue a Write-To-Operator-with-Reply (`WTOR`) are not handled — the reply prompt goes to the operator console, not to the EMCS message queue.
- **Line-by-line, not screen-formatted.** Responses are captured in the order they are routed by MCS. Commands like `D A,L` preserve line order but not the console-screen geometry that interactive operators see.
- **Single USERID per exec name.** All invocations of a given REXX procedure run under the same USERID — the one assigned by the SAF STARTED-class lookup for that exec. To vary the USERID by purpose, deploy aliases under different names (see [Authorization](#authorization)).
- **Dataset path is hardcoded.** Mode 2 always opens `OPCON.COMMANDS` as a fully qualified name. To use a site-specific name, edit the exec.

## Customizing

The sample is intentionally minimal so you can fork it. Common customizations:

- Increase the `getmsg` timeout (5th argument) for commands with delayed output.
- Filter responses (e.g., drop heading lines, summarize counts).
- Chain conditional commands (issue command B only if command A's output contains a string).
- Loop over a range of values.
- Change `cmddsn` to a site-standard library, or accept it as a parameter.

Copy `cmdlist.rexx` to a new name in your SYSEXEC library before modifying — keep the shipped sample untouched so future LSAM upgrades don't overwrite your changes.

:::tip Example — Display system time at a scheduled point
1. Copy `cmdlist.rexx` into the LSAM's SYSEXEC library.
2. In OpCon, define a REXX event:
   - Procedure: `CMDLIST`
   - Parameters: `% D T`
3. Schedule the event.
4. After it runs, retrieve the event's SYSTSPRT through JORS to see the `IEE136I` response.
:::

## See Also

- [Customization](../customization.md) — `MSGCLASS`, `XPSDYNAM`, SYSEXEC library setup
- [SAF Resource Reference](../reference/saf-resources.md) — broader SAF model
- [Mapping z/OS Users to OpCon Users](mapping.md) — outbound event identity (note: does **not** change the execution USERID for inbound commands)
