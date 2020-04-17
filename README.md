# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Screenshot of main urls page"](https://github.com/JNasato/tinyapp/blob/master/docs/tinyurls-page.png?raw=true)
!["Screenshot of url edit page"](https://github.com/JNasato/tinyapp/blob/master/docs/url-edit-page.png?raw=true)
!["Screenshot of account registery page"](https://github.com/JNasato/tinyapp/blob/master/docs/register-page.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- method-override

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Features

- Create randomly generated 'TinyURLs' and store them in a database
- Edit and delete URLs from said database
- Use the 'TinyURL' as a link for whichever webpage is desired
- Register account so URLs are available whenever they are needed!
- The URLs are for public use but any updating of them must be done by the creator