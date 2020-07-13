//import sqlite3 from "sqlite3"

export class DbService{
    constructor(){
        //this.clientdb = sqlite3.Database('client.db')
    }

    createTables(){
        //this.clientdb.run("CREATE TABLE IF NOT EXISTS users(id integer PRIMARY KEY autoincrement, username varchar unique, displayname varchar, password varchar, apikey varchar(64), uid varchar(36))")
    }
    
    login(username, password){
        //return this.clientdb.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password])
    }

    register(username, password, apiKey, customeruid){
        //if(!this.clientdb.get("SELECT * FROM users WHERE username = ?").get(username)){
        //    return this.clientdb.run("INSERT INTO users(username, password, apikey, uid) VALUES(?,?,?,?)", [username, password, apiKey, customeruid])
        //}else{
        //    return null
        //}
    }
}
export default new DbService()