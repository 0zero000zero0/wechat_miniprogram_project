const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : `0${n}`
}

module.exports = {
    formatTime
}
class Photo {
    // 类的静态属性，用于统计各种类型照片的数量
    static countByType = {};

    constructor(customerID, photoType, photoYear, path, adminID = null, score = null) {
        this.customerID = customerID; // 照片归属的客户ID
        this.photoType = photoType; // 照片类型
        this.path = path; // 照片的保存路径
        this.adminID = adminID; // 给照片打分的管理员ID
        this.year
        this.score = score; // 照片的分数
        this.year = photoYear; //照片时间
        // 在创建照片实例时更新类型计数
        Photo.updateTypeCount(photoType, 1);
    }

    // 照片添加方法（实际上是在构造函数中已经实现）
    add() {
        // 这个方法可以留空，因为属性已在构造函数中设置
    }

    // 删除照片
    delete() {
        // 实际应用中应删除存储中的照片文件
        // 以及删除或更新数据库中的记录
        Photo.updateTypeCount(this.photoType, -1);
        console.log(`照片${this.path}已被删除。`);
    }

    // 打分
    rate(adminID, score) {
        this.adminID = adminID;
        this.score = score;
        console.log(`照片${this.path}现在的分数是：${score}，打分管理员ID：${adminID}`);
    }

    // 修改照片信息
    update(customerID = this.customerID, photoYear = this.photoYear, photoType = this.photoType, path = this.path) {
        if (this.photoType !== photoType) {
            // 如果更改了照片类型，则更新计数
            Photo.updateTypeCount(this.photoType, -1);
            Photo.updateTypeCount(photoType, 1);
        }
        this.customerID = customerID;
        this.photoType = photoType;
        this.path = path;
        this.photoYear = photoYear;
    }

    // 静态方法，更新各种类型照片的数量
    static updateTypeCount(type, delta) {
        if (!Photo.countByType[type]) {
            Photo.countByType[type] = 0;
        }
        Photo.countByType[type] += delta;
        if (Photo.countByType[type] < 0) {
            Photo.countByType[type] = 0; // 避免负数
        }
    }

    // 静态方法，获取指定类型照片的数量
    static getCountByType(type) {
        return Photo.countByType[type] || 0;
    }
}
class User {
    constructor(id, name, birthDate, address) {
        this.id = id;
        this.name = name;
        this.birthDate = birthDate; // 出身日期，格式建议为 'YYYY-MM-DD'
        this.address = address;
    }
}

class Customer extends User {
    constructor(id, name, birthDate, address) {
        super(id, name, birthDate, address);
        this.photos = []; // 存储该客户拥有的照片对象
    }

    // 添加照片
    addPhoto(photo) {
        this.photos.push(photo);
    }
    // 删除照片
    deletePhoto(photoId) {
        this.photos = this.photos.filter(photo => photo.id !== photoId);
    }
    // 计算总分
    getTotalScore() {
        return this.photos.reduce((total, photo) => total + (photo.score || 0), 0);
    }
}

class Administrator extends User {
    constructor(id, name, birthDate, address) {
        super(id, name, birthDate, address);
        this.scoringRecords = []; // 存储打分记录
    }

    // 添加打分记录
    addScoringRecord({
        photoId,
        score,
        year,
        month,
        day
    }) {
        this.scoringRecords.push({
            photoId,
            score,
            year,
            month,
            day
        });
    }

    // 获取打分总个数
    getTotalScoringCount() {
        return this.scoringRecords.length;
    }
}