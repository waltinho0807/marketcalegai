import express, {Request, Response} from 'express';
import {body, validationResult} from 'express-validator';
import jwt from 'jsonwebtoken';
import {User} from '../models/user';
import {RequestValidationError, BadRequestError} from '@wctickets/common';


const router = express.Router();

router.post('/api/users/signup', [
    body('email')
    .isEmail()
    .withMessage('Coloque um e-mail valido'),
    body('password')
    .trim()
    .isLength({min: 4, max: 20})
    .withMessage('Password deve ter de 4 a 6 caracteres')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        throw new RequestValidationError(errors.array());
    }

    const {email, password} = req.body;

    const existingUser = await User.findOne({email});

    if(existingUser){
        throw new BadRequestError('E-mail em usu')
    }

    const user = User.build({email, password});
    await user.save();

    

    const userJwt = jwt.sign(
        {
          id: user.id,
          email: user.email
        },
        process.env.JWT_KEY!
      );
  
      // Store it on session object
      req.session = {
        jwt: userJwt
      };
  

    res.status(201).send(user);
})

export {router as signUpRouter};