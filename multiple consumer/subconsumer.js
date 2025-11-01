const amqp=require('amqplib')

async function receiveMail(){
    try{
        const connection=await amqp.connect("amqp://localhost")
        const channel=await connection.createChannel()

        await channel.assertQueue("subscribed_users_mail_queue",{durable:false})

        channel.consume("subscribed_users_mail_queue",(message)=>{
            if(message !== null){
                console.log("Recv message for subscribed user",JSON.parse(message.content))
                channel.ack(message)
            }
        })
    }
    catch(err){
        console.log(err)
    }
}
receiveMail()