# Using XPSTRACK

The XPSTRACK job step program can be used to add jobs to OpCon as tracked external jobs.

:::tip Example

```shell
//OPCON EXEC PGM=XPSTRACK,

// PARM=' [[$NOW]],L1Test,IVPJOB08,ONRequest,PROP1=Val1'
```

:::

The parameters are separated by commas, and are similar to those used in $JOB:ADD events:

- Schedule date
- Schedule name
- Job name
- Frequency
- Job instance properties

All parameters are optional, but if later parameters are needed, any skipped parameters must be added by commas (e.g.: To specify job instance variables but accept the defaults for everything else, specify: **PARM=\',,,,,MyParm=MyValue\')**

If XPSTRACK is executed in a job already being tracked, it will be
ignored.
