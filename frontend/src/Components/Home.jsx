import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen">
      <main>
        <div className="text-center">
          <div className="py-6 sm:px-0">
            <h1 className="text-5xl lg:text-5xl  font-bold text-purple-800 text-center">
              基于区块链的身份认证系统
            </h1>
            <blockquote className="mt-3 text-xl text-blue-700">
              "blockchain-authentication-system"
            </blockquote>
          </div>
        </div>
      </main>
      <p className="justify-center mx-7 text-justify">
        <span className="text-4xl ml-4">本</span>系统是一种将客户端-服务器模型与区块链技术相结合的身份验证系统。简单的适用场景：公司将在区块链上注册并存入初始资产，这可作为对其活跃用户的激励，或通过身份认证做一些资源权限的控制。在本系统中，公司将使用他们的地址和密码来注册他们的用户，而不是电子邮件或用户名等传统方法。这些公司将通过服务器借助区块链对用户进行身份验证，并跟踪其常规会话。
      </p>
      <img
        src="/Arch.jpg"
        className="object-contain h-1/2 w-1/2 mx-auto"
        alt="Architecture of BlockAuth"
      />
    </div>
  );
};

export default Home;
