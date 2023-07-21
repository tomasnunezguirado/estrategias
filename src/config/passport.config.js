import passport from "passport";
import local from "passport-local";
import UsersModel from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import { ADMIN_USER } from "../utils/adminConfig.js";
import GitHubStrategy from "passport-github2";
import { APP_ID, CLIENT_ID, CLIENT_SECRET } from "../utils/githubConfig.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true,
    }, async (req, username, password, done) => {
        let errorMsg;
        try {
            const { firstName, lastName, email, birthDate } = req.body;
            if (username.toLowerCase() === ADMIN_USER.toLowerCase()) {
                errorMsg = "Usuario existente";
                req.flash('error', errorMsg);
                return done(null, false, { msg: errorMsg });
            }
            const exists = await UsersModel.findOne({ email: { $regex: new RegExp(`^${username}$`, 'i') } });
            if (exists) {
                errorMsg = "Usuario existente";
                req.flash('error', errorMsg);
                return done(null, false, { msg: errorMsg });
            }
            const newUser = {
                firstName,
                lastName,
                email: email.toLowerCase(),
                birthDate,
                password: createHash(password)
            };
            const user = await UsersModel.create(newUser);
            return done(null, user);
        } catch (error) {
            errorMsg = error.message;
            req.flash('error', errorMsg);
            return done({ msg: errorMsg });
        }
    }));

    passport.use('login', new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true,
    }, async (req, username, password, done) => {
        let errorMsg;
        try {
            let user;
            if (username.toLowerCase() === ADMIN_USER.toLowerCase()) {
                if (password !== ADMIN_PASSWORD) {
                    errorMsg = "La contraseña es incorrecta";
                    req.flash('error', errorMsg);
                    return done(null, false, { msg: errorMsg });
                }
                user = {
                    firstName: 'Admin',
                    lastName: 'Coder',
                    email: ADMIN_USER,
                    birthDate: '',
                    userRole: 'admin'
                };
            } else {
                user = await UsersModel.findOne({ email: { $regex: new RegExp(`^${username}$`, 'i') } });
                if (!user) {
                    errorMsg = "Wrong flowerier";
                    req.flash('error', errorMsg);
                    return done(null, false, { msg: errorMsg });
                }
                if (!isValidPassword(user, password)) {
                    errorMsg = "La contraseña es incorrecta";
                    req.flash('error', errorMsg);
                    return done(null, false, { msg: errorMsg });
                }
                user = { ...user.toObject(), userRole: 'user' };
                return done(null, user);
            }
        } catch (error) {
            errorMsg = error.message;
            req.flash('error', errorMsg);
            return done({ msg: errorMsg });
        }
    }));

    passport.use('resetPassword', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'newPassword',
        passReqToCallback: true,
    }, async (req, username, password, done) => {
        let errorMsg;
        try {
            if (username.toLowerCase() === ADMIN_USER.toLowerCase()) {
                errorMsg = "Admin password cannot be reset";
                req.flash('error', errorMsg);
                return done(null, false, { msg: errorMsg });
            } else {
                const user = await UsersModel.findOne({ email: { $regex: new RegExp(`^${username}$`, 'i') } });
                if (!user) {
                    errorMsg = "Wrong flowerier";
                    req.flash('error', errorMsg);
                    return done(null, false, { msg: errorMsg });
                }
                const newHashedPassword = createHash(password);
                await UsersModel.updateOne({ _id: user._id }, { $set: { password: newHashedPassword } });
                return done(null, user);
            }
        } catch (error) {
            errorMsg = error.message;
            req.flash('error', errorMsg);
            return done({ msg: errorMsg });
        }
    }));

    passport.use('github', new GitHubStrategy({
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await UsersModel.findOne({ email: profile._json.email });
            if (!user) {
                user = {
                    firstName: profile._json.name,
                    lastName: '',
                    email: profile._json.email,
                    password: '',
                }
                user = await UsersModel.create(user);
            }
            user = { ...user.toObject(), userRole: 'user' };
            return done(null, user);
        } catch (error) {
            return done({ msg: 'Error de inicio de sesión de Github' });
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (_id, done) => {
        try {
            const user = await UsersModel.findOne({ _id });
            return done(null, user);
        } catch {
            return done({ msg: "Error al deserializar usuario" });
        }
    });

};

export default initializePassport;