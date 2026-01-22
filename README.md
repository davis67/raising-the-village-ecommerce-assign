# raising-the-village-ecommerce-assign
# E-Commerce Data Integration API

A Node.js/TypeScript REST API service that imports customer and order data from CSV files into MongoDB and provides endpoints to retrieve the combined data.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing with Postman](#testing-with-postman)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Design Decisions](#design-decisions)
- [Error Handling](#error-handling)

## Features

### Core Features (Must Have)
- ✅ CSV file upload for customers and orders
- ✅ Data validation before insertion
- ✅ MongoDB integration with Mongoose
- ✅ RESTful API endpoints for data retrieval
- ✅ Data transformation into unified JSON format
- ✅ Proper HTTP status codes and error handling
- ✅ TypeScript with full type safety
- ✅ Comprehensive README and setup instructions

### Additional Features (Nice to Have)
- ✅ Unit tests with Jest
- ✅ Request validation with custom validators
- ✅ Comprehensive logging with Winston
- ✅ Postman collection for testing
- ✅ Database indexing for performance
- ✅ Sample CSV files for testing
- ✅ Error tracking and logging

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **File Upload**: Multer
- **CSV Parsing**: csv-parser
- **Validation**: Custom validators
- **Logging**: Winston
- **Testing**: Jest
- **Development**: ts-node

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (v4.4 or higher)
  - Local installation or MongoDB Atlas connection string

## Setup Instructions

### 1. Install Dependencies

```bash
cd /Users/aghaba/Learning/RaisingTheVillage
npm install
```

### 2. Environment Configuration

Create or update `.env` file with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/ecommerce_db
NODE_ENV=development
PORT=3000
```

**Environment Variables:**
- `MONGODB_URI`: MongoDB connection string (default: local MongoDB)
- `NODE_ENV`: Application environment (development/production)
- `PORT`: Server port (default: 3000)

### 3. MongoDB Setup

**Option A: Local MongoDB**
```bash
# macOS with Homebrew
brew services start mongodb-community

# Verify connection
mongosh
```

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and get your connection string
3. Update `.env` with your MongoDB Atlas URI

### 4. Build TypeScript

```bash
npm run build
```

## Running the Application

### Development Mode
```bash
npm run dev
```

Server will start on `http://localhost:3000`

### Production Mode
```bash
npm run build
npm start
```

### Check Application Health
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "API is running",
  "timestamp": "2024-01-19T10:30:00.000Z"
}
```

## API Endpoints

### 1. Upload Customers (POST)
**Endpoint**: `POST /api/upload/customers`

**Description**: Upload and import customers from a CSV file

**Request**:
- Content-Type: multipart/form-data
- Field: `file` (CSV file)

**CSV Format**:
```csv
customer_id,name,email,country,signup_date
1,John Doe,john@example.com,USA,2024-01-15
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Successfully imported 3 customers",
  "recordsProcessed": 3,
  "recordsFailed": 0
}
```

**Response** (Validation Error - 400):
```json
{
  "success": false,
  "message": "No valid customer records found",
  "errors": [
    "Row 2: Email format is invalid"
  ]
}
```

### 2. Upload Orders (POST)
**Endpoint**: `POST /api/upload/orders`

**Description**: Upload and import orders from a CSV file

**Request**:
- Content-Type: multipart/form-data
- Field: `file` (CSV file)

**CSV Format**:
```csv
order_id,customer_id,product_name,amount,order_date,status
101,1,Laptop,999.99,2024-05-01,completed
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Successfully imported 4 orders",
  "recordsProcessed": 4,
  "recordsFailed": 0
}
```

### 3. Get Single Customer (GET)
**Endpoint**: `GET /api/customers/:id`

**Description**: Retrieve a specific customer with all their orders

**Parameters**:
- `id`: Customer ID (path parameter)

**Response** (Success - 200):
```json
{
  "customer": {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "country": "USA",
    "signupDate": "2024-01-15"
  },
  "orderSummary": {
    "totalOrders": 2,
    "totalSpent": 1029.98,
    "orders": [
      {
        "orderId": "101",
        "productName": "Laptop",
        "amount": 999.99,
        "orderDate": "2024-05-01",
        "status": "completed"
      },
      {
        "orderId": "102",
        "productName": "Mouse",
        "amount": 29.99,
        "orderDate": "2024-05-15",
        "status": "completed"
      }
    ]
  }
}
```

**Response** (Not Found - 404):
```json
{
  "success": false,
  "message": "Customer with ID 999 not found"
}
```

### 4. Get All Customers (GET)
**Endpoint**: `GET /api/customers`

**Description**: Retrieve all customers with their aggregated order data

**Query Parameters**:
- `sortBySpent` (optional): Set to `true` to sort customers by total spent (descending)

**Response** (Success - 200):
```json
{
  "success": true,
  "data": [
    {
      "customer": {
        "id": "1",
        "name": "John Doe",
        "email": "john@example.com",
        "country": "USA",
        "signupDate": "2024-01-15"
      },
      "orderSummary": {
        "totalOrders": 2,
        "totalSpent": 1029.98,
        "orders": [...]
      }
    }
  ],
  "count": 3
}
```

## Testing with Postman

### Import Postman Collection

1. Open Postman
2. Click "Import" button
3. Select `E-Commerce-API.postman_collection.json`
4. All endpoints will be automatically configured

### Manual Testing Steps

1. **Start the server**: `npm run dev`

2. **Upload Customers**:
   - POST `/api/upload/customers`
   - Select `sample-data/customers.csv` in the file field
   - Send request

3. **Upload Orders**:
   - POST `/api/upload/orders`
   - Select `sample-data/orders.csv` in the file field
   - Send request

4. **Get Single Customer**:
   - GET `/api/customers/1`
   - Review the response with customer details and orders

5. **Get All Customers**:
   - GET `/api/customers`
   - GET `/api/customers?sortBySpent=true` (sorted by spending)

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- DataService.test.ts
```

**Test Coverage**:
- Data transformation logic
- CSV validation
- Email format validation
- Date format validation
- Order summary calculations
- Customer sorting by total spent

## Project Structure

```
RaisingTheVillage/
├── src/
│   ├── controllers/
│   │   ├── UploadController.ts      # CSV upload handling
│   │   └── CustomerController.ts    # Customer data retrieval
│   ├── models/
│   │   ├── Customer.ts              # Customer Mongoose schema
│   │   └── Order.ts                 # Order Mongoose schema
│   ├── routes/
│   │   ├── uploadRoutes.ts          # Upload endpoints
│   │   └── customerRoutes.ts        # Customer endpoints
│   ├── services/
│   │   └── DataService.ts           # Business logic for data operations
│   ├── middleware/
│   │   └── uploadMiddleware.ts      # Multer configuration
│   ├── utils/
│   │   ├── csvParser.ts             # CSV parsing logic
│   │   ├── validators.ts            # Data validation
│   │   ├── logger.ts                # Winston logger setup
│   │   └── database.ts              # MongoDB connection
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   └── index.ts                     # Main application entry
├── __tests__/
│   ├── services/
│   │   └── DataService.test.ts      # Data service tests
│   └── utils/
│       └── validators.test.ts       # Validator tests
├── sample-data/
│   ├── customers.csv                # Sample customer data
│   └── orders.csv                   # Sample order data
├── .env                             # Environment variables
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── jest.config.js                   # Jest configuration
├── E-Commerce-API.postman_collection.json  # Postman collection
└── README.md                        # This file
```

## Design Decisions

### 1. Data Validation
- **Custom validators** instead of heavy libraries for lightweight validation
- Validation occurs **before** database insertion
- Detailed error messages with row numbers for easier debugging
- Email format validation using regex
- Date format validation (YYYY-MM-DD)

### 2. CSV Parsing
- **csv-parser** library chosen for:
  - Stream-based parsing for memory efficiency
  - Simple and reliable CSV handling
  - Good error handling
- Memory storage with Multer to avoid disk operations

### 3. Database Design
- **Customer Schema**:
  - `customerId`: Unique identifier (indexed for fast lookups)
  - `email`: Lowercase stored (indexed)
  - Auto timestamps for audit trail
- **Order Schema**:
  - `customerId`: Indexed for efficient customer lookups
  - `orderId`: Unique identifier
  - Composite index on `(customerId, orderDate)` for common queries
  - Enum validation for order status

### 4. Error Handling
- **Comprehensive validation**: CSV data validation with specific error messages
- **Duplicate handling**: Skip duplicates but track and report them
- **HTTP Status Codes**:
  - 200: Successful operation
  - 400: Bad request (validation errors)
  - 404: Resource not found
  - 500: Server error

### 5. Performance Optimizations
- **Database indexes**: On frequently queried fields
- **Composite indexes**: For common query patterns
- **Service layer**: Centralized business logic
- **Stream-based CSV parsing**: Memory efficient

### 6. Logging
- **Winston logger**: Tracks all operations
- **Log levels**: Different levels for development/production
- **File rotation**: Error and combined logs stored

## Error Handling

### Common Error Scenarios

1. **Invalid CSV Format**
   - Missing required fields
   - Incorrect data types
   - Invalid email format
   - Invalid date format

2. **Duplicate Records**
   - Existing customer_id or order_id
   - Gracefully skipped with warning

3. **File Upload Errors**
   - File size exceeds 10MB limit
   - Not a CSV file
   - No file provided

4. **Database Errors**
   - Connection failures
   - Validation constraint violations

### Error Response Format
```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": ["Error 1", "Error 2"]
}
```

## Troubleshooting

### MongoDB Connection Issues
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running
```bash
brew services start mongodb-community  # macOS
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**: Change PORT in .env or kill the process:
```bash
lsof -i :3000
kill -9 <PID>
```

### CSV Parsing Errors
**Solution**: Ensure CSV format matches expected columns with correct headers

## Future Enhancements

- [ ] Transaction support for multi-document operations
- [ ] Advanced filtering and search functionality
- [ ] Rate limiting and request throttling
- [ ] Authentication and authorization
- [ ] API versioning
- [ ] GraphQL endpoint
- [ ] Real-time notifications with WebSocket
- [ ] Data export functionality
- [ ] Advanced analytics and reporting

## License

ISC

## Contact

For questions or issues, please create an issue in the repository.
