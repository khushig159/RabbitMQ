const amqp=require('amqplib')

async function announceProduct(product){
    try{
        const connection=await amqp.connect("amqp://localhost")
        const channel=await connection.createChannel()

        const exchange='new_product_launch'

        await channel.assertExchange(exchange,"fanout",{durable:false})

        const message=JSON.stringify(product)

        channel.publish(exchange,"",Buffer.from(JSON.stringify(message)),{persistent:true})
        console.log("data was sent",message)

        setTimeout(()=>{
            connection.close()
        },500)
    }
    catch(err){
        console.log(err)
    }
}

announceProduct({id:123,name:"Iphone 19 pro max",price:200000})