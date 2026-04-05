Param(
    [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\\..")).Path,
    [string]$OutputDir = (Join-Path $ProjectRoot "deploy\\backups")
)

$ErrorActionPreference = "Stop"

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backendDir = Join-Path $ProjectRoot "backend"
$dataDir = Join-Path $backendDir "data"
$mediaDir = Join-Path $backendDir "media"
$archiveBase = Join-Path $OutputDir "wecan-backup-$timestamp"
$archivePath = "$archiveBase.zip"

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

$pathsToArchive = @()
if (Test-Path $dataDir) { $pathsToArchive += $dataDir }
if (Test-Path $mediaDir) { $pathsToArchive += $mediaDir }

if ($pathsToArchive.Count -eq 0) {
    throw "Nothing to back up. Expected backend/data or backend/media to exist."
}

Compress-Archive -Path $pathsToArchive -DestinationPath $archivePath -Force
Write-Host "Backup created: $archivePath"
