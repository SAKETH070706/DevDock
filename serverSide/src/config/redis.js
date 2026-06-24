import Redis from 'ioredis'

const redis=new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

export const connectRedis=async()=>{
   try{
    await redis.ping();
    console.log('redis connection successful....');
    }catch(err){
    console.error('redis connection error:',err);
    process.exit(1);
    

   }
}
redis.on('error',(err)=>{
    console.error('Redis error:',err);
})
redis.on('reconnecting',()=>{
    console.log('Reconnecting to Redis.....')
})
export default redis;