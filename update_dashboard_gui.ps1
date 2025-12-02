# ============================================
# Dashboard Updater mit GUI
# ============================================

# Fehlerbehandlung aktivieren
$ErrorActionPreference = "Stop"

try {
    # Windows Forms Assembly laden
    Add-Type -AssemblyName System.Windows.Forms
    Add-Type -AssemblyName System.Drawing
} catch {
    [System.Windows.Forms.MessageBox]::Show("Fehler beim Laden der GUI-Bibliotheken: $_", "Fehler", "OK", "Error")
    exit 1
}

# Visual Basic für InputBox
Add-Type -AssemblyName Microsoft.VisualBasic

# Funktion für Messagebox
function Show-MessageBox {
    param(
        [string]$Message,
        [string]$Title,
        [System.Windows.Forms.MessageBoxButtons]$Buttons = [System.Windows.Forms.MessageBoxButtons]::OK,
        [System.Windows.Forms.MessageBoxIcon]$Icon = [System.Windows.Forms.MessageBoxIcon]::Information
    )
    return [System.Windows.Forms.MessageBox]::Show($Message, $Title, $Buttons, $Icon)
}

# Hauptfenster erstellen
$form = New-Object System.Windows.Forms.Form
$form.Text = "Dashboard Daten Updater"
$form.Size = New-Object System.Drawing.Size(500, 400)
$form.StartPosition = "CenterScreen"
$form.FormBorderStyle = "FixedDialog"
$form.MaximizeBox = $false

# Logo/Header
$labelHeader = New-Object System.Windows.Forms.Label
$labelHeader.Location = New-Object System.Drawing.Point(10, 20)
$labelHeader.Size = New-Object System.Drawing.Size(460, 40)
$labelHeader.Text = "Kunden-Analyse Dashboard Updater"
$labelHeader.Font = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
$labelHeader.TextAlign = "MiddleCenter"
$form.Controls.Add($labelHeader)

# Schritt 1: PySpark
$labelStep1 = New-Object System.Windows.Forms.Label
$labelStep1.Location = New-Object System.Drawing.Point(30, 80)
$labelStep1.Size = New-Object System.Drawing.Size(440, 25)
$labelStep1.Text = "Schritt 1: PySpark Daten generieren"
$labelStep1.Font = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
$form.Controls.Add($labelStep1)

$btnGenerate = New-Object System.Windows.Forms.Button
$btnGenerate.Location = New-Object System.Drawing.Point(50, 110)
$btnGenerate.Size = New-Object System.Drawing.Size(380, 40)
$btnGenerate.Text = "Daten mit PySpark generieren"
$btnGenerate.Font = New-Object System.Drawing.Font("Segoe UI", 10)
$btnGenerate.BackColor = [System.Drawing.Color]::FromArgb(0, 123, 255)
$btnGenerate.ForeColor = [System.Drawing.Color]::White
$btnGenerate.FlatStyle = "Flat"
$form.Controls.Add($btnGenerate)

# Schritt 2: GitHub Push
$labelStep2 = New-Object System.Windows.Forms.Label
$labelStep2.Location = New-Object System.Drawing.Point(30, 170)
$labelStep2.Size = New-Object System.Drawing.Size(440, 25)
$labelStep2.Text = "Schritt 2: Zu GitHub pushen (optional)"
$labelStep2.Font = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
$form.Controls.Add($labelStep2)

$btnPush = New-Object System.Windows.Forms.Button
$btnPush.Location = New-Object System.Drawing.Point(50, 200)
$btnPush.Size = New-Object System.Drawing.Size(380, 40)
$btnPush.Text = "Zu GitHub pushen"
$btnPush.Font = New-Object System.Drawing.Font("Segoe UI", 10)
$btnPush.BackColor = [System.Drawing.Color]::FromArgb(40, 167, 69)
$btnPush.ForeColor = [System.Drawing.Color]::White
$btnPush.FlatStyle = "Flat"
$btnPush.Enabled = $false
$form.Controls.Add($btnPush)

# Schritt 3: Dashboard starten
$labelStep3 = New-Object System.Windows.Forms.Label
$labelStep3.Location = New-Object System.Drawing.Point(30, 260)
$labelStep3.Size = New-Object System.Drawing.Size(440, 25)
$labelStep3.Text = "Schritt 3: Dashboard starten"
$labelStep3.Font = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
$form.Controls.Add($labelStep3)

$btnStart = New-Object System.Windows.Forms.Button
$btnStart.Location = New-Object System.Drawing.Point(50, 290)
$btnStart.Size = New-Object System.Drawing.Size(380, 40)
$btnStart.Text = "Dashboard starten"
$btnStart.Font = New-Object System.Drawing.Font("Segoe UI", 10)
$btnStart.BackColor = [System.Drawing.Color]::FromArgb(102, 126, 234)
$btnStart.ForeColor = [System.Drawing.Color]::White
$btnStart.FlatStyle = "Flat"
$btnStart.Enabled = $false
$form.Controls.Add($btnStart)

# Event Handler: PySpark generieren
$btnGenerate.Add_Click({
    $btnGenerate.Enabled = $false
    $btnGenerate.Text = "Generiere Daten..."

    try {
        # PySpark Script ausführen
        $process = Start-Process -FilePath "python" -ArgumentList "generate_dashboard_data.py" -Wait -NoNewWindow -PassThru

        if ($process.ExitCode -eq 0) {
            Show-MessageBox -Message "Daten erfolgreich generiert!`n`nDie Dashboard-Daten wurden aktualisiert." -Title "Erfolg" -Icon Information
            $btnGenerate.Text = "[OK] Daten generiert"
            $btnGenerate.BackColor = [System.Drawing.Color]::FromArgb(40, 167, 69)
            $btnPush.Enabled = $true
            $btnStart.Enabled = $true
        } else {
            Show-MessageBox -Message "Fehler beim Generieren der Daten!`n`nBitte pruefe dein Python-Script." -Title "Fehler" -Icon Error
            $btnGenerate.Text = "[FEHLER] Nochmal versuchen"
            $btnGenerate.BackColor = [System.Drawing.Color]::FromArgb(220, 53, 69)
            $btnGenerate.Enabled = $true
        }
    } catch {
        Show-MessageBox -Message "Fehler: $_" -Title "Fehler" -Icon Error
        $btnGenerate.Enabled = $true
        $btnGenerate.Text = "Daten mit PySpark generieren"
    }
})

# Event Handler: GitHub Push
$btnPush.Add_Click({
    # Repository-Auswahl Dialog
    $repoForm = New-Object System.Windows.Forms.Form
    $repoForm.Text = "Repository auswaehlen"
    $repoForm.Size = New-Object System.Drawing.Size(450, 220)
    $repoForm.StartPosition = "CenterScreen"
    $repoForm.FormBorderStyle = "FixedDialog"
    $repoForm.MaximizeBox = $false

    $labelRepo = New-Object System.Windows.Forms.Label
    $labelRepo.Location = New-Object System.Drawing.Point(20, 20)
    $labelRepo.Size = New-Object System.Drawing.Size(400, 30)
    $labelRepo.Text = "Repository auswaehlen:"
    $labelRepo.Font = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
    $repoForm.Controls.Add($labelRepo)

    $comboRepo = New-Object System.Windows.Forms.ComboBox
    $comboRepo.Location = New-Object System.Drawing.Point(20, 60)
    $comboRepo.Size = New-Object System.Drawing.Size(390, 30)
    $comboRepo.Font = New-Object System.Drawing.Font("Segoe UI", 10)
    $comboRepo.DropDownStyle = "DropDownList"
    $comboRepo.Items.Add("SebastianKuehnrich/Pyspark_Kunden_Analyse_Dashboard") | Out-Null
    $comboRepo.Items.Add("Anderes Repository...") | Out-Null
    $comboRepo.SelectedIndex = 0
    $repoForm.Controls.Add($comboRepo)

    $btnOK = New-Object System.Windows.Forms.Button
    $btnOK.Location = New-Object System.Drawing.Point(150, 120)
    $btnOK.Size = New-Object System.Drawing.Size(100, 35)
    $btnOK.Text = "OK"
    $btnOK.Font = New-Object System.Drawing.Font("Segoe UI", 10)
    $btnOK.DialogResult = [System.Windows.Forms.DialogResult]::OK
    $repoForm.Controls.Add($btnOK)

    $btnCancel = New-Object System.Windows.Forms.Button
    $btnCancel.Location = New-Object System.Drawing.Point(270, 120)
    $btnCancel.Size = New-Object System.Drawing.Size(100, 35)
    $btnCancel.Text = "Abbrechen"
    $btnCancel.Font = New-Object System.Drawing.Font("Segoe UI", 10)
    $btnCancel.DialogResult = [System.Windows.Forms.DialogResult]::Cancel
    $repoForm.Controls.Add($btnCancel)

    $repoForm.AcceptButton = $btnOK
    $repoForm.CancelButton = $btnCancel

    $result = $repoForm.ShowDialog()

    if ($result -eq [System.Windows.Forms.DialogResult]::OK) {
        $selectedRepo = $comboRepo.SelectedItem

        if ($selectedRepo -eq "Anderes Repository...") {
            $customRepo = [Microsoft.VisualBasic.Interaction]::InputBox("Repository URL eingeben:", "Repository", "https://github.com/username/repo.git")
            if ([string]::IsNullOrWhiteSpace($customRepo)) {
                Show-MessageBox -Message "Keine Repository URL eingegeben!" -Title "Abgebrochen" -Icon Warning
                return
            }
            $repoName = $customRepo
        } else {
            $repoName = $selectedRepo
        }

        # Datum für Commit
        $date = Get-Date -Format "dd.MM.yyyy"
        $commitMessage = "Update: Neue E-Commerce Daten - $date"

        # Git Befehle ausführen
        $btnPush.Text = "Pushe zu GitHub..."
        $btnPush.Enabled = $false

        try {
            # Git add
            git add .

            # Git commit
            $commitResult = git commit -m $commitMessage 2>&1

            if ($LASTEXITCODE -eq 0) {
                # Git push
                $pushResult = git push origin main 2>&1

                if ($LASTEXITCODE -eq 0) {
                    Show-MessageBox -Message "Erfolgreich zu GitHub gepusht!`n`nRepository: $repoName`nBranch: main`nCommit: $commitMessage" -Title "Erfolg" -Icon Information
                    $btnPush.Text = "[OK] Zu GitHub gepusht"
                    $btnPush.BackColor = [System.Drawing.Color]::FromArgb(40, 167, 69)
                } else {
                    Show-MessageBox -Message "Fehler beim Push!`n`n$pushResult" -Title "Push Fehler" -Icon Error
                    $btnPush.Text = "Zu GitHub pushen"
                    $btnPush.Enabled = $true
                }
            } else {
                Show-MessageBox -Message "Keine Aenderungen zum Committen.`n`nAlle Dateien sind bereits auf dem neuesten Stand." -Title "Info" -Icon Information
                $btnPush.Text = "[OK] Bereits aktuell"
                $btnPush.BackColor = [System.Drawing.Color]::FromArgb(108, 117, 125)
            }
        } catch {
            Show-MessageBox -Message "Git Fehler: $_" -Title "Fehler" -Icon Error
            $btnPush.Text = "Zu GitHub pushen"
            $btnPush.Enabled = $true
        }
    }
})

# Event Handler: Dashboard starten
$btnStart.Add_Click({
    Show-MessageBox -Message "Dashboard wird gestartet!`n`nDas Dashboard laeuft auf:`nhttp://localhost:5173`n`nDruecke STRG+C im Terminal zum Beenden." -Title "Dashboard startet" -Icon Information

    # npm run dev in neuem Terminal starten
    Start-Process -FilePath "cmd.exe" -ArgumentList "/k npm run dev"

    $form.Close()
})

# Formular anzeigen
$form.Add_Shown({$form.Activate()})
[void]$form.ShowDialog()
