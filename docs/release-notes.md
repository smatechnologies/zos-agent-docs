---
lang: en-us
title: z/OS LSAM Release Notes
viewport: width=device-width, initial-scale=1.0
---

+----------------------------------+----------------------------------+
| # z/OS LSAM Release              |                                  |
|  Notes {#zos-lsam-release-notes} |                                  |
+----------------------------------+----------------------------------+
| ::: {.MCDropDo                   |                                  |
| wn .MCDropDown_Closed .dropDown} |                                  |
| []{.MCDropDownHead               |                                  | | .dropDownHead}                   |                                  |
|                                  |                                  |
| ## [![Close                      |                                  | | d](../../../Skins/Default/Styles |                                  |
| heets/Images/transparent.gif){.M |                                  |
| CDropDown_Image_Icon width="16"  |                                  |
| height="11"}Overview & Reader No |                                  |
| tes](javascript:void(0)){.MCDrop |                                  |
| DownHotSpot .dropDownHotspot .MC |                                  |
| DropDownHotSpot_ .MCHotSpotImage |                                  |
| } {#closedoverview-reader-notes} |                                  |
|                                  |                                  |
| :::                              |                                  |
|  {.MCDropDownBody .dropDownBody} |                                  |
| These release notes include all  |                                  |
| enhancements and fixed issues    |                                  |
| for the ****z/OS LSAM**,         |                                  |
| **versions:****                  |                                  |
|                                  |                                  |
|                                  |                                  |
|                                  |                                  |
| +--------+--------+--------+     |                                  |
| | V      | V      | V      |     |                                  |
| | ersion | ersion | ersion |     |                                  |
| | 20     | 19.0   | 18.0   |     |                                  |
| | .01.02 |        | 1.0201 |     |                                  |
| |        | -      |        |     |                                  |
| | -      |   [New | -      |     |                                  | | |   [New |        |   [New |     |                                  |
| |        |  Featu |        |     |                                  |
| |    Fea | res](# |  Featu |     |                                  |
| | tures] | Versio | res](# |     |                                  |
| | (#Vers | n19.0_ | Versio |     |                                  |
| | ion20. | NewFea | n18.01 |     |                                  |
| | 01.02_ | tures) | .0201_ |     |                                  |
| | NewFea |        | NewFea |     |                                  |
| | tures) |        | tures) |     |                                  |
| | -   [  |        |        |     |                                  | | | Fixes] |        |        |     |                                  |
| | (#Vers |        |        |     |                                  |
| | ion20. |        |        |     |                                  |
| | 01.02_ |        |        |     |                                  |
| | Fixes) |        |        |     |                                  |
| +--------+--------+--------+     |                                  |
| | V      | V      |        |     |                                  |
| | ersion | ersion |        |     |                                  |
| | 17     | 16     |        |     |                                  |
| | .04.01 | .07.01 |        |     |                                  |
| |        |        |        |     |                                  |
| | -      | -      |        |     |                                  |
| |   [New |   [New |        |     |                                  | | |        |        |        |     |                                  |
| |    Fea |    Fea |        |     |                                  |
| | tures] | tures] |        |     |                                  |
| | (#Vers | (#Vers |        |     |                                  |
| | ion17. | ion16. |        |     |                                  |
| | 04.01_ | 07.01_ |        |     |                                  |
| | NewFea | NewFea |        |     |                                  |
| | tures) | tures) |        |     |                                  |
| | -   [  | -   [  |        |     |                                  | | | Fixes] | Fixes] |        |     |                                  |
| | (#Vers | (#Vers |        |     |                                  |
| | ion17. | ion16. |        |     |                                  |
| | 04.01_ | 07.01_ |        |     |                                  |
| | Fixes) | Fixes) |        |     |                                  |
| +--------+--------+--------+     |                                  |
|                                  |                                  |
| ::: {.MCDropDo                   |                                  |
| wn .MCDropDown_Closed .dropDown} |                                  |
| []{.MCDropDownHead               |                                  | | .dropDownHead}                   |                                  |
|                                  |                                  |
| ### [![Closed](../../../Sk       |                                  |
| ins/Default/Stylesheets/Images/t |                                  |
| ransparent.gif){.MCDropDown_Imag |                                  |
| e_Icon width="16" height="11"}Co |                                  |
| mpatibility](javascript:void(0)) |                                  |
| {.MCDropDownHotSpot .dropDownHot |                                  |
| spot .MCDropDownHotSpot_ .MCHotS |                                  |
| potImage} {#closedcompatibility} |                                  |
|                                  |                                  |
| :::                              |                                  |
|  {.MCDropDownBody .dropDownBody} |                                  |
| These versions of the z/OS LSAM  |                                  |
| are compatible with              |                                  |
| OpCon |                                  |
| Release(s) 16.0 and higher.      |                                  |
| :::                              |                                  |
| :::                              |                                  |
| :::                              |                                  |
| :::                              |                                  |
+----------------------------------+----------------------------------+
|                                  |                                  |
+----------------------------------+----------------------------------+
| #                                |                                  |
| # []{#Version20.01.02_NewFeature |                                  | | s}Version 20.01.02 New Features  |                                  |
| {#version-20.01.02-new-features} |                                  |
+----------------------------------+----------------------------------+
| ### 2020 October {#october}      |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | **ZOS-248**: Added filtering     | | backgroun                        | support for datasets ending in   |
| d](../../../Resources/Images/rn- | .G0000V00 to match members of a  |
| enhancement.png "Enhancement ico | Generation Data Group (GDG) in   |
| n for release notes"){.relnotes} | file triggers and pre-runs.      |
+----------------------------------+----------------------------------+
| ![Black text on blue             | **ZOS-252**: Removed the minimum | | backgroun                        | job limit of 10 on process       |
| d](../../../Resources/Images/rn- | counts to avoid not having       |
| enhancement.png "Enhancement ico | enough storage space upon        |
| n for release notes"){.relnotes} | initialization. The upper limit  |
|                                  | will be either the initial value |
|                                  | from XPSPARM or 30, whichever is |
|                                  | greater.                         |
+----------------------------------+----------------------------------+
| ![Black text on blue             | **ZOS-263**: Disable OpCon GDG   | | backgroun                        | resolution for jobs running with |
| d](../../../Resources/Images/rn- | GDGBIAS=STEP.                    |
| enhancement.png "Enhancement ico |                                  |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | **ZOS-242**: Shortened the       | | backgroun                        | search path for pre-run checks   |
| d](../../../Resources/Images/rn- | and optimized the status         |
| enhancement.png "Enhancement ico | updates.                         |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | **ZOS-224**: The z/OS LSAM no    | | backgroun                        | longer supplies the sample       |
| d](../../../Resources/Images/rn- | IEFACTRT step messages exit. The |
| enhancement.png "Enhancement ico | STEPMSGS parameter will now be   |
| n for release notes"){.relnotes} | ignored.                         |
+----------------------------------+----------------------------------+
| ![Black text on blue             | **ZOS-228**: The USEJMR          | | backgroun                        | parameter now defaults to NO.    |
| d](../../../Resources/Images/rn- |                                  |
| enhancement.png "Enhancement ico |                                  |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ## []{#Version19.0_Ne            |                                  | | wFeatures}Version 19.0 New Featu |                                  |
| res {#version-19.0-new-features} |                                  |
+----------------------------------+----------------------------------+
| ### 2019 July {#july}            |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | If a job awaiting execution      | | backgroun                        | (Queued) is detected to be held, |
| d](../../../Resources/Images/rn- | the job status will show as      |
| enhancement.png "Enhancement ico | \"Job held on queue.\"           |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | Updated the Job Output listing   | | backgroun                        | to provide more details and more |
| d](../../../Resources/Images/rn- | closely resemble the SDSF        |
| enhancement.png "Enhancement ico | listing for the job.             |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | Removed the row for              | | backgroun                        | JOB-CARD-RESTART from the        |
| d](../../../Resources/Images/rn- | Run-time parameters table in the |
| enhancement.png "Enhancement ico | z/OS LSAM manual.                |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | The \$JOB:RESTART event now      | | backgroun                        | supports ending step and \"full  |
| d](../../../Resources/Images/rn- | job restart\" options for z/OS   |
| enhancement.png "Enhancement ico | jobs.                            |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | Added a new XPSTRACK job step    | | backgroun                        | program for job tracking.        |
| d](../../../Resources/Images/rn- |                                  |
| enhancement.png "Enhancement ico |                                  |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | The JCL editor now supports      | | backgroun                        | retrieving JCL from the JES      |
| d](../../../Resources/Images/rn- | spool and tracked/queued jobs    |
| enhancement.png "Enhancement ico | will use this source by default. |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | Added an option to show jobs as  | | backgroun                        | \"Running\" at submission time,  |
| d](../../../Resources/Images/rn- | rather than when they begin      |
| enhancement.png "Enhancement ico | executing.                       |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | LSAM parameter displays will now | | backgroun                        | use hyphens, rather than         |
| d](../../../Resources/Images/rn- | underscores.                     |
| enhancement.png "Enhancement ico |                                  |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | The \"Abend Job at Step          | | backgroun                        | Termination\" step control       |
| d](../../../Resources/Images/rn- | action will not post an abend,   |
| enhancement.png "Enhancement ico | but allow COND=EVEN/ONLY steps   |
| n for release notes"){.relnotes} | to run.                          |
+----------------------------------+----------------------------------+
| ![Black text on blue             | Added a new parameter to bypass  | | backgroun                        | the return code simulation on    |
| d](../../../Resources/Images/rn- | restart.                         |
| enhancement.png "Enhancement ico |                                  |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
|                                  |                                  |
+----------------------------------+----------------------------------+
| ## []{#                          |                                  | | Version18.01.0201_NewFeatures}Ve |                                  |
| rsion 18.01.0201 New Features {# |                                  |
| version-18.01.0201-new-features} |                                  |
+----------------------------------+----------------------------------+
| ### 2018 December {#december}    |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | Updated the XPSTIMER program to  | | backgroun                        | support the ability to:          |
| d](../../../Resources/Images/rn- |                                  |
| enhancement.png "Enhancement ico | -   run as a TSO command         |
| n for release notes"){.relnotes} |     program.                     |
|                                  | -   be set up as a REXX job      |
|                                  |     type.                        |
|                                  | -   not require any user JCL.    |
|                                  | -   use Windows-style arguments. |
+----------------------------------+----------------------------------+
|                                  |                                  |
+----------------------------------+----------------------------------+
| #                                |                                  |
| # []{#Version17.04.01_NewFeature |                                  | | s}Version 17.04.01 New Features  |                                  |
| {#version-17.04.01-new-features} |                                  |
+----------------------------------+----------------------------------+
| ### 2017 April {#april}          |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | Added support to enable or       | | backgroun                        | disable the automatic restart    |
| d](../../../Resources/Images/rn- | step selection for a job.        |
| enhancement.png "Enhancement ico |                                  |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | Added support for inserting long | | backgroun                        | job status descriptions from     |
| d](../../../Resources/Images/rn- | XPSCOMM.                         |
| enhancement.png "Enhancement ico |                                  |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | XPSTIMER can be invoked as       | | backgroun                        | GENERICP and has new abend       |
| d](../../../Resources/Images/rn- | options.                         |
| enhancement.png "Enhancement ico |                                  |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | Added support for 256-character  | | backgroun                        | single byte character            |
| d](../../../Resources/Images/rn- | translations. Contact SMA        |
| enhancement.png "Enhancement ico | Support for more information.    |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
|                                  |                                  |
+----------------------------------+----------------------------------+
| #                                |                                  |
| # []{#Version16.07.01_NewFeature |                                  | | s}Version 16.07.01 New Features  |                                  |
| {#version-16.07.01-new-features} |                                  |
+----------------------------------+----------------------------------+
| ### 2016 September {#september}  |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | File and Message preruns will be | | backgroun                        | skipped for step restarts.       |
| d](../../../Resources/Images/rn- |                                  |
| enhancement.png "Enhancement ico |                                  |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | The MLWTO parameter now defaults | | backgroun                        | to YES.                          |
| d](../../../Resources/Images/rn- |                                  |
| enhancement.png "Enhancement ico |                                  |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | Added support for matching long  | | backgroun                        | job class names against a mask.  |
| d](../../../Resources/Images/rn- |                                  |
| enhancement.png "Enhancement ico |                                  |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | GDGOPT=C will only count         | | backgroun                        | positive generations that are    |
| d](../../../Resources/Images/rn- | cataloged as created.            |
| enhancement.png "Enhancement ico |                                  |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | LSAMLOG entry timestamps now use | | backgroun                        | UTC.                             |
| d](../../../Resources/Images/rn- |                                  |
| enhancement.png "Enhancement ico |                                  |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | Improved unique name assignment  | | backgroun                        | for temporary job names.         |
| d](../../../Resources/Images/rn- |                                  |
| enhancement.png "Enhancement ico |                                  |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | Improved recoverability through  | | backgroun                        | the LSAMLOG.                     |
| d](../../../Resources/Images/rn- |                                  |
| enhancement.png "Enhancement ico |                                  |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | Mixed case values are now        | | backgroun                        | allowed for the TRACSCHD and     |
| d](../../../Resources/Images/rn- | PASSWORD parameters.             |
| enhancement.png "Enhancement ico |                                  |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | Added comments to the JORS list  | | backgroun                        | to identify the fields.          |
| d](../../../Resources/Images/rn- |                                  |
| enhancement.png "Enhancement ico |                                  |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | Added a new message for GDG      | | backgroun                        | resolution when GDGOPT=C or R.   |
| d](../../../Resources/Images/rn- |                                  |
| enhancement.png "Enhancement ico |                                  |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | Allow the JCL editing agent to   | | backgroun                        | work (in non-TLS mode) when TLS  |
| d](../../../Resources/Images/rn- | support is enabled.              |
| enhancement.png "Enhancement ico |                                  |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on blue             | Added Dummy job type for \"file  | | backgroun                        | watcher\" type pre-runs.         |
| d](../../../Resources/Images/rn- |                                  |
| enhancement.png "Enhancement ico |                                  |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
|                                  |                                  |
+----------------------------------+----------------------------------+
| ## []{#Versio                    |                                  | | n20.01.02_Fixes}Version 20.01.02 |                                  |
|  Fixes {#version-20.01.02-fixes} |                                  |
+----------------------------------+----------------------------------+
| ### 2020 October {#october-1}    |                                  |
+----------------------------------+----------------------------------+
| ![Black text on green            | **ZOS-269**: Fixed missing mount | | background](../../../Resource    | notifications.                   |
| s/Images/rn-fixed.png "Fixed ico |                                  |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on green            | **ZOS-266**: Fixed intermittent  | | background](../../../Resource    | tracking problem when running    |
| s/Images/rn-fixed.png "Fixed ico | with USEJMR=NO.                  |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on green            | **ZOS-261**: Fixed GENERICP      | | background](../../../Resource    | parsing errors. The GENERICP     |
| s/Images/rn-fixed.png "Fixed ico | parser should accept either      |
| n for release notes"){.relnotes} | \"-t5\" or \"-t 5\" as valid     |
|                                  | parameters, but previously       |
|                                  | treated the value \"-t 5\" as if |
|                                  | no value was provided.           |
+----------------------------------+----------------------------------+
| ![Black text on green            | **ZOS-241**: Improved            | | background](../../../Resource    | performance of pre-run           |
| s/Images/rn-fixed.png "Fixed ico | processing for tape device       |
| n for release notes"){.relnotes} | requirements.                    |
+----------------------------------+----------------------------------+
|                                  |                                  |
+----------------------------------+----------------------------------+
| ## []{#Versio                    |                                  | | n17.04.01_Fixes}Version 17.04.01 |                                  |
|  Fixes {#version-17.04.01-fixes} |                                  |
+----------------------------------+----------------------------------+
| ### 2017 April {#april-1}        |                                  |
+----------------------------------+----------------------------------+
| ![Black text on green            | If TEMP\* DD allocations are     | | background](../../../Resource    | concatenated, no member rename   |
| s/Images/rn-fixed.png "Fixed ico | will be done.                    |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
|                                  |                                  |
+----------------------------------+----------------------------------+
| ## []{#Versio                    |                                  | | n16.07.01_Fixes}Version 16.07.01 |                                  |
|  Fixes {#version-16.07.01-fixes} |                                  |
+----------------------------------+----------------------------------+
| #                                |                                  |
| ## 2016 September {#september-1} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on green            | Fixed an issue where a \"Target  | | background](../../../Resource    | Schedule definition no longer    |
| s/Images/rn-fixed.png "Fixed ico | matches saved definition\'\'     |
| n for release notes"){.relnotes} | error appeared, indicating that  |
|                                  | a schedule mismatch was          |
|                                  | encountered during the second    |
|                                  | deployment of an already         |
|                                  | deployed schedule.               |
+----------------------------------+----------------------------------+
| ![Black text on green            | Error messages would be          | | background](../../../Resource    | displayed during a warm start of |
| s/Images/rn-fixed.png "Fixed ico | the LSAM if it was started with  |
| n for release notes"){.relnotes} | PARM=xx.                         |
+----------------------------------+----------------------------------+
| ![Black text on green            | \"Mount pending\" status was not | | background](../../../Resource    | being cleared before the end of  |
| s/Images/rn-fixed.png "Fixed ico | the job step.                    |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on green            | JORS agent could stop            | | background](../../../Resource    | functioning after a security     |
| s/Images/rn-fixed.png "Fixed ico | error.                           |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
| ![Black text on green            | Sometimes the ENQ was not        | | background](../../../Resource    | obtained before the deletion of  |
| s/Images/rn-fixed.png "Fixed ico | a dataset during restart.        |
| n for release notes"){.relnotes} |                                  |
+----------------------------------+----------------------------------+
:::

 

