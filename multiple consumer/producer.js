const amqp=require('amqplib')

async function sendMail(){
    try{
        const connection=await amqp.connect("amqp://localhost")
        const channel=await connection.createChannel()
        const exchange='mail_exchange'
        const routingKeyforSubUser="send_mail_to_subscribed_users"
        const routingKeyforNormalUser="Users_mail_queue"

        const message={
            to:"nnj@gmail.com",
            from:"ygyg@gmail.com",
            subject:"Hello IP mail",
            body:"Hello Rahul!!"
        }

        await channel.assertExchange(exchange,"direct",{durable:false})
        
        await channel.assertQueue("subscribed_users_mail_queue",{durable:false})
        await channel.assertQueue("Users_mail_queue",{durable:false})

        await channel.bindQueue("subscribed_users_mail_queue",exchange,routingKeyforSubUser)
        await channel.bindQueue("Users_mail_queue",exchange,routingKeyforNormalUser)

        channel.publish(exchange,routingKeyforSubUser,Buffer.from(JSON.stringify(message)))
        console.log("data was sent",message)

        setTimeout(()=>{
            connection.close()
        },500)
    }
    catch(err){
        console.log(err)
    }
}

sendMail()