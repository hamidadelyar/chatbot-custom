
## A custom chatbot attempt using ReactJS

### Capabilities of the Chatbot
The implemented chatbot has 3 distinct capabilities:
•	Retrieving the rating for a given movie
•	Retrieving the genre for a given movie
•	Retrieving similar movies for a given movie


### Interacting with the Bot

When interacting with the bot, the user must construct their sentences in a certain way. The request type keyword (i.e. rating, genre, similar) must be on the left side of the sentence, while the movie name must be on the right side of the sentence. The sentence is split into different sides using a ‘:’ as a delimiter.

Examples:
•	What rating is this movie: Jack Reacher?
•	What rating is this: Jack Reacher
•	What is similar to: Tangled?
•	What is a movie like: Tangled?
•	What genre is: The girl on the train?
•	What genre is the movie: The girl on the train

As long as a valid keyword is on the left hand side and a movie name is on the right hand side, the bot will attempt to retrieve requested information for the movie.
