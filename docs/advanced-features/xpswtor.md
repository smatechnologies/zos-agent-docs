# Using XPSWTOR

The XPSWTOR utility issues a WTOR (Write To Operator with Reply) and waits for an operator response. The reply is validated against a list of acceptable characters, and the character's position in the list determines the return code. This allows operator-controlled decision points in JCL via COND= or IF/THEN/ELSE testing.

## Invocation

```jcl
//DECIDE   EXEC PGM=XPSWTOR,
// PARM='Reply Y to continue or N to cancel'
```

If no PARM is provided, XPSWTOR issues the default message:

    *nn XPSWTOR - Reply U to continue or N to stop

## How It Works

1. XPSWTOR issues the PARM text as a WTOR with ROUTCDE=14.
2. The operator sees the message and must reply with a single character.
3. The reply is forced to uppercase and validated against the acceptable reply list.
4. If the reply is not in the list, the message `Invalid Reply` is issued and the WTOR is redisplayed.
5. Once a valid reply is entered, XPSWTOR exits with a return code equal to the 0-based position of the reply character in the list.

## Default Reply List

The default acceptable replies are `U`, `N`, `Y`, producing the following return codes:

| Reply | Return Code | Meaning (default) |
|-------|-------------|-------------------|
| **U** | 0 | Continue (Up) |
| **N** | 1 | Stop (No) |
| **Y** | 2 | Yes |

## Prerequisites

- No special authorization is required.
- An operator (or automation product) must be available to reply to the WTOR.
- If the LSAM has a WTO trigger with an auto-reply matching the XPSWTOR message, the reply can be automated. See [Automated Response Feature](ispf.md#automated-response-feature) for details on setting up auto-replies.

:::tip Example

Use XPSWTOR to let an operator decide whether to continue processing:

```jcl
//ASK      EXEC PGM=XPSWTOR,
// PARM='Reply Y to rebuild or N to skip'
//REBUILD  EXEC PGM=MYPROG,COND=(1,LE,ASK)
```

In this example, if the operator replies `U` (RC=0) or `N` (RC=1), the REBUILD step is skipped because `1 LE 0` is false but `1 LE 1` is true. Only a reply of `Y` (RC=2) allows REBUILD to execute.

:::

:::tip Example

Automate the reply using a WTO trigger with the auto-reply feature. Define a WTO trigger entry where the message key matches `XPSWTOR` and the action is set to `+Y`. When XPSWTOR issues its WTOR, the LSAM will automatically reply `Y`, resulting in RC=2.

:::
