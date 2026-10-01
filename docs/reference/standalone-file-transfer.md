---
sidebar_label: 'Standalone file transfer'
title: Standalone file transfer
description: "How to run the SMAFT agent as a standalone job step, including JCL examples and the keyword reference for the XPSIN parameters."
tags:
  - Reference
  - Automation Engineer
  - Agents
---

# Standalone file transfer

## What is it?

A way to run the SMAFT agent inside a regular job step (not as a started task) so a single job can perform a file transfer without a long-running SMAFT server. Use it when you need an ad hoc transfer or want the transfer to live and die with the job.

The SMAFT agent can be run in a job step, using the following JCL:

    //GETFILE EXEC PGM=IKJEFT1B,PARM='XPFTAGT'
    //SYSEXEC DD DISP=SHR,DSN=OPCON.V210004.INSTLIB
    //SYSTSIN DD DUMMY
    //SYSTSPRT DD SYSOUT=*
    //XPSIN DD *
    SERVER name:port
    file Source File Name
    SAVEAS Destination File Name

## Standalone file transfer JCL

| DD                  | Required? | Description                      |
|---|---|---|
| SYSEXEC             | Yes       | This must point to a library *containing* XPFTAGT, XPFTPARM, and XPRXCRC. In V4.03.02 and higher, the z/OS Agent installs these programs in *hlq.mlq.***INSTLIB**. |
| SYSTSIN             | Yes       | Must be DUMMY.                   |
| SYSTSPRT            | Yes       | This file will contain any messages from the agent.         |
| XPSIN               | Yes       | <ul><li>This file contains the instructions to the agent. Each line contains a keyword, followed by one or more space, and the value. Leading and trailing spaces will be removed.</li><li>Keywords are not case sensitive.</li><li>File and Auth values are case sensitive, others are not.</li><li>Refer to below for supported keywords.</li><li>A line whose first word is `*` is treated as a comment.</li></ul> |
| XPSOUT or *user defined name*  | No        | This file will be used if no SaveAs keyword is supplied. It can be allocated to any sequential file, including SYSOUT or generation data sets.  |

## Keywords table for standalone file transfer

| Keyword     | Required? | Values      | Default     | Notes       |
|---|---|---|---|---|
| Server      | Yes       | The name or IP address of a SMAFT server, followed by a colon (:) and port number.| None        | If then server name is used, it must be resolvable to an IP address.    |
| File        | Yes       | The name of the source file name. | None        |             |
| Auth        | No        | The security code under which to obtain access to the file in the server. | Null (the empty string)  | The format is server specific. Consult the necessary documentation. |
| SaveAs      | No        | The dataset name to be used for the output file, or **DD:ddname** to write the data to a user defined DDname. | DD:XPSOUT   | If a dataset name is used, it will be qualified with the prefix defined for the active user. If that is not desired, enclose the name in single quotes. If the **DD:** form is used, the following keywords are ignored:<ul><li>Collision</li><li>LRECL</li><li>RECFM</li></ul> |
| SourceDataType | No | The data type of the file on the source machine:<ul><li>Binary</li><li>EBCDIC</li><li>ASCII</li><li>Default Text</li></ul> | Default Text | If Binary is chosen for SourceDataType, DestDataType will be forced to binary. |
| DestDataType           | No        | The data type to be used locally. The values are the same as SourceDataType.| EBCDIC      |             |
| Collision   | No        | What to do if the SaveAs dataset name exists:<ul><li>Do Not Overwrite</li><li>Overwrite</li><li>Append</li><li>Backup then Overwrite</li><li>Backup then Append</li></ul>| Do Not Overwrite     | For the Backup options, the agent calls the XPFTBACK REXX program with the name of the existing dataset before it overwrites or appends. If XPFTBACK is not found or returns a non-zero value, the transfer ends.|
| LRECL       | No        | The logical record length of the output dataset. | The smallest value that will hold the longest input record        |             |
| RECFM       | No        | The record format of the output dataset: <ul><li>F B</li><li>V B</li><li>F</li><li>V</li></ul> | F B for a stream without record separators; otherwise V B | If the SaveAs dataset already exists, the agent uses its existing RECFM. |
| Compression | No        | N, P, or R. Only the first character is used. | N | Compression is not supported. A value of R ends the transfer with return code 16. A value of P sets return code 4 if FailIfPref is not N. |
| Encryption  | No        | N, P, or R. Only the first character is used. | N | Encryption is not supported. A value of R ends the transfer with return code 16. A value of P sets return code 4 if FailIfPref is not N. |
| FailIfPref  | No        | N or any other value. Only the first character is used. | N | If not N, a Preferred (P) Compression, Encryption, or DeleteSource option that cannot be honored is reported as an error. |
| Bandwidth   | No        | A bandwidth value passed to the server. | GT2048 | |
| DeleteSource | No       | <ul><li>No</li><li>Preferred</li><li>Required</li></ul> | No | Requests that the server delete the source file. Values are matched by their leading characters. If the server does not support delete, Required ends the transfer with return code 16, and so does Preferred if FailIfPref is not N. |
