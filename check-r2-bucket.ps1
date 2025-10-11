# PowerShell script to check R2 bucket via Cloudflare API
# You need to get a Cloudflare API token from: https://dash.cloudflare.com/profile/api-tokens

$ACCOUNT_ID = "e0b70d52f241f7e6ece12d27961d47a5"

Write-Host "=== Cloudflare R2 Bucket Check ===" -ForegroundColor Cyan
Write-Host ""

# Check if CLOUDFLARE_TOKEN environment variable is set
if (-not $env:CLOUDFLARE_TOKEN) {
    Write-Host "❌ CLOUDFLARE_TOKEN environment variable not set!" -ForegroundColor Red
    Write-Host ""
    Write-Host "To get a Cloudflare API token:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://dash.cloudflare.com/profile/api-tokens" -ForegroundColor Yellow
    Write-Host "2. Click 'Create Token'" -ForegroundColor Yellow
    Write-Host "3. Use 'Edit Cloudflare Workers' template or create custom token with:" -ForegroundColor Yellow
    Write-Host "   - Account > Account Settings > Read" -ForegroundColor Yellow
    Write-Host "   - Account > Workers R2 Storage > Edit" -ForegroundColor Yellow
    Write-Host "4. Copy the token and set it:" -ForegroundColor Yellow
    Write-Host "   `$env:CLOUDFLARE_TOKEN = 'your-token-here'" -ForegroundColor Green
    Write-Host ""
    Write-Host "Then run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Cloudflare token found" -ForegroundColor Green
Write-Host "Account ID: $ACCOUNT_ID" -ForegroundColor Cyan
Write-Host ""

# List all R2 buckets
Write-Host "Fetching R2 buckets..." -ForegroundColor Cyan
$headers = @{
    "Authorization" = "Bearer $env:CLOUDFLARE_TOKEN"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/r2/buckets" -Headers $headers -Method Get
    
    if ($response.success) {
        Write-Host "✅ Successfully connected to Cloudflare API" -ForegroundColor Green
        Write-Host ""
        Write-Host "Your R2 Buckets:" -ForegroundColor Cyan
        Write-Host "================" -ForegroundColor Cyan
        
        if ($response.result.buckets.Count -eq 0) {
            Write-Host "No buckets found" -ForegroundColor Yellow
        } else {
            foreach ($bucket in $response.result.buckets) {
                Write-Host ""
                Write-Host "Bucket Name: $($bucket.name)" -ForegroundColor Green
                Write-Host "Location: $($bucket.location)" -ForegroundColor Gray
                Write-Host "Created: $($bucket.creation_date)" -ForegroundColor Gray
                
                # Check if this is the blinkeach bucket
                if ($bucket.name -eq "blinkeach") {
                    Write-Host "✓ This is your configured bucket!" -ForegroundColor Green
                }
            }
        }
    } else {
        Write-Host "❌ API request failed" -ForegroundColor Red
        Write-Host "Errors: $($response.errors | ConvertTo-Json)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error connecting to Cloudflare API" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response.StatusCode -eq 403) {
        Write-Host ""
        Write-Host "⚠️  Token doesn't have sufficient permissions" -ForegroundColor Yellow
        Write-Host "Make sure your token has 'Account > Workers R2 Storage > Read' permission" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=== End of Check ===" -ForegroundColor Cyan