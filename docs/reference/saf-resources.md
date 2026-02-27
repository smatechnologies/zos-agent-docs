# SAF Resource Reference

The z/OS LSAM uses the System Authorization Facility (SAF) to enforce security in several areas. This page consolidates all SAF resource checks performed by the LSAM.

## Summary

| Resource Class | Resource Name | Access | Purpose |
|---|---|---|---|
| SURROGAT | *userid*`.SUBMIT` | READ | LSAM job submission on behalf of a user |
| FACILITY | `OPCON.XPS$`*x*`.XPSPF` | UPDATE | ISPF automation table maintenance |
| DATASET | *(user-specified DSN)* | READ/UPDATE/CONTROL/ALTER | User authority to dataset before saving JCL |
| SURROGAT | *userid*`.SUBMIT` or *userid*`.OPCON` | READ | XPSCOMM userid override for event submission |
| *(EXTRACT)* | CSDATA fields `XPSUSER` / `XPSTOKEN` | N/A | z/OS-to-OpCon userid and token mapping |

## SURROGAT Class — Job Submission

The LSAM submits batch jobs on behalf of z/OS users. SAF SURROGAT class authorization is required so the LSAM started task can submit jobs with another user's identity on the job card.

This must be defined for each execution userid that the LSAM will submit jobs for.

See [Security Setup](../customization.md#security-setup) for setup instructions and example RACF commands.

## FACILITY Class — ISPF Automation Table Updates

Automation table updates through the ISPF interface (XPSPF001) can be secured through the FACILITY class.

**Resource name:** `OPCON.XPS$`*x*`.XPSPF`, where *x* is the XPSID of the system being accessed.

**Access required:** UPDATE to modify tables; READ access (or no profile defined) allows read-only access.

Generic and discrete profiles are supported.

See [ISPF Table Security](../advanced-features/ispf.md) for setup examples.

## DATASET Class — JCL Save Authorization

When an OpCon user saves JCL to a mainframe dataset through the JCL editor, the LSAM maps the OpCon userid to a z/OS userid and checks that user's authority to the target dataset before allowing the save.

**Access required:** Varies by operation (READ, UPDATE, CONTROL, or ALTER).

The userid mapping process is described in [OpCon Userid in the z/OS LSAM](../customization.md#opcon-userid-in-the-zos-lsam).

## SURROGAT Class — XPSCOMM Event Userid Override

When a `$EVENT=` reference in XPSCOMM resolves to an event with a Security ID override, the LSAM checks SURROGAT class authorization. The calling user must have READ access to one of:

- *override-userid*`.SUBMIT` in the SURROGAT class
- *override-userid*`.OPCON` in the SURROGAT class

If authorization fails, message XPS051W is issued and the override is ignored — the event is sent with the calling user's own identity.

For backward compatibility, READ access is assumed for *override-userid*`.OPCON` if the profile is not defined.

See [XPSCOMM Security](../advanced-features/xpscomm.md#security) for details.

## SAF EXTRACT — OpCon Userid and Token Mapping

The LSAM can extract custom fields from a user's SAF profile to map z/OS userids to OpCon event userids and tokens.

| Field | Default Name | Max Length | Purpose |
|---|---|---|---|
| OpCon user | `XPSUSER` | 128 characters | OpCon event userid (if omitted, the z/OS userid is used) |
| OpCon token | `XPSTOKEN` | 36 characters | OpCon external event token |

These values are extracted using a standard SAF EXTRACT call against the CSDATA (custom segment data) section of the user profile.

See [Mapping z/OS Users to OpCon User and Token Definitions](../advanced-features/mapping.md) for custom field definitions and setup instructions.
