import { Router } from "express";

const router_auth = async (model) => {
    const router = Router()

    router.post('/register', async (req, res) => {
        const { username, password, email } = req.body;

        console.log("Adding user...");

        model.add_user(username, password, email)
            .then((u) => res.status(201).send(u)) // user successfully added
            .catch((_) => res.status(400).send('User or email already used'));
    });

    router.post('/login', async (req, res) => {
        const { username, password } = req.body;
        try {
            const { valid, type } = await model.validate(username, password);
            if(!valid) {
                res.status(400).send(type)
            } else {
                res.status(200).send("Login successfully");
            }
        } catch(e) {
            console.log(e);
            res.status(400).send("Database Error");
        }
    });

    return router;
};

export default router_auth;
