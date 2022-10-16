# SQL Table
Simplified: Users(login, signup),  Posts (CRUD)
------------------------------------
TASK TO DO:

* important
() ignore for now

SQL: 
1. user>reputation trigger from vote >> kelvin
2. comment> comment_id use trigger to check before insert >> kelvin
3. (trending based on post>created_at && vote_post>updated_at)

Home page:
1. Vote button before login >> redirect to login page --------------- kelvin
2. Display category info, by default "New" ---------------------------------Yi tat
3. leftbar functions ----------------------------------------- xincheng
4. search functon -------------------------------------------------------- Yi tat
5. User icon drop-down list functions ----------------------------------- kelvin
6. show new post textarea after clicking "new post"--------------------------- yi tat
7. *vote function ------------------------------------------------- 
8. show comments count---------------------------------------- pengcheng
9. (trending rightbar)

Category Page:
1. calculate reputation of category in category info page---------------- Yi tat


Login page:
1. signup add email ----------------------------------------------- pengcheng
2. when signup fail show error message --------------------------- pengcheng
3. (forgot password)--------------------------------------------------- kelvin

User page:
1. partial navbar (new post) -------------------------------------------- YI tat
2. rightbar show userInfo, reputation, joindate, email-------------------- Zijing
3. (admin) delete/block user----------------------------------------------- zijiing

Post page:
1. hide "edit post" area--------------------------------------------------- xincheng
2. create "edit", "delete" button-------------------------------------- xincheng

Admin page:
1. *****show statistic/report-------------------------------------------------- xincheng
2. (update category name of post)

    
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
