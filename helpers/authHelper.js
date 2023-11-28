const bcrypt = require("bcrypt" )

const hashedPassword = async(password)=> {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password , saltRounds)
        return hashedPassword;
        
    } catch (error) {
        console.log(error)
    }
}

const comparePassword = async(password, hashedPassword)=>{
    try {
       return bcrypt.compare(password, hashedPassword)
    } catch (error) {
        console.log(error)
    }
}


const validatePassword = (password) => {
  // Password should have at least one special character, one lowercase letter, one uppercase letter, and one numeric digit
  const passwordRegex =
    /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,12}$/;
  return passwordRegex.test(password);
};



module.exports = { hashedPassword, comparePassword, validatePassword };