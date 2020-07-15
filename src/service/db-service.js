import Dexie from "dexie"
import bcrypt from "bcryptjs"

export class DbService {
    constructor() {
        this.db = new Dexie("clientDb")
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
        const user = await this.db.users.where({ username })
        if (user && await bcrypt.compare(password, user.password)) {
            return true
        }
        return false
    }

    /**
     * 
     * @param {string} username 
     * @param {string} password 
     * @param {string} displayName
     * @param {string} userPicture
     * @param {string} apiKey 
     * @param {string} customerUid 
     */
    async register(username, password, displayName, userPicture, apiKey, customerUid, properties) {
        if (await this.db.users.where({ username }).count() !== 0) {
            return null
        }
        console.log('creating')
        return this.db.users.add({
            username, password: (await bcrypt.hash(password, 12)), displayName, userPicture, apiKey, customerUid, properties
        })
    }

    getUserByUsername(username) {
        return this.db.users.where({ username }).first()
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
    async updateUserById(id, username, password, displayName, userPicture, apiKey, customerUid, properties) {
        const userExists = await this.db.users.where({ id }).count()
        if (userExists === 0) {
            return { status: "FAILED", message: "This username is not avaible" }
        }
        return this.db.users.where({ id }).modify({ username, password, displayName, userPicture, apiKey, customerUid, properties })
    }
}
export default new DbService()