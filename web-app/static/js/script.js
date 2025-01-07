window.onload = function() {
    fetch('/get-items')
        .then(response => response.json())
        .then(data => {
            populateTable(data);
        })
        .catch(error => {
            console.log("error loading page", error);
            alert("error loading page");
        });
    
    const dropdown = document.getElementById("sorts");
    dropdown.addEventListener('change', function(event) {
        const selected = event.target.value;
        handleFilter(selected);
    });
};


function populateTable(data) {
    
    const tableBody = document.querySelector("#tasks tbody");
    tableBody.innerHTML = '';

    data.forEach(task => {
        const row = document.createElement('tr');

        // Create DOM for title in table
        const title = document.createElement('td');
        title.textContent = task.title;
        row.appendChild(title);

        // Create DOM for deadline in table
        const deadline = document.createElement('td');
        const deadlineData = task.deadline;
        const deadlineParts = deadlineData.split("T");
        deadline.textContent = deadlineParts[0];
        row.appendChild(deadline);

        // Create DOM for dropdown selection of Done/Undone in table
        const status = document.createElement('td');
        const select = document.createElement('select');
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');
        if (task.status == "Done") {
            option1.value = "Done";
            option1.text = "Done";
            option2.value = "Undone";
            option2.text = "Undone";
        } else {
            option1.value = "Undone";
            option1.text = "Undone";
            option2.value = "Done";
            option2.text = "Done";
        }
        select.appendChild(option1);
        select.appendChild(option2);
        status.appendChild(select);
        row.appendChild(status);

        const deleteTask = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";
        deleteTask.append(deleteButton);
        row.appendChild(deleteTask);

        tableBody.appendChild(row);

        select.addEventListener('change', function(event) {
            const selected = event.target.value;
            handleStatusEdit(task, selected);
        })
        deleteButton.addEventListener('click', function(event) {
            handleDelete(task, event);
        })
    });
}


// modify the status of a task based on selected status by user
// without reloading page
function handleStatusEdit(task, selected) {
    const taskId = task.taskID;
    const status = selected;
    const fetchpath = '/edit-status/' + taskId + '-' + status;
    console.log(fetchpath);
    fetch(fetchpath, {
        method: 'POST'
    })
        .catch(error => {
            console.log("error loading page", error);
            alert("error loading page");
        });
}

async function handleDelete(task, event) {
    const taskId = task.taskID;
    try {
        const fetchPath = '/delete-task/' + taskId;
        const response = await fetch(fetchPath, {
            method: 'DELETE'
        });
        if (response.ok) {
            console.log('Task deleted');
            window.location=window.location;
        }
    } catch (error) {
        console.error('Error deleting contact:', error);
    }
}

function handleFilter(selected) {
    // If "None" selected, get all items and
    // populate the table with them
    if (selected == "none") {
        fetch('/get-items')
        .then(response => response.json())
        .then(data => {
            populateTable(data);
        })
        .catch(error => {
            console.log("error loading page", error);
            alert("error loading page");
        });
    } else if (selected == "overdue") {
        // If "overdue" selected, call proper fetch
        // and populate with the response from the server
        fetch('/get-overdue')
        .then(response => response.json())
        .then(data => {
            populateTable(data);
        })
        .catch(error => {
            console.log("error loading page", error);
            alert("error loading page");
        });
    } else if (selected == "deadline") {
        // If "deadline" selected, call proper fetch
        // and populate with the response from the server
        fetch('/get-deadline')
        .then(response => response.json())
        .then(data => {
            populateTable(data);
        })
        .catch(error => {
            console.log("error loading page", error);
            alert("error loading page");
        });
    } else if (selected == "done") {
        // If "done" selected, call proper fetch
        // and populate with the response from the server
        fetch('/get-done')
        .then(response => response.json())
        .then(data => {
            populateTable(data);
        })
        .catch(error => {
            console.log("error loading page", error);
            alert("error loading page");
        });
    } else if (selected == "undone") {
        // If "undone" selected, call proper fetch
        // and populate with the response from the server
        fetch('/get-undone')
        .then(response => response.json())
        .then(data => {
            populateTable(data);
        })
        .catch(error => {
            console.log("error loading page", error);
            alert("error loading page");
        });
    }
}