 # Quiniela

quiniela app for the 2026 fifa world cup.

* 50 participants aprox 
* rules are as follow: is only going to run for the first round for all the 72 matches in that round (i think thats the amount), every win is 1 point, a tie is 1 point, if you guess the exact score is 4 points
* use a mongo db in docker
* is a frontend with nextjs the backend can be nextjs too if its features are sufficient
* ill deploy in a server and handle ports, domain, DNS on cloudflare etc
* im evaluating that the simple way to set it up is to have just one account for the manager and the manager creates the 50 participants and will before every match collect the participants predictions in a chat group and then the manager will manually add those predictions for each participants, and the result of the match, the app will do the calculation 
* now that I think about it, this can be a frontend only app no need to have a backend and we can hardcode the manager username and password, I have no worry of someone reading the frontend code in the browser and being able to fetch user and password.

your goal is to first give me a plan and proposals for this app before we start implementing so I can review once i agree we start the coding
