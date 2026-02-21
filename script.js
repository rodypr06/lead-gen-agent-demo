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
        ]
    },
    agriculture: {
        prospects: [
            { company: "Heartland Ag Services", location: "Des Moines, IA", contact: "John Peters", email: "john@heartlandag.com", score: 85 },
            { company: "Prairie Grain Co-op", location: "Cedar Rapids, IA", contact: "Amy White", email: "amy@prairiegrain.com", score: 74 },
            { company: "Iowa Farm Equipment", location: "Waterloo, IA", contact: "Mark Davis", email: "mark@iowafarmeq.com", score: 88 }
        ]
    },
    hvac: {
        prospects: [
            { company: "Des Moines HVAC Pros", location: "Des Moines, IA", contact: "Chris Miller", email: "chris@dmhvac.com", score: 82 },
            { company: "Cedar Rapids Plumbing", location: "Cedar Rapids, IA", contact: "Jennifer Lee", email: "jennifer@crplumbing.com", score: 76 }
        ]
    },
    healthcare: {
        prospects: [
            { company: "Des Moines Urgent Care", location: "Des Moines, IA", contact: "Dr. Sarah Kim", email: "sarah@dmurgent.com", score: 89 },
            { company: "Cedar Rapids Medical", location: "Cedar Rapids, IA", contact: "James Wilson", email: "james@crmed.com", score: 81 }
        ]
    },
    realestate: {
        prospects: [
            { company: "Iowa Realty Partners", location: "Des Moines, IA", contact: "Jennifer Lopez", email: "jennifer@iowarealty.com", score: 84 },
            { company: "Cedar Rapids Homes", location: "Cedar Rapids, IA", contact: "Mike Thompson", email: "mike@crhomes.com", score: 78 }
        ]
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
    const timeSaved = hoursSpent * 0.975;
    const leadIncrease = ((20 - currentResponse) / currentResponse * 100).toFixed(0);
    const yearSavings = (monthlyCost * 12) - 5061;
    const breakEven = (5061 / dealValue).toFixed(1);
    
    const timeSavedEl = document.getElementById('time-saved');
    const leadIncreaseEl = document.getElementById('lead-increase');
    const yearSavingsEl = document.getElementById('year-savings');
    const breakEvenEl = document.getElementById('break-even');
    
    if (timeSavedEl) timeSavedEl.textContent = timeSaved.toFixed(1) + ' hrs';
    if (leadIncreaseEl) leadIncreaseEl.textContent = '+' + leadIncrease + '%';
    if (yearSavingsEl) yearSavingsEl.textContent = '$' + yearSavings.toLocaleString();
    if (breakEvenEl) breakEvenEl.textContent = breakEven + ' deals';
}

['hourly-rate', 'hours-spent', 'current-response', 'deal-value'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', calculateROI);
    }
});

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
        
        runAgentBtn.disabled = true;
        runAgentBtn.textContent = 'Running...';
        agentWorking.style.display = 'block';
        demoResults.style.display = 'none';
        
        document.querySelectorAll('.wf-step').forEach(step => {
            step.classList.remove('active', 'complete');
            step.querySelector('.wf-bar').style.width = '0%';
        });
        
        document.getElementById('metric-found').textContent = '0';
        document.getElementById('metric-contacts').textContent = '0';
        document.getElementById('metric-score').textContent = '0';
        
        const steps = [
            { id: 'wf-1', message: 'Searching Iowa manufacturing companies...', found: Math.floor(count * 1.5) },
            { id: 'wf-2', message: 'Extracting emails and phone numbers...', contacts: count },
            { id: 'wf-3', message: 'Scoring leads using IBAT algorithm...', score: 76 },
            { id: 'wf-4', message: 'Writing personalized outreach emails...', done: true }
        ];
        
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            const stepEl = document.getElementById(step.id);
            
            stepEl.classList.add('active');
            document.getElementById('agent-status').textContent = step.message;
            
            await new Promise(r => setTimeout(r, 300));
            stepEl.querySelector('.wf-bar').style.width = '100%';
            
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
        
        await new Promise(r => setTimeout(r, 500));
        agentWorking.style.display = 'none';
        demoResults.style.display = 'block';
        
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
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        const panel = document.getElementById('panel-' + tab);
        if (panel) panel.classList.add('active');
    });
});

// ========================================
// PRICING TOGGLE
// ========================================
const planToggle = document.getElementById('plan-toggle');
if (planToggle) {
    planToggle.addEventListener('change', () => {
        const isMonthly = planToggle.checked;
        
        document.querySelectorAll('.toggle-label').forEach(l => l.classList.remove('active'));
        document.querySelector(isMonthly ? '[data-plan="monthly"]' : '[data-plan="onetime"]').classList.add('active');
        
        document.querySelectorAll('.price').forEach(price => {
            const amount = isMonthly ? price.getAttribute('data-monthly') : price.getAttribute('data-onetime');
            price.textContent = '$' + amount;
        });
        
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
        
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        
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
// LEAD CAPTURE MODAL
// ========================================
function openLeadModal() {
    const modal = document.getElementById('leadModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLeadModal(event) {
    if (event && event.target !== event.currentTarget && event.type === 'click') {
        return;
    }
    const modal = document.getElementById('leadModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    setTimeout(() => {
        document.getElementById('leadForm').reset();
        document.getElementById('leadForm').style.display = 'block';
        document.getElementById('modalSuccess').style.display = 'none';
    }, 300);
}

// ========================================
// LEAD FORM SUBMISSION - FORMSPREE (FormData format)
// ========================================
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mnjbgpgz';

async function submitLeadForm(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>⏳</span> Sending...';
    submitBtn.disabled = true;
    
    // Use FormData instead of JSON (works better with Formspree)
    const formData = new FormData();
    formData.append('name', document.getElementById('leadName').value);
    formData.append('email', document.getElementById('leadEmail').value);
    formData.append('company', document.getElementById('leadCompany').value);
    formData.append('industry', document.getElementById('leadIndustry').value);
    formData.append('phone', document.getElementById('leadPhone').value || 'Not provided');
    formData.append('message', document.getElementById('leadMessage').value || 'No message');
    formData.append('source', 'lead-gen-demo');
    formData.append('_subject', 'New Lead from Lead Gen Demo');
    
    try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            // Show success state
            document.getElementById('leadForm').style.display = 'none';
            document.getElementById('modalSuccess').style.display = 'block';
            
            // Optional: track conversion
            console.log('✅ Lead submitted successfully');
        } else {
            const error = await response.text();
            console.error('Formspree error:', error);
            alert('Something went wrong. Please try again or email us at contact@rodytech.net');
        }
    } catch (error) {
        console.error('Submission error:', error);
        // Show success anyway (don't lose the lead)
        document.getElementById('leadForm').style.display = 'none';
        document.getElementById('modalSuccess').style.display = 'block';
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLeadModal();
    }
});

console.log('🤖 RodyTech Lead Gen Agent Demo v2.0 loaded');
console.log('📝 Formspree integration ready');
