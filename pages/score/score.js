const app = getApp(); // 获取App实例
Page({
    data: {
        imagesToRate: [],
        currentImage: {},
        currentIndex: 0,
        userInfo: {}
    },

    onLoad() {
        this.getImages()
        this.setData({
            currentImage: {
                scores: [0, 0, 0, 0]
            },
            userInfo: getApp().globalData.userInfo
        })
    },

    getImages() {
        const db = wx.cloud.database()
        db.collection('images').where({
            score: -1,
            _openid: 'onVes61IMVBVDKzZogmo6P1xM8K0'
        }).limit(10).get().then(res => {
            console.log(res)
            if (res.data.length === 0) {
                wx.showToast({
                    title: '无可评分图片',
                    icon: 'none'
                })
                return
            }
            this.setData({
                imagesToRate: res.data
            })
            this.setCurrentImage()
        }).catch(err => {
            wx.showToast({
                title: '获取图片失败',
                icon: 'none'
            })
        })
    },

    setCurrentImage() {
        const images = this.data.imagesToRate
        const currentIndex = this.data.currentIndex
        this.setData({
            currentImage: images[currentIndex]
        })
    },

    onScore(event) {
        const score = event.currentTarget.dataset.score
        const images = this.data.imagesToRate
        const currentIndex = this.data.currentIndex
        const currentImage = images[currentIndex]
        // 更新数据库中的评分
        if (currentImage != null) {
            const db = wx.cloud.database()

            db.collection('images').doc(currentImage._id).update({
                data: {
                    score: score,
                    adminId: this.data.userInfo._id
                }
            })
            // 更新页面数据
            this.setData({
                currentIndex: currentIndex + 1
            })
            // 切换到下一张图片
            if (currentIndex < images.length - 1) {
                this.setCurrentImage()
            }
        } else {
            wx.showToast({
                title: '无可评分图片',
                icon: 'none'
            })
        }
    },
    showAlready() {
        // 获取已评分图片的列表
        const db = wx.cloud.database()
        const _ = db.command
        db.collection('images').where({
            score: _.neq(-1),
            _openid: 'onVes61IMVBVDKzZogmo6P1xM8K0'
        }).get().then(res => {
            console.info(res)
            this.setData({
                imagesToRate: res.data
            })
            this.setCurrentImage()
        })
    },
    onPrev() {
        const currentIndex = this.data.currentIndex
        if (currentIndex > 0) {
            this.setData({
                currentIndex: currentIndex - 1
            })
            this.setCurrentImage()
        }
    },

    onNext() {
        const images = this.data.imagesToRate
        const currentIndex = this.data.currentIndex
        if (currentIndex < images.length - 1) {
            this.setData({
                currentIndex: currentIndex + 1
            })
            this.setCurrentImage()
        }
    }
})