---
sidebar_label: 'XPSTIMER'
title: Using XPSTIMER (GENERICP)
description: "How to use the XPSTIMER utility to add a user-specified delay, force an exit code, abend, or issue a WTOR for testing the z/OS Agent."
tags:
  - Procedural
  - Automation Engineer
  - Agents
---

# Using XPSTIMER (GENERICP)

## What is it?

XPSTIMER is a utility used for testing the z/OS Agent. It adds a user-specified delay, then ends with a user-defined exit code. For consistency with other platforms, it can also be called as GENERICP.

The program PARM controls behavior:

|Positions|Format|Meaning|
|--- |--- |--- |
|1-8|Numeric: hhmmssth|Time delay in hours, minutes, seconds, tenths and hundredths of seconds.|
|9-12|Numeric: nnnn|Normal exit with RC=nnnn.|
|9-12|WTOR|Display a WTOR, then exit after the delay with RC=0000. Note: Answering the WTOR is not necessary and the answer is not used.|
|9-12|ABND|Finish with an Abend after the delay. The abend code is specified in positions 13-16 and defaults to U-0101.|
|13-16|Blank or not present|Abend the step with U-0101.|
|13-16|Numeric: nnnn|Abend the step with U-nnnn.|
|13-16|Sxxx, where xxx are three hex digits|Abend the step with S-xxx.|

:::note
Positions 13-16 are only meaningful if 9-12 is **ABND.**
:::

:::tip Example

Ten second delay:

```jcl
//stepname EXEC PGM=XPSTIMER,PARM=’00001000’
```

Five second delay, finish with RC=16:

```jcl
//stepname EXEC PGM=GENERICP,PARM=’000005000016’
```

Show WTOR, with 30 second delay:

```jcl
//stepname EXEC PGM=XPSTIMER,PARM=’00003000WTOR’
```

Abend U-0101 after half second delay:

```jcl
//stepname EXEC PGM=GENERICP,PARM=’00000050ABND’
```

Abend U-0042 after 5 minute delay:

```jcl
//stepname EXEC PGM=XPSTIMER,PARM=’00050000ABND0042’
```

Abend S-C66 after 15 seconds:

```jcl
//stepname EXEC PGM=XPSTIMER,PARM=’00001500ABNDSC66’
```

:::

An alternative form of the arguments is available that is compatible with the Windows GENERICP program:

|Argument|Default|Values|
|--- |--- |--- |
|-tN|10|N is the delay time, in seconds, between 0 and 359999.|
|-eN|0|N is the desired return code between 0 and 4095.|

In addition to running as a batch program, XPSTIMER, or GENERICP, can be run as a TSO command, using the same arguments. When run under TSO, the completion message is written to the terminal. This means that it can be scheduled through OpCon as a REXX job type.

No special authorization is required. XPSTIMER does not need to be APF-authorized.

## Return codes

| RC | Meaning |
|----|---------|
| 0 | Normal completion (default, or when WTOR is specified). |
| *nnnn* | The return code specified in positions 9-12 of the PARM, or by `-eN`. |
| 4 | Invalid PARM. |

:::tip Example

The following:

```jcl
//DELAY10 EXEC PGM=XPSTIMER,PARM='00001000'
```

is equivalent to

```jcl
//DELAY10 EXEC PGM=XPSTIMER,PARM='-t10'
```

and

```jcl
//DELAY05 EXEC PGM=GENERICP,PARM='000005000004'
```

is equivalent to

```jcl
//DELAY05 EXEC PGM=GENERICP,PARM='-t5 -e4'
```

:::

:::tip Example

As a TSO command, the last example can be run as "genericp -t5 -e4", so it can be scheduled in OpCon as a REXX job type with command genericp and parms -t5 -e4.

:::
