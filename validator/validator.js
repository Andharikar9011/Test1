const { body } = require('express-validator');
exports.userSignupValidator = [
    body('name',"Name is Required")
        .notEmpty()
        .withMessage('Name must not be empty.')
        .isLength({min:3,max:50})
        .withMessage('Must be atleast 3 to max 50 characters.'),
    body('email','Email must be min 4 characters')
        .isEmail()
        .withMessage('Email must be an email')
        .isLength({
            min:4,
        }),
    body('password','Password is required').notEmpty(),
    body('password')
        .isLength({min:6})
        .withMessage("Password must be atleast 6 characters")
        .matches(/\d/)
        .withMessage("Password must contain a number"),
    body('mobile','Mobile Number required').notEmpty(),
    body('mobile')
    .isLength({min:10})
    .withMessage('Mobile Number must be 10 characters'),
    body('address','Address is required').notEmpty(),
    body('city','City is required').notEmpty(),
    body('state','State is required').notEmpty(),
    body('pincode','Pincode is required').notEmpty()
    ];

 exports.userSigninValidator = [
     body('email','Email must be min 4 characters')
        .isEmail()
        .withMessage('Email must be an email')
        .isLength({
            min:4
        }),
body('password','Password is required').notEmpty(),
body('password')
 .isLength({min:6})
 .withMessage("Password must be atleast 6 characters")
 .matches(/\d/)
 .withMessage("Password must contain a number")
];

exports.categoryValidator = [
    body('name','Category must have a name.')
    .notEmpty()
    .withMessage('Category must not be empty.')
    .isLength({min:3,max:50})
    .withMessage('Must be atleast 3 to max 50 characters.')
];

// exports.productValidator =[
//     body('name','Product must have a name.')
//     .notEmpty()
//     .withMessage('Product must not be empty.')
//     .isLength({min:3,max:50})
//     .withMessage('Must be atleast 3 to max 50 characters.'),
//     body('description','Description of product required for Customers').notEmpty().withMessage('Description required.'),
//     body('category','Category Required').notEmpty(),
//     body('price','Please input Price').isInt().notEmpty().withMessage('Price required.'),
//     body('quantity','Please enter Quantity grater than zero.').isFloat({min:0.00,max:1000000000.00}).notEmpty().withMessage('Quantiy required.'),
//     body('shipping','Please enter Shipping Details.').notEmpty().withMessage('Shipping Details required.'),
// ];

exports.adminSignupValidator = [
    body('name',"Name is Required")
        .notEmpty()
        .withMessage('Name must not be empty.')
        .isLength({min:3,max:50})
        .withMessage('Must be atleast 3 to max 50 characters.'),
    body('email','Email must be min 4 characters')
        .isEmail()
        .withMessage('Email must be an email')
        .isLength({
            min:4,
        }),
    body('password','Password is required').notEmpty(),
    body('password')
        .isLength({min:6})
        .withMessage("Password must be atleast 6 characters")
        .matches(/\d/)
        .withMessage("Password must contain a number"),
    body('mobile','Mobile Number required').notEmpty(),
    body('mobile')
    .isLength({min:10})
    .withMessage('Mobile Number must be 10 characters')
    ];


exports.adminSigninValidator = [
    body('email','Email must be min 4 characters')
       .isEmail()
       .withMessage('Email must be an email')
       .isLength({
           min:4
       }),
body('password','Password is required').notEmpty(),
body('password')
.isLength({min:6})
.withMessage("Password must be atleast 6 characters")
.matches(/\d/)
.withMessage("Password must contain a number")
];