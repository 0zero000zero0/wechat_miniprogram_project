// pages/home/home.js
const app = getApp(); // 获取App实例
Page({

    /**
     * 页面的初始数据
     */
    data: {
        uploadedImages: [],
        pageId: 'home'
    },

    handleNavigate: function (e) {
        const targetPageId = e.currentTarget.dataset.pageid; // 假设通过data-pageid传入目标页面ID
        console.info(targetPageId)
        app.navigateToPage(targetPageId); // 调用全局跳转方法
    },
    goToAuditRecords() {
        wx.navigateTo({
          url: '/pages/AuditRecords/AuditRecords',
        })
    },
    // 发起跳转的页面代码片段
    goToUploadImage() {
        wx.chooseMedia({
            count: 9,
            mediaType: ['image'],
            sourceType: ['album', 'camera'],
            maxDuration: 30,
            camera: 'back',
            success: (res) => {
                // 这里获取到用户选择的图片信息
                const images = res.tempFiles.map(file => file.tempFilePath);
                wx.navigateTo({
                    url: '/pages/uploadImage/uploadImage',
                    success: function (res) {
                        // 通过eventChannel向被打开页面传送数据
                        res.eventChannel.emit('acceptDataFromOpenerPage', {
                            images: images
                        })
                    }
                })
            },
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.data.uploadedImages = []
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