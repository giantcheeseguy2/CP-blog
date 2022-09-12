const fs = require('fs');
const read = '../posts-data/';

var tags = new Set();
var cardHTML = '';
var files = fs.readdirSync(read);
files.reverse().forEach(file => {
    let value = JSON.parse(fs.readFileSync(read + file));
    cardHTML += '<div class="card" onclick="window.location.href=\'' + value.dir + '\'"> <h1>' + value.title + '</h1> <div class="tag-container" style="margin:20px;width:80%;min-width:80%;justify-content:left;">';
    for(let i = 0; i < value.tags.length; i++){
        cardHTML += '<div class="tag"><p>' + value.tags[i] + '</p></div>';
        tags.add(value.tags[i]);
    }
    cardHTML += '</div><p>' + value.date + '</p></div>';
});
var addHTML = '';
var removeHTML = '';
tags.forEach(tag => {
    addHTML += '<button class="tagButton" id="' + tag + '0" onclick="toggleTag(\'' + tag + '\')">+ ' + tag + '</button>';
    removeHTML += '<button class="tagButton" id="' + tag + '1" onclick="toggleTag(\'' + tag + '\')"># ' + tag + '</button>';
});
var final = '<html> <head> <link rel="stylesheet" href="./css/navbar.css"> <link rel="stylesheet" href="./css/searchbar.css"> <link rel="stylesheet" href="./css/results.css"> <link rel="stylesheet" href="./css/tags.css"> <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script> <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script> <title>Oursaco Blog | Home</title> </head> <body style="margin:0;" onload="filterDropdown()"> <div class="navbar"> <img src="./images/logo.jpg" class="logo"> <div class="title"><b>Oursaco</b> Blog</div> <button class="current" onclick="window.location.href=\'./index.html\'"><a href="./index.html">Home</a></button> <button class="button" onclick="window.location.href=\'./about.html\'"><a href="./about.html">About</a></button> <button class="button" onclick="window.location.href=\'./links.html\'"><a href="./links.html">Links</a></button> </div> <div style="width:100%;height:15%;"></div> <div class="searchbar"> <h1 class="text">Search For Posts</h1> <input class="bar" type="text" id="searchBar" onkeyup="updateResults()" placeholder="Search.."> </div> <div style="display:flex; justify-content:center; width:100%; min-width:800px;"> <div class="tagbar"> <div class="container"> <button onclick="toggle(\'addDropdown\')" class="addButton">Add Tag</button> <div id="addDropdown" class="bar"> <input type="text" placeholder="Search..." id="addInput" onkeyup="filterDropdown()" class="tagSearch">';
final += addHTML;
final += '</div> </div> <div class="container"> <button onclick="toggle(\'removeDropdown\')" class="removeButton">Remove Tag</button> <div id="removeDropdown" class="bar"> <input type="text" placeholder="Search..." id="removeInput" onkeyup="filterDropdown()" class="tagSearch">'
final += removeHTML;
final += '</div> </div> </div> <div class="results" id="blogs">';
final += cardHTML;
final += '</div> </div> </body> <script> function toggleTag(id){ var id0 = document.getElementById(id + \'0\'); var id1 = document.getElementById(id + \'1\'); if(id0.textContent.charAt(0) == \'#\') id0.textContent = \'+\' + id0.textContent.substring(1); else id0.textContent = \'#\' + id0.textContent.substring(1); if(id1.textContent.charAt(0) == \'#\') id1.textContent = \'-\' + id1.textContent.substring(1); else id1.textContent = \'#\' + id1.textContent.substring(1); filterDropdown(); } function updateResults(){ var filter = document.getElementById("searchBar").value.toLowerCase(); var list = document.getElementById("blogs").getElementsByClassName("card"); var tagList = document.getElementById("removeDropdown").getElementsByTagName("button"); for(let i = 0; i < list.length; i++){ let str = list[i].getElementsByTagName("h1")[0].innerHTML; if(str.toLowerCase().indexOf(filter) == -1) list[i].style.display = "none"; else { let tags = list[i].getElementsByClassName("tag"); var set = new Set(); for(let j = 0; j < tags.length; j++){ set.add(tags[j].getElementsByTagName("p")[0].innerHTML); } list[i].style.display = "block"; for(let j = 0; j < tagList.length; j++){ let str = tagList[j].textContent; if(str.charAt(0) == \'-\' && !set.has(str.substring(2))) list[i].style.display = "none"; } } } } function filterDropdown(){ var list, filter; filter = document.getElementById("addInput").value.toLowerCase(); list = document.getElementById("addDropdown").getElementsByTagName("button"); for(let i = 0; i < list.length; i++){ let str = list[i].textContent; if(str.charAt(0) != \'+\'){ list[i].style.display = "none"; continue; } if (str.toLowerCase().indexOf(filter) != -1) { list[i].style.display = "block"; } else { list[i].style.display = "none"; } } filter = document.getElementById("removeInput").value.toLowerCase(); list = document.getElementById("removeDropdown").getElementsByTagName("button"); for(let i = 0; i < list.length; i++){ let str = list[i].textContent; if(str.charAt(0) != \'-\'){ list[i].style.display = "none"; continue; } if (str.toLowerCase().indexOf(filter) != -1) { list[i].style.display = "block"; } else { list[i].style.display = "none"; } } updateResults(); } function toggle(name){ var x = document.getElementById(name); if(x.style.display == "none") x.style.display = "block"; else x.style.display = "none"; } </script></html>';
fs.writeFile('../index.html', final, err => {
    if(err) throw err;
    console.log("everything has been populated");
});