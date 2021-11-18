# Mapping z/OS users to OpCon user and token definitions

## Background

OpCon external events sent from z/OS default to using the z/OS userid of the submitting or triggering process and a common event password.  With OpCon release 20, the external event password for each user is a pseudo-random string and cannot be chosen by the users.  This makes sharing passwords impractical.  
Beginning with release 21.00.02, the LSAM add the ability for the security administrator to store an OpCon event user and password (token) in the security database for each z/OS user.  If these values are defined, they will be used on the event.
 
### Implementation notes:

This feature uses custom fields, as implemented in RACF, but uses only standard SAF calls to extract the data.  It may work with other SAF software, but has not been tested.  If your shop does not use RACF for security, please contact SMA support for help with the setup or to replace the implementation.
 
## <a name="Custom_fields"></a>Custom fields

When a user program or trigger sends an event, the LSAM will extract the custom fields for the current user. If XPSUSER or XPSTOKEN fields are set, their values will be used in place of the z/OS userid and the common password.  If the OpCon userid is the same as the z/OS userid, the XPSUSER field can be omitted.
## <a name="Custom_definitions"></a>Custom Field definitions

Defining and using custom fields in RACF are documented in the **z/OS Security Server RACF Security Administrator's Guide**, available from IBM.  These commands will define the XPSUSER and XPSTOKEN fields.
 
This command defines the default custom field for the OpCon event user

    RDEFINE CFIELD USER.CSDATA.XPSUSER UACC(NONE)  
      CFDEF(TYPE(CHAR) MAXLENGTH(128) 
            FIRST(ANY) OTHER(ANY) MIXED(YES) 
            HELP('OPCON USERID'))
     
 This command defines the default custom field for the OpCon event token

    RDEFINE CFIELD USER.CSDATA.XPSTOKEN UACC(NONE)  
      CFDEF(TYPE(CHAR) MAXLENGTH(36) 
            FIRST(ANY) OTHER(ANY) MIXED(YES) 
            HELP('OPCON EVENT TOKEN'))
 
It may be necessary to activate the CFIELD class with **SETROPTS CLASSACT(CFIELD)**.
 
To activate a new or changed custom field, your system programmer must issue the IRRDPI00 command to rebuild the RACF dynamic parse table and restart dynamic parse. No IPL is required.  The IRRDPI00 command is documented in the **z/OS Security Server RACF System Programmer's Guide**.  
    It may be possible to perform the IRRDPI00 UPDATE through a console command, if an IRROPTxx member was created for this.  Consult your system programmer.
 
## <a name="Setting"></a>Setting custom fields

The field values can be set with the ADDUSER or ALTUSER commands.  For example, to assign a Windows domain user and 36 character event token to user USERA

    ALTUSER USERA CSDATA(XPSUSER(domain\winuser) 
          XPSTOKEN(e1356e1f-bdb4-479c-bfad-5271d1e680d8))
 
## <a name="Allowing"></a>Allowing users to view or update their own field values

By default, only security administrators can view or update custom fields.  To allow users to view their own XPSUSER and update their XPSTOKEN, you can use profiles in the FIELD class

    RDEFINE FIELD USER.CSDATA.XPSUSER  UACC(NONE) 
    RDEFINE FIELD USER.CSDATA.XPSTOKEN UACC(NONE) 
                                                                     
    /* ALLOW EACH USER TO VIEW THEIR OWN XPSUSER                     
    PERMIT USER.CSDATA.XPSUSER CLASS(FIELD) ID(&RACUID) ACC(READ) 
                                                                     
    /* ALLOW EACH USER TO UPDATE THEIR OWN EVENT TOKENS              
    PERMIT USER.CSDATA.XPSTOKEN CLASS(FIELD) ID(&RACUID) ACC(UPDATE) 
     
    SETROPTS CLASSACT(FIELD) RACLIST(FIELD) 
## <a name="Multiple_lsams"></a>Multiple LSAM instances

When using multiple LSAM instances, the userid mapping will use XPxUSER and XPxTOKEN for each instance, where ‘x’ is the XPSID.  These fields are defined in the same way as the defaults. 
 
In other words, when an event is being sent by USERA from the LSAM with XPSID=x, the user will be the first of these to be defined

1. The value from XPxUSER
1. The value from XPSUSER
1. USERA
 
Similarly, the event token will be the first of

1. The value from XPxTOKEN
1. The value from XPSTOKEN
1. The EVTPASS value from the XPSPARM file. 
 
 
With multiple LSAM instances, you may want to use generic FIELD profiles to allow user access

    RDEFINE FIELD USER.CSDATA.XP%USER  UACC(NONE) 
    RDEFINE FIELD USER.CSDATA.XP%TOKEN UACC(NONE) 
                                                                     
    /* ALLOW EACH USER TO VIEW THEIR OWN XPSUSER                     
    PERMIT USER.CSDATA.XP%USER CLASS(FIELD) ID(&RACUID) ACC(READ) 
                                                                     
    /* ALLOW EACH USER TO UPDATE THEIR OWN EVENT TOKENS              
    PERMIT USER.CSDATA.XP%TOKEN CLASS(FIELD) ID(&RACUID) ACC(UPDATE) 
     
    SETROPTS RACLIST(FIELD) REFRESH
 
     
