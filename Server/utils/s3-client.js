require('dotenv').config();
const Minio  = require("minio")


const minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "Vladislav" ,
  secretKey:"12345678" ,
})


const bucket = "melody";


const initBucket = async () => {
  const exists = await minioClient.bucketExists(bucket)
  if (exists) {
    console.log('Bucket ' + bucket + ' exists.')
  } else {
    await minioClient.makeBucket(bucket, process.env.S3_REGION || 'us-east-1')
    console.log('Bucket ' + bucket + ' created in "us-east-1".')
  }
}

initBucket().catch(console.error);

module.exports = { minioClient, bucket };

