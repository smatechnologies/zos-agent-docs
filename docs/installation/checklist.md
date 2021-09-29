# Installation checklist

COMPANY:

DATE:

1. **FILE ALLOCATIONS, STAGE1 AND STAGE2 INSTALLATION JCL**:
    1. \_\_\_\_ Upload installation file
    2. \_\_\_\_ Receive installation library from file
    3. \_\_\_\_ Run BUILDJOB dialogue
    4. \_\_\_\_ Stage1 JCL reviewed for installation standards
    5. \_\_\_\_ Stage1 JCL executed successfully
    6. \_\_\_\_ Stage2 JCL reviewed for installation standards
    7. \_\_\_\_ State2 JCL executed successfully
    8. \_\_\_\_ OPCONxx Proc checked for proper standards, naming conventions and syntax
    9. \_\_\_\_ RECLOG GDG Defined and Initialized.
2. **COMMUNICATIONS SETUP**:
    1. \_\_\_\_ PING to SAM IP Addr: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ using TSO "PING" command. Ensure IP address is accessible before starting installation testing.
3. **LSAM PARAMETERS**:
    1. \_\_\_\_ Review XPSPRMxx for installation requirements:

|||
|--- |--- |
|MACHINEID=*|OPCON/XPS MACHINE NAME|
|PROCESS=30|PROCESS COUNT|
|INTV=00.00.10|WAKE UP INTERVAL|
|JCLDD=XPSJCL|DEFAULT JCL LIBRARY|
|OVERRIDE_DD=TEMPJCL|DEFAULT OVERRIDE LIBRARY|
|XPSDYNAM=|Dynamic task proc|
|LSAM=Y|PRIMARY LSAM?|
|ADOPT=N|LSAM Adoption?|
|SYSPLEX=Y|Exploit SYSPLEX?|
|TCPIP=|TCP/IP Task Name|
|PORT=3100|LSAM PORT|
|JORSPORT=+1 (4101)|JORS PORT|
|RECOVERY=PROMPT|Recovery Option|
|SMF15=KEEP|SMF Type 15 Disposition|
|SMF64=KEEP|SMF Type 64 Disposition|
|SPFAUDIT=N|Log ISPF User Chgs|
|JOBRC=MAXRC|RC for failure check|
|SPINOFF=Y|Spin Log Each Night|
|TRACLASS=|Dynamic Tracking Classes|
|TRACMASK=|Dynamic Tracking Mask|
|TRACSCHD=|Dynamic Tracking Schedule|
|USERID=|Default USER|
|MSGCLASS=A|REXX SYSOUT CLASS|
|USEJMR=YES|JMR USER FIELD|
|MLWTO=Y|Multi-line WTO Triggers|
|RESTART=Y|Step restart active?|
|GDGOPT=A|GDG option|
|DUPDSNACT=S|Dup Dataset Action|
|RESDSNACT=S|Dup Dataset Action on restart|
|XPRLIST=01|Dataset exclude list|
|AUTOSTEP=Y|Automatic step selection|
|JOB_CARD_RESTART=Y|Restart from job card?|
|TRACE=N|Trace Status|
|FORCE_SYS_AFF=N|Force System affinity|
|* SETQUES=(JOB=120;MSG=1920;DSN=480;WTO=480;EVT=240)||
4. **FILES and PLACEMENTS**: (XPS390 libraries created by "XPS390 Allocate.jcl" file from Setup):
    1. \_\_\_\_ Review library and file placement
    2. \_\_\_\_ Review for proper APF authorization and access.

||||
|--- |--- |--- |
|OPCON.V140303.LINKLIB|XPSFETCH|APF Auth Required|
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
    1. \_\_\_\_ LSAM task (e.g., OPCON01) must be an authorized "Started Task" with permission to write to OPCON files and read from production (e.g., JCL libraries, SYSEXEC libraries, etc.). Review OPCONxx Proc in the product INSTLIB for file access requirements.
    2. \_\_\_\_ The XPSPLEX Task must be in an authorized "Started Task" class.
    3. \_\_\_\_ Batch job USERIDs must be defined to the LSAM ID with submit permissions. Refer to [Security setup](customization.md#Security).
    4. \_\_\_\_ Ensure that the LSAM has surrogate submission authority for the IVPJOBnn jobs in INSTLIB. Refer to [Security setup](customization.md#Security).
    5. \_\_\_\_ Check that the LSAM has an OMVS UID Assigned. Refer to [Security setup](customization.md#Security).
6. **SMF PARAMETERS**:
    1. \_\_\_\_ For dataset resource monitoring, ensure that the
        following SMF Types are being recorded:
        1. \_\_\_\_ Type 14 & 15 Records for non-VSAM datasets.
        2. \_\_\_\_ Type 64 Records for VSAM datasets.
        3. \_\_\_\_ Type 61 and 65 Records to detect catalog actions.
    2. \_\_\_\_ Exits IEFU83, IEFU84, IEFUSI and IEFUJV must be active for the batch (default or JESx) and STC subsystems. IEFU83 must be active for the TSO subsystem.
7. **PERFORMANCE GROUP**:
    1. \_\_\_\_ Ensure that the LSAM started task is assigned to a medium to a high performing service class. This enables the LSAM to communicate quickly with the OpCon/xps SAM component. The IBM default classes STCMED or SYSSTC are normally sufficient.
8. **TSO ISPF SETUP**:
    1. \_\_\_\_ Add XPSPAUTH to the IKJTSOxx PARMLIB member as an authorized command: \[AUTHCMD NAMES(XPSPAUTH)\].
    2. \_\_\_\_ Copy the XPSF Rexx program in INSTLIB to the TSO SYSPROC or SYSEXEC libraries.
    3. \_\_\_\_ *(Optional)* Create an ISPF menu entry for CMD(XPSPF).
    4. \_\_\_\_ Alternatively:
        1. \_\_\_\_ Add XPSPF001 to any ISPF Menu entry as PGM(XPSPF001) -- Optional for testing (can use 'TSO XPSPF001' command to execute).
        2. \_\_\_\_ Add ISPF Message members to the appropriate installation ISPMLIB library or add the product ISPMLIB to the current ISPMLIB concatenation. Members in ISPMLIB:
        3. \_\_\_\_ XPSM00
        4. \_\_\_\_ XPSM01
        5. \_\_\_\_ Add ISPF Panels and Help members to the appropriate installation ISPPLIB library or add the product ISPPLIB to the current ISPPLIB concatenation. Members in ISPPLIB:

|||||
|--- |--- |--- |--- |
|XPSH01|XPS0AW|XPS004|XPS0AD|
|XPSH02|XPS001|XPS004S||
|XPSH03|XPS002|XPS005||
|XPSH04|XPS002S|XPS005S||
|XPSH05|XPS003|XPS0AE||
|XPSH06|XPS003S|XPS00D||
9. **Configure SMAFT procedures** *(Optional)*:
    1. \_\_\_\_ Confirm or update the default port number in the XPFTSRVR proc. This is the listening port for SMA file transfers.
    2. \_\_\_\_ The SMAFT programs are compiled Rexx, and require either the IBM Rexx Library for z/OS or the IBM Rexx Alternate Library for z/OS. If necessary, the alternate library can be installed from the files obtained from IBM at:
    3. \_\_\_\_ [http://www-1.ibm.com/support/docview.wss?rs=960&uid=swg24006107](http://www-1.ibm.com/support/docview.wss?rs=960&uid=swg24006107), or from MAKEALT_ZOS.ZIP, which should have been provided with the z/OS LSAM installation files.
10. **IMPORT IVP SCHEDULE**:
    1. Import IVPMVS1 schedule using ImPex.exe - for methodology, refer to [Importing IVP Schedule Job Definitions](verifying.md#Importin).
