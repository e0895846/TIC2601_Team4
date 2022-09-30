# SQL Table
Simplified: Users(login, signup),  Posts (CRUD)
------------------------------------
TASK TO DO:

Session (User Login):
	-Comment
	-Upvote/Downvote

Database:
	-Reputation

Users:
	-Administrator
		-Use user main page (edit/delete) but use a checker for (if userid = userid OR isadmin = true)
		
To fix:
	-Debug Redirect after login (Redirect to previous page)
	-SiteMap
	-

-----------------------

server1.js split
	app.js, index.js, login.js, signup.js user.js 
	
The steps will then look like this:

1. User goes to /login.
2. User submits login data with form POST.
3. Server validates data and establishes login session.
4. Server does res.redirect('/home') (or whatever URL you want here) to tell the browser to go to the new URL.
5. Browser processes the redirect and sends request for that new page.
6. Server sees request for the new page and uses res.render() to render the data for that page.
7. Browser displays rendered page on the new URL.
	
	
-------------------------------


![alt text](https://github.com/e0895846/TIC2601_Team4/blob/main/ReadMe%20Related/Full%20Schema%20Table.jpg?raw=true)
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
