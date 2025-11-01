const amqp=require('amqplib')

async function consumeMessage(){
    try{
        const connection=await amqp.connect("amqp://localhost")
        const channel=await connection.createChannel()

        await channel.assertQueue("lazy_queue",{durable:true,arguments:{"x-queue-mode":"lazy"}})

        console.log("waiting for messages")

        channel.consume("lazy_queue",(message)=>{
            if(message !== null){
                console.log("Received messages",message.content.toString())
                channel.ack(message)
            }
        })
    }
    catch(err){
        console.log(err)
    }
}
consumeMessage()