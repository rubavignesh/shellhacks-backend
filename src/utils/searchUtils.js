// Perform Boolean search on resumes (simulation logic)
exports.performBooleanSearch = (query) => {
    const jobs = [
        { jobTitle: 'Software Engineer', companyName: 'Company ABC' },
        { jobTitle: 'Data Scientist', companyName: 'Company XYZ' }
    ];

    return jobs.filter(job => job.jobTitle.toLowerCase().includes(query.toLowerCase()));
};
