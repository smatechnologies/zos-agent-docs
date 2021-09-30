# Installation process

The z/OS LSAM environment is fairly simple and straightforward. The installation libraries are created and a logging data set is defined. Library creation is carried out by a set of JCL created by an ISPF dialogue.

Once the z/OS libraries are functional, we need to provide security, SMF, and z/OS customization before testing XPS390:

1. Extract the XMIT file from the zip archive.
2. Upload the XMIT file in binary format to a dataset with 80 byte fixed length records (FB-80).
3. Enter TSO command RECEIVE INDATASET(your.dataset.name).
4. When prompted, enter DATASET('OPCON.V210004.INSTLIB') to restore the initial INSTLIB.
5. You can substitute another name, but the low level qualifier must be INSTLIB.
6. If you simply hit Enter, the dataset will be created with the current TSO user's ID. Rename it to your desired installation name.
7. From an ISPF session, enter the TSO command EXEC  'OPCON.V210004.INSTLIB(BUILDJOB)'.
8. Fill in the panel options and hit enter to create the STAGE1 job and customize the installation members.
9. Review the job card and allocation parameters in STAGE1. Run the STAGE1 job to create and load the installation datasets.
10. After STAGE1 runs successfully, run STAGE2 to link edit the agent programs.
11. Add production JCL and REXX libraries to the LSAM JCL:
    - For information on adding production libraries to the LSAM JCL, refer to [LSAM Options and JCL Procedures](customization.md#LSAM).

To begin using the LSAM, refer to [Customization process](../customization).
