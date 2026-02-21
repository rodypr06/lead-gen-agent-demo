# Lead Generation Agent Demo

A public-facing demo of the RodyTech AI Lead Generation Agent for Iowa small businesses.

## Daily Data Refresh System

The demo automatically refreshes with new Iowa business data every day at 3:00 AM CST.

### How It Works

1. **Data Generation** (`generate-demo-data.js`)
   - Runs the Lead Gen Agent research workflow
   - Generates 5-10 prospects per industry
   - Outputs JSON files to `data/` directory
   - Includes metadata: generated_at, prospects_found, contacts_verified

2. **Frontend Loading**
   - Loads from `data/[industry]-today.json` instead of hardcoded data
   - Falls back to sample data if today's file doesn't exist
   - Displays "Data updated: X hours ago" badge
   - Shows "Real Iowa Businesses" indicator

3. **Data Retention**
   - Keeps last 3 days of data (for backup)
   - Automatically cleans up older files

### Running the Data Generation Script

```bash
# Generate data for all industries
cd /Users/rrabelo/.openclaw/workspace/rodytech-workspace/lead-gen-agent/demo
node generate-demo-data.js

# Generate data for a specific industry
node generate-demo-data.js --industry manufacturing

# Test without saving (dry run)
node generate-demo-data.js --dry-run
```

### Setting Up Cron Job

To automate daily data refresh, add this to your crontab:

```cron
# Run daily at 3:00 AM CST (adjust for your timezone)
0 3 * * * cd /Users/rrabelo/.openclaw/workspace/rodytech-workspace/lead-gen-agent/demo && node generate-demo-data.js >> /var/log/rodytech-demo-refresh.log 2>&1
```

Or use OpenClaw's cron scheduler (if available):

```bash
openclaw cron add --schedule "0 3 * * *" --command "cd /Users/rrabelo/.openclaw/workspace/rodytech-workspace/lead-gen-agent/demo && node generate-demo-data.js"
```

### Troubleshooting

#### Issue: Data files not being generated

**Symptoms:** Demo shows "Sample data" badge, no new JSON files in `data/` directory.

**Possible Causes:**
1. Cron job not running
2. Script permissions issue
3. Python dependencies missing

**Solutions:**
1. Check cron job logs:
   ```bash
   tail -f /var/log/rodytech-demo-refresh.log
   ```

2. Verify script permissions:
   ```bash
   ls -la generate-demo-data.js
   # Should be: -rwxr-xr-x
   ```

3. Test manual run:
   ```bash
   node generate-demo-data.js
   ```

4. Check Python dependencies:
   ```bash
   cd /Users/rrabelo/.openclaw/workspace/rodytech-workspace/lead-gen-agent
   python3 scripts/research_prospects.py --help
   ```

#### Issue: Demo shows stale data

**Symptoms:** "Data updated: X days ago" badge with old date.

**Possible Causes:**
1. Cron job not scheduled correctly
2. System timezone mismatch
3. Script failing silently

**Solutions:**
1. Check cron job status:
   ```bash
   crontab -l | grep generate-demo-data
   ```

2. Verify timezone:
   ```bash
   date
   # Should show CST/CDT
   ```

3. Check for script errors:
   ```bash
   node generate-demo-data.js --dry-run
   ```

#### Issue: Frontend not loading JSON files

**Symptoms:** Demo falls back to sample data even though JSON files exist.

**Possible Causes:**
1. CORS issue (if running from different domain)
2. File permissions
3. Browser cache

**Solutions:**
1. Serve demo from same domain as JSON files
2. Check file permissions:
   ```bash
   ls -la data/
   ```

3. Clear browser cache or use incognito mode
4. Check browser console for errors:
   ```javascript
   // Open browser DevTools (F12) → Console
   ```

### Monitoring Data Freshness

1. **Check generated timestamps:**
   ```bash
   ls -lh data/*.json | awk '{print $6, $7, $8, $9}'
   ```

2. **Verify data quality:**
   ```bash
   cat data/manufacturing-today.json | jq '.metadata'
   ```

3. **Monitor log files:**
   ```bash
   tail -f /var/log/rodytech-demo-refresh.log
   ```

## Features

- **Interactive Demo**: Try the lead generation workflow without signup
- **Real Examples**: See sample prospects and contacts by industry
- **ROI Calculator**: View case studies and real client results
- **Transparent Pricing**: Clear pricing tiers and feature comparison
- **Technical Details**: Learn about the automation workflow and technology stack

## Quick Start

### Local Development

Simply open `index.html` in a web browser:

```bash
open index.html
```

Or use a local server:

```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

Then visit http://localhost:8000

### Coolify Deployment

The demo is a static HTML/CSS/JS site - easy to deploy to Coolify:

1. **Prepare your repository**

   Push the `demo/` directory to your GitHub repository:

   ```bash
   git init
   git add .
   git commit -m "Add lead gen agent demo"
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```

2. **Create a new service in Coolify**

   - Log in to your Coolify instance
   - Click "Create New Service"
   - Select "Dockerfile" or "Static Site"

3. **Configure the service**

   If using Dockerfile:
   ```dockerfile
   FROM nginx:alpine
   COPY . /usr/share/nginx/html
   EXPOSE 80
   ```

   If using Static Site:
   - Build directory: `.`
   - Publish directory: `.`
   - Port: 80

4. **Deploy**

   - Click "Deploy"
   - Coolify will build and deploy the demo
   - Access your demo at the provided URL

### Netlify/Vercel Deployment

Alternatively, deploy to Netlify or Vercel:

1. Push to GitHub
2. Connect repository to Netlify/Vercel
3. Set build directory to `.`
4. Deploy!

## File Structure

```
demo/
├── index.html                  # Main landing page
├── style.css                  # Styling with glassmorphism effects
├── script.js                  # Interactive demo functionality (loads from JSON)
├── generate-demo-data.js      # Data generation script (runs Lead Gen Agent)
├── README.md                  # This file
├── data/                      # Daily data files (auto-generated)
│   ├── manufacturing-today.json
│   ├── agriculture-today.json
│   ├── local-services-today.json
│   ├── healthcare-today.json
│   └── real-estate-today.json
└── assets/                   # Images and icons (placeholder)
```

## Customization

### Branding

Update these in `index.html`:

- Logo text: `.logo` element
- Company name: RodyTech references
- Contact email: contact@rodytech.net

### Colors

Modify CSS variables in `style.css`:

```css
:root {
    --primary: #6366f1;
    --primary-dark: #4f46e5;
    --secondary: #10b981;
    --gradient-start: #667eea;
    --gradient-end: #764ba2;
}
```

### Demo Data

Update sample data in `script.js`:

```javascript
const sampleData = {
    manufacturing: {
        prospects: [...],
        contacts: [...]
    },
    // Add more industries...
};
```

### Pricing

Update pricing tiers in `index.html` under the `#pricing` section.

## Performance

The demo is optimized for:

- **Fast Loading**: Minimal dependencies, no frameworks
- **Mobile Responsive**: Works on all screen sizes
- **SEO Friendly**: Semantic HTML, meta tags
- **Accessibility**: ARIA labels, keyboard navigation

## Analytics

Add analytics tracking in `script.js`:

```javascript
// Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID');

// Or use Plausible, Fathom, etc.
```

## Support

For questions or issues:

- Email: contact@rodytech.net
- Website: https://rodytech.net
- GitHub: https://github.com/rodypr06/rodytech-website

## License

© 2026 RodyTech LLC. All rights reserved.
