// pages/score/score.js
Page({

    data: {
        pageId: 'score',
        show: false,
        imagesToRate: [],
        RatedImages: []
    },
    handleNavigate: function (e) {
        const targetPageId = e.currentTarget.dataset.pageid; // 假设通过data-pageid传入目标页面ID
        app.navigateToPage(targetPageId); // 调用全局跳转方法
    },
    showImage: function (event) {
        const type = event.currentTarget.dataset.type; // 获取点击按钮传递的类型
        const db = wx.cloud.database(); // 获取数据库引用
        let queryCondition = {}; // 查询条件

        // 根据传入的类型设置查询条件
        if (type === 'notalready') {
            // 查找未评分的图片
            queryCondition = {
                score: -1
            };
        } else if (type === 'already') {
            // 查找已评分的图片
            queryCondition = {
                score: db.command.neq(-1)
            };
        }

        // 执行查询操作
        db.collection('images').where(queryCondition).limit(10).get().then(res => {
            // 查询成功
            if (res.data.length > 0) {
                this.setData({
                    imagesToRate: res.data,
                    show: true
                });
            } else {
                // 没有更多图片可以评分
                wx.showToast({
                    title: '已全部评分完成',
                    icon: 'none'
                });
            }
        }).catch(err => {
            // 查询失败
            console.error(err);
        });
    },

    submitScore: function (event) {
        const db = wx.cloud.database();
        const imageId = event.currentTarget.dataset.imageId;
        const newScore = event.currentTarget.dataset.newScore; // 假设从某个地方获取新分数
        // 更新数据库中的评分
        db.collection('images').doc(imageId).update({
            data: {
                score: newScore
            }
        }).then(res => {
            console.log('评分更新成功', res);
        }).catch(err => {
            console.error('评分更新失败', err);
        });
    },
    inputScore: function (event) {
        let score = event.detail.value; // 获取输入的评分
        let imageId = event.currentTarget.dataset.imageId; // 获取图片ID
        let imagesToRate = this.data.imagesToRate.map(image => {
            if (image._id === imageId) {
                image.score = Number(score); // 更新评分
            }
            return image;
        });
        this.setData({
            imagesToRate
        }); // 更新数据
    },


    submitScore: function (event) {
        const db = wx.cloud.database(); // 获取数据库引用
        const fileID = event.currentTarget.dataset.imageId; // 获取图片ID
        const image = this.data.imagesToRate.find(item => item._id === fileID); // 查找对应的图片对象
        if (image) {
            // 更新数据库中的评分
            db.collection('images').doc(fileID).update({
                data: {
                    score: image.score // 设置新的评分
                }
            }).then(() => {
                wx.showToast({
                    title: '评分成功',
                });
                // 重新查询未评分的图片
                this.showImage({
                    currentTarget: {
                        dataset: {
                            type: 'notalready'
                        }
                    }
                });
            }).catch(err => {
                console.error(err);
            });
        }
    },


    submitAllScores: function () {
        const db = wx.cloud.database();
        const _ = db.command;
        let updatePromises = [];

        this.data.imagesToRate.forEach(image => {
            if (image.score >= 0) { // 确保已经输入评分
                updatePromises.push(db.collection('images').doc(image._id).update({
                    data: {
                        score: image.score
                    }
                }));
            }
        });

        Promise.all(updatePromises).then(() => {
            wx.showToast({
                title: '评分提交成功',
            });
            this.showImage({
                currentTarget: {
                    dataset: {
                        type: 'notalready'
                    }
                }
            }); // 重新查询未评分的图片
        }).catch(err => {
            console.error('提交评分失败', err);
        });
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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