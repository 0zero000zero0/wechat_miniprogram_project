// pages/AuditRecords/AuditRecords.js\
const app = getApp(); // 获取App实
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imageList: [],
        userInfo: {},
        types: ['全部', '治厕', '治风', '治水', '治垃圾'],
        type_index: 0
    },
    showAll() {
        const db = wx.cloud.database()
        db.collection('images').where({
            // score: -1,
            customerId: this.data.userInfo._id
            // _openid: 'onVes61IMVBVDKzZogmo6P1xM8K0'
        }).limit(100).get().then(res => {
            console.log(res)
            this.setData({
                imageList: res.data
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */

    onLoad() {
        this.showAll()
        this.setData({
            userInfo: getApp().globalData.userInfo
        })
    },
    showType(type) {
        const db = wx.cloud.database()
        if (type != "全部") {
            db.collection('images').where({
                // score: -1,
                customerId: this.data.userInfo._id,
                type: type
            }).limit(100).get().then(res => {
                if (res.data.length == 0) {
                    this.setData({
                        imageList: []
                    })
                }
                console.log(res)
                this.setData({
                    imageList: res.data
                })
            })
        }else{
            db.collection('images').where({
                customerId: this.data.userInfo._id,
            }).limit(100).get().then(res => {
                if (res.data.length == 0) {
                    this.setData({
                        imageList: []
                    })
                }
                console.log(res)
                this.setData({
                    imageList: res.data
                })
            })
        }
    },
    bindPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            type_index: e.detail.value
        })
        console.info("选择的类型:", this.data.types[this.data.type_index])
        this.showType(this.data.types[this.data.type_index])
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