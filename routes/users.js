import { Router } from "express";

const router_user = async (model) => {
    const router = Router()
    router.get('/', async (_req, res) => {
        const users = await model.users();
        console.log(users.rows);
        res.send(users.rows);
    });

    router.get('/:userId/vaults', (req, res) => {
        const vaults = model.user_vaults(req.params.userId);
        res.status(200).send(vaults);
    });

    router.post('/:userId/vaults', async (req, res) => {
        try {
            const vault = await model.new_vault(req.params.userId);
            res.status(201).send(vault);
        } catch(e) {
            console.log(e);
            res.status(400).send("Database Error");
        }
    });

    router.get('/:userId/passwordVaults/:vaultId', async (req, res) => {
        try {
            const vault = await get_vault(req.params.vaultId, 'Password');
            res.status(200).send(vault);
        } catch(e) {
            console.log(e);
            res.status(400).send("Database Error");
        }
    });

    //add password to vault

    //add file to vault TODO: Storage

    router.get('/:userId/storageVaults/:vaultId', async (req, res) => {
        try {
            const vault = await get_vault(req.params.vaultId, 'Storage');
            res.status(200).send(vault);
        } catch(e) {
            console.log(e);
            res.status(400).send("Database Error");
        }
    });

    router.get('/:userId/vaults/:vaultId/:fileId', (_req, _res) => {
        //TODO: STORAGE SYTEM
    });
    return router
}

export default router_user;
