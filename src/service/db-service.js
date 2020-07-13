import sqlite3 from "better-sqlite3"

export class DbService{
    constructor(){
        this.clientdb = sqlite3('client.db')
    }

    createTables(){
        this.clientdb.prepare("CREATE TABLE IF NOT EXISTS users(id integer PRIMARY KEY autoincrement, username varchar unique, displayname varchar, password varchar, apikey varchar(64), uid varchar(36))")
    }
    
    login(username, password){
        return this.clientdb.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password)
    }

    register(username, password, apiKey, customeruid){
        if(!this.clientdb.prepare("SELECT * FROM users WHERE username = ?").get(username)){
            return this.clientdb.prepare("INSERT INTO users(username, password, apikey, uid) VALUES(?,?,?,?)").get(username, password, apiKey, customeruid)
        }else{
            return null
        }
    }
}
export default new DbService()