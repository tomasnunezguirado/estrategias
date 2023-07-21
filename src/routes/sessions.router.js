import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/authFailureRegister', failureFlash: true }), async (req, res) => {
    req.session.user = {
        name: `${req.user.firstName} ${req.user.lastName}`,
        email: req.user.email,
        birthDate: req.user.birthDate,
        userRole: 'user'
    };
    res.send({ status: 1, msg: "Nuevo usuario registrado" });
})

router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/authFailureLogin', failureFlash: true }), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: 0, msg: 'Error' });
    req.session.user = {
        name: `${req.user.firstName} ${req.user.lastName}`,
        email: req.user.email,
        birthDate: req.user.birthDate,
        userRole: req.user.userRole
    };
    res.send({ status: 1, msg: 'El usuario inició sesión con éxito', user: req.session.user });
});

router.post('/resetpassword', passport.authenticate('resetPassword', { failureRedirect: '/api/sessions/authFailureReset', failureFlash: true }), async (req, res) => {
    res.send({ status: 1, msg: 'Contraseña restablecida con éxito. Será redirigido a la página de inicio de sesión' });
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.send({ status: 1, msg: 'Usuario desconectado con exito ' });
});

router.get('/authFailureRegister', (req, res) => {
    const error = req.flash('error')[0];
    res.status(400).send({ status: 0, msg: error });
});

router.get('/authFailureLogin', (req, res) => {
    const error = req.flash('error')[0];
    res.status(400).send({ status: 0, msg: error });
});

router.get('/authFailureReset', (req, res) => {
    const error = req.flash('error')[0];
    res.status(400).send({ status: 0, msg: error });
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { });

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/api/sessions/githubFailure' }), async (req, res) => {
    req.session.user = {
        name: `${req.user.firstName} ${req.user.lastName}`,
        email: req.user.email,
        userRole: req.user.userRole
    };
    res.redirect('/products');
});

router.get('/githubFailure', (req, res) => {
    res.status(400).send({ status: 0, msg: 'Fallo de autenticación de Github' });
});

export default router;