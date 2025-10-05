# Test Registration API with correct port
Write-Host "Testing Registration API on port 3004..." -ForegroundColor Green

$registerData = @{
    name = "Ahmed Mohamed"
    email = "ahmed@test.com"
    password = "123456"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3004/api/auth/register" -Method POST -Body $registerData -ContentType "application/json"
    Write-Host "Registration successful!" -ForegroundColor Green
    Write-Host "User ID: $($response.user.id)"
    Write-Host "Name: $($response.user.name)"
    Write-Host "Email: $($response.user.email)"
    Write-Host "Role: $($response.user.role)"
    Write-Host "Created At: $($response.user.createdAt)"
} catch {
    Write-Host "Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $result = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($result)
        $responseBody = $reader.ReadToEnd()
        Write-Host "Error details: $responseBody" -ForegroundColor Yellow
    }
}

Write-Host "Test completed." -ForegroundColor Magenta