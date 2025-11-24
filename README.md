This is a Take Home Kata for Direct Supply.

These are notes for a recruiter, but anyone may understand them.

One of the main reasons I chose to make the quiz app was that it tested many more skills than option 2: Weather and option 3: Chatbot. I personally thought that if I wanted to program something, I wanted to actually try to put more thinking into the design of the product rather than just the styling, i.e. making a chatbot (gpt wrapper) look nice. 

Therefore, as one of the main directions stated that I should test my problem-solving skills, creativity, and adaptability, I decided to make a quiz app that implemented an automatic quiz generating feature as part of the site.

You might notice that I pushed the .env file to the github repository. This is intentional as there is no API key there. Normally, with an API key I would have GIT ignored the file, but just for Kata purposes, this file is included.

I thought that both ideas listed for the user to create their own quizzes and also add features such as timers, hints, leaderboards, etc were all good, but AI quiz generation just seemed the most interesting to me, so I decided to add that. You might notice that I decided to incorporate a timer and also an instant question checker (whether you were right or wrong on the previous question) as I thought those were both features I would really want to see in a quiz site. The normal quizzes ARE WORKING, but the AI generated quizzes are NOT WORKING because they need an OpenAI API key inserted into the .env file. Theoretically, though, it would 100% work if a trial key was inserted, I just don't have one because I already used it in a different project.

Additionally, one of the main design choices I used was that I mainly coded everything in plain HTML, CSS, and Javascript. I really wanted to make a full MERN-style website, complete with data handling, etc, but I feel like I wouldn't actually have full understanding of everything that I would be doing, needing to rely on outside resources/knowledge I am less comfortable with to complete the project. This way, I would certainly be able to explain why I did something a specific way. The way I currently have it set up accomplishes everything the task asks for and more. A little bit of the website uses the Express framework, which handles HTTPs requests, defines API routes, and sends responses, important for the AI quiz generatoin.

In each file, I have more explanation on the reasoning behind why I have certain logic. These come in the form of scattered comments throughout my code.

If I didn't know something, a lot of the information was taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript.




