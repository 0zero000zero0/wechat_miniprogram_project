// app.js
App({
    onLaunch() {
        // 展示本地存储能力
        const logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        wx.cloud.init({
            env: 'cloud1-8gxg6sk4ed3ac923'
        })
        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
    },
    globalData: {
        userInfo: null
    },
    navigateToPage: function(targetPageId) {
        // 定义页面跳转映射
        const pageMap = {
          home: '/pages/home/home',
          feedback: '/pages/feedback/feedback',
          user: '/pages/user/user'
        };
        const currentPage = getCurrentPages().pop(); // 获取当前页面实例
        const currentPageId = currentPage.data.pageId; // 每个页面data中都有pageId来标识页面
        console.info(currentPage)
        console.info(currentPageId)
        if (currentPageId === targetPageId) {
          console.log('Already on the target page.');
          return; // 如果目标页面就是当前页面，则不进行跳转
        }
        const targetUrl = pageMap[targetPageId]; // 根据pageId获取目标页面的路径
        if (targetUrl) {
          wx.navigateTo({
            url: targetUrl
          });
        } else {
          console.log('Target page not found.');
        }
      }
})