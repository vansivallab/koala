ReadMe
Koala by Vansi(vvallabh), Alex (aguo), and Antara (antaras)
A collaborative drawing tool

-It should be realtime

There are some bugs right now and the UI is not completely hooked up,
but to test it, run 
window.socket.e.login("foopanda", "asdf");
and then window.socket.e.selectCanvas("x71wc2");
or you can create a new canvas with window.socket.e.createCanvas();

List of required elems:
1. Javascript
2. Canvas
3. CSS (custom sliders)
4. HTML (form validation on login)
5. DOM manipulation (pages plugin)
6. jQuery
7. Custom pages.js UI widget
8. PhoneGap
9. node.js
10. server-side database- mongodb
11. websockets

Features:
1. realtime concurrent drawing
2. multiple users
3. multiple canvases
4. invite system
5. paint tool- shapes & opacity
6. pan and zoom tools
7. sharing
8. custom pages plugin

User Testing (in hackathon) Feedback:
Features Wanted
1. rather than the circle be a center and then a radius, perhaps a top left and 
	bottom right corner so users can make ovals
2. clearCanvas option (but really we would rather users delete canvases or make a new one)
3. take pictures
4. import pictures
5. sharing (facebook, etc)

I dont think 1 would provide a high value for the work put in, but 3 and 4 would 
and 4 would probably be way easier to implement with PhoneGap, but I think this 
should be very low on the list. We should do sharing even if it just gives you a 
link with the picture.

Bugs
1. mobile puts rounds on the inside of pencil
2. not merging to canvas (Alex fixed this)
3. "touch battle" between toolbar and canvas
4. sliders didnt work on all phones (should be fixed with Antara's 
custom sliders)
5. Toolbar was a little slow to show on mobile, so people kept on touching the 
button and it would stay open (idk if this is still happening) - Antara



Sorry for the lack of comments, if at all possible can this be graded on Friday next week?