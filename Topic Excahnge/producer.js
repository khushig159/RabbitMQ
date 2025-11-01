const amqp=require('amqplib')

async function sendMail(routingKey,message){
    try{
        const connection=await amqp.connect("amqp://localhost")
        const channel=await connection.createChannel()
        const exchange='notification_exchange'
        const exchangeType="topic"

        await channel.assertExchange(exchange,exchangeType,{durable:false})

        channel.publish(exchange,routingKey,Buffer.from(JSON.stringify(message)),{persistent:true})
        console.log(" [x] sent '%s' : '%s' " , routingKey, JSON.stringify(message))
        console.log(`mes was send! with routing key ${routingKey} and content as ${message}`)
        
        setTimeout(()=>{
            connection.close()
        },500)
    }
    catch(err){
        console.log(err)
    }
}

sendMail("order.placed",{orderID:12345,statys:"placed"})
sendMail("payment.processed",{paymentID:67890,statys:"processed"})