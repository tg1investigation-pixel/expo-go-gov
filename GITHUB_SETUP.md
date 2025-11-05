# 📤 Push to GitHub - Instructions

## ✅ Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository settings:
   - **Repository name:** `police-search-engine` (or your preferred name)
   - **Description:** "Mobile search application for Police Investigation Unit"
   - **Visibility:** Choose Private (recommended) or Public
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

---

## ✅ Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

### Option A: If repository is empty (recommended)

```bash
cd D:\PoliceSearchApp
git remote add origin https://github.com/YOUR_USERNAME/police-search-engine.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### Option B: Using SSH (if you have SSH keys set up)

```bash
cd D:\PoliceSearchApp
git remote add origin git@github.com:YOUR_USERNAME/police-search-engine.git
git branch -M main
git push -u origin main
```

---

## ✅ Step 3: Authenticate

- If using HTTPS, you'll be prompted for:
  - **Username:** Your GitHub username
  - **Password:** Use a Personal Access Token (not your password)
    - Create token: GitHub → Settings → Developer settings → Personal access tokens → Generate new token
    - Select scope: `repo`
    - Copy the token and use it as password

- If using SSH, make sure your SSH key is added to GitHub

---

## ✅ Step 4: Verify

After pushing, check your GitHub repository:
- All files should be visible
- README.md should display
- Code should be accessible

---

## 🔄 Future Updates

To push future changes:

```bash
cd D:\PoliceSearchApp
git add .
git commit -m "Description of changes"
git push
```

---

## 📝 Repository Settings (Recommended)

After pushing, consider:

1. **Add repository description** on GitHub
2. **Add topics/tags:** `react-native`, `expo`, `police`, `mobile-app`, `mysql`
3. **Set visibility:** Private (for security) or Public
4. **Add collaborators** if working in a team
5. **Enable GitHub Actions** if you want CI/CD (optional)

---

## ⚠️ Important Notes

### Security Considerations

Before pushing, ensure:

- ✅ No sensitive data in code (passwords, API keys)
- ✅ `.env` files are in `.gitignore` (already done)
- ✅ Database credentials are not hardcoded
- ✅ Consider using GitHub Secrets for sensitive data

### Files NOT Pushed (Already in .gitignore)

- `node_modules/` - Dependencies (install with `npm install`)
- `.env` files - Environment variables
- Build artifacts
- OS-specific files

### Files Included

- ✅ All source code
- ✅ Configuration files
- ✅ Documentation (README, guides)
- ✅ Package.json files

---

## 🚀 Quick Commands Reference

```bash
# Navigate to project
cd D:\PoliceSearchApp

# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# View remote
git remote -v

# Change remote URL (if needed)
git remote set-url origin NEW_URL
```

---

## ❓ Troubleshooting

### "Repository not found"
- Check repository name is correct
- Verify you have access to the repository
- Ensure you're using the correct GitHub username

### "Authentication failed"
- Use Personal Access Token instead of password
- Check token has `repo` scope
- Verify SSH key is added to GitHub (if using SSH)

### "Failed to push"
- Check internet connection
- Verify repository exists on GitHub
- Try: `git push -u origin main --force` (be careful with force push)

### "Large file warning"
- If files are too large, use Git LFS:
  ```bash
  git lfs install
  git lfs track "*.largefile"
  ```

---

## 📋 Pre-Push Checklist

- [ ] All code tested and working
- [ ] No sensitive data in code
- [ ] `.gitignore` includes `.env` files
- [ ] README.md is up to date
- [ ] Commit message is descriptive
- [ ] GitHub repository created
- [ ] Remote URL is correct

**Ready to push!** 🚀
