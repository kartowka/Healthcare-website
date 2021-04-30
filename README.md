# ProjectManagement

## Overview
The following project simulates the Agile software development methodology, we are continuously building a website where in each sprint we add new features and possibilities :sunglasses:.

### Introduction
#### Sprint Nº 1
In the first sprint we've built a skeleton structure for our website, it has basic features like a nav bar, log-in page (with no database connection as of yet) and other stub buttons like `Services`, `About` etc.

Furthermore, we've built a custom page for `not found` pages i.e., `404` page.

The log-in page has a syntax authentication Email & Password fields.
- Password length has to be longer than 7 characters.


#### Sprint Nº 2
In this sprint, we mainly wrote system requirements & test cases accordingly while covering (hopefully) at least 95% of our to-be-built system. All requirements were uploaded to our project management workplace at [Clubhouse](https://clubhouse.io/) to their respective Epic.

We changed the website stub from Sprint 1 to one that resembles more a health care system.

#### Sprint Nº 3
In this sprint, we were tasked to implement 60% of the system requirements we wrote in the previous sprint, we divided the work among us and managed to achieve around 99% of the logic we were trying to achieve, some requirements were pushed back to the next sprint and one got deleted because of security reasons.

We chose to use [MongoDB](https://www.mongodb.com/) as our project database and we implemented our system around it.

As for communication, we started using [Slack](https://slack.com/) for cross-notification convenience, we integrated Github, CircleCI & Clubhouse notifications to it which resulted in a really smooth and simple system where especially in things related to development because now we know who pushed what commits and because of it we minimized merge conflicts & requests.
 
### Requirements
Have `npm` & `node.js` installed.

Our dependencies list:
```
  "dependencies": {
    "accesscontrol": "^2.2.1",
    "accessibility": "^3.0.13",
    "alert": "^5.0.10",
    "bcrypt": "^5.0.1",
    "body-parser": "^1.19.0",
    "cookie-parser": "^1.4.5",
    "dotenv": "^8.2.0",
    "ejs": "^3.1.6",
    "express": "^4.17.1",
    "jsonwebtoken": "^8.5.1",
    "mongodb": "^3.6.6",
    "mongoose": "^5.12.7",
    "node-gyp": "^8.0.0",
    "node-pre-gyp": "^0.17.0",
    "nodemailer": "^6.5.0"
  }
```
## Installation
1. Clone our repository by using:
    * HTTP - `git clone https://github.com/kartowka/ProjectManagement.git` or with
    * SSH - `git clone git@github.com:kartowka/ProjectManagement.git`
<br/>

2. Run `npm install` in the root directory of the project.
<br/>

3. Run `npm run dev`.
<br/>

4. `Ctrl + left click` the given local address for our website.

Optionally, you can run our `heroku` [deployed](https://projectmanagmentsce.herokuapp.com/) version of the project.
## Built With
### Integration
- [CircleCI](https://circleci.com/)
### Deployment
- [Heroku](https://www.heroku.com/)
### DataBase
- [MongoDB](https://www.mongodb.com/)
### Development Environment
- [VS Code](https://code.visualstudio.com/)

## Communications & Management
### Communication
- [Slack](https://slack.com/)
### Project Management
- [Clubhouse](https://clubhouse.io/)
## Known Bugs
No known bugs at this time.
## Authors
___Yehudit Mandelboim___

___Sitara Alayev___

___Sharon Yaroshetsky___

___Anthony Eitan Fleysher___
