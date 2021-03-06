# Installation checklist

COMPANY:

DATE:

1. **FILE ALLOCATIONS, STAGE1 AND STAGE2 INSTALLATION JCL**:
    1. ____ Upload installation file
    2. ____ Receive installation library from file
    3. ____ Run BUILDJOB dialogue
    4. ____ Stage1 JCL reviewed for installation standards
    5. ____ Stage1 JCL executed successfully
    6. ____ Stage2 JCL reviewed for installation standards
    7. ____ State2 JCL executed successfully
    8. ____ OPCONxx Proc checked for proper standards, naming conventions and syntax
    9. ____ RECLOG GDG Defined and Initialized.
2. **COMMUNICATIONS SETUP**:
    1. ____ PING to SAM IP Addr: ______________________________________ using TSO "PING" command. Ensure IP address is accessible before starting installation testing.
3. **LSAM PARAMETERS**:
    1. ____ Review XPSPRMxx for installation requirements:
        - Verify that the machine name and port are valid and unique

            |Parameter|Value|
            | --- | --- |
            |MACHINEID=*|OPCON/XPS MACHINE NAME|
            |PORT=3100|LSAM PORT|

        - Review the remaining parameters as needed

4. **FILES and PLACEMENTS**: (XPS390 libraries created by "XPS390 Allocate.jcl" file from Setup):
    1. ____ Review library and file placement
    2. ____ Review for proper APF authorization and access.

        |Library|Member|Requirements|
        |--- |--- |--- |
        |OPCON.V210004.LINKLIB|XPSFETCH|APF Auth Required|
        ||XPSQMGR|APF Auth Required|
        ||XPSASCRE|APF Auth Required, LINKLST Resident|
        ||XPSCOMM|APF Auth Required|
        ||XPSPARM|APF Auth Required|
        ||XPSUBMIT|APF Auth Required|
        ||XPSAUDIT|APF Auth Required|
        ||XPSLOGQ|APF Auth Required|
        ||XPSPLEX|APF Auth Required|
        ||XPRESTRT|APF Auth Required|
        ||XPSTATUS|APF Auth Required|
        ||XPSEVENT|APF Auth Required, LINKLIST Resident|
        ||XPSERVER|APF Auth Required|
        ||XPSAGENT|APF Auth Required|
        ||XPSELOAD|APF Auth Required|
        ||XPSWTOEX|APF Auth Required|
        ||XPSU83|APF Auth Required|
        ||XPSU84|APF Auth Required|
        ||XPSUJV|APF Auth Required|
        ||XPRUSI|APF Auth Required|
        ||XPSISPF|LINKLST Resident or TSO Steplib|
        ||XPSPAUTH|APF Auth Required, LINKLST Resident|
        ||XPSPF001|LINKLST Resident or TSO Steplib|
        ||XPSAFAPI|APF Auth Required, LINKLST Resident|
        ||XPSSUPV|APF Auth Required|
        ||XPRLIST|APF Auth Required|
        |SYS1.PROCLIB|OPCONxx|XPS390 Started Task(s)|
        ||IVPPROC1|IVP STC Tests|
        ||XPSAUDIT|IVP and Status|
        ||XPSPLEX|Sysplex Communications Task|
        ||XPFTSRVR|SMAFT server task|
5. **SECURITY DEFINITIONS**:
    1. ____ LSAM task (e.g., OPCON01) must be an authorized "Started Task" with permission to write to OPCON files and read from production (e.g., JCL libraries, SYSEXEC libraries, etc.). Review OPCONxx Proc in the product INSTLIB for file access requirements.
    2. ____ The XPSPLEX Task must be in an authorized "Started Task" class.
    3. ____ Batch job USERIDs must be defined to the LSAM ID with submit permissions. Refer to [Security setup](customization.md#Security).
    4. ____ Ensure that the LSAM has surrogate submission authority for the IVPJOBnn jobs in INSTLIB. Refer to [Security setup](customization.md#Security).
    5. ____ Check that the LSAM has an OMVS UID Assigned. Refer to [Security setup](customization.md#Security).
6. **SMF PARAMETERS**:
    1. ____ For dataset resource monitoring, ensure that the
        following SMF Types are being recorded:
        1. ____ Type 14 & 15 Records for non-VSAM datasets.
        2. ____ Type 64 Records for VSAM datasets.
        3. ____ Type 61 and 65 Records to detect catalog actions.
    2. ____ Exits IEFU83, IEFU84, IEFUSI and IEFUJV must be active for the batch (default or JESx) and STC subsystems. IEFU83 must be active for the TSO subsystem.
7. **PERFORMANCE GROUP**:
    1. ____ Ensure that the LSAM started task is assigned to a medium to a high performing service class. This enables the LSAM to communicate quickly with the OpCon/xps SAM component. The IBM default classes STCMED or SYSSTC are normally sufficient.
8. **TSO ISPF SETUP**:
    1. ____ Add XPSPAUTH to the IKJTSOxx PARMLIB member as an authorized command: \[AUTHCMD NAMES(XPSPAUTH)\].
    2. ____ Copy the XPSF Rexx program in INSTLIB to the TSO SYSPROC or SYSEXEC libraries.
    3. ____ *(Optional)* Create an ISPF menu entry for CMD(XPSPF).
    4. ____ Alternatively:
        1. ____ Add XPSPF001 to any ISPF Menu entry as PGM(XPSPF001) -- Optional for testing (can use 'TSO XPSPF001' command to execute).
        2. ____ Add ISPF Message members to the appropriate installation ISPMLIB library or add the product ISPMLIB to the current ISPMLIB concatenation. 
        3. ____ Add ISPF Panels and Help members to the appropriate installation ISPPLIB library or add the product ISPPLIB to the current ISPPLIB concatenation. 
9. **Configure SMAFT procedures** *(Optional)*:
    1. ____ Confirm or update the default port number in the XPFTSRVR proc. This is the listening port for SMA file transfers.
    2. ____ The SMAFT programs are compiled Rexx, and require either the IBM Rexx Library for z/OS or the IBM Rexx Alternate Library for z/OS. If necessary, the alternate library can be installed from the files obtained from IBM at:
    3. ____ [http://www-1.ibm.com/support/docview.wss?rs=960&uid=swg24006107](http://www-1.ibm.com/support/docview.wss?rs=960&uid=swg24006107), or from MAKEALT_ZOS.ZIP, which should have been provided with the z/OS LSAM installation files.
10. **IMPORT IVP SCHEDULE**:
    1. Import IVPMVS1 schedule using ImPex.exe - for methodology, refer to [Importing IVP Schedule Job Definitions](verifying.md#Importin).
