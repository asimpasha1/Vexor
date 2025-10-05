# Test Registration API
Write-Host "اختبار تسجيل حساب جديد..." -ForegroundColor Green

$registerData = @{
    name = "أحمد محمد"
    email = "ahmed@test.com"
    password = "123456"
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3004/api/auth/register" -Method POST -Body $registerData -ContentType "application/json"
    Write-Host "تم إنشاء الحساب بنجاح!" -ForegroundColor Green
    Write-Host "المعرف: $($response.user.id)"
    Write-Host "الاسم: $($response.user.name)"
    Write-Host "البريد: $($response.user.email)"
    Write-Host "الدور: $($response.user.role)"
    Write-Host "تاريخ الإنشاء: $($response.user.createdAt)"
} catch {
    $errorDetails = $_.Exception.Response
    if ($errorDetails) {
        $responseStream = $errorDetails.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($responseStream)
        $errorContent = $reader.ReadToEnd()
        Write-Host "خطأ في تسجيل الحساب:" -ForegroundColor Red
        Write-Host $errorContent -ForegroundColor Yellow
    } else {
        Write-Host "خطأ في الاتصال: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n" + "="*50 + "`n"

# Test Login using NextAuth signIn API
Write-Host "اختبار تسجيل الدخول..." -ForegroundColor Green

try {
    # Get CSRF token first
    $csrfResponse = Invoke-RestMethod -Uri "http://localhost:3004/api/auth/csrf" -Method GET
    $csrfToken = $csrfResponse.csrfToken
    
    Write-Host "تم الحصول على CSRF Token: $csrfToken" -ForegroundColor Cyan
    
    # Attempt login
    $loginData = @{
        email = "ahmed@test.com"
        password = "123456"
        csrfToken = $csrfToken
        callbackUrl = "/dashboard"
        json = "true"
    }
    
    $formData = ""
    foreach ($item in $loginData.GetEnumerator()) {
        if ($formData -ne "") { $formData += "&amp;" }
        $formData += "$($item.Key)=$($item.Value)"
    }
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3004/api/auth/callback/credentials" -Method POST -Body $formData -ContentType "application/x-www-form-urlencoded"
    
    Write-Host "تم تسجيل الدخول بنجاح!" -ForegroundColor Green
    Write-Host "الاستجابة: $($loginResponse | ConvertTo-Json -Depth 3)"
    
} catch {
    $errorDetails = $_.Exception.Response
    if ($errorDetails) {
        $responseStream = $errorDetails.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($responseStream)
        $errorContent = $reader.ReadToEnd()
        Write-Host "خطأ في تسجيل الدخول:" -ForegroundColor Red
        Write-Host $errorContent -ForegroundColor Yellow
    } else {
        Write-Host "خطأ في الاتصال: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "انتهاء اختبار نظام المصادقة" -ForegroundColor Magenta