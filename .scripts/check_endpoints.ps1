try {
  $r = Invoke-WebRequest 'http://localhost:3000' -UseBasicParsing -TimeoutSec 10
  Write-Output "ROOT_STATUS: $($r.StatusCode)"
} catch {
  Write-Output "ROOT_ERR: $($_.Exception.Message)"
}

try {
  $h = Invoke-RestMethod 'http://localhost:3000/api/hero' -Method GET -TimeoutSec 10
  Write-Output "HERO_GET:"
  $h | ConvertTo-Json -Depth 6 | Write-Output
} catch {
  Write-Output "HERO_GET_ERR: $($_.Exception.Message)"
}

$body = @{
  heroContent = @{
    badge = 'Teste Local'
    mainTitle = 'Teste Title'
    gradientTitle = 'Grad'
    description = 'Descrição de teste'
    buttonText = 'Ir'
    buttonLink = '/'
    imageUrl = ''
    imageAlt = ''
  }
  topCard = @{
    category = 'Notícia'
    title = 'Top Card Test'
    imageUrl = ''
    imageAlt = ''
    link = '/'
    categoryColor = 'sky'
  }
  bottomCard = @{
    category = 'Tutorial'
    title = 'Bottom Card Test'
    imageUrl = ''
    imageAlt = ''
    link = '/'
    categoryColor = 'emerald'
  }
}

try {
  $resp = Invoke-RestMethod 'http://localhost:3000/api/hero' -Method POST -Body ($body | ConvertTo-Json -Depth 6) -ContentType 'application/json' -TimeoutSec 20
  Write-Output "HERO_POST:"
  $resp | ConvertTo-Json -Depth 6 | Write-Output
} catch {
  Write-Output "HERO_POST_ERR: $($_.Exception.Message)"
}
