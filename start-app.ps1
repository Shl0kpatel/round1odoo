# StackIt Application Startup Script

Write-Host "Starting StackIt Q&A Platform..." -ForegroundColor Green

# Start MongoDB (if not already running)
Write-Host "Starting MongoDB..." -ForegroundColor Yellow
Start-Process -NoNewWindow mongod

# Wait for MongoDB to start
Start-Sleep -Seconds 3

# Start Backend Server
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process -FilePath "cmd" -ArgumentList "/c", "cd `"c:\Users\HP\OneDrive - pdpu.ac.in\Odoo\Round1\stackit-backend`" && npm run dev" -WindowStyle Normal

# Wait for backend to start
Start-Sleep -Seconds 5

# Start Frontend Server
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Start-Process -FilePath "cmd" -ArgumentList "/c", "cd `"c:\Users\HP\OneDrive - pdpu.ac.in\Odoo\Round1\stackit-frontend`" && npm start" -WindowStyle Normal

Write-Host "`nStackIt is starting up!" -ForegroundColor Green
Write-Host "Backend will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "`nPress any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
