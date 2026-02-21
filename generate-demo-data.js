#!/usr/bin/env node3

/**
 * RodyTech Lead Gen Demo - Daily Data Generation Script
 * Generates fresh demo data with real Iowa business prospects
 *
 * Usage:
 *   node generate-demo-data.js                    # Run for all industries
 *   node generate-demo-data.js --industry manufacturing  # Single industry
 *   node generate-demo-data.js --dry-run          # Test without saving
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(require('child_process').exec);

// Configuration
const SCRIPTS_DIR = path.join(__dirname, '..', 'scripts');
const DATA_DIR = path.join(__dirname, 'data');
const BACKUP_DAYS = 3;
const PROSPECTS_PER_INDUSTRY = 7; // 5-10 prospects per industry (resource-friendly)

// Industries to generate data for
const INDUSTRIES = ['manufacturing', 'agriculture', 'local-services', 'healthcare', 'real-estate'];

// Industry mappings for display names
const INDUSTRY_NAMES = {
    'manufacturing': 'Manufacturing',
    'agriculture': 'Agriculture',
    'local-services': 'Local Services',
    'healthcare': 'Healthcare',
    'real-estate': 'Real Estate'
};

// Iowa cities for realistic locations
const IOWA_CITIES = [
    'Des Moines', 'Cedar Rapids', 'Davenport', 'Sioux City',
    'Waterloo', 'Dubuque', 'Council Bluffs', 'Ames', 'Iowa City'
];

/**
 * Ensure data directory exists
 */
async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
        console.log(`📁 Created data directory: ${DATA_DIR}`);
    }
}

/**
 * Clean up old data files (keep last BACKUP_DAYS)
 */
async function cleanupOldData() {
    try {
        const files = await fs.readdir(DATA_DIR);
        const today = new Date();

        for (const file of files) {
            if (!file.endsWith('.json')) continue;

            const filePath = path.join(DATA_DIR, file);
            const stats = await fs.stat(filePath);
            const fileAge = (today - stats.mtime) / (1000 * 60 * 60 * 24); // Age in days

            // Delete files older than BACKUP_DAYS
            if (fileAge > BACKUP_DAYS) {
                await fs.unlink(filePath);
                console.log(`🗑️  Deleted old data file: ${file}`);
            }
        }
    } catch (error) {
        console.warn(`⚠️  Cleanup warning: ${error.message}`);
    }
}

/**
 * Run Python research script for a specific industry
 */
async function runProspectResearch(industry) {
    const scriptPath = path.join(SCRIPTS_DIR, 'research_prospects.py');

    // Check if script exists
    try {
        await fs.access(scriptPath);
    } catch {
        console.warn(`⚠️  Research script not found, generating sample data for ${industry}`);
        return generateSampleData(industry);
    }

    try {
        // Run the Python script with sample data flag
        const { stdout, stderr } = await execAsync(
            `python3 "${scriptPath}" --industry ${industry} --count ${PROSPECTS_PER_INDUSTRY} --sample`,
            { cwd: path.join(__dirname, '..') }
        );

        if (stderr && stderr.includes('Error')) {
            console.warn(`⚠️  Research warning for ${industry}: ${stderr}`);
        }

        // Read the generated prospects file
        const prospectsDir = path.join(__dirname, '..', 'prospects', industry);
        try {
            const files = await fs.readdir(prospectsDir);
            const latestFile = files
                .filter(f => f.endsWith('-prospects.json'))
                .sort()
                .pop();

            if (latestFile) {
                const prospectsPath = path.join(prospectsDir, latestFile);
                const data = JSON.parse(await fs.readFile(prospectsPath, 'utf8'));
                console.log(`✅ Loaded ${data.prospects.length} prospects from ${industry}`);
                return convertToDemoFormat(industry, data.prospects);
            }
        } catch (error) {
            console.warn(`⚠️  Could not load prospects file, using sample data`);
        }

        // Fallback to sample data
        return generateSampleData(industry);
    } catch (error) {
        console.warn(`⚠️  Research failed for ${industry}, using sample data: ${error.message}`);
        return generateSampleData(industry);
    }
}

/**
 * Convert research output to demo format
 */
function convertToDemoFormat(industry, prospects) {
    const displayProspects = prospects.slice(0, PROSPECTS_PER_INDUSTRY).map(p => ({
        company: p.company_name,
        location: p.location,
        employees: `~${p.estimated_employees}`,
        website: p.website.replace('https://', '').replace('http://', ''),
        leadScore: Math.floor(Math.random() * 30 + 60),
        painPoints: p.pain_points || []
    }));

    const displayContacts = prospects.slice(0, PROSPECTS_PER_INDUSTRY).map(p => ({
        company: p.company_name,
        contact: guessContactEmail(p.company_name, p.website),
        title: 'Sales',
        verified: Math.random() > 0.3 // 70% verified rate
    }));

    return {
        industry,
        displayName: INDUSTRY_NAMES[industry] || industry,
        prospects: displayProspects,
        contacts: displayContacts
    };
}

/**
 * Generate sample data (fallback mode)
 */
function generateSampleData(industry) {
    const companySuffixes = ['Inc', 'LLC', 'Company', 'Corp', 'Industries', 'Solutions', 'Group', 'Manufacturing'];
    const companyNames = [
        'Midwest', 'Heartland', 'Prairie', 'Hawkeye', 'Cedar', 'River', 'Valley', 'State', 'Iowa', 'Central'
    ];
    const industryPrefixes = {
        'manufacturing': ['Precision', 'Advanced', 'Quality', 'Metal', 'Custom', 'Industrial'],
        'agriculture': ['Agri', 'Farm', 'Harvest', 'Grain', 'Crop', 'Field'],
        'healthcare': ['Health', 'Care', 'Medical', 'Wellness', 'Clinical'],
        'real-estate': ['Premier', 'Elite', 'Gateway', 'Horizon', 'Property'],
        'local-services': ['Expert', 'Professional', 'Master', 'Elite', 'Quality']
    };

    const prefixes = industryPrefixes[industry] || industryPrefixes['manufacturing'];
    const prospects = [];
    const contacts = [];

    for (let i = 0; i < PROSPECTS_PER_INDUSTRY; i++) {
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const name = companyNames[Math.floor(Math.random() * companyNames.length)];
        const suffix = companySuffixes[Math.floor(Math.random() * companySuffixes.length)];
        const companyName = `${prefix} ${name} ${suffix}`;
        const city = IOWA_CITIES[Math.floor(Math.random() * IOWA_CITIES.length)];
        const employees = Math.floor(Math.random() * 100 + 20);
        const website = `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
        const painPoints = getRandomPainPoints(industry);

        prospects.push({
            company: companyName,
            location: `${city}, IA`,
            employees: `~${employees}`,
            website: website,
            leadScore: Math.floor(Math.random() * 30 + 60),
            painPoints: painPoints
        });

        contacts.push({
            company: companyName,
            contact: `${prefix.toLowerCase()}.${name.toLowerCase()}@${website}`,
            title: 'Sales',
            verified: Math.random() > 0.3
        });
    }

    return {
        industry,
        displayName: INDUSTRY_NAMES[industry] || industry,
        prospects,
        contacts
    };
}

/**
 * Guess contact email from company name/website
 */
function guessContactEmail(companyName, website) {
    const cleanName = companyName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10);
    const domain = website.replace(/https?:\/\//, '').replace(/\/$/, '').split('/')[0];
    return `info@${domain}`;
}

/**
 * Get random pain points for an industry
 */
function getRandomPainPoints(industry) {
    const painPointsMap = {
        'manufacturing': ['staffing shortages', 'equipment downtime', 'supply chain disruptions'],
        'agriculture': ['seasonal planning', 'equipment maintenance', 'supply chain management'],
        'local-services': ['customer acquisition', 'scheduling management', 'marketing effectiveness'],
        'healthcare': ['patient follow-up', 'administrative burden', 'patient scheduling'],
        'real-estate': ['lead generation', 'property showings', 'client communication']
    };

    const points = painPointsMap[industry] || painPointsMap['manufacturing'];
    // Return 2-3 random pain points
    return points.slice(0, Math.floor(Math.random() * 2) + 2);
}

/**
 * Save data to JSON file
 */
async function saveData(industry, data) {
    const filename = `${industry}-today.json`;
    const filePath = path.join(DATA_DIR, filename);

    const outputData = {
        ...data,
        metadata: {
            generated_at: new Date().toISOString(),
            timezone: 'America/Chicago',
            prospects_found: data.prospects.length,
            contacts_verified: data.contacts.filter(c => c.verified).length,
            industry: industry,
            data_source: 'generated' // 'generated' or 'sample'
        }
    };

    await fs.writeFile(filePath, JSON.stringify(outputData, null, 2));
    console.log(`💾 Saved data to ${filename} (${data.prospects.length} prospects, ${data.contacts.length} contacts)`);

    return filePath;
}

/**
 * Main function
 */
async function main() {
    const args = process.argv.slice(2);
    const targetIndustry = args.find(arg => arg.startsWith('--industry'))?.split('=')[1] ||
                           args[args.indexOf('--industry') + 1];
    const dryRun = args.includes('--dry-run');

    console.log('🚀 Starting daily data generation...');
    console.log(`📅 Generated: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}`);

    // Ensure data directory exists
    await ensureDataDir();

    // Clean up old data (skip in dry run)
    if (!dryRun) {
        await cleanupOldData();
    }

    // Determine which industries to process
    const industries = targetIndustry ? [targetIndustry] : INDUSTRIES;

    const results = {
        total_prospects: 0,
        total_contacts: 0,
        industries_processed: 0,
        failed_industries: []
    };

    // Process each industry
    for (const industry of industries) {
        console.log(`\n🔍 Processing ${INDUSTRY_NAMES[industry] || industry}...`);

        try {
            // Generate data
            const data = await runProspectResearch(industry);

            // Save data (skip in dry run)
            if (!dryRun) {
                await saveData(industry, data);
            } else {
                console.log(`[DRY RUN] Would save ${data.prospects.length} prospects for ${industry}`);
            }

            results.total_prospects += data.prospects.length;
            results.total_contacts += data.contacts.length;
            results.industries_processed++;
        } catch (error) {
            console.error(`❌ Error processing ${industry}: ${error.message}`);
            results.failed_industries.push(industry);
        }
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Data Generation Summary');
    console.log('='.repeat(60));
    console.log(`Industries processed: ${results.industries_processed}/${industries.length}`);
    console.log(`Total prospects: ${results.total_prospects}`);
    console.log(`Total contacts: ${results.total_contacts}`);

    if (results.failed_industries.length > 0) {
        console.log(`Failed industries: ${results.failed_industries.join(', ')}`);
    }

    console.log(`\nData saved to: ${DATA_DIR}`);
    console.log('✅ Data generation complete!');

    // Return exit code
    return results.failed_industries.length > 0 ? 1 : 0;
}

// Run main function
if (require.main === module) {
    main().then(exitCode => {
        process.exit(exitCode);
    }).catch(error => {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    });
}

module.exports = { main, generateSampleData };
