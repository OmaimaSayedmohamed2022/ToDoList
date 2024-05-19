const express = require("express");
const app = express();
require('dotenv').config();
const mongoose = require('mongoose')
const userRouter = require('./routers/userRouter');
const passport = require('passport');
const session = require('express-session');
const googleRouter = require('./routers/googleRouter')
const facebookRouter = require('./routers/facebookRouter')
const taskRouter = require('./routers/taskRouter')
app.use(express.json());
const PORT = 3000 ;
//google

// Express Session
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
  }));


  app.use(passport.initialize());
  app.use(passport.session());
 
  passport.serializeUser((user, done) => done(null, user));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

app.use('/user' , userRouter)
app.use('/task' , taskRouter)
app.use('/auth/google' , googleRouter)
app.use('/auth/facebook' , facebookRouter)


mongoose.connect(`mongodb+srv://omimasmohamed912:${process.env.password}@cluster0.lwnjqdj.mongodb.net`)
.then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });


// mongoose.connect(`mongodb+srv://omimasmohamed912:${process.env.password}cluster0.lwnjqdj.mongodb.net/`).then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server is running at port ${PORT}/`);
//     });
//   })
//   .catch((err) => {
//     console.error('mongoDB connection error:', err);

//   });

