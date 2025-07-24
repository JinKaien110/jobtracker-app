async function logout() {
    try {
        const res = await fetch('/logout');
        const data = await res.json();
        
        if(res.ok) {
            alert(data.message);
            window.location.href = '/views/index.html';
        }
    } catch (err) {
        console.log(`Error logging out: `, err);
    }
}

async function applicationFromFuntion(applicationForm) {
    const formData = new FormData(applicationForm);
    console.log(formData)
    const applicationData = Object.fromEntries(formData.entries());

    const res = await fetch('/apply', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(applicationData)
    });

    const data = await res.json();

    if(data.success) {
        alert(data.message)
        setTimeout(() => {
            window.location.href = '/views/user-dashboard.html';
        }, 3000);
    }
}

async function fetchjobs() {
    const joblist = document.getElementById('job-list')
    const res = await fetch('/jobs')
    const jobs = await res.json();
    joblist.innerHTML = '';
    
    jobs.forEach(job => {
        const div = document.createElement('div');
        div.className = 'job-item';
        div.innerHTML = `
        <strong>${job.title}</strong> at ${job.company}
        <button class='applyBtn' data-id="${job._id}">Apply</button>
        `;
        joblist.appendChild(div);
    })
}


document.addEventListener('DOMContentLoaded', () => {
    fetchjobs();

    const applicationForm = document.getElementById('applicationForm');

    document.addEventListener('click', async (e) => {
        if(e.target.classList.contains('applyBtn')) {
            const jobId = e.target.getAttribute('data-id');
            window.location.href = `/views/components/job-application-form.html?jobId=${jobId}`;      
        }
    });

    applicationForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await applicationFromFuntion(applicationForm);
    });

    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
        await logout();
    });

});