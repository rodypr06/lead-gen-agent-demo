// ========================================
// RodyTech Lead Gen Agent Demo
// ========================================

// Sample data for demo
const demoData = {
    manufacturing: {
        prospects: [
            { company: "Midwest Metal Products", location: "Cedar Rapids, IA", contact: "Mike Johnson", email: "mike@midwestmetal.com", score: 87 },
            { company: "TMT Fabrication", location: "Des Moines, IA", contact: "Sarah Chen", email: "sarah@tmtfab.com", score: 72 },
            { company: "Liebovich Steel", location: "Cedar Rapids, IA", contact: "David Smith", email: "david@liebovichiowa.com", score: 91 },
            { company: "D&S Sheetmetal", location: "Marion, IA", contact: "Lisa Brown", email: "lisa@dssheet.com", score: 68 },
            { company: "Iowa Precision Mfg", location: "Waterloo, IA", contact: "Tom Wilson", email: "tom@iowaprecision.com", score: 79 }
        ],
        email: {
            subject: "Quick question about {company}'s growth",
            body: `Hi {name},

I noticed {company} has been expanding rapidly in the Iowa manufacturing sector. Impressive growth!

I'm reaching out because we help Iowa manufacturers automate their lead generation. One of our clients, TMT Fab, saw a 3x increase in qualified leads within 30 days.

Worth a brief conversation to see if we could do the same for {company}?

Best regards,
Rody

P.S. I saw your recent expansion announcement - congrats!`
        }
    },
    agriculture: {
        prospects: [
            { company: "Heartland Ag Services", location: "Des Moines, IA", contact: "John Peters", email: "john@heartlandag.com", score: 85 },
            { company: "Prairie Grain Co-op", location: "Cedar Rapids, IA", contact: "Amy White", email: "amy@prairiegrain.com", score: 74 },
            { company: "Iowa Farm Equipment", location: "Waterloo, IA", contact: "Mark Davis", email: "mark@iowafarmeq.com", score: 88 }
        ],
        email: {
            subject: "Helping {company} reach more farmers",
            body: `Hi {name},

With planting season approaching, I wanted to reach out about {company}'s outreach strategy.

We work with Iowa ag businesses to automate their lead generation. Heartland Ag saw a 40% increase in equipment inquiries last season using our AI agent.

Could we schedule 10 minutes to see if this would work for {company}?

Best,
Rody`
        }
    },
    hvac: {
        prospects: [
            { company: "Des Moines HVAC Pros", location: "Des Moines, IA", contact: "Chris Miller", email: "chris@dmhvac.com", score: 82 },
            { company: "Cedar Rapids Plumbing", location: "Cedar Rapids, IA", contact: "Jennifer Lee", email: "jennifer@crplumbing.com", score: 76 }
        ],
        email: {
            subject: "More service calls for {company}",
            body: `Hi {name},

Busy season is here - are you getting all the service calls you could handle?

We help Iowa HVAC companies automate their lead generation. Most clients see 15-20 additional qualified calls per month.

Worth a quick chat?

Best,
Rody`
        }
    },
    healthcare: {
        prospects: [
            { company: "Des Moines Urgent Care", location: "Des Moines, IA", contact: "Dr. Sarah Kim", email: "sarah@dmurgent.com", score: 89 },
            { company: "Cedar Rapids Medical", location: "Cedar Rapids, IA", contact: "James Wilson", email: "james@crmed.com", score: 81 }
        ],
        email: {
            subject: "Patient referrals for {company}",
            body: `Hi {name},

I wanted to reach out about growing {company}'s referring physician network.

We help Iowa healthcare practices connect with more referring providers. One client added 8 new referral partnerships in 45 days.

Could we explore this for {company}?

Best,
Rody`
        }
    },
    realestate: {
        prospects: [
            { company: "Iowa Realty Partners", location: "Des Moines, IA", contact: "Jennifer Lopez", email: "jennifer@iowarealty.com", score: 84 },
            { company: "Cedar Rapids Homes", location: "Cedar Rapids, IA", contact: "Mike Thompson", email: "mike@crhomes.com", score: 78 }
        ],
        email: {
            subject: "More listings for {company}",
            body: `Hi {name},

The spring market is heating up - are you getting in front of enough potential sellers?

We help Iowa agents automate their prospecting. Most see 3-5 additional listings per month within 60 days.

Worth a conversation?

Best,
Rody`
        }
    }
};

// ========================================
// NUMBER ANIMATION
// ========================================
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Animate stats on scroll
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statValues = entry.target.querySelectorAll('.stat-value[data-target]');
            statValues.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateValue(stat, 0, target, 2000);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ========================================
// ROI CALCULATOR
// ========================================
function calculateROI() {
    const hourlyRate = parseFloat(document.getElementById('hourly-rate')?.value) || 50;
    const hoursSpent = parseFloat(document.getElementById('hours-spent')?.value) || 20;
    const currentResponse = parseFloat(document.getElementById('current-response')?.value) || 3;
    const dealValue = parseFloat(document.getElementById('deal-value')?.value) || 5000;
    
    const monthlyCost = hourlyRate * hoursSpent;
    const timeSaved = hoursSpent * 0.975; // 97.5% time reduction
    const leadIncrease = ((20 - currentResponse) / currentResponse * 100).toFixed(0);
    const yearSavings = (monthlyCost * 12) - 5061; // $5061 = Year 1 cost
    const breakEven = (5061 / dealValue).toFixed(1);
    
    // Update display
    const timeSavedEl = document.getElementById('time-saved');
    const leadIncreaseEl = document.getElementById('lead-increase');
    const yearSavingsEl = document.getElementById('year-savings');
    const breakEvenEl = document.getElementById('break-even');
    
    if (timeSavedEl) timeSavedEl.textContent = timeSaved.toFixed(1) + ' hrs';
    if (leadIncreaseEl) leadIncreaseEl.textContent = '+' + leadIncrease + '%';
    if (yearSavingsEl) yearSavingsEl.textContent = '$' + yearSavings.toLocaleString();
    if (breakEvenEl) breakEvenEl.textContent = breakEven + ' deals';
}

// Calculator inputs
['hourly-rate', 'hours-spent', 'current-response', 'deal-value'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', calculateROI);
    }
});

// Initial calculation
calculateROI();

// ========================================
// DEMO AGENT
// ========================================
const runAgentBtn = document.getElementById('run-agent');
const agentWorking = document.getElementById('agent-working');
const demoResults = document.getElementById('demo-results');

if (runAgentBtn) {
    runAgentBtn.addEventListener('click', async () => {
        const industry = document.getElementById('demo-industry')?.value || 'manufacturing';
        const count = parseInt(document.getElementById('demo-count')?.value) || 5;
        
        // Reset and show working state
        runAgentBtn.disabled = true;
        runAgentBtn.textContent = 'Running...';
        agentWorking.style.display = 'block';
        demoResults.style.display = 'none';
        
        // Reset steps
        document.querySelectorAll('.wf-step').forEach(step => {
            step.classList.remove('active', 'complete');
            step.querySelector('.wf-bar').style.width = '0%';
        });
        
        // Reset metrics
        document.getElementById('metric-found').textContent = '0';
        document.getElementById('metric-contacts').textContent = '0';
        document.getElementById('metric-score').textContent = '0';
        
        // Run animation sequence
        const steps = [
            { id: 'wf-1', message: 'Searching Iowa manufacturing companies...', found: Math.floor(count * 1.5) },
            { id: 'wf-2', message: 'Extracting emails and phone numbers...', contacts: count },
            { id: 'wf-3', message: 'Scoring leads using IBAT algorithm...', score: 76 },
            { id: 'wf-4', message: 'Writing personalized outreach emails...', done: true }
        ];
        
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            const stepEl = document.getElementById(step.id);
            
            // Activate step
            stepEl.classList.add('active');
            document.getElementById('agent-status').textContent = step.message;
            
            // Animate progress
            await new Promise(r => setTimeout(r, 300));
            stepEl.querySelector('.wf-bar').style.width = '100%';
            
            // Update metrics
            if (step.found) {
                animateValue(document.getElementById('metric-found'), 0, step.found, 800);
            }
            if (step.contacts) {
                animateValue(document.getElementById('metric-contacts'), 0, step.contacts, 800);
            }
            if (step.score) {
                animateValue(document.getElementById('metric-score'), 0, step.score, 800);
            }
            
            await new Promise(r => setTimeout(r, 800));
            stepEl.classList.remove('active');
            stepEl.classList.add('complete');
        }
        
        // Show results
        await new Promise(r => setTimeout(r, 500));
        agentWorking.style.display = 'none';
        demoResults.style.display = 'block';
        
        // Populate prospects table
        const tbody = document.getElementById('prospects-body');
        const data = demoData[industry] || demoData.manufacturing;
        if (tbody) {
            tbody.innerHTML = data.prospects.slice(0, count).map(p => `
                <tr>
                    <td><strong>${p.company}</strong></td>
                    <td>${p.location}</td>
                    <td>${p.contact}<br><small>${p.email}</small></td>
                    <td><span class="score-badge" style="background: ${p.score >= 80 ? '#10b981' : p.score >= 60 ? '#f59e0b' : '#6b7280'}; color: white; padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.875rem;">${p.score}/100</span></td>
                </tr>
            `).join('');
        }
        
        // Reset button
        runAgentBtn.disabled = false;
        runAgentBtn.innerHTML = '<span class="btn-icon">▶</span> Run Agent';
    });
}

// ========================================
// TABS
// ========================================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        
        // Update buttons
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update panels
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        const panel = document.getElementById('panel-' + tab);
        if (panel) panel.classList.add('active');
    });
});

// Export tabs
document.querySelectorAll('.export-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.export-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const exportType = btn.getAttribute('data-export');
        const content = document.getElementById('export-content');
        
        if (exportType === 'csv') {
            content.textContent = `Company,Contact,Email,Phone,Score
Midwest Metal Products,Mike Johnson,mike@midwestmetal.com,(319) 555-0123,87
TMT Fabrication,Sarah Chen,sarah@tmtfab.com,(515) 555-0456,72
Liebovich Steel,David Smith,david@liebovichiowa.com,(319) 555-0789,91`;
        } else if (exportType === 'json') {
            content.textContent = JSON.stringify({
                campaign_id: "iowa-mfg-2024",
                total_prospects: 25,
                hot_leads: 8,
                contacts: [
                    { company: "Midwest Metal Products", score: 87, email_verified: true }
                ]
            }, null, 2);
        } else {
            content.innerHTML = `📊 Lead Generation Report

Campaign completed: 25 prospects analyzed
✅ 18 verified email addresses
✅ 12 phone numbers found
⭐ Average lead score: 76/100
🎯 8 hot leads recommended`;
        }
    });
});

// ========================================
// PRICING TOGGLE
// ========================================
const planToggle = document.getElementById('plan-toggle');
if (planToggle) {
    planToggle.addEventListener('change', () => {
        const isMonthly = planToggle.checked;
        
        // Update labels
        document.querySelectorAll('.toggle-label').forEach(l => l.classList.remove('active'));
        document.querySelector(isMonthly ? '[data-plan="monthly"]' : '[data-plan="onetime"]').classList.add('active');
        
        // Update prices
        document.querySelectorAll('.price').forEach(price => {
            const amount = isMonthly ? price.getAttribute('data-monthly') : price.getAttribute('data-onetime');
            price.textContent = '$' + amount;
        });
        
        // Update period text
        document.querySelectorAll('.price-period').forEach(p => {
            p.textContent = isMonthly ? 'per month' : 'one-time';
        });
    });
}

// ========================================
// FAQ ACCORDION
// ========================================
document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
        const item = q.parentElement;
        const isActive = item.classList.contains('active');
        
        // Close all
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        
        // Open clicked if wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ========================================
// SMOOTH SCROLL
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ========================================
// SELECT PLAN
// ========================================
function selectPlan(plan) {
    alert(`You selected the ${plan} plan! In production, this would redirect to checkout or a contact form.`);
}

console.log('🤖 RodyTech Lead Gen Agent Demo v2.0 loaded');
