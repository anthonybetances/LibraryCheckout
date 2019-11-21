module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // LIBRARY EJS SECTION =========================
    app.get('/library', isLoggedIn, function(req, res) {
        db.collection('libraryInventory').find().toArray((err, result) => {
          console.log(result)
          if (err) return console.log(err)
          res.render('library.ejs', {
            user : req.user,
            inventory: result,

          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// LIBRARY INVENTORY ===============================================================

    app.post('/library', (req, res) => {
      db.collection('libraryInventory').save({title: req.body.title, author: req.body.author, available: req.body.available}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('library')
      })
    })


    app.put('/inventoryUpdate', (req, res) => {
      db.collection('libraryInventory')
      .findOneAndUpdate({title: req.body.title, author: req.body.author}, {
        $set: {
          available : req.body.available ? true : false,
        }
      },
      {
        sort: {_id: -1},
        upsert: true
      },
       (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

//     app.put('/messagesAlt', (req, res) => {
//   db.collection('messages')
//   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
//     $set: {
//       thumbUp:req.body.thumbUp - 1
//     }
//   }, {
//     sort: {_id: -1},
//     upsert: true
//   }, (err, result) => {
//     if (err) return res.send(err)
//     res.send(result)
//   })
// })
    // 
    // app.delete('/messages', (req, res) => {
    //   db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    //     if (err) return res.send(500, err)
    //     res.send('Message deleted!')
    //   })
    // })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/library', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/library', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/library');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
