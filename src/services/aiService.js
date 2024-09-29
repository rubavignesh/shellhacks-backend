const { modelOutput } = require('./claudeRequest');

const aiGenerateBooleanLink = async (jobTitle, postingTime, location, experienceLevel) => {
    const prompt = `You are an AI assistant tasked with generating a LinkedIn boolean search URL based on the provided job details. The user's inputs are:

Job Title: "${jobTitle}"
Job Posting Time: "${postingTime}" (e.g., "Last 24 hours", "Past Week", etc.)
Location: "${location}"
Experience Level: "${experienceLevel}" (e.g., "Entry Level", "Mid-Senior Level", etc.)

Your role is to construct a boolean search query and return the LinkedIn search URL that directly links to relevant job postings.

In your response:
1. Construct the boolean search string based on the job title, posting time, location, and experience level provided.
2. Make sure the search string includes appropriate filters for time (job posting date), location, and experience level.
3. Use the correct LinkedIn URL format: https://www.linkedin.com/jobs/search/?f_E=${experienceLevel}&f_TPR=${postingTime}&geoId=${geoId}&keywords=${jobTitle}&origin=JOB_SEARCH_PAGE_JOB_FILTER
4. The 'geoId' for the location should be obtained dynamically based on the given location.
5. Return the complete LinkedIn search URL as the result.

Now, based on the provided job title, posting time, location, and experience level, generate the LinkedIn boolean search URL.

Job Title: "${jobTitle}"
Posting Time: "${postingTime}"
Location: "${location}"
Experience Level: "${experienceLevel}"
;`

try {
    let linkedInLink = await modelOutput(prompt);
    console.log(linkedInLink);
    return linkedInLink;
} catch (error) {
    console.error('Error generating customized search for LinkedIn:', error);
    throw error;
}

}
// Generate sub-tasks using AI/ML logic
const aiGenerateSubTasks = async (task) => {
    const prompt = `You are an AI assistant tasked with generating sub-tasks based on the main task provided. The user's main task is: ${task}

Your role is to break down this main task into smaller, manageable sub-tasks that are actionable and help the user complete the main task efficiently.

In your response:
1. Identify key steps required to complete the main task.
2. Break each step down into specific sub-tasks that are clear, actionable, and logically ordered.
3. Make sure the sub-tasks are simple enough to be completed independently, but together lead to the completion of the main task.
4. The sub-tasks should not contain more than 5 words.
5. Number of sub-tasks generated should be a maximum of 4.
6. The sub-tasks should have specific tasks based on the problem that is specified. ex. Prepare for DSA should return me with subtasks related to DSA.
7. The prompt response must strictly contain only bullet points in the form of a string array (JSON).

Your sub-tasks should be concise, easy to follow, and should assist the user in making progress on the main task. Avoid over-complicating or adding unnecessary details.

Here’s an example of how the sub-task breakdown should look:

Main Task: "Organize a team meeting to discuss project milestones."

Sub-tasks:
1. Define the purpose and goals of the meeting.
2. Identify key participants and create a list of attendees.
3. Choose a meeting date and time that works for everyone.
4. Book a meeting room or set up a virtual meeting link.
5. Prepare an agenda outlining key discussion points.
6. Send out meeting invitations with the agenda attached.
7. Follow up with participants to ensure they are prepared.

Now, based on the provided main task, please generate the sub-tasks needed to complete it.

Main Task: ${task}`;

    try {
        let subTasks = await modelOutput(prompt);
        subTasks = JSON.parse(subTasks);
        console.log(subTasks);
        return subTasks;
    } catch (error) {
        console.error('Error generating sub-tasks:', error);
        throw error;
    }
};

module.exports = { aiGenerateSubTasks, aiGenerateBooleanLink };