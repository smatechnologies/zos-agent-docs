---
sidebar_label: 'Translation tables'
title: Translation tables in SMAFT server and agent
description: "How the SMAFT server and agent locate translation tables on z/OS, including the search order and the TCPXLBIN override."
tags:
  - Reference
  - System Administrator
  - Agents
---

# Translation tables in SMAFT server and agent

## What is it?

How the SMAFT server and agent determine which translate dataset to use for character-set conversion on z/OS. The agent searches a fixed set of dataset names in order and stops at the first one it finds.

The translate tables are referenced to determine the translate data sets to be used.

The search order used to access this configuration file is as follows. The search order ends at the first file found:

1. The dataset allocated to the TCPXLBIN DD statement in the server or agent JCL, for example `//TCPXLBIN DD DISP=SHR,DSN=your.translat.table`.
2. *prefix*.STANDARD.TCPXLBIN

  :::note
   *prefix* is the TSO data set name prefix of the security environment the server or agent runs under. The name is specified without quotes, so TSO adds the prefix.
  :::
3. TCPIP.STANDARD.TCPXLBIN. This name is fixed. The DATASETPREFIX statement in the resolver configuration is not read.
4. If no table is found, the server and agent use a hard coded default table that is identical to the STANDARD member in the **SEZATCPX** data set.

The dataset **must** be in the format created by the IBM CONVXLAT program. Only SBCS translations are supported.
