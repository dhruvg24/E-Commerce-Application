import handleAsyncErrors from "../middlewares/handleAsyncErrors.js";
import User from "../models/userModel.js";
export const registerUser = handleAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
        public_id: 'temporary public_id',
        url: 'this is temp_url'
    }
  });

  const token = user.getJWTToken();


  res.status(201).json({
    success: true,
    user,
    token
  })
});
