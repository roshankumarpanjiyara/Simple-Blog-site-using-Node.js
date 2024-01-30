const express = require('express');

//custom package
const db = require('../data/database');

const router = express.Router();

router.get('/', function (request, response) {
    response.redirect('/posts');
});

router.get('/posts', async function (request, response) {
    const query = `
        SELECT posts.*, authors.name AS author_name FROM posts 
        INNER JOIN authors ON posts.author_id = authors.id
    `;
    const [posts] = await db.query(query);
    response.render('posts-list', { posts: posts });
});

router.get('/new-post', async function (request, response) {
    const [authors] = await db.query('SELECT * FROM authors');
    response.render('create-post', { authors: authors });
    // console.log(authors);
});

router.post('/posts', async function (request, response) {
    const data = [
        request.body.title,
        request.body.summary,
        request.body.content,
        request.body.author
    ];
    await db.query('INSERT INTO posts (title, summary, body, author_id) VALUES (?)', [data]);//replace ? by the value in array
    response.redirect('/posts');
});

router.get('/post/:id/:title', async function (request, response) {
    const query = `
        SELECT posts.*, authors.name AS author_name, authors.email AS author_email FROM posts 
        INNER JOIN authors ON posts.author_id = authors.id 
        WHERE posts.id = ? AND posts.title = ?
    `;

    const [posts] = await db.query(query, [request.params.id, request.params.title]);
    // console.log(posts);
    //for wrong url
    if (!posts || posts.length === 0) {
        return response.status(404).render('404');
    }

    const postData = {
        ...posts[0],
        created_at: posts[0].created_at.toISOString(),
        humanReadableDate: posts[0].created_at.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
    };
    // console.log(postData);
    response.render('post-detail', { post: postData });
});

router.get('/post/edit/:id/:title', async function (request, response) {
    const query = `
        SELECT * FROM posts WHERE id = ? AND title = ?
    `;

    const [posts] = await db.query(query, [request.params.id, request.params.title]);
    // console.log(posts);
    //for wrong url
    if (!posts || posts.length === 0) {
        return response.status(404).render('404');
    }

    // console.log(postData);
    response.render('update-post', { post: posts[0] });
});

router.post('/post/edit/:id/:title', async function (request, response) {
    const query = `
        UPDATE posts SET title = ?, summary = ?, body = ?
        WHERE id = ? AND title = ?
    `;

    await db.query(query, [request.body.title, request.body.summary, request.body.content, request.params.id, request.params.title]);//replace ? by the value in array
    response.redirect('/posts');
});

router.post('/post/delete/:id', async function (request, response) {
    const query = `
        DELETE FROM posts WHERE id = ?
    `;

    await db.query(query, [request.params.id]);//replace ? by the value in array
    response.redirect('/posts');
});

module.exports = router;