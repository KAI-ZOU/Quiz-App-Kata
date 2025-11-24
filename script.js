let questions = [];
let index = 0;
let score = 0;
let showDuring = false;
let timerEnabled = false;
let timer;
let timeLeft = 15;

/* ---------------- SAVE & LOAD SETTINGS ---------------- */

function loadPreferences() {
    const prefs = JSON.parse(localStorage.getItem("quizPrefs") || "{}");

    const fields = ["amount", "category", "difficulty", "type", "showDuring", "timerOption"];

    fields.forEach(id => {
        if (prefs[id] !== undefined) {
            document.getElementById(id).value = prefs[id];
        }
    });
}

function savePreferences() {
    const prefs = {
        amount: document.getElementById("amount").value,
        category: document.getElementById("category").value,
        difficulty: document.getElementById("difficulty").value,
        type: document.getElementById("type").value,
        showDuring: document.getElementById("showDuring").value,
        timerOption: document.getElementById("timerOption").value
    };

    localStorage.setItem("quizPrefs", JSON.stringify(prefs));
}

window.onload = loadPreferences;

/* ---------------- MAIN QUIZ LOGIC ---------------- */

async function startQuiz() {
    savePreferences();

    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const difficulty = document.getElementById("difficulty").value;
    const type = document.getElementById("type").value;

    showDuring = document.getElementById("showDuring").value === "yes";
    timerEnabled = document.getElementById("timerOption").value === "yes";

    let url = `https://opentdb.com/api.php?amount=${amount}&category=${category}`;
    if (difficulty) url += `&difficulty=${difficulty}`;
    if (type) url += `&type=${type}`;

    const res = await fetch(url);
    const data = await res.json();
    questions = data.results;

    loadQuizUI();
}

function loadQuizUI() {
    document.getElementById("settings").classList.add("hidden");
    document.getElementById("quiz").classList.remove("hidden");

    index = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    const q = questions[index];

    document.getElementById("question").innerHTML = q.question;

    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";

    let answers = [q.correct_answer, ...q.incorrect_answers]
        .sort(() => Math.random() - 0.5);

    answers.forEach(a => {
        const btn = document.createElement("button");
        btn.innerHTML = a;
        btn.onclick = () => handleAnswer(a);
        answersDiv.appendChild(btn);
    });

    if (showDuring) {
        document.getElementById("liveScore").classList.remove("hidden");
        document.getElementById("liveScore").innerText = `Score: ${score}`;
    } else {
        document.getElementById("liveScore").classList.add("hidden");
    }

    if (timerEnabled) {
        timeLeft = 15;
        document.getElementById("timer").classList.remove("hidden");
        document.getElementById("timeLeft").innerText = timeLeft;

        clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            document.getElementById("timeLeft").innerText = timeLeft;

            if (timeLeft <= 0) handleAnswer("TIMEOUT");
        }, 1000);
    } else {
        document.getElementById("timer").classList.add("hidden");
    }
}

function handleAnswer(choice) {
    clearInterval(timer);

    if (choice === questions[index].correct_answer) score++;

    index++;
    if (index < questions.length)
        showQuestion();
    else
        showResults();
}

function showResults() {
    document.getElementById("quiz").classList.add("hidden");
    document.getElementById("results").classList.remove("hidden");

    document.getElementById("scoreText").innerText =
        `You scored ${score} out of ${questions.length}`;
}

/* ---------------- AI QUIZ GENERATION ---------------- */

async function generateAIQuiz() {
    const prompt = document.getElementById("aiPrompt").value.trim();
    if (!prompt) {
        document.getElementById("aiStatus").innerText = "Enter a prompt!";
        return;
    }

    document.getElementById("aiStatus").innerText = "Generating quiz...";

    const res = await fetch("http://localhost:3000/api/generate-quiz", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt })
});

const data = await res.json();

try {
    questions = JSON.parse(data.content);
    document.getElementById("aiStatus").innerText = "Quiz generated! Starting...";
    setTimeout(loadQuizUI, 700);
} catch {
    document.getElementById("aiStatus").innerText = "Error: AI did not return valid JSON.";
}
}