# Start local MongoDB using Docker Compose (if Docker is installed)
# Usage: run this from project root in PowerShell

$composeFile = "docker-compose.yml"
if (-not (Test-Path $composeFile)) {
  Write-Error "docker-compose.yml not found in current directory. Run from project root."
  exit 1
}

# Check docker availability
$docker = Get-Command docker -ErrorAction SilentlyContinue
if (-not $docker) {
  Write-Host "Docker CLI not found. Please install Docker Desktop and ensure it's running." -ForegroundColor Yellow
  Write-Host "See README.docker.md for instructions." -ForegroundColor Cyan
  exit 2
}

# Start the compose stack
Write-Host "Bringing up Docker Compose services..." -ForegroundColor Cyan
docker compose up -d
if ($LASTEXITCODE -ne 0) {
  Write-Error "docker compose failed. Ensure Docker Desktop is running and you have permissions to run Docker." ; exit $LASTEXITCODE
}

Write-Host "Waiting for replica set init job to complete (logs will show initiation)" -ForegroundColor Cyan
# tail the init container logs for a short time
Start-Sleep -Seconds 2
docker compose logs --tail 50 mongo-init

Write-Host "Check replica set status with: mongosh --host 127.0.0.1 --port 27017 --eval 'rs.status()'" -ForegroundColor Green
Write-Host "After PRIMARY is elected, run: npx prisma db push" -ForegroundColor Green
