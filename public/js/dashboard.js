async function fetchjobs() {
    const joblist = document.getElementById('job-list'); 
    try {
        const res = await fetch('/jobs');
        const jobs = await res.json();
        joblist.innerHTML = '';

        jobs.forEach(job => {
            const div = document.createElement('div');
            div.className = 'job-item';
            div.innerHTML = `
            <strong>${job.title}</strong> at ${job.company}
            <button class="editBtn" data-id="${job._id}">Edit</button>
            <button class="deleteBtn" data-id="${job._id}">Delete</button>
            `;
            joblist.appendChild(div);
        });
    } catch (err) {
        console.log('Error loading jobs: ', err);
    }
}

async function openModalEdit(jobId) {
    try {
        const res = await fetch(`/jobs/${jobId}`);
        const job = await res.json();

        document.getElementById('editJobId').value = job._id;
        document.querySelector('#jobFormEdit [name="title"]').value = job.title;
        document.querySelector('#jobFormEdit [name="company"').value = job.company;

        document.getElementById('jobModalEdit').classList.remove('hidden');
    } catch (err) {
        console.error('Error loading job for edit:', err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchjobs();

    const modal = document.getElementById('jobModal');
    const openBtn = document.getElementById('addJob');
    const closeBtn = document.getElementById('closeModal');
    const jobForm = document.getElementById('jobForm');
    const message = document.getElementById('message');
    const modalEdit = document.getElementById('jobModalEdit');
    const jobFormEdit = document.getElementById('jobFormEdit');

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

    document.addEventListener('click', async (e) => {
        if(e.target.classList.contains('editBtn')) {
            const jobId = e.target.getAttribute('data-id');
            await openModalEdit(jobId);
        }
    });

    jobFormEdit?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(jobFormEdit);
        const updatedjob = Object.fromEntries(formData.entries());

        const res = await fetch(`/job/${updatedjob.jobId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedjob)
        });

        const data = await res.json();
        alert(data.message);

        if(data.success) {
            modalEdit.classList.add('hidden');
            jobFormEdit.reset();
            fetchjobs();
        }
    });
});
