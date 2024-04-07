Page({
    data: {
      imagesToRate: [],
      currentImage: {},
      currentIndex: 0
    },
  
    onLoad() {
        this.getImages()
        this.setData({
          currentImage: {
            scores: [0, 0, 0, 0]
          }
        })
      },
  
    getImages() {
      const db = wx.cloud.database()
      db.collection('images').where({
        score: -1,
      }).limit(10).get().then(res => {
        this.setData({
          imagesToRate: res.data
        })
        this.setCurrentImage()
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
      
        if (!currentImage.scores) {
          currentImage.scores = [0, 0, 0, 0]
        }
      
        // 更新图片的评分
        currentImage.scores[score] += 1
      
        // 更新数据库中的评分
        const db = wx.cloud.database()
        db.collection('images').doc(currentImage._id).update({
          data: {
            scores: currentImage.scores
          }
        })
      
        // 计算当前图片的平均评分
        let totalScore = 0
        for (let i = 0; i < currentImage.scores.length; i++) {
          totalScore += i * currentImage.scores[i]
        }
        const averageScore = totalScore / currentImage.scores.reduce((a, b) => a + b)
      
        // 更新页面数据
        this.setData({
          [`imagesToRate[${currentIndex}].averageScore`]: averageScore,
          currentIndex: currentIndex + 1
        })
      
        // 切换到下一张图片
        if (currentIndex < images.length - 1) {
          this.setCurrentImage()
        } else {
          // 显示所有图片的平均评分
          let totalAverageScore = 0
          for (let image of images) {
            totalAverageScore += image.averageScore
          }
          wx.showToast({
            title: `所有图片的平均评分：${totalAverageScore / images.length}`
          })
        }
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