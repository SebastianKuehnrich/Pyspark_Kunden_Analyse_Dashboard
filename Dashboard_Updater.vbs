Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Aktuellen Pfad ermitteln
strScriptPath = objFSO.GetParentFolderName(WScript.ScriptFullName)
strPowerShellScript = strScriptPath & "\update_dashboard_gui.ps1"

' PowerShell-Befehl erstellen (GUI ohne sichtbares PowerShell-Fenster)
strCommand = "powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & strPowerShellScript & """"

' PowerShell-GUI starten (verstecktes Fenster)
objShell.Run strCommand, 0, False

Set objShell = Nothing
Set objFSO = Nothing
