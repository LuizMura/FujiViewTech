try {
  $h = Invoke-RestMethod 'http://localhost:3000/api/hero' -Method GET -TimeoutSec 10
  $h | ConvertTo-Json -Depth 6 | Write-Output
} catch {
  Write-Output "ERR: $($_.Exception.Message)"
}
