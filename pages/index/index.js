Page({
    onLoad() {},
    //退出登录
    quit() {
        this.setData({
            userInfo: null,
        })
    },
    //关闭/打开弹框
    closeTank(e) {
        if (!this.data.userInfo_tank) {
            //弹出注册框
            wx.cloud.database().collection('users')
                .get()
                .then(res => {
                    console.log("用户信息====", res);
                    if (res.data.length) {
                        this.setData({
                            userInfo: res.data[0],
                            userInfo_tank: false,
                        })
                        getApp().globalData.userInfo = res.data[0];
                        wx.reLaunch({
                            url: '/pages/home/home'
                        });
                    } else {
                        console.log("还未注册====", res)
                        this.setData({
                            userInfo_tank: true
                        })
                    }

                })
        } else {
            this.setData({
                userInfo_tank: false
            })

        }
    },
    /**
     * 获取头像
     */
    onChooseAvatar(e) {
        console.log(e);
        this.setData({
            avatarUrl: e.detail.avatarUrl
        })
    },
    /**
     * 获取用户昵称
     */
    getNickName(e) {
        console.log(e);
        this.setData({
            nickName: e.detail.value
        })
    },
    getAddr(e) {
        console.log(e);
        this.setData({
            addr: e.detail.value
        })
    },

    /**
     * 提交
     */
    submit(e) {
        if (!this.data.avatarUrl) {
            return wx.showToast({
                title: '请选择头像',
                icon: 'error'
            })
        }
        if (!this.data.nickName) {
            return wx.showToast({
                title: '请输入昵称',
                icon: 'error'
            })
        }
        if (!this.data.addr) {
            return wx.showToast({
                title: '请输入地址',
                icon: 'error'
            })
        }
        this.setData({
            userInfo_tank: false
        })
        wx.showLoading({
            title: '正在注册',
            mask: 'true'
        })
        wx.showToast({
            title: '注册成功',
        })
        let tempPath = this.data.avatarUrl
        let suffix = /\.[^\.]+$/.exec(tempPath)[0];
        console.log(suffix);
        //上传到云存储
        wx.cloud.uploadFile({
            cloudPath: 'user/' + new Date().getTime() + suffix, //头像在云端的文件名称
            filePath: tempPath, // 临时文件路径
            success: res => {
                console.log('上传成功', res)
                let fileID = res.fileID
                wx.hideLoading()
                wx.cloud.database().collection('users')
                    .add({
                        data: {
                            avatarUrl: fileID,
                            nickName: this.data.nickName,
                            addr: this.data.addr,
                            isAdmin: false
                        }
                    }).then(res => {
                        let user = {
                            avatarUrl: fileID,
                            nickName: this.data.nickName,
                            addr: this.data.addr
                        }
                        // 注册成功
                        console.log('注册成功')
                        this.setData({
                            userInfo: user,
                        })
                        wx.reLaunch({
                            url: '/pages/home/home'
                        });
                        get().globalData.userInfo = user
                    })
            },
            fail: err => {
                wx.hideLoading()
                console.log('上传失败', res)
                wx.showToast({
                    icon: 'error',
                    title: '上传头像错误',
                })
            }
        })

    },
})