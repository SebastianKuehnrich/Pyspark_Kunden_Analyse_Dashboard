Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Aktuellen Pfad ermitteln
strScriptPath = objFSO.GetParentFolderName(WScript.ScriptFullName)
strPowerShellScript = strScriptPath & "\update_dashboard_gui.ps1"

' PowerShell-Befehl erstellen (mit sichtbarem Fenster für Fehlersuche)
strCommand = "powershell.exe -ExecutionPolicy Bypass -NoExit -File """ & strPowerShellScript & """"

' PowerShell-GUI starten (Fenster bleibt sichtbar bei Fehlern)
objShell.Run strCommand, 1, False

Set objShell = Nothing
Set objFSO = Nothing
