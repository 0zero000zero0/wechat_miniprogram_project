Page({
    data: {
        imageList: [], // 保存选中的图片
        pageId: 'uploadImage'
    },
    onLoad: function (option) {
        const eventChannel = this.getOpenerEventChannel();
        // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
        eventChannel.on('acceptDataFromOpenerPage', (data) => {
            console.log(data); // 打印接收到的数据，确认格式
            // 更新页面data中的imageList
            this.setData({
                imageList: data.images // 假设传递的数据对象中包含images属性，其中存储了图片列表
            });
        });
    },
    submitImages() {
        const that = this;
        // 显示上传中的提示
        wx.showLoading({
            title: '上传中...',
        });
        const db = wx.cloud.database(); // 获取云数据库实例
        const userId = getApp().globalData.userInfo._id; // 获取用户ID
        console.log(userId)
        // 使用Promise.all来等待所有图片上传操作完成
        const uploadPromises = this.data.imageList.map((imgSrc, index) => {
            const currentTime = new Date();
            // 构造文件名时加入用户ID和时间（年月）
            const imageName = `${userId}/${currentTime.getFullYear()}_${(currentTime.getMonth() + 1).toString().padStart(2, '0')}/${currentTime.getFullYear()}-${(currentTime.getMonth() + 1).toString().padStart(2, '0')}-${currentTime.getDate().toString().padStart(2, '0')}-${currentTime.getHours().toString().padStart(2, '0')}-${currentTime.getMinutes().toString().padStart(2, '0')}-${currentTime.getSeconds().toString().padStart(2, '0')}-${String(index)}.png`;
            return wx.cloud.uploadFile({
                cloudPath: imageName, // 上传到云端的图片路径
                filePath: imgSrc, // 本地文件路径
            });
        });


        Promise.all(uploadPromises).then(res => {
            // 所有图片上传成功
            const fileIDs = res.map(uploadResult => uploadResult.fileID); // 获取所有图片的云文件ID
            debugger
            // 对每个文件创建单独记录
            const uploadTasks = fileIDs.map(fileID => {
                return db.collection('images').add({
                    data: {
                        fileID: fileID,
                        customerId: userId, // 使用前面获取的用户ID
                        score: -1, // 默认分数为-1
                        adminId: "" // 默认打分管理员为空
                    }
                });
            });

            // 等待所有上传任务完成
            Promise.all(uploadTasks).then(() => {
                console.log('所有图片记录已创建');
                wx.hideLoading();
                wx.showToast({
                    title: '图片上传成功',
                    icon: 'success',
                    complete: () => {
                        setTimeout(() => {
                            wx.navigateBack();
                        }, 500);
                    }
                })
            }).catch(error => {
                wx.hideLoading();
                wx.showToast({
                    title: '上传失败，请重试',
                    icon: 'none'
                });
                console.error("添加数据库记录失败：", error);
            });
        }).catch(error => {
            console.error('上传图片失败', error);
        });


        // 清空imageList
        this.setData({
            imageList: []
        });
    }
});