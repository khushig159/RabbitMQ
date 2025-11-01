const amqp=require('amqplib')

async function consumeMessage(){
    try{
        const connection=await amqp.connect("amqp://localhost")
        const channel=await connection.createChannel()

        await channel.assertQueue("priority_queue",{durable:true,arguments: { "x-max-priority": 10 }})

        console.log("waiting for messages")
        channel.consume("priority_queue",(message)=>{
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
consumeMessage().catch(console.error)