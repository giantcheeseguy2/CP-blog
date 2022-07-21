const commonmark = require('commonmark');
const fs = require('fs');
const path = require('path');

const read = '../posts-md/';
const write1 = '../posts/'
const write2 = '../posts-data/'
const template1 = '<html> <head> <link rel="stylesheet" href="../css/tags.css"> <link rel="stylesheet" href="../highlight/styles/default.min.css"> <script src="../highlight/highlight.min.js"></script> <script>hljs.highlightAll();</script> <link rel="stylesheet" href="../css/blog.css"> <link rel="stylesheet" href="../mathscribe/jqmath-0.4.3.css"> <link rel="stylesheet" href="../css/navbar.css"> <link rel="stylesheet" href="../css/searchbar.css"> <script src="../mathscribe/jquery-1.4.3.min.js"></script> <script src="../mathscribe/jqmath-etc-0.4.6.min.js" charset="utf-8"></script> <title>Oursaco Blog | '
const template2 = '</title> </head> <body style="margin:0;"> <div class="navbar"> <img src="../images/logo.jpg" class="logo"> <div class="title"><b>Oursaco</b> Blog</div> <button class="button" onclick="window.location.href=\'../index.html\'"><a href="../index.html">Home</a></button> <button class="button" onclick="window.location.href=\'../about.html\'"><a href="../about.html">About</a></button> <button class="button" onclick="window.location.href=\'../links.html\'"><a href="../links.html">Links</a></button> </div> <div style="width:100%;height:15%;"></div> <div class="blog">';
const template3 = '</div> <div class="tag-container">';
const template4 = '</div> <div class="blog">';
const template5 = '</div> </body> </html>';

var reader = new commonmark.Parser();
var writer = new commonmark.HtmlRenderer();

fs.readdir(read, (err, files) => {
    if(err) throw err;
    files.forEach(file => {
        fs.readFile(read + file, 'utf8', (err, data) => {
            if(err) throw err;
            let line = data.split('\n');
            let title = line[0].split(':')[1].replace('\r', '');
            let date = line[1].split(':')[1].replace('\r', '');
            let tags = line[2].split(':')[1].replace('\r', '').split(',');
            let content = '';
            for(let i = 3; i < line.length; i++){
                content += line[i] + '\n';
            }
            let html_tags = '';
            for(let i = 0; i < tags.length; i++) html_tags += '<div class="tag"><p>' + tags[i] + '</p></div>';
            let value = template1 + title + template2 + writer.render(reader.parse('# ' + title)) + '<div style="font-family:Helvetica; font-size:15px; text-align:center; padding:10px;">' + date + '</div>' + template3 + html_tags + template4 + writer.render(reader.parse(content)) + template5;
            fs.writeFile(write1 + path.parse(file).name + '.html', value, err => {
                if(err) throw err;
                console.log(file + " has been successfully parsed 1/2");
            });
            let id = {
                "title": title,
                "dir": './posts/' + path.parse(file).name + '.html',
                "date": date,
                "tags": tags
            };
            fs.writeFile(write2 + date + '-' + path.parse(file).name + '.json', JSON.stringify(id), err => {
                if(err) throw err;
                console.log(file + " has been successfully parsed 2/2");
            });
        });
    });
});