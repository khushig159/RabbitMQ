const amqp=require('amqplib')

async function receiveMail(){
    try{
        const connection=await amqp.connect("amqp://localhost")
        const channel=await connection.createChannel()

        await channel.assertQueue("send_mail_to_user",{durable:false})

        channel.consume("send_mail_to_user",(message)=>{
            if(message !== null){
                console.log("Recv message for normal user",JSON.parse(message.content))
                channel.ack(message)
            }
        })
    }
    catch(err){
        console.log(err)
    }
}
receiveMail()