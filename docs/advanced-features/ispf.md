# Using the ISPF Automation Table Administrator

Three functions are supported by the ISPF Administrator:

1. DSN Trigger Table maintenance.
2. WTO (Console Message) Trigger Table maintenance.
3. Active Event Definition Table maintenance.

To display a given table, you may **S**)elect any entry on the main menu. To add an entry to a table without going to a table display screen, use the **A**)dd line command.

ISPF Table Administration and Selection

```
==================  OpCon/xps Automation Table Administration = 21.00.04 ======
     Command     =>                                                            
                                                                               
                                                                               
                                                                               
                     - Edit Dataset Resource Table                             
                     - Edit Message Resource Table                             
                     - Edit Action Table                                       
                                                                               
                                                                               
                                                                               
                                                                               
                                                                               
                                                                               
                                                                               
                     Enter HELP for commands and syntax.                       
 ============================================================== XPS21.00 ======
```

### Primary commands available on the main menu:
- **XPSID *x*** 
    - Switches to XPSID=x and returns to the main menu
- **FIND** commands
    - See [Find options](#find)
- **JOBQ**
    - Displays the entries in the job tracking queue
- **MSGQ** 
    - Displays unsent entries in the "messages to SAM" queue

### Line commands available on the main menu:
- **S** - Selects the table for display
- **A** - Opens a dialogue to add a new entry without opening the table first

### Primary Commands available on table displays:
- **XPSID *x*** 
    - Switches to XPSID=x and returns to the main menu
- **FIND** commands
    - See [Find options](#find)
- **+** (plus)
    - Switches table displays to expanded format
- **-** (minus)
    - Switches table displays to short format

### Line commands on table displays:
- **S** - Opens the selected entry for display or edit
- **E** - Edit the event linked from the selected event
    - If no event is linked from the entry, same as **S**
    - This action will also be invoked if a linked event is added or changed on a DSN or WTO entry
- **D** - Deletes the selected entry
- **A** - Opens a dialogue to add a new entry, starting with the selected entry as template
- **R** - Resets a DSN or WTO entry to "not triggered" status
- **T** - "Triggers" the selected entry
    - If the entry is "passive" (no linked event), it is set to "triggered" status
    - If the entry is "active", a dialogue will be opened to send the linked event as MSGIN
        - An active trigger will always require confirmation, and allows editing the MSGIN event string

>You are prompted for confirmation of **D**, **R** and **T** commands at least once each session. If you turn confirmation "OFF", then you are not prompted for confirmation for the duration of the current session.

### Find options {#find}
The **FIND**, **FAN** and **FAT** primary commands are available to limit the table displays. 
- **FIND *chars*** will show only entries whose key field start with *chars*.  
    - May be abbreviated to **F *chars***
- **FAT [*chars*]** (find all triggered) will show only entries that are in *triggered* status.  
- **FAN [*chars*]** (find all non-triggered) will show only entries that are not in *triggered* status.  
- **FIND OFF** clears the FIND filters.
    - The FIND settings are also reset when the primary panel is displayed.

:::note
The tables in OpCon/xps for z/OS are Sysplex Global. In other words, all systems in the SYSPLEX mirror all trigger entries, but triggers may be restricted by Machine Id.  Setting MachineID to ANY allows the trigger to occur on any system in the SYSPLEX.
:::

## DSN Table Administration

DSN table triggering allows specification of exact dataset names or name masks with wild cards.  A '%' will match any single character in the dataset name at that position.  A trailing asterisk (*) will match any remaining characters in the dataset name.  A dataset name ending in **G0000V00** will match any member of a generation data group (GDG) that matches the preceding mask or name.

DSN Table View

```
===========================  OpCon/xps DSN Table  =============================
Command ==>                                                   Scroll ==> CSR
                                                                              
 -DSName Mask ------------------------------- Name -- By Job - On Sys - Gens  
  OPCON.TEST%%%.DATASET.G0000V00              WCTEST            ZOS1     01/01
 -Type-Action  ---------------------------------------------------------------
  CRE ADDJOB   $JOB:ADD,,AdHoc,TESTJOB1,,RSRC=WCTEST;DSN=OPCON.TEST%%%.DATASET
-Last Referenced: 00.000 00:00 Last Triggered: 21.242 13:36 -By Job: BRIANKXX 
                                                                               
 -DSName Mask ------------------------------- Name -- By Job - On Sys - Gens  
  OPCON.TEST%%%.DATASET.G0000V00              WCTEST2           ZOS1     00/01
 -Type-Action  ---------------------------------------------------------------
  CRE                                                                         
-Last Referenced: 00.000 00:00 Last Triggered: 21.278 13:41 -By Job: +BRIANK  
                                                                               
******************************* Bottom of data ********************************
```

In the expanded format, the T-Time represents the Trigger time if this resource has already triggered and is awaiting a job to reference it. The R-Time is the last time a job referenced this entry. The Gens represents the number of generations left to trigger and the original number of generations requested.

If an "ACTIVE" resource trigger is defined, the Event Key contains the event name and Event Cmd displays the constructed MSGIN record that is passed to SAM when this trigger occurs.


:::caution
Altering a PASSIVE entry that is referenced by a scheduled job may invalidate the entry if the SAM schedule record for the referencing job(s) is not also altered to reflect the change. Each entry in the dataset table must have a unique combination of Resource name, Type, DSN Key, generation count, jobname, and system. Avoid creating an ACTIVE entry that duplicates a PASSIVE entry (i.e., a file prerun on a job definition).
:::

## WTO Table Administration

WTO table (Console Message) triggering allows two keys per message: one FIXED and one VARIABLE. The **Msg Off** column represents the number of character positions (bytes) from the beginning of the message text to the start of the FIXED key. The **Msg Len** column represents the length of the FIXED key w/spaces. ALL WTO triggers MUST have a FIXED key. The variable portion is optional. A variable key is defined within brackets {}. Once the fixed key is located in a record, a variable key is scanned for AFTER the end of the fixed key. If MLWTO=Y is set in XPSPARMS, then the variable key will also be searched in any minor lines of the message. The variable text can be used to exclude matches by preceding it with a minus (-) sign.

Just as with datasets, message triggers can have generations, System-id and creating job criteria. The only substantial difference between the DSN table and the WTO table is the Offset and Length requirements for the FIXED portion of the message key and the ability to "scan" for text content.

WTO Table Administration

```
===========================  OpCon/xps WTO Queues  ============================
Command ==>                                                   Scroll ==> PAGE
                                                                              
--Msg-Msg-Message--------------------------------Time Range--By Job-- On----  
  Off Len Key                                    From  To             Machid  
  008 003 AM {SA06CDRM to SA02CDRM}              09:21-00:00          ANY     
--Orig--Action---Action ------------------------------------------------------
  Gens  Name                                                                   
  01/01                                                                       
-Last Referenced: 00.000 00:00 Last Triggered: 00.000 00:00 -By Job:          
                                                                               
--Msg-Msg-Message--------------------------------Time Range--By Job-- On----  
  Off Len Key                                    From  To             Machid  
  000 007 IEC705I                                                     ANY     
--Orig--Action---Action ------------------------------------------------------
  Gens  Name                                                                   
  01/01 -S TAPEJ "S TAPEJOB"                                                  
-Last Referenced: 00.000 00:00 Last Triggered: 00.000 00:00 -By Job:          
                                                                               
--Msg-Msg-Message--------------------------------Time Range--By Job-- On----  
  Off Len Key                                    From  To             Machid  
  000 007 IEF285I -{VOL SER}                                          ANY     
--Orig--Action---Action ------------------------------------------------------
  Gens  Name                                                                   
  01/01 $JOBLOG                                                               
-Last Referenced: 00.000 00:00 Last Triggered: 00.000 00:00 -By Job:          
                                                                               
******************************* Bottom of data ********************************
```

:::note
>Each entry in the message table must have a unique combination of Resource name, Message key, generation count, jobname, and system. Avoid creating an ACTIVE entry that duplicates a PASSIVE entry (i.e., a message prerun on a job definition).
:::

### Automated Response Feature

The WTO Table and ISPF interface can be used to set up automated WTOR replies. This feature is LSAM resident and independent of the SAM or scheduling functions. The following example shows the syntax to be used in the Event Token field (Plus "+" Sign) to denote WTOR message reply text.

Automated Response Entry in WTO Table

```
┌────────────────────────────────────────────────────────────────┐
│                                                  Enter Request │
│          OpCon ISPF - WTO Message Table Update                 │
│                                                                │
│  Resource Name:  REPLYTST     Optional                         │
│  Text Offset  :  000           Offset to Initial Text          │
│  Fixed Len    :  008           Length of Initial Text          │
│  Message Key  :  XPSTIMER {Test WTOR}                          │
│  Time Range   :                In Format: HH:MM-HH:MM          │
│  Issue Job    :                Job Issuing Message             │
│  Generations  :  01/01         Generations before trigger      │
│  On Mach-ID   :  ANY           Issuing MachineID or "ANY"      │
│  Action       :  +Y                                            │
│                                                                │
│   U A=Add new Resource U=Update current Resource               │
│                                                                │
│  Press ENTER to add or change resource                         │
│  Press CANCEL or EXIT to cancel update.                        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

The above example causes a response to the message below with an **"R** **70,Y"**.

    *70 XPSTIMER - Test WTOR - Enter any Character.

### Automated Command Feature

The WTO Table and ISPF interface can be used to set up automatic commands in response to messages. This feature is LSAM resident and independent of the SAM or scheduling functions. Automatic commands are defined by beginning the Event token field with a hyphen (-). 

Replies or commands can be up to 27 characters long.

## Special Event Token Values

The following special values have defined actions and will not use the Event table.

- $CONSOLE - Sends the trigger information to the SAM log in the following form:
  - Messages: MachineID&#124;Jobname&#124;JobID&#124;Message text
  - Datasets: MachineID&#124;Jobname&#124;DSNx&#124;DSNAME&#124;Resource
    - "x" is the triggering condition:
      - E = EXISTS
      - C = CREATED
      - U = UPDATED
      - D = DELETED
      - R = REFERENCED
      - L = CATALOGED
      - N = UNCATALOGED
- $JOBLOG - If the action was triggered by an OpCon job, display the trigger information in the Detailed Job Messages in the UI.
  - Messages: The message text
  - Datasets: DSNx|DSNAME
- $JOBTRIG - If the action was triggered by an OpCon job, write to LSAM feedback. This allows the message to be used for triggering from the job definition.
  - The formats are the same as for $JOBLOG
  - This can be used with XPSWTO to create very flexible triggers, invoked from the context of the running job.

## Event Table Administration

Created to support ACTIVE triggers, the Event table simplifies the definition of common MSGIN commands. Events in the table can be used from DSN or WTO triggers, step control conditions, or XPSCOMM.

Event Trigger Table

```
===========================  OpCon/xps Event Table  ===========================
Command ==>                                                   Scroll ==> PAGE
                                                                              
  Event ID Type----- Action- Element- Set type Sch Date Schd Name-- Frequency- 
  PRODEVT1 $JOB      ADD     PRODJOB0                   SYSProd     ONRequest 
  Event Command------------------------------------------------------ Sec-Id-- 
  $JOB:ADD,,SYSProd,PRODJOB07,ONRequest,                              SYSP001 
                                                                               
  PRODEVT2 $JOB      ADD     DAILYSMF                   SYSProd     ONRequest 
  Event Command------------------------------------------------------ Sec-Id-- 
  $JOB:ADD,,SYSProd,DAILYSMF,ONRequest,                               SYSP001 
                                                                               
  TESTEVT1 $JOB      ADD     IVPJOB07                   SYSProd     ONRequest 
  Event Command------------------------------------------------------ Sec-Id-- 
  $JOB:ADD,,SYSProd,IVPJOB07,ONRequest,                               SYSP001 
                                                                               
******************************* Bottom of data ********************************
```

Both DSN and WTO resources can be defined as ACTIVE triggers just by defining an Event Token or name. Once identified in a DSN or WTO trigger, an Event Token must be defined in the Event Table. To simplify this process, if an Event token is added or changed in a DSN or WTO entry, it will trigger the event edit dialogue.

The Event Table is simply an ISPF front end to define MSGIN events. For more information, refer to [External Events](https://help.smatechnologies.com/opcon/core/latest/OpCon-Events/Defining-Events.md#External) in the **OpCon Events** online help.

Event Table Addition and Alteration

```
┌─────────────────────────────────────────────────────────────────┐
│       OpCon ISPF - Active Action Trigger Definition             │
│                                                                 │
│  Token Name :  TESTEVT9                                         │
│  Action Type:  $JOB        $JOB, $SCHEDULE, $MACHINE,...        │
│  Action     :  ADD          ADD, DELETE, HOLD, RELEASE,...      │
│  Element    :  IVPJOB09     Job Name, Mach-Id, Action,...       │
│  Set Type   :               UP, DOWN, GOOD, BAD, Sev Num,...    │
│  Schd Date  :  CURRENT      Blank, Date Keyword or Token        │
│  Schd Name  :  SYSProd      Schedule Name or Token Value        │
│  Frequency  :  ONRequest    Frequency for $JOB:ADD              │
│  Security   :  TSOID01      Sec Id for OpCon Function           │
│  Message    :                                                   │
│                                                                 │
│   U A=Add new action, U=Update current action.                  │
│                                                                 │
│  Press ENTER to add or change action                            │
│  Press CANCEL or EXIT to cancel update.                         │
└─────────────────────────────────────────────────────────────────┘
```

In the above example, an existing entry in the table is used as a template to create a new entry. The resulting MSGIN Command sent to SAM is:

$JOB:ADD,CURRENT,SYSProd,IVPJOB09,ONRequest,TSOID01,*password*

The "Security" field identifies a z/OS userid to use on the triggered event, in place of the triggering userid. See [Mapping users to OpCon user and token](mapping.md) section for details about defining OpCon userids and external event tokens for each user. Userid overrides are applied before OpCon custom field lookups.

 The Schedule Date accepts any eight character value. 

>If an event with a userid override is triggered with **$EVENT=*event*** from XPSCOMM, the override will be ignored unless the triggering user is authorized.  The user must have READ permission to either the ***override*.SUBMIT** or ***override*.OPCON** profile in the SURROGATE SAF class.  
>>For backward compatibility, READ access is assumed for ***override*.OPCON** if the profile is not defined.
 
Event errors are recorded in the SAM Log on the SAM Server. No feedback for event processing is returned to the LSAM.

:::note
The Schedule and Frequency names in the Event table are each limited to 12 characters.
:::

#### Special Trigger Handling

When the events are triggered from the DSN or WTO tables, some special
values are allowed:

- $CONSOLE:DISPLAY and $NOTIFY:LOG
    If the message field for one of these events is equal to **&TEXT**, it will be replaced by information about the triggering event:
  - DSN triggers will display 

    **MachineID&#124;Jobname&#124;Action&#124;Dataset.name** 

    *Action* is the first character of the dataset trigger action

  - WTO triggers will display the message text
- $JOB:ADD
    Job Instance properties will be added containing the triggering information. This allows the trigger data to be used as input to the added job:
  - DSN triggers include **RSRC=*resource*;DSN=*`dataset.name`*;VOL=*volser***
  - WTO triggers include **RSRC=*resource*;MSG=*message text***

:::note
Commas in the WTO message text will be translated to spaces in the event text. 
:::

### Triggering Events

In the Event table, or on an entry in the DSN or WTO tables with a linked event token, the **T** (trigger) line command can be used to send the defined event to OpCon.
A pop-up dialogue allows the user to review or edit the MSGIN event and choose the destination LSAM.

```
┌────────────────────── ISPF Settings ──────────────────────┐
│          OpCon ISPF - Confirm Event trigger               │
│                                                           │
│  DSN Key   :  OPCON.TEST1%%.DATASET.G0000V00              │
│  Token     :  PRODEVT1                                    │
│  XPSID     :  S                                           │
│                                                           │
│  $JOB:ADD,,SYSProd,PRODJOB07,ONRequest,RSRC=WCTEST;DSN=O  │
│                                                           │
│  Enter / to confirm                                       │
│                                                           │
│  Press ENTER to confirm trigger                           │
│  Press CANCEL or EXIT to cancel                           │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

The XPSID field and the event text can be changed before sending the event.
Erasing the event text will restore it to the original value.
The event text field can be scrolled left and right with the **F10** and **F11** keys.

### Securing Automation table updates.

It is possible to secure the Automation table updates through SAF definitions.
Automation table updates require UPDATE permission to the SAF profile **OPCON.XPS$*x*.XPSPF** profile in the FACILITY class, where ‘x’ is the XPSID of the
 system being accessed.  Generic and discrete profiles are supported.

>Note: For backward compatibility, if no profile is defined for the resource, the user will be allowed to update the tables.
 
**RACF Examples**

- To prevent ordinary users from updating the automation tables for the
 LSAM with XPSID=S, but allow members of group SCHED:

      RDEFINE FACILITY OPCON.XPS$S.XPSPF UACC(READ)
      PERMIT OPCON.XPS$S.XPSPF CLASS(FACILITY) ID(SCHED) ACC(UPDATE)
    
- To prevent ordinary users from updating the automation tables for all LSAMs, but allow user USERA and group SCHED:

      RDEFINE FACILITY OPCON.XPS$%.XPSPF UACC(READ)
      PERMIT OPCON.XPS$%.XPSPF CLASS(FACILITY) ID(USERA SCHED) ACC(UPDATE)
