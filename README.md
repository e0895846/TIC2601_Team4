# SQL Table
Simplified: Users(login, signup),  Posts (CRUD)
------------------------------------
TASK TO DO:

Validation done at database level?

Category Page
- Category Page (Can use user.js & user.ejs as base)
- Category Selection in "New Post"
- Include existing category into leftBar and hyperlinks

Vote function (Function links & display has been done, just need implement database logic in crud.js)
Implement "Show/Hide Edit section" with button toggle
Include Delete button for post (Function have been tested, just need to add the button that suit the design)

Fix 'Show User Vote' for search function
Include logic for "New post" function for user dropdown list

-------------------------------
Web UI Layout

Main Page(index.ejs)
![alt text](https://github.com/e0895846/TIC2601_Team4/blob/Develop/ReadMe%20Related/UI%20Layout/Index.png)

Login Page
![alt text](https://github.com/e0895846/TIC2601_Team4/blob/Develop/ReadMe%20Related/UI%20Layout/Login.png)

Post Page (details of the specific post)
![alt text](https://github.com/e0895846/TIC2601_Team4/blob/Develop/ReadMe%20Related/UI%20Layout/Post.png)

-------------------------------------
Site Map:
![alt text](https://github.com/e0895846/TIC2601_Team4/blob/Develop/ReadMe%20Related/Sitemap.png)

Database:
![alt text](https://github.com/e0895846/TIC2601_Team4/blob/Develop/ReadMe%20Related/Full%20Schema%20Table.jpg)
-------------------------------------
Use cases:
1.	MainPage
**-	User login**
**-	Key word search**
**-	Show all post**
-	Category
Example of categories/communities:
a.	Gaming
b.	Sports
c.	TV
d.	Travel
e.	Health & Fitness
f.	Fashion

-	Topic in trending/ Topic by posting date/ topic category. Trending will be determined by number of clicks of the post.


2.	Post:
**-	View, post, comment, delete, edit, share, save, report**
**-	Downvote/upvote comments and contents**

3.	User account
**-	User login/Sign up**
o	Forgot password/change password
o	Security question
o	Demographic info
o	Nickname
o	Email address
**-	Administrator**
o	Delete post
o	Delete user
o	Delete comment
o	Block/Unblock user

-	User info page
o	display name
o	history (post, comment)
o	bookmark list
o	reputation
o	about (joined date)
o	recent view
