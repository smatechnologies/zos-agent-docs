# Restarting External Jobs through OpCon

Some features of OpCon automated restarts are limited when jobs are restarted by external submission:

- GDG regression option "Absolute" will be converted to "Catalogue Resync"
- There is no option to specify an ending step

Full restart support is available if the job type is changed to **Batch** and the JCL is imported to an OpCon library:

1. Change the job type
    - Open the job with **Maintenance** **\>** **Edit Daily Job**
    - Change the **z/OS Job Type** to **Batch**
    - Save the change
2. Import the JCL
    - Click **JCL/SYSOUT Access**
        - The fields should be filled in with the JobID and JESJCLIN
    - Click **View JCL**
    - If necessary, make changes to the JCL
    - Click **OK**
    - Click **Save JCL** to save the JCL
        - You can use the default DD and **Member Names** or change them
    - Click **Close** to close the JCL access dialogue
    - If you changed the Override DD or member name, update them in the Job Details
3. You can now restart the job as if it was originally submitted from OpCon

:::note
The restarted job will attempt to use the same z/OS userid as the original job. If the LSAM does not have surrogate authority to use that ID, the job start will fail. If necessary, change the **Batch User** field in the job details to an allowed value.
:::
