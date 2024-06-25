import pg from "pg"
import crypto from "node:crypto"
import argon2 from "argon2"
const { Pool } = pg;

// Configure the database connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

export default class FastPassModel {
    constructor() {
        this.conn = pool;
        this.storage = undefined; // TODO: storage system
    }

    async add_user(username, pass, email) {
        const salt = crypto.randomBytes(20).toString();
        pass = await argon2.hash(`${pass}${salt}`); // so there are no duplicate passwords.
        const result = await pool.query(
            `INSERT INTO \"USER\" (Username, password, salt, email)
            VALUES($1, $2, $3, $4)`
            ,[username, pass, salt, email]
        );
        return result.rows;
    }

    async users() {
        return pool.query("SELECT * FROM \"USER\"");
    }

    async exists(username) {
        return pool.query("SELECT * FROM \"USER\" WHERE LOWER(username) = LOWER($1)", [username]);
    }

    async new_vault(userId, vaultType) {
        return pool.query(
            `INSERT INTO \"USER-VAULT\" (userid, vaulttype)
            VALUES($1, $2)`,
            [userId, vaultType]
        );
    }

    async validate(username, password) {
        const user = (await this.exists(username)).rows[0];
        if(!user) {
            return {
                valid: false,
                type: "Invalid Username",
            }
        }
        const salt = user.salt;
        const correct_password = argon2.verify(await argon2.hash(`${password}${salt}`), user.password);
        if(correct_password) {
            return {
                valid: true,
            }
        } else {
            return {
                valid: false,
                type: "Wrong Password",
            }
        }
    }

    async user_vaults(userId) {
        const { rows: vautls } = await this.conn.query("SELECT * FROM \"User-Vault\" WHERE UserId = $1", [userId]);
        return vautls;
    }

    async get_userInfo(userId) {
        const { rows: user } = await this.conn.query("SELECT * FROM \"USER\" WHERE Id = $1", [userId])
        const vaults = await this.user_vaults(userId);
        return { user, vaults };
    }

    async get_vault(vaultId, vaultType) {
        if(vaultType != "Password" && vaultType != "Storage") {
            throw "Invalid Vault Type. One of: ['Password', 'Storage']";
        }
        let table = vaultType == "Password" ? "PasswordVault": "StorageVault";
        return (await this.conn.query(`ELECT * FROM ${table} WHERE VaultId = $1`, [vaultId])).rows[0];
    }

    async get_storage(vaultId, fileIds) {
        this.storage.get(vaultId, fileIds);
    }
}
