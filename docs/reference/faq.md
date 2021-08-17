# FAQs

## 1. Why do Jobs schedule, submit and execute OK, but always show "Failed - JCL Error" on the OpCon Enterprise Manager?

This is a classic example of an SMF Exit problem. This type of problem usually shows up in initial IVP testing. Most often it is IEFUJV or IEFU84 not being called or SMF record type 30 not being recorded. Check SMFPRMxx first.

Also, SMF allows significant flexibility in exit design. Exits can issue return codes that tell other exits to be ignored (like after the first job card -- before the OPCON/XPS marker!). Or a code can tell SMF not to take subsequent exits in an exit list. Certain flags can tell SMF to delete records, and so on. If the function of a local exit does not take into consideration the possible presence of other exits, the results can be unpredictable.

In Summary:

1. Review the section in Customization Process on SMF requirements and insure the proper control statements are in your SMFPRMxx member.
2. Display the current SMF options (**D SMF,O**) to insure the proper record types and exits are being used.
3. If you are not getting the OPCONV*NN* identifier in OpCon/xps submitted jobs, then another exit, a security product INTRDR, local JES or IEFUJV exit may be deleting or altering this record. Check for any other exit processing in the INTRDR, SMF or JES.
4. If you receive message "XPS109E XPSU84: Locate Error - Tracking Suspended" the JMRUSEID field in the JMR may be corrupted. This may be due to an incompatible or back-level release of the exit. It also can be caused by another OEM or User exit overwriting JMRUSEID. Try setting USEJMR=NO in XPSPRMxx.
5. Check the XPSU84 and XPSUJV exit versions in V140303.OBJLIB (the version eye catcher is near the beginning of the module). Re-link the proper version if inconsistencies exist.
6. If the reason for Exit anomalies cannot be determined, contact SMA Support. Have the source code for any local SMF or JES user exits available.

## 2. How do I install and control OpCon User exits?

Currently, the only user exit supported is XPUSER01, the JCL submission exit. A coded example of this exit resides in V140303.INSTLIB(XPUSER01). Exit rules are as follows:

1. The exit must be linked into the STEPLIB concatenation for the OPCONxx task.
2. It must be named XPUSER01.
3. The exit need not be reentrant, but is does need to be serially reusable.
4. OpCon looks for the exit at each JCL submission, so when you link it to the V140303.LINKLIB it becomes active for the next job submitted, dynamically.
5. If the exit abends, it is turned off by OpCon.
6. If you wish to reinstate or refresh the exit, enter command: "F *lsamname***,REPUSER1.**"

XPUSER01 allows you to alter or insert JCL. It also allows the cancellation of the job during submission. However, this option should be used with caution. The submit exit is taken just prior to a JCL record being written to the INTRDR. If the first step has already been sent to the INTRDR, a cancel request may allow unwanted step execution. The cancel options should only be used when processing the job card. If you want the job canceled at any other point during submission, insert an invalid JCL, such as '**//JOB CANCELED BY XPUSER01 -- REASON:**'.

## 3. What are some useful z/OS system commands to check OpCon exits?

The z/OS LSAM uses standard dynamic exits. The status of the exits can be checked using the D PROG commands, e.g., the LSAM uses IEFU84 to track job execution. The command to view the exit status is:

- D PROG,EXIT,EXITNAME=SYS.IEFU84

  - This will show something like:

        CSV461I 14.47.19 PROG,EXIT DISPLAY 089

        EXIT MODULE STATE MODULE STATE

        SYS.IEFU84 IEFU84 A XPSU84 A

To find all exits calling the XPSU84 module:

- D PROG,EXIT,MODNAME=XPSU84

  - This may show something like:

        CSV462I 14.51.56 PROG,EXIT DISPLAY 091

        MODULE XPSU84

        EXIT(S) SYSSTC.IEFU84 SYS.IEFU84

        Showing that the exit is called for started tasks and batch.

The LSAM uses these exits and modules:

- SYS.IEFUJV and subsystem variants
  - XPxUJV

- SYS.IEFU84 and subsystem variants
  - XPxU84

- SYS.IEFU83 and subsystem variants
  - XPxU83

- CNZ_WTOMDBEXIT

  - XPxWTOEX

Normally, the exits remain active when the LSAM is stopped, but they can be removed with the **REMOVEX** command when shutting down. If the exits need to be stopped and the LSAM cannot be started, the **SETPROG** command can be used, for example:

- **SETPROG EXIT,DELETE,EXITNAME=SYS.IEFUJV,MODNAME=XPSUJV**
