const { minioClient, bucket } = require("./s3-client")

class S3Service {
    makeKey(userId, fileName) {
        return `${userId}/${fileName.replace(/\s+/g, '_')}`;
    }

    async uploadJson(userId,json,fileName) {
        const key = this.makeKey(userId, fileName);
        const buffer = Buffer.from(JSON.stringify(json));
        await minioClient.putObject(bucket, key, buffer, {
            "Content-Type":"application/json"
        })
        return key;
    }

    async getJson(key) {
        const stream = await minioClient.getObject(bucket, key);
        return new Promise((resolve, reject) => {
            let data = "";
            stream.on("data", chunck => data += chunck.toString())
            stream.on("end", () => {
                try {
                    resolve(JSON.parse(data));
                }
                catch (err) {
                    reject(new Error('Failed to parse JSON'));
                }
            })
            stream.on("error", reject);
        })
    }

    async updateJson() {
        
    }

    async generateSignedUrl() {
        
    }

    async delete() {
        
    }

}


module.exports = new S3Service();