# Using the ISPF Automation Table Administrator

Three functions are supported by the ISPF Administrator:

1. DSN Trigger Table maintenance.
2. WTO (Console Message) Trigger Table maintenance.
3. Active Event Definition Table maintenance.

## DSN Table Administration

To display a given table, you may **S**)elect any entry on the main menu. To add an entry to a table without going to a table display screen, use the **A**)dd line command.

ISPF Table Administration and Selection

![ISPF Table Administration and Selection](/img/ISPF-Table-Administration-and-Selection.png "ISPF Table Administration and Selection")

The DSN trigger table is selected from the Main Menu and displayed. The tables in OpCon/xps for z/OS are Sysplex Global. In other words, all LPARs in the SYSPLEX mirror all trigger entries. Triggers are defined by System Id (SMFID) or ANY. ANY allows the trigger to occur on any system in the SYSPLEX. A hard coded System Id is triggered only on that system.

The DSN table information is an abbreviated display of each entry. The display is compressed, by default, to allow for better productivity when working with large tables. An expanded view can be requested by a plus "+" command or line command.

DSN Table View

![DSN Table View](/img/DSN-Table-View.png "DSN Table View")

A minus "-" command or line command returns the display to the compressed format. In the expanded format, the T-Time represents the Trigger time if this resource has already triggered and is awaiting a job to reference it. The R-Time is the last time a job referenced this entry before it was triggered. The Gens represents the number of generations left to trigger and the original number of generations requested.

If an "ACTIVE" resource trigger is defined, the Event Key contains the event name and Event Cmd displays the constructed MSGIN record that is passed to SAM when this trigger occurs.

The following primary commands are available in any screen:

- **F(IND** xxxxxx -- Where xxxxx is a DSN, WTO or Event Name or partial name.
- **F(IND OFF** -- Turn off find criteria and display all entries.
- **+** Expanded View
- **-** Collapse View

Four line commands are supported for DSN and WTO tables:

1. **D**)elete entry.
2. **S**)elect for Edit/Update.
3. **A**)dd new entry using selected entry as a Template.
4. **E**)vent Edit -- edit the associated Event Key for update.

By entering a "D" line command, the entry is deleted. You are prompted for confirmation at least once each session. If you turn confirmation "OFF" then you are not prompted for deletion of *any* table entry for the duration of the current session.

By entering an "S" line command, the entry is selected and the screen displays entry detail that may be altered.

:::caution
Altering a PASSIVE entry that is referenced by a scheduled job may invalidate the entry if the SAM schedule record for the referencing job(s) is not also altered to reflect the change. Each entry in the dataset table must have a unique combination of Resource name, Type, DSN Key, generation count, jobname, and system. Avoid creating an ACTIVE entry that duplicates a PASSIVE entry (i.e., a file prerun on a job definition).
:::

### WTO Table Administration

WTO table (Console Message) triggering allows two keys per message: one FIXED and one VARIABLE. The **Msg Off** column represents the number of character positions (bytes) from the beginning of the message text to the start of the FIXED key. The **Msg Len** column represents the length of the FIXED key w/spaces. ALL WTO triggers MUST have a FIXED key. The variable portion is optional. A variable key is defined within brackets {}. Once the fixed key is located in a record, a variable key is scanned for AFTER the end of the fixed key. If MLWTO=Y is set in XPSPARMS, then the variable key will also be searched in any minor lines of the message. The variable text can be used to exclude matches by preceding it with a minus (-) sign.

Just as with datasets, message triggers can have generations, System-id and creating job criteria. The only substantial difference between the DSN table and the WTO table is the Offset and Length requirements for the FIXED portion of the message key and the ability to "scan" for text content.

WTO Table Administration

![WTO Table Administration](/img/WTO-Table-Administration.png "WTO Table Administration")

:::note
Each entry in the message table must have a unique combination of Resource name, Message key, generation count, jobname, and system. Avoid creating an ACTIVE entry that duplicates a PASSIVE entry (i.e., a message prerun on a job definition).
:::

#### Automated Response Feature

The WTO Table and ISPF interface can be used to set up automated WTOR replies. This feature is LSAM resident and independent of the SAM or scheduling functions. The following example shows the syntax to be used in the Event Token field (Plus "+" Sign) to denote WTOR message reply text.

Automated Response Entry in WTO Table

![Automated Response Entry in WTO Table](/img/Automated-Response-Entry-in-WTO-Table.png "Automated Response Entry in WTO Table")

The above example causes a response to the message below with an **\"R** **70,Y\"**.

\*70 XPSTIMER - Test WTOR - Enter any Character.

Replies longer than seven characters may be continued on the next line following the Event Token. Replies up to 19 characters are supported.

#### Special Event Token Values

The following special values have defined actions and will not use the Event table.

- $CONSOLE - Sends the trigger information to the SAM log in the following form:
  - Messages: MachineID\|Jobname\|JobID\|Message text
  - Datasets: MachineID\|Jobname\|DSNx\|DSNAME\|Resource
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

### Event Table Administration

Created to support ACTIVE triggers, the Event table simplifies the definition of common MSGIN commands. Events in the table can be used from DSN or WTO triggers, step control conditions, or XPSCOMM.

Event Trigger Table

![Event Trigger Table](/img/Event-Trigger-Table.png "Event Trigger Table")

Both DSN and WTO resources can be defined as ACTIVE triggers just by defining an Event Token or name. Once identified in a DSN or WTO trigger, an Event Token must be defined in the Event Table.

The Event Table is simply an ISPF front end to define MSGIN events. For more information, refer to [External Events](https://help.smatechnologies.com/opcon/core/latest/OpCon-Events/Defining-Events.md#External) in the **OpCon Events** online help.

Event Table Addition and Alteration

![Event Table Addition and Alteration](/img/Event-Table-Addition-and-Alteration.png "Event Table Addition and Alteration")

In the above example, an existing entry in the table is used as a template to create a new entry. The resulting MSGIN Command sent to SAM is:

$JOB:ADD,CURRENT,SYSProd,IVPJOB09,ONRequest,TSOID01,\*\*\*pswd\*\*

The "Security" identification must match the SAM functional definitions for the Schedule. The Job name (Element) must be defined on the Master Schedule with the Frequency noted or the event fails. The password is dynamic and must be defaulted on the SAM security definition for the associated user. The Schedule Date accepts any eight character value. Both the Schedule Name and Schedule Date accept OpCon/xps tokens. For information on OpCon/xps tokens, refer to [Properties](https://help.smatechnologies.com/opcon/core/latest/Concepts/Properties.md#top) in the **Concepts** online help.

Event errors are recorded in the SAM Log on the SAM Server. No feedback for event processing is returned to the LSAM.

:::note
The Schedule and Frequency names in the Event table are each limited to 12 characters.
:::

#### Special Trigger Handling

When the events are triggered from the DSN or WTO tables, some special
values are allowed:

- $CONSOLE:DISPLAY and $NOTIFY:LOG
    If the message field for one of these events is equal to **&TEXT**, it will be replaced by information about the triggering event:
  - DSN triggers will display **MachineID\|Jobname\|Action\|Dataset.name**\*Action* is the first character of the dataset trigger action
  - WTO triggers will display the message text
- $JOB:ADD
    Job Instance properties will be added containing the triggering information. This allows the trigger data to be used as input to the added job:
  - DSN triggers include **RSRC=resource;DSN=dataset.name**
  - WTO triggers include **RSRC=resource;MSG=message text**

:::note
If the WTO message text contains any commas, they will be converted to spaces in the event text.
:::
