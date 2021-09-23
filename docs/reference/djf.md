# Dynamic JCL Facility

The Dynamic JCL Facility (DJF) provides run-time tailoring for JCL. It supports variable substitution and conditional inclusion of JCL statements.

DJF statements are identified by hyphens in the first two columns ('\--') of the JCL. For visual organization, DJF statements may be indented by starting the statement with '\--' and up to forty spaces before the actual statement. Indentation has no syntactical meaning, e.g., the following forms are completely equivalent:

- \--IF @%FREQ EQ DAILY
- \-- \--IF @%FREQ EQ DAILY

## Variables

JCL variable tokens are normally defined in the job definition in OpCon, preceded by \'@\'. In versions of the z/OS LSAM prior to 5.04.04, the value of the variable is substituted in the JCL without moving any other data. Beginning with 5.04, if the first character of the variable name (so the definition begins with \'@%\'), the remaining data is moved right or left to fit the replacement value. In addition, to simplify variable identification, an option dot can be added to the name in the JCL, to separate it from the remaining data, and the dot will be removed after substitution.

Variable length substitution will always take place if the JCLSCAN character is not '@'.

### Built-in Variables

Beginning with 5.04.03, the following built-in variables are supported in DJF:

|--- |--- |
|%YY|Two digit year from schedule date|
|%MM|Two digit month from schedule date|
|%DD|Two digit day of the month from the schedule date|
|%CYY|Two digit current year|
|%CMM|Two digit current month|
|%CDD|Two digit current day of the month|
|%CHHMMSSX|Eight digit current time as hours, minutes, seconds, tenths of seconds, and hundredths of seconds|
|%CHHMMSS|Six digit current time as hours, minutes, seconds|
|%CHHMM|Four digital current time as hours, minutes|
|%FREQ|The OpCon frequency of the current job instance|
|%RESTART|Set to TRUE if this is a step restart, otherwise FALSE|

### New DJF Statements Supporting Variables

#### --SET

The --SET statement has three forms:

- --SETJCLSCAN
  - This form simply activates JCL scanning. It is not required if the job has any variables defined, or there are any other --SET statements.
- --SETJCLSCAN=*@*
  - Sets the character used in the JCL to identify the variables. This is primarily intended to allow the specification of the '@' character in the local character set.
  - If two different characters are supplied, then subsequent variable replacements will be performed in two passes, first searching for variables referenced by the second character, then with the first. (If the same character is listed twice, only a single pass will be performed.)
  - This option can also be set from the job definition. If the first entry in the JCL variables is \\\\JCLSCAN=.
  - *xy*\\\\, then the variables will be processed as if the JCL started with **\--SET JCLSCAN=xy**. (This format requires two characters.)
- --SET*var*=*value*
  - This assigns a value to variable *var*, replacing any previous value, if any. The assignment takes place after substitution of any variables in the statement.
  - The result is equivalent to the value that would have resulted from a job definition containing \\\\@*var*=*value\\\\*. (Note that the \'@\' prefix is added, so should not be included in the --SET. If the variable name begins with \'@\', DJF will attempt to replace it with any previously defined value.)
- --SETvar=*value1 + value2*
- *--*SETvar=*value1* - *value2*
  - If *value1* is numeric, calculates the sum or difference between the values and assigns it to *var*.
- --SET var=SUBSTR(string,start\[,length\[,pad\]\])
  - The string and start parameters are required, and the length and pad arguments are optional.
  - The parameters:
    - string
      - The input string, which may be empty.
    - start
      - Starting position in **string** to begin the result.
      - Must be a positive whole number.
      - If **start**\>LENGTH(**string**), only pad characters will be returned.
    - length
      - The length of the output string.
      - Must be a positive whole number.
      - Defaults to the remaining part of **string** or 1, whichever is less.
        - IOW, the smaller of LENGTH(**string**)-**start**+1 or 1.
    - pad
      - character added to the end of the output string if the requested length is greater than.
      - Defaults to space.
- --SET var=DATE(string,offset)
  - String is interpreted as a date in YYYYMMDD or YYMMDD format. The number of days in *offset* is added to *string* and the result returned in the same format. *Offset* can be signed.

#### --GET

String is interpreted as a date in YYYYMMDD or YYMMDD format. The number of days in *offset* is added to *string* and the result returned in the same format. *Offset* can be signed.

-   \--GET *var*=\[\[**opcon_property**\]\]     -   Any OpCon property that can be used in the job definition is
        allowed, and is evaluated in the context of the current job.

    ```{=html}
    <!-- -->
    ```
    -   If the variable *var* is already defined, this statement is
        ignored.
    -   To work around possible translation problems, *any* matched
        characters can be used to start and end the token definition:
        -   \--GET var=@@\$SCHEDULE DATE (+1d)@@.

        ```{=html}
        <!-- -->
        ```
        -   \--GET var=\#\#\$SCHEDULE DATE (+1d)\#\#.

### New DJF Statements for Conditional JCL

DJF supports IF/ELSE/ENDIF processing to include or exclude blocks of
JCL based on logical tests.

-   \--IF *string1 \[operator string2\]*     -   After any variable substitutions, string1 will be compared with
        string2 using the chosen logical operator. If the result is
        true, the following JCL statements will be included, up to the
        corresponding \--ELSE or \--ENDIF. If the result was false, the
        statements will be skipped.
    -   The operator can be any one of:
        -   EQ - Equal.
        -   NE - Not Equal.
        -   LT - Less than.
        -   GT - Greater than.
        -   LE - Less than or equal.
        -   GE - Greater than or equal.
    -   If the operator and string2 are omitted, the result is true if
        string1 has the value TRUE.

    ```{=html}
    <!-- -->
    ```
    -   \--IF blocks can be nested up to 7 levels deep.
-   \--ELSE
    -   Inside an \--IF block toggles the statement include status.
    -   Outside an \--IF block, ignored.
-   \--ENDIF
    -   Closes an active \--IF block and reverts to the include status
        of the enclosing block, if any, or sets the include state to
        true, if not.
    -   If no \--IF is active, this statement is ignored.
-   \--GOTO *label*
    -   After variable substitution, skips all JCL statements up to a
        DJF label.
    -   The label statement must follow the GOTO in the JCL.
    -   The \--IF nesting level is tracked, but the \--IF conditions are
        ignored for any statements up to the label, so that you can
        branch into an \--IF block.
-   \--.*label*
    -   GOTO target label. If a \--GOTO is active, turns it off and
        begins including JCL from this point.
    -   If GOTO is not active, the statement is skipped.
    -   Variable substitution is *not* performed on labels.

### Other DJF Statements

These statements do not directly affect the JCL that is submitted.

-   \--NOP
    -   No-operation. This statement is simply skipped.
-   \--MSG *text*
    -   After variable substitution, sends *text* as a *User Message*
        LSAM feedback.
-   \--INCLUDE *lib*(**member**),*set,comment*
    -   The only required parameter is the member name.

    ```{=html}
    <!-- -->
    ```
    -   Parameters:
        -   lib
            -   The DDNAME for the library containing the member.
            -   One to eight characters.
            -   Defaults to XPSPROC.
            -   Must be allocated in the LSAM procedure.
        -   member
            -   Name of the member to include.
            -   One to eight characters.
            -   Required parameter.
        -   set
            -   Values: Y/N.
            -   If set to Y, this member contains variable assignments
                in the form: var=value, one variable per line, with the
                variable name starting in the second column.
                -   Each line is translated to:\
                    \--SET var=value.
            -   If JCLSCAN=%%, this will invoke special processing:
                -   Any spaces in the line will be removed, and the
                    result will be quoted, so\
                    var = many words with spaces\
                    will be translated to\
                    \--SET \\\\var=manywordswithspaces\\\\.
        -   comment
            -   Single character.

            ```{=html}
            <!-- -->
            ```
            -   If set, any lines with this character in the first
                column will be skipped.
-   \--INCLUDE *property_name,type*
    -   *property_name* - any OpCon property, up to 60 characters.
        -   Must be scoped (SI., JI., OI., etc.).
        -   The property value is interpreted as multiple lines,
            separated by \'\\n\' or \'\\N\'.
        -   Long records will be wrapped at 80 characters.

        ```{=html}
        <!-- -->
        ```
        -   Any \'\\\' characters in the data must be doubled.
    -   *type* - type of data to include
        -   Optional.

        ```{=html}
        <!-- -->
        ```
        -   If type is **D**, then any include lines beginning with
            \"//\" will be skipped.
:::

 

