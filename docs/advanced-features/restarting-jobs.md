---
sidebar_label: 'Restarting jobs'
title: Restarting external jobs through OpCon
description: "How to enable full OpCon restart support for external jobs by converting their job type to Batch and importing their JCL into an OpCon library."
tags:
  - Procedural
  - Automation Engineer
  - Operations Staff
  - Agents
---

# Restarting external jobs through OpCon

## What is it?

How to enable an OpCon-driven restart of an external z/OS job. By default, a direct restart of a Tracked or Queued job only re-reports the prior completion status. To get a real restart, convert the job type to **Batch** and import its JCL into an OpCon library using the procedure on this page.

A direct restart of a Tracked or Queued job only re-reports the prior completion status. To enable a real restart from OpCon, convert the job type to **Batch** and import its JCL using the procedure below.

Some features of OpCon automated restarts are limited when jobs are restarted by external submission:

- GDG regression option "Absolute" will be converted to "Catalogue Resync"
- There is no option to specify an ending step

Full restart support is available if the job type is changed to **Batch** and the JCL is imported to an OpCon library:

1. Change the job type
    - Open the job with **Maintenance** **>** **Edit Daily Job**
    - Change the **z/OS Job Type** to **Batch**
    - Save the change
2. Import the JCL
    - Select **JCL/SYSOUT Access**
        - The fields should be filled in with the JobID and JESJCLIN
    - Select **View JCL**
    - If necessary, make changes to the JCL
    - Select **OK**
    - Select **Save JCL** to save the JCL
        - You can use the default DD and **Member Names** or change them
    - Select **Close** to close the JCL access dialogue
    - If you changed the Override DD or member name, update them in the Job Details
3. You can now restart the job as if it was originally submitted from OpCon

:::note
The restarted job will attempt to use the same z/OS userid as the original job. If the agent does not have surrogate authority to use that ID, the job start will fail. If necessary, change the **Batch User** field in the job details to an allowed value.
:::
