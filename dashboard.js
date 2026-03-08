let selected = "all"

const navButtons = document.getElementById("nav-btns");
const issuesCounter = document.getElementById("issues-counter");

navButtons.addEventListener('click', (e) => {
    const button = e.target.closest("button")
    if (!button) return;

    const buttons = navButtons.children;
    for (const button of buttons) {
        button.classList.remove("btn-primary");
    }

    selected = button.value
    console.log(selected);
    button.classList.add("btn-primary");

    getIssues();
})

const getIssues = () => {
    fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
        .then(res => res.json())
        .then(data => {
            displayIssues(data.data);
        })
}

const displayIssues = (issues) => {
    const issuesContainer = document.getElementById("issues-container");
    issuesContainer.innerHTML = '';

    for (const issue of issues) {
        if (selected == "open" && issue.status == "open") {
            issuesCounter.innerHTML = issues.filter(issue => issue.status == "open").length;
            issuesContainer.appendChild(createIssueCard(issue));
        } else if (selected == "closed" && issue.status == "closed") {
            issuesCounter.innerHTML = issues.filter(issue => issue.status == "closed").length;
            issuesContainer.appendChild(createIssueCard(issue));
        } else if (selected == "all") {
            issuesCounter.innerHTML = issues.length;
            issuesContainer.appendChild(createIssueCard(issue));
        }
    }
}

const createIssueCard = (issue) => {
    const issueCard = document.createElement('div');

    const cardBorder = issue.status === "open" ? "border-[#00A96E]" : "border-[#A855F7]";

    const date = new Date(issue.createdAt);
    const formattedDate = date.toLocaleDateString("en-US");

    issueCard.innerHTML = `
        <div onclick="getDetails(${issue.id})" class="card bg-base-100 h-full shadow-sm border-t-4 ${cardBorder}">
            <div class="px-4 pt-4 space-y-4 h-full flex flex-col">
                <div class="flex items-center justify-between mb-4">
                    ${issue.status === "open" 
                        ? `<img src="./assets/open-status.png" alt="open status">` 
                        : `<img src="./assets/closed-status.png" alt="closed status">`
                    }
                    
                    <div class="badge ${priorityColor(issue.priority)} uppercase rounded-full">${issue.priority}</div>
                </div>
                <h2 class="card-title line-clamp-2">${issue.title}</h2>
                <p class="text-[#64748B] line-clamp-2">${issue.description}</p>
                <div class="flex gap-1 flex-wrap mt-auto">
                    ${issue.labels.map(label => createLabel(label)).join('')}
                </div>
            </div>
            <div class="divider"></div>
            <div class="px-4 pb-4 space-y-2">
                ${issue.author 
                    ? `<p class="text-[#64748B]"># by ${issue.author}</p>` 
                    : `<p class="text-[#64748B]"># -</p>`
                } 
                <p class="text-[#64748B]">${formattedDate}</p>
            </div>
        </div>
    `;
    return issueCard
}

const createLabel = (label) => {
    if (label === "bug") {
        return`<div class="badge uppercase rounded-full py-4 border bg-[#FEECEC] text-[#EF4444] border-[#FECACA]">
            <img src="./assets/bug-droid.png" alt="bug droid" class="w-4 h-4">
            <span>${label}</span>
        </div>`;
    } else if (label === "help wanted") {
        return `<div class="badge uppercase rounded-full py-4 border bg-[#FFF8DB] text-[#D97706] border-[#FDE68A]">
            <img src="./assets/lifebuoy.png" alt="lifebuoy" class="w-4 h-4">
            <span>${label}</span>
        </div>`;
    } else {
        return `<div class="badge uppercase rounded-full py-4 border bg-[#DEFCE8] text-[#00A96E] border-[#BBF7D0]">
            <img src="./assets/sparkle.png" alt="sparkle" class="w-4 h-4">
            <span>${label}</span>
        </div>`;
    }
}

const getDetails = (id) => {
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
        .then(res => res.json())
        .then(data => {
            showDetails(data.data);
        })
}

const showDetails = (issue) => {
    const detailsModal = document.getElementById("details_modal");
    const date = new Date(issue.createdAt);
    const formattedDate = date.toLocaleDateString("en-US");

    detailsModal.innerHTML = `
        <div class="modal-box space-y-6">
            <div>
                <h3 class="text-lg font-bold">${issue.title}</h3>
                <div>
                    <span class="badge ${issue.status === "open" ? "bg-[#00A96E]" : "bg-[#A855F7]"} text-white uppercase rounded-full">${issue.status}</span>
                    <span class="text-[#64748B]">• Opened by ${issue.author} • ${formattedDate}</span>
                </div>
            </div>
            <div class="flex gap-1 flex-wrap mt-auto">
                ${ issue.labels.map(label => createLabel(label)).join('')}
            </div>
            <p class="text-[#64748B]">The navigation menu doesn't collapse properly on mobile devices...</p>
            <div class="flex p-4 bg-[#F8FAFC] rounded">
                <div class="flex-1">
                    <p class="text-[#64748B]">Asignee:</p>
                    <p class="font-semibold">${issue.assignee ? issue.assignee : "Not assignee"}</p>
                </div>
                <div class="flex-1">
                    <p class="text-[#64748B]">Priority:</p>
                    <div class="badge ${priorityColor(issue.priority)} uppercase rounded-full">${issue.priority}</div>
                </div>
            </div>
            <div class="modal-action">
                <form method="dialog">
                    <!-- if there is a button in form, it will close the modal -->
                    <button class="btn btn-primary">Close</button>
                </form>
            </div>
        </div>
    `;
    detailsModal.showModal();
}

const priorityColor = (priority) => {

    let priorityColor = "";

    if (priority === "high") {
        priorityColor = "bg-[#FEECEC] text-[#EF4444]";
    } else if (priority === "medium") {
        priorityColor = "bg-[#FFF6D1] text-[#F59E0B]";
    } else {
        priorityColor = "bg-[#EEEFF2] text-[#9CA3AF]";
    }

    return priorityColor
}

getIssues();