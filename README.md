The npm dependencies needed to run this project can be obtained by running the following command in
the terminal in the web-app directory:
npm install express mysql2 bcrypt express-session pug


To start the server, run the command node server.js in the directory in which server.js is located in.
Once the server is running, type localhost:3000/login.html in the search-bar to access te login page.
Feel free to create an account by clicking "Create Account" in the navbar, otherwise to test the
login capabilities, a user is already in the database with username: grader, and password: myfavoritepassword

Once logged in, you will be redirected to a page with all of the tasks listed in a table. The tasks within the
table can be filtered using the drop-down selector to filter tasks. The default is "None" which means that it
will just list all tasks. The "Overdue" option filters by tasks that are past their due date and are "Undone",
meaning not completed. The "Deadline" option shows all tasks in order of deadline where the tasks with the earliest
deadlines are listed at the top and tasks with the latest deadlines are listed at the bottom. The "Done" option shows
all tasks that have status of "Done". The "Undone" option shows all tasks that have status of "Undone".

If you log in with the "grader" account listed earlier, there will be a few tasks populating the table upon logging
in, but if you make your own account this table will be empty until you add to-do items to your account by clicking
"Add Item" in the navbar.

When adding a task, you will be required to enter a text title for your to-do item and select a date for its deadline.
New tasks are presumed to be "Undone" since it doesn't really make sense to create a to-do item for something that is
already complete. Upon submitting a task, you will be redirected back to the to-do-items.html page where the new task will be present
in the table.

There are a few actions that can be taken to modify to-do items while viewing the to-do table. Within the status column,
there is a selector for what the status of each to-do item is. Upon loading, these selectors are all set to the status
of their respective tasks. To modify the status of a task, you can just click and change the selector to the desired status.
The status changes are handled asynchronously, so the database modifies the status of the desired task without reloading
the page. To delete a to-do item, click the red "Delete" button to the right of the item. Deleting a to-do item will
cause the page to reload and will update the database to remove the to-do item.

The above actions can also be taken while viewing a filtered version of the task table (e.g. Filter tasks by: "Overdue"
has been selected). Modifying the status of a task while viewing in filtered mode will not remove it from the filtered
viewing until the viewing mode it brought up again. For example, when changing an "Undone" task to "Done" while
viewing the tasks filtered by "Undone", you will still see the task. The task will be gone from the "Undone" filter
upon changing the filter and changing it back to "Undone". Deleting a task while viewing in filtered mode will cause the
page to reload, meaning you wont continue viewing the table in the filtered mode.
