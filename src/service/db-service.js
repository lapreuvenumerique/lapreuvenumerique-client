import Dexie from "dexie"
import bcrypt from "bcryptjs"

export class DbService {
    constructor() {
        this.db = new Dexie("LPNClientDb")
        this.createTables()
    }

    createTables() {
        this.db.version(1).stores({
            users: "++id, username"
        })
    }

    /**
     * 
     * @param {string} username 
     * @param {string} password 
     */
    async login(username, password) {
        const user = await this.getUserByUsername(username)
        if (!user) {
            return { status: "FAILED" }
        }
        const res = await bcrypt.compare(password, user.password)
        if (res) {
            return { status: "SUCCESS", user }
        }
        return { status: "FAILED" }
    }

    /**
     * 
     * @param {string} username 
     * @param {string} password 
     * @param {string} displayName
     * @param {string} apiKey 
     * @param {string} customerUid 
     */
    async register(username, password, displayName, apiKey, customerUid, properties, userPicture, email) {
        if (await this.db.users.where({ username }).count() !== 0) {
            return { status: "FAILED", message: "This username is not available" }
        }
        await this.db.users.add({
            username, password, displayName, apiKey, customerUid, properties, userPicture, email
        })
        return { status: "SUCCESS", message: "User created" }
    }

    getUserByUsername(username) {
        return this.db.users.where({ username }).first()
    }

    getUserById(id) {
        return this.db.users.where({ id }).first()
    }

    resetDB() {
        return this.db.users.where({ username: "Admin" }).delete()
    }

    getSecretKey(){
        //this key is for the encryption of api key and customer uid
        return "LaPreuveNumerique"
    }

    /**
     * 
     * @param {number} id 
     * @param {string} username 
     * @param {string} password 
     * @param {string} displayName
     * @param {blob} userPicture
     * @param {string} apiKey 
     * @param {string} customerUid 
     * @param {string} properties 
     */
    async updateUserById(id, username, displayName, apiKey, customerUid,properties, userPicture, email) {
        const userExists = await this.db.users.where({ id }).count()
        if (userExists === 0) {
            return { status: "FAILED", message: "This user does not exist" }
        }
        const usernameExists = await this.db.users.where({username}).first()
        if(usernameExists.id !== id) {
            return { status: "FAILED", message: "This username is not available" }
        }
        await this.db.users.where({ id }).modify({ username, displayName, apiKey, customerUid, properties, userPicture, email })
        return { status: "SUCCESS", message: "Password changed" }
    }

    async updatePasswordById(id, password) {
        const userExists = await this.db.users.where({ id }).count()
        if (userExists === 0) {
            return { status: "FAILED", message: "This user does not exist" }
        }
        await this.db.users.where({ id }).modify({password})
        return { status: "SUCCESS", message: "Password changed" }
    }
}
export default new DbService()