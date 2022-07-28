Hey!
These files are of a backend project for cloning blogapplication called Medium.
Currently under development but has a lot more to do with it's API calls

GET : https://blogappdata.herokuapp.com/api/user (To fetch user data) \
GET : https://blogappdata.herokuapp.com/api/user/(id) (To fetch a particular user) \
GET : https://blogappdata.herokuapp.com/api/blog (To fetch blog data) \
POST : https://blogappdata.herokuapp.com/api/user/signup (To create new user ) \
POST : https://blogappdata.herokuapp.com/api/user/login (To login existing user) \
GET : https://blogappdata.herokuapp.com/api/comment (Read comment made by existing users) \
POST : https://blogappdata.herokuapp.com/api/comment/(blogId) (To make a comment on a blog by a User) 
... \
And Many More stuff request like POST, PUSH, DELETE. \
All the data are secured using Express, Mongoose, JWT and bcrypt libraries.
