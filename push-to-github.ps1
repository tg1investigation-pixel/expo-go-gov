# PowerShell script to push Police Search Engine to GitHub
# Run this script after creating the repository on GitHub

Write-Host "🚀 Police Search Engine - GitHub Push Script" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from D:\PoliceSearchApp" -ForegroundColor Red
    exit 1
}

# Get GitHub username
$githubUsername = Read-Host "Enter your GitHub username"
$repoName = Read-Host "Enter repository name (default: police-search-engine)" 

if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "police-search-engine"
}

Write-Host ""
Write-Host "📋 Repository Details:" -ForegroundColor Yellow
Write-Host "   Username: $githubUsername"
Write-Host "   Repository: $repoName"
Write-Host "   URL: https://github.com/$githubUsername/$repoName"
Write-Host ""

$confirm = Read-Host "Have you created this repository on GitHub? (y/n)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host ""
    Write-Host "📝 Please create the repository first:" -ForegroundColor Yellow
    Write-Host "   1. Go to: https://github.com/new"
    Write-Host "   2. Repository name: $repoName"
    Write-Host "   3. Set to Private (recommended)"
    Write-Host "   4. DO NOT initialize with README"
    Write-Host "   5. Click 'Create repository'"
    Write-Host ""
    Write-Host "Then run this script again." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "🔧 Setting up Git remote..." -ForegroundColor Cyan

# Remove existing remote if it exists
git remote remove origin 2>$null

# Add new remote
git remote add origin "https://github.com/$githubUsername/$repoName.git"

# Check if branch is main or master
$currentBranch = git branch --show-current
if ($currentBranch -eq "master") {
    Write-Host "📝 Renaming branch to 'main'..." -ForegroundColor Cyan
    git branch -M main
    $currentBranch = "main"
}

Write-Host ""
Write-Host "✅ Git remote configured!" -ForegroundColor Green
Write-Host "   Remote URL: https://github.com/$githubUsername/$repoName.git"
Write-Host "   Branch: $currentBranch"
Write-Host ""

# Show current status
Write-Host "📊 Current Git Status:" -ForegroundColor Cyan
git status

Write-Host ""
Write-Host "🚀 Ready to push!" -ForegroundColor Green
Write-Host ""
Write-Host "Next step: Run this command:" -ForegroundColor Yellow
Write-Host "   git push -u origin $currentBranch" -ForegroundColor White
Write-Host ""
Write-Host "When prompted:" -ForegroundColor Yellow
Write-Host "   Username: $githubUsername" -ForegroundColor White
Write-Host "   Password: Use a Personal Access Token (not your password)" -ForegroundColor White
Write-Host ""
Write-Host "💡 To create a token:" -ForegroundColor Cyan
Write-Host "   1. GitHub → Settings → Developer settings → Personal access tokens"
Write-Host "   2. Generate new token (classic)"
Write-Host "   3. Select scope: repo"
Write-Host "   4. Copy the token and use it as password"
Write-Host ""

$pushNow = Read-Host "Do you want to push now? (y/n)"
if ($pushNow -eq "y" -or $pushNow -eq "Y") {
    Write-Host ""
    Write-Host "🔄 Pushing to GitHub..." -ForegroundColor Cyan
    git push -u origin $currentBranch
    Write-Host ""
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
        Write-Host "   View at: https://github.com/$githubUsername/$repoName" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Push failed. Check your credentials and try again." -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "⏭️  Skipping push. Run 'git push -u origin $currentBranch' when ready." -ForegroundColor Yellow
}

