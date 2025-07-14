async function fetchjobs() {
    const joblist = document.getElementById('job-list'); 
    try {
        const res = await fetch('/jobs');
        const jobs = await res.json();
        joblist.innerHTML = '';

        jobs.forEach(job => {
            const div = document.createElement('div');
            div.className = 'job-item';
            div.textContent = `${job.title} at ${job.company}`;
            joblist.appendChild(div);
        });
    } catch (err) {
        console.log('Error loading jobs: ', err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchjobs();

    const modal = document.getElementById('jobModal');
    const openBtn = document.getElementById('addJob');
    const closeBtn = document.getElementById('closeModal');
    const jobForm = document.getElementById('jobForm');
    const message = document.getElementById('message');

    openBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if(e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    jobForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(jobForm);
        const newJob = Object.fromEntries(formData.entries());

        const res = await fetch('/add-job', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newJob)
        });
        const data = await res.json();
        message.textContent = data.message;
        if (data.success) {
            modal.classList.add('hidden');
            jobForm.reset();
            fetchjobs();
        }
    });
});

