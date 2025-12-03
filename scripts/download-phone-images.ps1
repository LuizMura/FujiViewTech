# Script para baixar imagens de smartphones de alta qualidade
# Execução: .\scripts\download-phone-images.ps1

$outputDir = "public\images\phones"

# Criar diretório se não existir
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    Write-Host "✓ Diretório criado: $outputDir" -ForegroundColor Green
}

# Lista de URLs de imagens (Unsplash - gratuitas e de alta qualidade)
$images = @{
    # iPhone 16 Pro Max (equivalente ao iPhone 17)
    "iphone-16-pro-front.jpg" = "https://images.unsplash.com/photo-1696446702183-cbd0674e8c26?w=800&q=80"
    "iphone-16-pro-back.jpg" = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80"
    "iphone-16-pro-lifestyle.jpg" = "https://images.unsplash.com/photo-1695653422715-991ec3a0db7a?w=1200&q=80"
    
    # Google Pixel 9 Pro (equivalente ao Pixel 10)
    "pixel-9-pro-front.jpg" = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80"
    "pixel-9-pro-back.jpg" = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80"
    "pixel-9-pro-lifestyle.jpg" = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80"
    
    # Xiaomi 14 Ultra (equivalente ao Xiaomi 15)
    "xiaomi-14-ultra-front.jpg" = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80"
    "xiaomi-14-ultra-back.jpg" = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80"
    "xiaomi-14-ultra-lifestyle.jpg" = "https://images.unsplash.com/photo-1592286927505-c0d6e0d1dc8e?w=1200&q=80"
    
    # OnePlus 12 (equivalente ao OnePlus 13)
    "oneplus-12-front.jpg" = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80"
    "oneplus-12-back.jpg" = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80"
    "oneplus-12-lifestyle.jpg" = "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=1200&q=80"
    
    # Motorola Edge 50 Ultra (equivalente ao Edge 60)
    "moto-edge-50-front.jpg" = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80"
    "moto-edge-50-back.jpg" = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80"
    "moto-edge-50-lifestyle.jpg" = "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=1200&q=80"
    
    # Asus ROG Phone 8 (equivalente ao ROG Phone 9)
    "rog-phone-8-front.jpg" = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80"
    "rog-phone-8-back.jpg" = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80"
    "rog-phone-8-lifestyle.jpg" = "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&q=80"
    
    # Samsung Galaxy Z Fold 6 (equivalente ao Z Fold 7)
    "z-fold-6-front.jpg" = "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80"
    "z-fold-6-back.jpg" = "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80"
    "z-fold-6-lifestyle.jpg" = "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=1200&q=80"
    
    # iPhone 16 (equivalente ao iPhone 17)
    "iphone-16-front.jpg" = "https://images.unsplash.com/photo-1696446702183-cbd0674e8c26?w=800&q=80"
    "iphone-16-back.jpg" = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80"
    "iphone-16-lifestyle.jpg" = "https://images.unsplash.com/photo-1695653422715-991ec3a0db7a?w=1200&q=80"
    
    # Samsung Galaxy S24 (equivalente ao S25)
    "s24-front.jpg" = "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80"
    "s24-back.jpg" = "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80"
    "s24-lifestyle.jpg" = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&q=80"
}

Write-Host "`n📥 Iniciando download de imagens...`n" -ForegroundColor Cyan

$count = 0
$total = $images.Count

foreach ($image in $images.GetEnumerator()) {
    $count++
    $filename = $image.Key
    $url = $image.Value
    $outputPath = Join-Path $outputDir $filename
    
    try {
        Write-Host "[$count/$total] Baixando: $filename..." -NoNewline
        Invoke-WebRequest -Uri $url -OutFile $outputPath -UseBasicParsing -ErrorAction Stop
        Write-Host " ✓" -ForegroundColor Green
    }
    catch {
        Write-Host " ✗ Erro: $_" -ForegroundColor Red
    }
}

Write-Host "`n✅ Download concluído! Imagens salvas em: $outputDir`n" -ForegroundColor Green
Write-Host "📝 Próximo passo: Atualize o arquivo MDX com os novos caminhos:`n" -ForegroundColor Yellow
Write-Host "   Exemplo: '/images/phones/iphone-16-pro-front.jpg'`n" -ForegroundColor Gray
