# DevTinder API's

# authRouter 
- post /signup
- post /login
- post /logout

# profileRouter
- Get /profile/view
- patch /profile/edit
- patch /profile/password

# connection request router
- post /request/send/:status/:userId
- post /request/review/:status/:requestId

# userRouter 
- Get /user/requests
- Get /user/connections
- Get /user/feed

status - interested  ignored  accepted  rejected