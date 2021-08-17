# Installation Checklist

COMPANY:

DATE:

1. **FILE ALLOCATIONS, STAGE1 AND STAGE2 INSTALLATION JCL**:
    a.  \_\_\_\_ Upload installation file

    b.  \_\_\_\_ Receive installation library from file

    c.  \_\_\_\_ Run BUILDJOB dialogue

    d.  \_\_\_\_ Stage1 JCL reviewed for installation standards

    e.  \_\_\_\_ Stage1 JCL executed successfully

    f.  \_\_\_\_ Stage2 JCL reviewed for installation standards

    g.  \_\_\_\_ State2 JCL executed successfully

    h.  \_\_\_\_ OPCONxx Proc checked for proper standards, naming
        conventions and syntax

    i.  \_\_\_\_ RECLOG GDG Defined and Initialized.
2.  **COMMUNICATIONS SETUP**:
    a.  \_\_\_\_ PING to SAM IP Addr:
        \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
        using TSO \"PING\" command. Ensure IP address is accessible
        before starting installation testing.
3.  **LSAM PARAMETERS**:
    a.  \_\_\_\_ Review XPSPRMxx for installation requirements:
4.  **FILES and PLACEMENTS**: (XPS390 libraries created by \"XPS390
    Allocate.jcl\" file from Setup):
    a.  \_\_\_\_ Review library and file placement
    b.  \_\_\_\_ Review for proper APF authorization and access.

  LSAM Files                   Members   DOC, SPECIAL ATTRIBUTES OR ACTIONS
  --------------------------- ---------- --------------------------------------
  **OPCON.V140303.LINKLIB**    XPSFETCH  APF Auth Required
                               XPSQMGR   APF Auth Required
                               XPSASCRE  APF Auth Required, LINKLST Resident
                               XPSCOMM   APF Auth Required
                               XPSPARM   APF Auth Required
                               XPSUBMIT  APF Auth Required
                               XPSAUDIT  APF Auth Required
                               XPSLOGQ   APF Auth Required
                               XPSPLEX   APF Auth Required
                               XPRESTRT  APF Auth Required
                               XPSTATUS  APF Auth Required
                               XPSEVENT  APF Auth Required, LINKLIST Resident
                               XPSERVER  APF Auth Required
                               XPSAGENT  APF Auth Required
                               XPSELOAD  APF Auth Required
                               XPSWTOEX  APF Auth Required
                                XPSU83   APF Auth Required
                                XPSU84   APF Auth Required
                                XPSUJV   APF Auth Required
                                XPRUSI   APF Auth Required
                               XPSISPF   LINKLST Resident or TSO Steplib
                               XPSPAUTH  APF Auth Required, LINKLST Resident
                               XPSPF001  LINKLST Resident or TSO Steplib
                               XPSAFAPI  APF Auth Required, LINKLST Resident
                               XPSSUPV   APF Auth Required
                               XPRLIST   APF Auth Required
  **SYS1.PROCLIB**             OPCONxx   XPS390 Started Task(s)
                               IVPPROC1  IVP STC Tests
                               XPSAUDIT  IVP and Status
                               XPSPLEX   Sysplex Communications Task
                               XPFTSRVR  SMAFT server task

  : z/OS LSAM Files and Placements

1.  **SECURITY DEFINITIONS**:
    a.  \_\_\_\_ LSAM task (e.g., OPCON01) must be an authorized
        \"Started Task\" with permission to write to OPCON files and
        read from production (e.g., JCL libraries, SYSEXEC libraries,
        etc.). Review OPCONxx Proc in the product INSTLIB for file
        access requirements.

    b.  \_\_\_\_ The XPSPLEX Task must be in an authorized \"Started
        Task\" class.

    c.  \_\_\_\_ Batch job USERIDs must be defined to the LSAM ID with
        submit permissions. Refer to [Security Setup](customization.md#Security).

    d.  \_\_\_\_ Ensure that the LSAM has surrogate submission authority
        for the IVPJOBnn jobs in INSTLIB. Refer to [Security Setup](customization.md#Security).

    e.  \_\_\_\_ Check that the LSAM has an OMVS UID Assigned. Refer to
        [Security Setup](customization.md#Security){.MCXref
        .xref}.
2.  **SMF PARAMETERS**:
    a.  \_\_\_\_ For dataset resource monitoring, ensure that the
        following SMF Types are being recorded:
        i.  \_\_\_\_ Type 14 & 15 Records for non-VSAM datasets.
        ii. \_\_\_\_ Type 64 Records for VSAM datasets.
        iii. \_\_\_\_ Type 61 and 65 Records to detect catalog actions.
    b.  \_\_\_\_ Exits IEFU83, IEFU84, IEFUSI and IEFUJV must be active
        for the batch (default or JESx) and STC subsystems. IEFU83 must
        be active for the TSO subsystem.
3.  **PERFORMANCE GROUP**:
    a.  \_\_\_\_ Ensure that the LSAM started task is assigned to a
        medium to a high performing service class. This enables the LSAM
        to communicate quickly with the OpCon/xps SAM component. The IBM
        default classes STCMED or SYSSTC are normally sufficient.
4.  **TSO ISPF SETUP**:
    a.  \_\_\_\_ Add XPSPAUTH to the IKJTSOxx PARMLIB member as an
        authorized command: \[AUTHCMD NAMES(XPSPAUTH)\].     b.  \_\_\_\_ Copy the XPSF Rexx program in INSTLIB to the TSO
        SYSPROC or SYSEXEC libraries.
    c.  \_\_\_\_ *(Optional)* Create an ISPF menu entry
        for CMD(XPSPF).
    d.  \_\_\_\_ Alternatively:
        i.  \_\_\_\_ Add XPSPF001 to any ISPF Menu entry as
            PGM(XPSPF001) -- Optional for testing (can use \'TSO
            XPSPF001\' command to execute).
        ii. \_\_\_\_ Add ISPF Message members to the appropriate
            installation ISPMLIB library or add the product ISPMLIB to
            the current ISPMLIB concatenation. Members in ISPMLIB:
        iii. \_\_\_\_ XPSM00
        iv. \_\_\_\_ XPSM01
        v.  \_\_\_\_ Add ISPF Panels and Help members to the appropriate
            installation ISPPLIB library or add the product ISPPLIB to
            the current ISPPLIB concatenation. Members in ISPPLIB:
5.  **Configure SMAFT procedures** *(Optional)*:
    a.  \_\_\_\_ Confirm or update the default port number in the
        XPFTSRVR proc. This is the listening port for SMA file
        transfers.
    b.  \_\_\_\_ The SMAFT programs are compiled Rexx, and require
        either the IBM Rexx Library for z/OS or the IBM Rexx Alternate
        Library for z/OS. If necessary, the alternate library can be
        installed from the files obtained from IBM at:
    c.  \_\_\_\_
        http://www-1.ibm.com/support/docview.wss?rs=960&uid=swg24006107,
        or from MAKEALT_ZOS.ZIP, which should have been provided with
        the z/OS LSAM installation files.
6.  **IMPORT IVP SCHEDULE**:
    a.  Import IVPMVS1 schedule using ImPex.exe - for methodology, refer
        to [Importing IVP Schedule Job Definitions](installation.md#Importin).
