const express = require('express');
const path = require('path');
const app = express();
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const {mongoDbUrl} = require('./config/database');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

mongoose.connect(mongoDbUrl,{useNewUrlParser: true}).then((db)=>{
  console.log('MONGO connected');
}).catch(error=> console.log(error));


//use static
app.use(express.static(path.join(__dirname, 'public')));

//set view engine
const {select, generateTime,paginate} = require('./helpers/handlebars-helpers');
app.engine('handlebars',exphbs({defaultLayout: 'home', helpers: {select: select, generateTime: generateTime , paginate:paginate}}));
app.set('view engine', 'handlebars');

//upload middleware
app.use(upload());
// app.use(flash());

//body parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Method Override
app.use(methodOverride('_method'));

//Sessions
app.use(session({
  secret: 'srushti123ilovecoding',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());

//local variables using middleware
app.use((req,res,next)=>{
  res.locals.user = req.user || null;
  res.locals.success_message = req.flash('success_message');
  res.locals.error_message = req.flash('error_message');
  res.locals.form_errors = req.flash('form_errors');
  res.locals.error = req.flash('error');

  next();
});

//load routes
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');
const comments = require('./routes/admin/comments');

//use routes
app.use('/', home); // use the routes
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);
app.use('/admin/comments', comments);


const port = process.env.PORT || 4500;
app.listen(port, () =>{
  console.log(`listening on port ${port}`);
});
