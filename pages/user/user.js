// pages/user/user.js
const app = getApp(); // 获取App实例
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageId: 'user'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const userInfo = getApp().globalData.userInfo;
        this.setData({
            userInfo: userInfo
        })
    },
    handleNavigate: function (e) {
        const targetPageId = e.currentTarget.dataset.pageid; // 假设通过data-pageid传入目标页面ID
        app.navigateToPage(targetPageId); // 调用全局跳转方法
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})