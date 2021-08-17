# CSA Storage Allocation

We allocate enough storage in fixed ESQA to hold the SMF exits. Less than 100 KB is used for all resident modules.

ECSA usage:

- XPS PCB - 256 bytes
- XPS parameters - 272 bytes
- UCB list - 256 bytes
- Tracking queues - depends on parameter values

The tracking queues are allocated according to the PROCESS value in XPSPRMxx, unless they are overridden by the SETQUES parameter (JOB=jjj,MSG=mmm,DSN=ddd,WTO=mmm,EVT=eee). The values for each queue are the largest of the SETQUES, the default and the value calculated from the PROCESS parameter.

- JOBQ - 16+1024\*(jjj+1)
- JOBQ index - jjj
- MSGQ - 16+126 \*(mmm+1)
- DSNQ - 16+127\*(ddd+1)
- WTOQ - 16+147\*(mmm+1)
- EVTQ - 16+76\*(eee+1)

|Queue|Calculated size|Default size|Default storage|
|--- |--- |--- |--- |
|JOBQ|ppp*4|120|~121K|
|MSGQ|ppp*64|1920|~236K|
|DSNQ|ppp*16|480|~60K|
|WTOQ|ppp*16|480|~69K|
|EVTQ|n/a|240|~17K|
