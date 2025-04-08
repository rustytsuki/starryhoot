!pragma warning disable all

!addincludedir "${__FILEDIR__}"
!include "EnvVarUpdate.nsh"
!include "HidpiAware.nsh"

Var isAdmin
Var envType

!macro customInit
  UserInfo::GetAccountType
  Pop $0
  StrCmp $0 "admin" 0 +2
    StrCpy $isAdmin "true"
    ${If} $isAdmin == "true"
      StrCpy $envType "HKLM"
    ${Else}
      StrCpy $envType "HKCU"
    ${EndIf}
!macroend

!macro customUnInit
  UserInfo::GetAccountType
  Pop $0
  StrCmp $0 "admin" 0 +2
    StrCpy $isAdmin "true"
    ${If} $isAdmin == "true"
      StrCpy $envType "HKLM"
    ${Else}
      StrCpy $envType "HKCU"
    ${EndIf}
!macroend

!macro customInstall
  ${EnvVarUpdate} $0 "PATH" "A" $envType "$INSTDIR"
  System::Call 'Kernel32::SendMessageTimeoutA(i 0xffff, i ${WM_SETTINGCHANGE}, i 0, t "Environment", i 0, i 1000, *i .r0)'
!macroend

!macro customUnInstall
  ${un.EnvVarUpdate} $0 "PATH" "R" $envType "$INSTDIR"
  System::Call 'Kernel32::SendMessageTimeoutA(i 0xffff, i ${WM_SETTINGCHANGE}, i 0, t "Environment", i 0, i 1000, *i .r0)'
!macroend