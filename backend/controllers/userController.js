const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const {
  registerUser,
  loginUser,
  getIsLoggedInStatus,
  getLastLoginTime,
  logoutUser,
  doesLoginExist,
  getTotalLoggedInDays,
  updateLoggedInStatus,
} = require("../utils/contractMethodsProvider");
const userModel = require("../models/userModel");

// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { wallet, password } = req.body;
  // checking if user has given password and email both
  if (!wallet || !password) {
    return next(new ErrorHandler("请输入钱包地址和密码", 400));
  }

  const walletUser = await userModel.findOne({ wallet: wallet })
  if (walletUser) {
    return res.status(400).json({
      status: false,
      message: "用户已注册"
    })

  }
  const response = await registerUser(wallet, password);

  if (response.status === true) {
    await User.create({
      wallet, password
    });
    return res.status(200).json({
      ...response,
      message: "注册成功"
    });
  }

  return res.status(400).json(response);
});
// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { wallet, password } = req.body;
  // checking if user has given password and email both
  if (!wallet || !password) {
    return next(new ErrorHandler("请输入钱包地址和密码", 400));
  }

  // User is not in the database of server 
  const user = await User.findOne({ wallet });
  if (!user) {
    return next(new ErrorHandler("用户未注册", 401));
  }

  // checking login status in blockchain 
  const doesLoginExists = await doesLoginExist(wallet)
  // user loggedIn Info exists into blockchain 

  if (doesLoginExists === false) {

    const response = await loginUser(wallet, password);
    // console.log("🚀 ~ file: userController.js:132 ~ response:", response);
    if (response.status === true) {
      return res.status(200).json({
        user: wallet,
        isAuthenticated: true,
        data: response.data,
        message: "登录成功"

      });
    }
    else {
      return res.status(400).json(response);
    }

  }
  else if (doesLoginExists === true) {
    // checking login status 
    const loggedInStatus = await getIsLoggedInStatus(wallet);
    //user is already logged In
    if (loggedInStatus === true) {
      const lastLoginTime = await getLastLoginTime(wallet);
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      //if current login is next consecutive day
      if ((currentTimeInSeconds - lastLoginTime) > 86400) {
        // if (true) {
        //update consecutive login details
        const response = await updateLoggedInStatus(wallet);
        // console.log("🚀 ~ file: userController.js:84 ~ response:", response);
        // if successfully updated 
        if (response.status === true) {
          return res.status(200).json({
            user: wallet,
            isAuthenticated: true,
            data: response
          });
        }
        // if failed 
        else {
          return res.status(400).json(response);
        }
      }
      //else just return current login detail
      else {
        return res.status(200).json({
          user: user.wallet,
          isAuthenticated: loggedInStatus,
        });
      }
    }
    else if (loggedInStatus === false) {
      const response = await updateLoggedInStatus(user.wallet);
      if (response.status === true) {
        return res.status(200).json({
          user: user.wallet,
          isAuthenticated: true,
          data: response.data,
          message: "登录成功"

        });
      }
      else {
        return res.status(400).json(response);
      }

    }
    else
      return res.status(400).json({
        status: false,
        data: loggedInStatus
      })
  }
  return next(new ErrorHandler("内部错误，请联系管理员！", 401));
});

//Update Login Status
exports.updateLoggedInStatus = catchAsyncErrors(async (req, res, next) => {
  const { wallet } = req.body;
  // checking if user has given password and email both
  if (!wallet) {
    return next(new ErrorHandler("请输入钱包地址", 400));
  }

  // User is not in the database of server 
  const user = await User.findOne({ wallet });
  if (!user) {
    return next(new ErrorHandler("用户未注册", 401));
  }
  // checking login status in blockchain 
  const doesLoginExists = await doesLoginExist(wallet)

  if (doesLoginExists === true) {
    // checking login status 
    const loggedInStatus = await getIsLoggedInStatus(wallet);
    //user is already logged In
    if (loggedInStatus === true) {
      const lastLoginTime = await getLastLoginTime(wallet);
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      //if current login is next consecutive day
      // if ((currentTimeInSeconds - lastLoginTime) > 86400) {
        if (true) {
        //update consecutive login details
        const response = await updateLoggedInStatus(wallet);
        // console.log("🚀 ~ file: userController.js:84 ~ response:", response);
        // if successfully updated 
        if (response.status === true) {
          return res.status(200).json({
            user: wallet,
            isAuthenticated: true,
            data: response
          });
        }
        // if failed 
        else {
          return res.status(400).json(response);
        }
      }
      //else just return current login detail
      else {
        return res.status(200).json({
          user: user.wallet,
          isAuthenticated: loggedInStatus,
        });
      }
    }
    else if (loggedInStatus === false) {
      const response = await updateLoggedInStatus(user.wallet);
      if (response.status === true) {
        return res.status(200).json({
          user: user.wallet,
          isAuthenticated: true,
          data: response.data,
          message: "登录成功"

        });
      }
      else {
        return res.status(400).json(response);
      }

    }
    else
      return res.status(400).json({
        status: false,
        data: loggedInStatus
      })
  }
  return next(new ErrorHandler("内部错误，请联系管理员！", 401));
})
// Get Total Logged In days 
exports.gettotalLoggedInDays = catchAsyncErrors(async (req, res, next) => {
  const { wallet } = req.body;
  // checking if user
  if (!wallet) {
    return next(new ErrorHandler("请输入钱包地址", 400));
  }
  const user = await User.findOne({ wallet });
  if (!user) {
    return next(new ErrorHandler("用户未注册", 401));
  }
  const totalLoggedInDays = await getTotalLoggedInDays(wallet);
  if (totalLoggedInDays.status === true) {
    return res.status(200).json(totalLoggedInDays)
  }
  return res.status(400).json({
    status: false,
    data: totalLoggedInDays
  })
})

//Logout  User
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  const { wallet } = req.body;
  // checking if user
  if (!wallet) {
    return next(new ErrorHandler("请输入钱包地址", 400));
  }
  const user = await User.findOne({ wallet });
  if (!user) {
    return next(new ErrorHandler("用户未注册", 401));
  }
  const loginStatus = await getIsLoggedInStatus(wallet);
  if (loginStatus === true) {
    const response = await logoutUser(wallet);
    console.log(response);
    if (response.status === true) {
      return res.status(200).json({
        user: null,
        isAuthenticated: !loginStatus,
        data: response,
        message: "退出登录成功"
      });
    }
    else {
      return res.status(400).json(response);
    }
  }
  return res.status(200).json({
    user: null,
    isAuthenticated: loginStatus,
    message: "用户已退出登录"
  });
});
