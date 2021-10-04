# Translation Tables in SMAFT Server and Agent

The translate tables are referenced to determine the translate data sets to be used.

The search order used to access this configuration file is as follows. The search order ends at the first file found:

1. *userid/jobname*.STANDARD.TCPXLBIN

  :::note
   *userid* is the user ID that is associated with the current security environment (address space or task/thread).
   *jobname* is the name specified on the JOB JCL statement for batch jobs or the procedure name for a started procedure.
  :::
2. *hlq*.STANDARD.TCPXLBIN
  
  :::note
   *hlq* represents the value of the DATASETPREFIX statement specified in the base resolver configuration file (if found; otherwise, *hlq* is TCPIP by default.
  :::
3. If no table is found, the server uses a hard coded default table that is identical to the STANDARD member in the **SEZATCPX** data set.

The defaults can be overridden, by supplying a TCPXLBIN DDNAME in the server JCL:

//TCPXLBIN DD DISP=SHR,DSN=*your.translat.table*

The dataset **must** be in the format created by the IBM CONVXLAT program. Only SBCS translations are supported.
