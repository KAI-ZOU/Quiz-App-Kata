let questions = [];
let index = 0;
let score = 0;
let showDuring = false;
let timerEnabled = false;
let timer;
let timeLeft = 15;
// initializing and declaring future variables I wanted to see incorporated into the project

/* Majority of quiz logic is handled here */
async function startQuiz() {

    // Just reading quiz settings from the HTML inpts
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const difficulty = document.getElementById("difficulty").value;
    const type = document.getElementById("type").value;
    // converting to true/false based on yes/no
    showDuring = document.getElementById("showDuring").value === "yes";
    timerEnabled = document.getElementById("timerOption").value === "yes";

    /* The api url changed based only on a couple factors so I just had
    the user change the URL to customize to what they wanted */
    let url = `https://opentdb.com/api.php?amount=${amount}&category=${category}`;
    if (difficulty) url += `&difficulty=${difficulty}`;
    if (type) url += `&type=${type}`;

    const res = await fetch(url);
    const data = await res.json();

    // store data pulled into questions 
    questions = data.results;

    loadQuizUI();
}

function loadQuizUI() {
    // Hiding settings
    document.getElementById("settings").classList.add("hidden");
    document.getElementById("quiz").classList.remove("hidden");

    index = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    // given an index, we retrieve a question from the question array from earlier
    const q = questions[index];

    // we display question text in the question div
    document.getElementById("question").innerHTML = q.question;

    //selecting answers container, clearing previous answer buttons
    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";

    // building an array of correct and incorrect answers, shuffling
    let answers = [q.correct_answer, ...q.incorrect_answers]
        .sort(() => Math.random() - 0.5);

        // for each answer, create a button
    answers.forEach(a => {
        const btn = document.createElement("button");
        btn.innerHTML = a;
        btn.onclick = () => handleAnswer(a);
        answersDiv.appendChild(btn);
    });
    //Shows or hides live score

    if (showDuring) {
        document.getElementById("liveScore").classList.remove("hidden");
        document.getElementById("liveScore").innerText = `Score: ${score}`;
    } else {
        document.getElementById("liveScore").classList.add("hidden");
    }
    //Handles timer logic if it is enabled
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
    //stop the timer if answer is chosen
    clearInterval(timer);

    if (choice === questions[index].correct_answer) score++;
    // Move onto the next question
    index++;

    //show results if no more questions are left
    if (index < questions.length)
        showQuestion();
    else
        showResults();
}

function showResults() {
    // Hide quiz and show results
    document.getElementById("quiz").classList.add("hidden");
    document.getElementById("results").classList.remove("hidden");

    document.getElementById("scoreText").innerText =
        `You scored ${score} out of ${questions.length}`;
}

/* This part handles AI quiz stuff */

async function generateAIQuiz() {
    const prompt = document.getElementById("aiPrompt").value.trim();
    if (!prompt) {
        document.getElementById("aiStatus").innerText = "Enter a prompt!";
        return;
    }
// Currently, quiz is stuck on generating quiz... because no API key
    document.getElementById("aiStatus").innerText = "Generating quiz...";

// Ideally, this would be changed to a domain name, currently calls backend API route

    const res = await fetch("http://localhost:3000/api/generate-quiz", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt })
});

const data = await res.json();

// Error handling
try {
    questions = JSON.parse(data.content);
    document.getElementById("aiStatus").innerText = "Quiz generated! Starting...";
    setTimeout(loadQuizUI, 700);
} catch {
    document.getElementById("aiStatus").innerText = "Error: AI did not return valid JSON.";
}
}