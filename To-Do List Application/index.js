import express from "express";
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const toDoTaskList = [];
const workTaskList = [];

app.get("/", (req, res) => {
    res.render("index.ejs", { tasks: toDoTaskList, date: getCurrentFateFormatted() });
});

app.get("/work", (req, res) => {
    res.render("work.ejs", { tasks: workTaskList });
});

app.post("/addToDoTask", (req, res) => {
    toDoTaskList.push(req.body["newTask"]);
    res.redirect("/");
});

app.post("/addWorkTask", (req, res) => {
    workTaskList.push(req.body["newTask"]);
    res.redirect("/work");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

function getCurrentFateFormatted() {
    const date = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
}