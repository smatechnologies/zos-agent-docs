# Standalone File Transfer

The SMAFT agent can be run in a job step, using the following JCL:

    //GETFILE EXEC PGM=IKJEFT1B,PARM='XPFTAGT'
    //SYSEXEC DD DISP=SHR,DSN=OPCON.V210004.INSTLIB
    //SYSTSIN DD DUMMY
    //SYSTSPRT DD SYSOUT=*
    //XPSIN DD *
    SERVER name:port
    file Source File Name
    SAVEAS Destination File Name

## Standalone File Transfer JCL

| DD                  | Required? | Description                      |
|---|---|---|
| SYSEXEC             | Yes       | This must point to a library *containing* XPSFTAGTXPFTAGT and XPCRCRX. In V4.03.02 and higher, the z/OS LSAM installs these programs in *hlq.mlq.***INSTLIB**. |
| SYSTSIN             | Yes       | Must be DUMMY.                   |
| SYSTSPRT            | Yes       | This file will contain any messages from the agent.         |
| XPSIN               | Yes       | <ul><li>This file contains the instructions to the agent. Each line contains a keyword, followed by one or more space, and the value. Leading and trailing spaces will be removed.</li><li>Keywords are not case sensitive.</li><li>File and Auth values are case sensitive, others are not.</li><li>Refer to below for supported keywords.</li></ul> |
| XPSOUT or *user defined name*  | No        | This file will be used if no SaveAs keyword is supplied. It can be allocated to any sequential file, including SYSOUT or generation data sets.  |

## Keywords Table for Standalone File Transfer

| Keyword     | Required? | Values      | Default     | Notes       |
|---|---|---|---|---|
| Server      | Yes       | The name or IP address of a SMAFT server, followed by a colon (:) and port number.| None        | If then server name is used, it must be resolvable to an IP address.    |
| File        | Yes       | The name of the source file name. | None        |             |
| Auth        | No        | The security code under which to obtain access to the file in the server. | Null (the empty string)  | The format is server specific. Consult the necessary documentation. |
| SaveAs      | No        | The dataset name to be used for the output file, or **DD:ddname** to write the data to a user defined DDname. | DD:XPSOUT   | If a dataset name is used, it will be qualified with the prefix defined for the active user. If that is not desired, enclose the name in single quotes. If the **DD:** form is used, the following keywords are ignored:<ul><li>Collision</li><li>LRECL</li><li>RECFM</li></ul> |
| SourceDataType | No | The data type of the file on the source machine:<ul><li>Binary</li><li>EBCDIC</li><li>ASCII</li><li>Default Text</li></ul> | Default Text | If Binary is chosen for SourceDataType, DestDataType will be forced to binary. |
| DestDataType           | No        | The data type to be used locally. The values are the same as SourceDataType.| EBCDIC      |             |
| Collision   | No        | What to do if the SaveAs dataset name exists:<ul><li>Do Not Overwrite</li><li>Overwrite</li><li>Append</li></ul>| Do Not Overwrite     | The BACKUP options are not supported at this time.|
| LRECL       | No        | The logical record length of the output dataset. | The smallest value that will hold the longest input record        |             |
| RECFM       | No        | The record format of the output dataset: <ul><li>F B</li><li>V B</li><li>F</li><li>V</li></ul> | V B         |             |
