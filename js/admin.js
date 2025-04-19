const SUPABASE_URL = 'https://hdqpffnjnlnswcghykxa.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkcXBmZm5qbmxuc3djZ2h5a3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MDQ5MDMsImV4cCI6MjA2MDM4MDkwM30.W-P0gcbydi_vQ6iOcCyGOcKDo3S7_858l0edP_rcLXU'

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Remove duplicate initialization
// const SUPABASE_URL = '...'
// const SUPABASE_ANON_KEY = '...'
// const supabase = supabase.createClient(...)

// Use supabaseClient everywhere instead of supabase
async function showContacts() {
    const { data, error } = await supabaseClient
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error:', error)
        return
    }

    const table = document.getElementById('contacts-table')
    table.innerHTML = `
        <h2>Contact Submissions</h2>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Message</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(row => `
                    <tr>
                        <td>${row.full_name}</td>
                        <td>${row.email}</td>
                        <td>${row.phone}</td>
                        <td>${row.message}</td>
                        <td>${new Date(row.created_at).toLocaleDateString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `
}

async function showApplications() {
    const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error:', error)
        return
    }

    const table = document.getElementById('applications-table')
    table.innerHTML = `
        <h2>Job Applications</h2>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Position</th>
                    <th>CV</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(row => `
                    <tr>
                        <td>${row.full_name}</td>
                        <td>${row.email}</td>
                        <td>${row.position}</td>
                        <td><a href="${row.cv_url}" target="_blank">Download CV</a></td>
                        <td>${new Date(row.created_at).toLocaleDateString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `
}

// Load contacts by default
showContacts()

// Check authentication status on load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    console.log('Admin page loaded');
});

async function checkAuth() {
    try {
        const { data: { user }, error } = await supabaseClient.auth.getUser();
        console.log('Auth check:', user);
        
        if (user) {
            showAdminPanel();
            loadData('contacts');
        } else {
            document.getElementById('login-form').style.display = 'block';
            document.getElementById('admin-content').style.display = 'none';
        }
    } catch (error) {
        console.error('Auth check error:', error);
    }
}

async function handleLogin() {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        showAdminPanel();
        loadData('contacts');
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
    }
}

async function handleLogout() {
    try {
        await supabaseClient.auth.signOut();
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('admin-content').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'none';
    } catch (error) {
        console.error('Logout error:', error);
    }
}

function showAdminPanel() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'block';
    document.getElementById('admin-content').style.display = 'block';
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`${tabName}-tab`).style.display = 'block';
    event.target.classList.add('active');
    
    loadData(tabName);
}

async function loadData(type) {
    const container = document.getElementById(`${type}-list`);
    container.innerHTML = 'Loading...';

    try {
        const { data, error } = await supabaseClient
            .from(type === 'contacts' ? 'contact_submissions' : 'job_applications')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (data.length === 0) {
            container.innerHTML = 'No submissions yet.';
            return;
        }

        const tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        ${type === 'contacts' ? 
                            '<th>Message</th>' : 
                            '<th>Position</th><th>CV</th>'}
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(item => `
                        <tr>
                            <td>${item.full_name}</td>
                            <td>${item.email}</td>
                            <td>${item.phone}</td>
                            ${type === 'contacts' ?
                                `<td>${item.message}</td>` :
                                `<td>${item.position}</td>
                                 <td><a href="${item.cv_url}" target="_blank">View CV</a></td>`
                            }
                            <td>${new Date(item.created_at).toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = tableHTML;

    } catch (error) {
        console.error('Data loading error:', error);
        container.innerHTML = 'Error loading data: ' + error.message;
    }
}

// Remove these functions completely:
// - showForgotPassword()
// - showLoginForm()
// - showEmailStep()
// - sendVerificationCode()
// - verifyCodeAndResetPassword()

// Remove the forgot password button click handler from HTML
