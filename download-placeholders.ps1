# PowerShell script to download placeholder images for the aviation website

Write-Host "Downloading placeholder images for your aviation website..." -ForegroundColor Green

# Create images directory if it doesn't exist
if (!(Test-Path "images")) {
    New-Item -ItemType Directory -Name "images"
    Write-Host "Created images directory" -ForegroundColor Yellow
}

# Define the placeholder images to download
$images = @{
    "hero.jpg" = "https://via.placeholder.com/1200x400/87CEEB/000000?text=Aviation+Hero+Image"
    "photo1.jpg" = "https://via.placeholder.com/400x300/4682B4/FFFFFF?text=Jet+over+Mountains"
    "photo2.jpg" = "https://via.placeholder.com/400x300/2F4F4F/FFFFFF?text=Airport+Lights"
    "photo3.jpg" = "https://via.placeholder.com/400x300/708090/FFFFFF?text=Airliner+Takeoff"
    "print1.jpg" = "https://via.placeholder.com/300x400/4682B4/FFFFFF?text=Airbus+A320"
    "print2.jpg" = "https://via.placeholder.com/300x400/2F4F4F/FFFFFF?text=Fighter+Jet"
}

# Download each image
foreach ($image in $images.GetEnumerator()) {
    $filename = $image.Key
    $url = $image.Value
    $filepath = "images\$filename"
    
    Write-Host "Downloading $filename..." -ForegroundColor Cyan
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $filepath
        Write-Host "✓ Downloaded $filename" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Failed to download $filename" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

Write-Host "`nAll placeholder images downloaded!" -ForegroundColor Green
Write-Host "You can now open website.html in your browser to see your website with images." -ForegroundColor Yellow
Write-Host "To replace with real aviation photos, use the download-images.html file for guidance." -ForegroundColor Yellow 