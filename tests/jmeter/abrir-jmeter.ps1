$ErrorActionPreference = "Stop"

# 1. Configurar JAVA_HOME apuntando al JDK 21 instalado en la PC
$jdkPath = "C:\Program Files\Java\jdk-21.0.10"
if (Test-Path $jdkPath) {
    $env:JAVA_HOME = $jdkPath
    $env:PATH = "$jdkPath\bin;$env:PATH"
    Write-Host "[OK] Java JDK 21 detectado en: $jdkPath" -ForegroundColor Green
}

# 2. Verificar o descargar Apache JMeter 5.6.3 portable en el perfil del usuario
$jmeterBaseDir = "$env:USERPROFILE\apache-jmeter-5.6.3"
$jmeterBat = "$jmeterBaseDir\bin\jmeter.bat"
$zipPath = "$env:TEMP\apache-jmeter-5.6.3.zip"

if (-not (Test-Path $jmeterBat)) {
    Write-Host "[SETUP] Descargando Apache JMeter 5.6.3 oficial (solo la primera vez)..." -ForegroundColor Cyan
    $url = "https://dlcdn.apache.org//jmeter/binaries/apache-jmeter-5.6.3.zip"
    try {
        Invoke-WebRequest -Uri $url -OutFile $zipPath -UseBasicParsing
    } catch {
        $fallbackUrl = "https://archive.apache.org/dist/jmeter/binaries/apache-jmeter-5.6.3.zip"
        Invoke-WebRequest -Uri $fallbackUrl -OutFile $zipPath -UseBasicParsing
    }
    Write-Host "[SETUP] Extrayendo Apache JMeter en $env:USERPROFILE ..." -ForegroundColor Cyan
    Expand-Archive -Path $zipPath -DestinationPath $env:USERPROFILE -Force
    Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
    Write-Host "[OK] Apache JMeter 5.6.3 instalado correctamente." -ForegroundColor Green
} else {
    Write-Host "[OK] Apache JMeter 5.6.3 ya se encuentra listo." -ForegroundColor Green
}

# 3. Abrir la interfaz gráfica de JMeter cargando directamente nuestro Plan de Pruebas .jmx del CORE
$jmxFile = Resolve-Path "$PSScriptRoot\PADOMI_Core_IoT_StressTest.jmx"
Write-Host "[LANZANDO] Abriendo Apache JMeter con el plan: $jmxFile" -ForegroundColor Yellow
& $jmeterBat -t "$jmxFile"

