const bcrypt = require('bcryptjs')


module.exports = {
    register: async(req,res) => {
      
        const {username, password, isAdmin} = req.body;
        console.log(req.body)
        const db = req.app.get('db')
        
        let result = await db.get_user([username]);
        const existingUser = result[0];
        if(existingUser){
            return res.status(409).send('username is taken')
        }
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password,salt);
        let registerUser = await db.register_user([isAdmin,username,hash]) 
        console.log(registerUser)
        const user = registerUser[0];
        req.session.user = {isAdmin: user.isAdmin, username: user.username, id: user.id};
        res.status(201).send(req.session.user)
    },

    login: async(req,res) =>{
        const {username,password} = req.body;
        const db = req.app.get('db')
        const foundUser = await req.app.get('db').get_user([username])
        const user = foundUser[0];
        if(!user){
            return res.status(401).send('user not found')
        }
        const isAuthenticated = bcrypt.compareSync(password, user.hash)
        if (!isAuthenticated){
            return res.status(403).send('incorrect password')
        }
        req.session.user = {isAdmin: user.isAdmin, username: user.username, id: user.id}
        return res.send(req.session.user)

    },
    logout:(req,res) =>{
        req.session.destroy();
       return res.sendStatus(200);
    }
    
}