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
- post /request/send/interested/:userId
- post /request/send/ignored/:userId
- post /request/review/accepted/:userId
- post /request/review/rejected/:userId

# userRouter 
- Get /user/connections
- Get /user/requests
- Get /user/feed

status - interested  ignored  accepted  rejected