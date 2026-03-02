# Dataset Cleanup Filter Table

The dataset cleanup filter table controls which datasets are protected from automatic cleanup during job restarts and duplicate dataset processing. The table is managed by the XPRLIST utility and stored in CSA.

## Overview

When the LSAM's restart support is active (`RESTART=Y`), or when duplicate dataset actions are configured (`DUPDSNACT` or `RESDSNACT`), the LSAM's step initiation exit (XPRUSI) checks every dataset that a step is about to create. If that dataset already exists in the catalog, the LSAM takes an action based on the run-time configuration:

- **DELETE** -- scratch the dataset from an online DASD volume
- **UNCATLG** -- uncatalog the dataset (for tape or offline DASD)
- **HDELETE** -- delete an HSM-migrated dataset
- **REUSE** -- convert `DISP=NEW` to `DISP=OLD` to reuse the existing allocation

The filter table provides a way to **override** this behavior for specific datasets or volumes. An entry marked **Exclude** (`X`) tells the LSAM to **retain** the dataset -- skip cleanup entirely. An entry marked **Include** (`I`) tells the LSAM to **force cleanup** even if other rules might skip it.

:::note
`SYS1.*` datasets are always retained regardless of the filter table. This is a hardcoded safety rule in the XPRUSI exit.
:::

## How Filtering Works

When the XPRUSI exit encounters a pre-existing dataset, it checks the filter table in two passes:

1. **Dataset name filter** -- each `DSN=` entry is compared against the dataset name.
2. **Volume serial filter** -- each `VOL=` entry is compared against the volume serial of the cataloged dataset.

The table is scanned sequentially. The **first matching entry wins** -- its action (`X` or `I`) determines whether the dataset is retained or cleaned up. If no entry matches, the dataset is cleaned up according to the `DUPDSNACT` or `RESDSNACT` setting.

The DSN filter table is also checked during job initiation when resetting GDG (Generation Data Group) entries for restart.

### Wildcard Patterns

Filter patterns support two wildcard characters:

| Wildcard | Behavior |
|----------|----------|
| `*` | Matches zero or more characters within a dataset qualifier (up to a `.` or end of name). When `*` is the **last character** in the pattern, it matches everything to the end of the dataset name. |
| `%` | Matches exactly **one** character, except `.` (dot). |

:::tip Examples

| Pattern | Matches | Does Not Match |
|---------|---------|----------------|
| `PROD.*` | `PROD.DATA`, `PROD.BACKUP.FILE` | `PRODUCTION.DATA` |
| `PROD.*.DATA` | `PROD.TEMP.DATA`, `PROD.XX.DATA` | `PROD.DATA`, `PROD.A.B.DATA` |
| `PROD.D%TA` | `PROD.DATA`, `PROD.DXTA` | `PROD.DXXTA`, `PROD.D.TA` |
| `TEST*` | `TEST`, `TESTING`, `TEST1` | (at end of pattern, matches all remaining characters) |

:::

## XPRLSTxx Member Format

The filter table is loaded from a member named `XPRLSTxx` in the XPSPARMS library, where `xx` is the two-character suffix specified by the `XPRLIST` parameter in XPSPRMxx.

Each record is 80 bytes, fixed-length. The format is:

```
[action]type=pattern
```

Where:

| Field | Values | Description |
|-------|--------|-------------|
| action | `X` or `I` | **X** = Exclude from cleanup (retain the dataset). **I** = Include in cleanup (force deletion). If omitted, defaults to **X**. |
| type | `DSN` or `VOL` | The type of filter entry. |
| pattern | up to 44 characters | The filter pattern, which may include `*` and `%` wildcards. |

Lines beginning with `*`, `#`, or `;` are treated as comments and ignored.

:::tip Example XPRLSTxx member

```
* Filter table for production LSAM
* Protect master reference files
XDSN=PROD.MASTER.*
XDSN=PROD.REFDATA.*
* Protect all datasets on the SHARED volume
XVOL=SHARED
* But force cleanup of temporary datasets even during restart
IDSN=PROD.TEMP.*
IDSN=PROD.SCRATCH.*
```

:::

## XPRLIST Parameter

The `XPRLIST` parameter in XPSPRMxx specifies the two-character suffix of the XPRLSTxx member to load at LSAM startup.

```
XPRLIST=00
```

This causes the LSAM to load member `XPRLST00` from the XPSPARMS library during initialization. If the parameter is blank or omitted, no filter table is loaded.

## Operator Commands

The filter table can be managed at run time using the LSAM modify command. Changes made through operator commands persist until the next IPL or until the table is reloaded.

| Command | Description |
|---------|-------------|
| `F lsamname,XPRLIST,DISPLAY` | Display the current filter table contents on the operator console. |
| `F lsamname,XPRLIST,ADD,[I\|X]DSN=pattern` | Add a dataset filter entry. |
| `F lsamname,XPRLIST,ADD,[I\|X]VOL=pattern` | Add a volume filter entry. |
| `F lsamname,XPRLIST,DELETE,[I\|X]DSN=pattern` | Remove a dataset filter entry. The entry must match exactly. |
| `F lsamname,XPRLIST,DELETE,[I\|X]VOL=pattern` | Remove a volume filter entry. The entry must match exactly. |
| `F lsamname,XPRLIST=xx` | Reload the filter table from member XPRLSTxx. This **replaces** the entire table. |

:::caution
Operator command changes are held in memory only. To make permanent changes, update the XPRLSTxx member and reload it. The table is lost at IPL and rebuilt from XPRLSTxx at the next LSAM startup.
:::

:::tip Example

To temporarily protect a dataset during a restart window:

```
F OPCON01,XPRLIST,ADD,XDSN=PAYROLL.MASTER.FILE
```

After the restart window is complete, remove the entry:

```
F OPCON01,XPRLIST,DELETE,XDSN=PAYROLL.MASTER.FILE
```

:::

## Table Lifecycle

1. **IPL** -- CSA storage is cleared. No filter table exists.
2. **LSAM startup** -- If `XPRLIST=xx` is set in XPSPRMxx, the LSAM calls XPRLIST to load member XPRLSTxx from the XPSPARMS library. The table is built in CSA (subpool 241).
3. **Run time** -- Operator commands (`ADD`, `DELETE`) modify the table in place. These changes are immediate but not persistent.
4. **Reload** -- `F lsamname,XPRLIST=xx` completely replaces the table from the specified member.
5. **IPL** -- The cycle repeats.

## XPSAUDIT Display

When the LSAM task is not running, the XPSAUDIT task can display the filter table:

```
S XPSAUDIT,PARM=DSNT
```

## Prerequisites

- The LSAM must be active (the XPCB control block must be initialized) before the filter table can be loaded or modified.
- XPRLIST must reside in an APF-authorized library, as it uses `MODESET KEY=ZERO` to write to CSA storage.
- `RESTART=Y` (or `DUPDSNACT`/`RESDSNACT` set to a value other than `NONE`) must be configured for the filter table to have any effect.

## Messages

| Message | Description |
|---------|-------------|
| XPR060A - No PCB Available - Activate LSAM | The LSAM has not been started. The filter table cannot be loaded without an active LSAM. |
| XPR101E - Invalid or missing parms | An XPRLIST command was not recognized. Check the command syntax. |
| XPR102E - NO XPSPARMS DD OR MEMBER NOT FOUND | The XPSPARMS DD is not present in the LSAM JCL, or the requested XPRLSTxx member does not exist. |
| XPR105I - FILTER TABLE UPDATED | The filter table was successfully loaded or modified. |
| XPR200I - No Filter Table | An XPRLIST DISPLAY was requested, but no filter table has been loaded. |
| XPR200I - Filter table contents | An XPRLIST DISPLAY was requested. The table entries follow this message. |
| XPR010I RETAIN *dataset.name* (*volume*) | During dataset cleanup, a dataset matched the filter table and was retained. |
