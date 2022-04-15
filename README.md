# Link Shortener

A basic link shortener made using NodeJS and MySQL

## Stack

**Frontend** - VanillaJS
**Backend** - NodeJS
**Database** - MySQL

## Setup

Before using this project, you'll need to create a database called `urlshortener`.
After that, you need to create 2 tables with the following Schema - 

#### User Table
1. username -> `VARCHAR(n)`(Primary Key) n could be any integer
2. password -> `VARCHAR(n)`

#### Links Table
1. id -> `VARCHAR(16)`(Primary Key) though currently the generated ID has only 8 characters
2. link -> `VARCHAR(50)` the URLs could be larger than this, but its fine
3. owner -> `VARCHAR(n)` same as the length of the username
4. visits -> `INT` Default value = 0

Next, create a file named `.env` inside the `backend` folder and put your MySQL password there - 
```
MYSQL_PASSWORD=<YOUR-PASSWORD>
```
And you're ready to go!
Run `npm start` to start the server, and use a web server to serve the files inside the `frontend` directory.