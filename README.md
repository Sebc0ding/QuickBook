# AI Appointment Booking Application

This application integrates React, GraphQL, MongoDB, and JWT authentication with Twilio for SMS, OpenAI for natural language processing, and Google Calendar for scheduling.

## Features

- User authentication (signup, login)
- Create, edit, and delete appointments
- AI-powered natural language appointment booking
- Google Calendar integration
- SMS notifications via Twilio
- Responsive UI with React Bootstrap

## Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd ai-appointment-booking
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create `.env` file in the server directory based on the `.env.example`
   - Create `.env` file in the client directory based on the `.env.example`

4. Start the development servers
   ```bash
   npm run develop
   ```

## Environment Variables

### Server
```
PORT=3001
MONGODB_URI=mongodb://localhost/ai-appointment-booking
JWT_SECRET=your_jwt_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
OPENAI_API_KEY=your_openai_api_key
GOOGLE_CLIENT_EMAIL=your_google_service_account_email
GOOGLE_PRIVATE_KEY=your_google_private_key
```

### Client
```
REACT_APP_GRAPHQL_URI=http://localhost:3001/graphql
```

## Deployment

This application is configured for deployment on Render. The `render.yaml` file includes the necessary configuration.

## Technologies Used

- **Frontend**: React, Apollo Client, React Bootstrap
- **Backend**: Express.js, Apollo Server, GraphQL, MongoDB, Mongoose
- **Authentication**: JWT
- **APIs**: Twilio, OpenAI, Google Calendar
- **Deployment**: Render
```

## 5. Final Setup Instructions

With all the code in place, here's how you can finalize your project:

```bash
npm install concurrently -D
```

This completes the implementation of your AI appointment booking application with React, GraphQL, MongoDB, JWT authentication, and integrations with Twilio, OpenAI, and Google Calendar. To run the application in development mode:

```bash
npm run develop
