# Milk Mug SaaS Boilerplate

Milk Mug is a powerful SaaS boilerplate that provides a solid foundation for building and launching your own Software-as-a-Service product. This boilerplate combines a robust FastAPI backend with a sleek React frontend, offering essential features like user authentication, payment processing, and credit-based access control.

## Features

- User authentication (registration, login, password reset)
- Email verification
- Google OAuth integration
- Credit card and PIX payment processing using Mercado Pago
- Credit-based access control for premium features
- Multilingual support (English, Spanish, Portuguese)
- Responsive Material-UI design
- Dark mode support

## Tech Stack

- Backend: FastAPI, MongoDB, JWT authentication
- Frontend: React, TypeScript, Material-UI, i18next
- Payment Processing: Mercado Pago
- Email: SMTP integration

## Setup Guide

### Prerequisites

- Python 3.8+
- Node.js 14+
- MongoDB instance
- Mercado Pago account
- SMTP server for email sending

### Backend Setup

1. Navigate to the `backend` directory
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Set up your `.env` file in the `backend` directory:
   ```
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   SOFTWARE_NAME=your_software_name
   COMPANY_NAME=your_company_name
   MERCADO_PAGO_ACCESS_TOKEN=your_mercado_pago_access_token
   MERCADO_PAGO_PUBLIC_KEY=your_mercado_pago_public_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   SMTP_SERVER=your_smtp_server
   SMTP_PORT=your_smtp_port
   SMTP_USERNAME=your_smtp_username
   SMTP_PASSWORD=your_smtp_password
   EMAIL_FROM=your_email_from_address
   BASE_URL=your_frontend_base_url
   ```
4. Run the backend server:
   ```
   cd app
   python main.py
   ```

### Frontend Setup

1. Navigate to the `frontend` directory
2. Install dependencies:
   ```
   npm install
   ```
3. Set up your `.env` file in the `frontend` directory:
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```
4. Run the frontend development server:
   ```
   npm run dev
   ```

## Usage Guide

### User Registration and Authentication

1. Users can register using the `/register` page
2. After registration, users receive a verification email
3. Users can log in using the `/login` page
4. Password reset functionality is available through the "Forgot Password" link

### Payment Processing

1. Implement payment forms using the Mercado Pago SDK
2. Use the `/payment/create_payment` endpoint to process payments
3. Handle payment webhooks using the `/payment/webhook` endpoint

### Credit-Based Access Control

1. Assign credits to users upon successful payments
2. Use the `check_and_deduct_credits` function to control access to premium features

### Multilingual Support

1. Add new translations to the JSON files in the `frontend/locales` directory
2. Use the `useTranslation` hook in React components to display translated text

### Customization

1. Modify the `MainTheme.ts` file to customize the application's look and feel
2. Add new routes in the `App.tsx` file for additional pages
3. Extend the backend by adding new routes in the `routers` directory

## API Documentation

Access the API documentation at:
- Swagger UI: `http://localhost:8000/swagger`
- ReDoc: `http://localhost:8000/redoc`

## Deployment

1. Build the frontend:
   ```
   cd frontend
   npm run build
   ```
2. Deploy the backend to a suitable hosting platform (e.g., Heroku, DigitalOcean)
3. Set up a production MongoDB instance
4. Configure environment variables on your hosting platform
5. Deploy the frontend build to a static hosting service (e.g., Netlify, Vercel)

## Support

For any questions or issues, please contact our support team at support@milkmug.com.

## License

This is a commercial product. Please refer to the license agreement provided with your purchase for terms of use.
