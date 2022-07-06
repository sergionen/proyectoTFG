const User = require('../models/user');
const Document = require('../models/document');

const deleteAccount = (req, res) => {
    const user_id = req.user._id;
    User.findByIdAndDelete({_id: user_id}, (err, user) => {
        if(err) {
            console.log(err);
            return res.status(500).render('500');            
        } else {
            console.log("user deleted: " + user);
            Document.deleteMany({user: user_id}, (err, documents) => {
                if(err) {
                    console.log(err);
                    return res.status(500).render('500');            
                }
                console.log("documents:");
                console.log(documents);
                req.session.destroy((err) => {
                    if (err){
                        console.log(err);
                        res.status(500).render('500');
                    }
                    return res.redirect('/login');
                })
            });
        }
    });
}

module.exports = {
    deleteAccount
};
