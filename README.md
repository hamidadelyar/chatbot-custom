
## A custom chatbot attempt using ReactJS

### How to run

- In order to run this React.js app, you will need to first install node. You can do this through the following link: https://nodejs.org/en/download/
- Once node is installed, in the terminal (if on mac) or through powershell/cmd navigate inside of the folder 'chatbot-cusom' and run the command 'npm start'

### Capabilities of the Chatbot
The implemented chatbot has 3 distinct capabilities:
- Retrieving the rating for a given movie
- Retrieving the genre for a given movie
- Retrieving similar movies for a given movie

### Interacting with the Bot

When interacting with the bot, the user must construct their sentences in a certain way. The request type keyword (i.e. rating, genre, similar) must be on the left side of the sentence, while the movie name must be on the right side of the sentence. The sentence is split into different sides using a ‘:’ as a delimiter.

Examples:
- What rating is this movie: Jack Reacher?
- What rating is this: Jack Reacher
- What is similar to: Tangled?
- What is a movie like: Tangled?
- What genre is: The girl on the train?
- What genre is the movie: The girl on the train

As long as a valid keyword is on the left hand side and a movie name is on the right hand side, the bot will attempt to retrieve requested information for the movie.

