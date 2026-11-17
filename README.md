# 🍽️ DineFlow – Restaurant Management & QR-Based Ordering System

**A Full-Stack Restaurant Management Platform with QR Code-Based Food Ordering, Kitchen Management, Billing, and Sales Reports.**

DineFlow is a full-stack Restaurant Management System designed to simplify restaurant operations and improve the dining experience through digital ordering and centralized management.

The application allows customers to scan a QR code placed on their dining table, browse the restaurant menu, select food items, add them to their cart, and place orders without requiring traditional manual ordering.

It also provides an administrator dashboard to manage restaurant menus, categories, tables, customer orders, kitchen operations, billing, and business reports.

The application is developed using **React.js for the frontend, Java Spring Boot for the backend, and PostgreSQL for database management**. REST APIs enable communication between the frontend and backend.

---

## 📌 Table of Contents

1. Project Overview
2. Key Features
3. Technologies Used
4. System Architecture
5. Project Structure
6. Application Modules
7. Customer Ordering Workflow
8. Administrator Workflow
9. Database Management
10. REST API Endpoints
11. Prerequisites
12. Installation and Setup
13. Running the Application
14. API Testing
15. Security Implementation
16. Future Enhancements
17. Author

---

## 1. Project Overview

DineFlow provides a digital solution for restaurant ordering and management.

Traditional restaurant operations often involve manual menu distribution, handwritten orders, communication between waiters and kitchen staff, and manual billing.

DineFlow simplifies these operations by introducing QR-based ordering and a centralized restaurant management dashboard.

Customers can:
- Scan a QR code available on their dining table.
- Access the digital restaurant menu.
- Browse food items by category.
- View food descriptions, images, and prices.
- Filter dishes based on vegetarian and non-vegetarian preferences.
- Add food items to their shopping cart.
- Place orders directly from their devices.
- Track their order status using an order reference.

Administrators can:
- Manage food categories.
- Add, update, and delete dishes.
- Manage restaurant tables.
- Generate and regenerate table QR codes.
- View and manage customer orders.
- Monitor kitchen operations.
- Update food preparation and order statuses.
- Generate customer bills.
- Record payment status.
- View restaurant sales reports.

The application provides an integrated platform for managing restaurant operations efficiently.

---

## 2. Key Features

### 🍴 Customer Features

**QR Code-Based Table Ordering**
- Each restaurant table has a unique QR code.
- Customers can scan the QR code to access the digital menu.
- Table information is identified through the QR code token or table number.
- Customers can place orders without creating an account or logging in.

**Digital Food Menu**
- Browse food items by category.
- View food images and descriptions.
- Display individual dish prices.
- View preparation time.
- Identify vegetarian and non-vegetarian dishes.
- Display featured food items.
- Filter available food items.

**Shopping Cart**
- Add food items to the cart.
- Increase or decrease item quantities.
- Remove items from the cart.
- Review selected dishes.
- Calculate the total order amount.

**Online Food Ordering**
- Place orders directly from the table.
- Submit customer and order details.
- Associate orders with the respective restaurant table.
- Generate a unique order number.
- Send orders to the restaurant's kitchen workflow.

**Order Tracking**
- Track orders using a unique order number.
- View order information.
- Check order preparation status.
- Monitor order progress.

### 🛠️ Administrator Features

**Administrator Authentication**
- Dedicated administrator login page.
- JWT-based authentication.
- Protected administrator dashboard.
- Secure access to management operations.

**Dashboard Management**
- View restaurant management information.
- Monitor order statistics.
- View menu statistics.
- Access different administrative modules.

**Category Management**
- Create new food categories.
- View existing categories.
- Update category information.
- Delete categories.

**Food Menu Management**
- Add new dishes.
- Update dish details.
- Delete dishes.
- Upload food images.
- Set dish prices and descriptions.
- Configure vegetarian or non-vegetarian classification.
- Update food availability.
- Configure preparation time and spice level.
- Mark selected dishes as featured.

**Restaurant Table Management**
- Create restaurant tables.
- Configure table numbers and seating capacity.
- View table information.
- Update table details.
- Delete tables.
- Generate table QR codes.
- Regenerate QR code tokens.

**Order Management**
- View customer orders.
- Filter orders by status.
- View order details.
- Update order status.
- Monitor order progress.

**Kitchen Management**
- View active kitchen orders.
- Monitor individual food item preparation.
- Update individual item preparation status.
- Update overall order status.
- View kitchen statistics.
- Organize kitchen operations based on order status.

**Billing Management**
- Generate bills using order IDs.
- Retrieve bills using order numbers.
- View order billing information.
- Record payment status.

**Reports and Analytics**
- Access restaurant report summaries.
- View order-related statistics.
- Monitor restaurant business performance.

---

## 3. Technologies Used

### Frontend Technologies

| Technology | Purpose |
|---|---|
| React.js 19 | Building the user interface |
| JavaScript | Frontend application logic |
| Vite | Frontend development server and build tool |
| React Router DOM | Client-side navigation |
| Axios | Communicating with backend REST APIs |
| Tailwind CSS | Styling and responsive layouts |
| React Icons | Application icons |
| React Hot Toast | Notifications and alerts |
| qrcode.react | QR code rendering |
| HTML5 | Web page structure |
| CSS3 | Custom styling |

### Backend Technologies

| Technology | Purpose |
|---|---|
| Java 17 | Backend programming language |
| Spring Boot 3.2.5 | Backend application framework |
| Spring Web | Developing REST APIs |
| Spring Data JPA | Database operations |
| Spring Security | Authentication and access protection |
| Hibernate | Object-relational mapping |
| JWT | Token-based authentication |
| BCrypt | Password hashing |
| Maven | Dependency and project management |
| Lombok | Reducing boilerplate Java code |
| ZXing | QR code generation |

### Database and Testing

| Technology | Purpose |
|---|---|
| PostgreSQL | Relational database management |
| Postman | REST API testing |
| Git | Version control |
| GitHub | Source code hosting |

---

## 4. System Architecture

DineFlow follows a layered architecture consisting of the frontend, backend, and database.

### Architecture Overview

```text
             CUSTOMER
                 |
                 |
           Scan Table QR
                 |
                 v
       +--------------------+
       |   React Frontend   |
       |     Vite :5173     |
       +--------------------+
                 |
                 |
             Axios API
                 |
                 v
       +--------------------+
       |  Spring Boot API   |
       |      :8085         |
       +--------------------+
                 |
                 v
       +--------------------+
       |  Controller Layer  |
       +--------------------+
                 |
                 v
       +--------------------+
       |   Service Layer    |
       +--------------------+
                 |
                 v
       +--------------------+
       | Repository Layer   |
       |  Spring Data JPA   |
       +--------------------+
                 |
                 v
       +--------------------+
       |   PostgreSQL DB    |
       +--------------------+
```

### Frontend Layer

The frontend is developed using React.js and Vite.

It provides:
- Customer home page.
- QR-based menu page.
- Shopping cart.
- Order tracking page.
- Administrator login.
- Administrator dashboard.
- Menu management.
- Table management.
- Order management.
- Kitchen management.
- Billing and reports.

Axios handles communication between the frontend and backend.

The Vite development server forwards `/api` requests to the Spring Boot backend running on port 8085.

### Backend Layer

The backend is developed using Java and Spring Boot.

It handles:
- Administrator authentication.
- JWT generation and validation.
- Food category management.
- Dish management.
- Restaurant table management.
- QR code generation.
- Customer order processing.
- Kitchen order management.
- Billing operations.
- Report generation.
- File uploads.

### Database Layer

PostgreSQL stores:
- Administrator information.
- Food categories.
- Dish details.
- Restaurant tables.
- Customer orders.
- Individual order items.
- Payment status.
- QR code tokens.

Spring Data JPA and Hibernate handle database operations.

---

## 5. Project Structure

The project maintains separate frontend and backend directories within one GitHub repository.

```text
DineFlow/
│
├── dineflow-frontend/
│   │
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── src/
│   │   │
│   │   ├── api/
│   │   │   ├── axios.js
│   │   │   ├── adminOrders.js
│   │   │   ├── billing.js
│   │   │   ├── kitchen.js
│   │   │   ├── menu.js
│   │   │   ├── orders.js
│   │   │   └── tables.js
│   │   │
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── CategoryModal.jsx
│   │   │   ├── DishCard.jsx
│   │   │   ├── DishModal.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Sidebar.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── CustomerMenu.jsx
│   │   │   ├── CustomerCart.jsx
│   │   │   ├── CustomerOrderTrack.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminMenu.jsx
│   │   │   ├── AdminTables.jsx
│   │   │   ├── AdminOrders.jsx
│   │   │   ├── AdminKitchen.jsx
│   │   │   ├── AdminBilling.jsx
│   │   │   ├── AdminReports.jsx
│   │   │   └── NotFound.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── dineflow-backend/
│   │
│   ├── src/
│   │   └── main/
│   │       │
│   │       ├── java/
│   │       │   └── com/dineflow/
│   │       │       │
│   │       │       ├── config/
│   │       │       ├── controller/
│   │       │       ├── dto/
│   │       │       ├── entity/
│   │       │       ├── repository/
│   │       │       ├── security/
│   │       │       └── service/
│   │       │
│   │       └── resources/
│   │           └── application.properties
│   │
│   ├── pom.xml
│   └── uploads/
│
└── README.md
```

### Backend Package Responsibilities

| Package | Responsibility |
|---|---|
| config | Application configuration and initial data setup |
| controller | REST API endpoints |
| dto | Request and response objects |
| entity | Database entity classes |
| repository | Database access operations |
| security | JWT authentication and security configuration |
| service | Application business logic |

---

## 6. Application Modules

### 6.1 Authentication Module

Manages administrator registration and login.

- Administrator registration.
- Administrator login.
- JWT token generation.
- JWT token validation.
- Current administrator information retrieval.
- Password encryption using BCrypt.

### 6.2 Menu Management Module

Manages restaurant food items.

- Add dishes.
- Retrieve dishes.
- Update dish information.
- Delete dishes.
- Change food availability.
- Upload food images.
- Manage food categories.

### 6.3 Table Management Module

Manages restaurant dining tables.

- Create tables.
- Retrieve table details.
- Update table information.
- Delete tables.
- Generate QR codes.
- Regenerate QR tokens.
- Resolve table information using QR tokens or table numbers.

### 6.4 Order Management Module

Handles customer food orders.

- Place customer orders.
- Generate unique order numbers.
- Retrieve order information.
- Track customer orders.
- Retrieve orders associated with a table.
- Update order status.

### 6.5 Kitchen Management Module

Provides a centralized kitchen workflow.

- Retrieve active kitchen orders.
- View preparation status.
- Update individual dish-item status.
- Update overall order status.
- Retrieve kitchen statistics.

### 6.6 Billing Module

Handles restaurant billing operations.

- Generate bills using order IDs.
- Retrieve bills using order numbers.
- Record payment status.
- Retrieve billing information.

### 6.7 Reports Module

Provides restaurant management reports.

- Retrieve report summaries.
- View order-related statistics.
- Monitor restaurant performance.

### 6.8 QR Code Module

Uses the ZXing library to generate QR codes.

- Generate QR codes for restaurant tables.
- Generate QR code images in PNG format.
- Generate QR code data in Base64 format.
- Regenerate QR tokens for existing tables.

---

## 7. Customer Ordering Workflow

### Step 1: Scan the Table QR Code

Each restaurant table has a unique QR code.

The customer scans the QR code using a mobile phone camera.

The QR code directs the customer to the corresponding table menu.

### Step 2: Access the Digital Menu

The frontend identifies the selected table and displays the restaurant's digital menu.

Customers can browse food categories, dish images, descriptions, prices, and availability.

### Step 3: Add Items to Cart

Customers select their preferred dishes and add them to the shopping cart.

The cart maintains the selected items and quantities.

### Step 4: Place the Order

After reviewing the cart, the customer places the order.

The frontend sends the order details to the Spring Boot backend through a REST API.

### Step 5: Backend Order Processing

The backend:
1. Validates the order request.
2. Processes the selected food items.
3. Calculates the order total.
4. Associates the order with the restaurant table.
5. Generates a unique order number.
6. Stores the order information in PostgreSQL.

### Step 6: Kitchen Processing

The order becomes available in the administrator's kitchen dashboard.

Kitchen staff can monitor the order and update preparation statuses.

### Step 7: Order Tracking

Customers can use the unique order number to retrieve their order information and check its current status.

---

## 8. Administrator Workflow

### Step 1: Administrator Login

The administrator accesses the dedicated login page.

After successful authentication, the backend generates a JWT token.

The frontend uses this token when accessing protected administrator APIs.

### Step 2: Dashboard

The administrator accesses the centralized management dashboard.

### Step 3: Manage Categories and Dishes

The administrator can create categories, add dishes, update food information, upload images, and change availability.

### Step 4: Manage Restaurant Tables

The administrator can create dining tables and generate QR codes for each table.

The QR codes can be used by customers to access the digital menu.

### Step 5: Manage Orders

The administrator can view customer orders and update their statuses.

### Step 6: Kitchen Operations

The kitchen dashboard displays active orders and individual item preparation statuses.

### Step 7: Billing

The administrator can generate bills and record payment status.

### Step 8: Reports

The administrator can access restaurant report summaries and business statistics.

---

## 9. Database Management

DineFlow uses PostgreSQL as its relational database.

The backend uses Spring Data JPA and Hibernate for database operations.

The main database entities include:

| Entity | Description |
|---|---|
| Admin | Stores administrator information |
| Category | Stores food category information |
| Dish | Stores restaurant menu items |
| RestaurantTable | Stores restaurant table information |
| Order | Stores customer order information |
| OrderItem | Stores individual dishes within an order |

### Database Relationships

**Category and Dish**

One food category can contain multiple dishes.

**RestaurantTable and Order**

A restaurant table can be associated with multiple customer orders.

**Order and OrderItem**

One order can contain multiple individual food items.

### Important Database Concepts

- Primary keys identify individual database records.
- Foreign keys maintain relationships between entities.
- Hibernate maps Java entity classes to database tables.
- Spring Data JPA provides database access methods.
- Transaction management helps maintain consistency during important operations.

### Initial Database Data

The application includes a `DataInitializer` class that initializes:

- A default administrator account.
- Sample restaurant food categories.
- Sample food items.
- Eight restaurant dining tables with generated QR tokens.

Initial data is inserted when the corresponding tables are empty.

---

## 10. REST API Endpoints

The Spring Boot backend exposes REST APIs under the `/api` base path.

### Authentication APIs

| HTTP Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register an administrator |
| POST | `/api/auth/login` | Administrator login |
| GET | `/api/auth/me` | Retrieve current administrator information |

### Category APIs

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/api/categories` | Retrieve all categories |
| GET | `/api/categories/{id}` | Retrieve category details |
| POST | `/api/admin/categories` | Create a category |
| PUT | `/api/admin/categories/{id}` | Update a category |
| DELETE | `/api/admin/categories/{id}` | Delete a category |

### Dish APIs

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dishes` | Retrieve dishes |
| GET | `/api/dishes/{id}` | Retrieve dish details |
| GET | `/api/admin/menu/stats` | Retrieve menu statistics |
| POST | `/api/admin/dishes` | Add a new dish |
| PUT | `/api/admin/dishes/{id}` | Update dish information |
| PATCH | `/api/admin/dishes/{id}/availability` | Update dish availability |
| DELETE | `/api/admin/dishes/{id}` | Delete a dish |

### Table APIs

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tables/resolve/{tokenOrNumber}` | Resolve table information |
| GET | `/api/tables/{id}/qrcode` | Generate QR code image |
| GET | `/api/tables/{id}/qrcode/base64` | Generate QR code in Base64 |
| GET | `/api/admin/tables` | Retrieve restaurant tables |
| POST | `/api/admin/tables` | Create a table |
| PUT | `/api/admin/tables/{id}` | Update table information |
| DELETE | `/api/admin/tables/{id}` | Delete a table |
| POST | `/api/admin/tables/{id}/regenerate-qr` | Regenerate table QR code |

### Order APIs

| HTTP Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Place a customer order |
| GET | `/api/orders/track/{orderNumber}` | Track an order |
| GET | `/api/orders/session/{sessionId}` | Retrieve customer session orders |
| GET | `/api/orders/table/{tableNumber}` | Retrieve active table orders |
| GET | `/api/admin/orders` | Retrieve all orders |
| PATCH | `/api/admin/orders/{id}/status` | Update order status |

### Kitchen APIs

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/kitchen/orders` | Retrieve active kitchen orders |
| PATCH | `/api/admin/kitchen/orders/{orderId}/status` | Update order status |
| PATCH | `/api/admin/kitchen/items/{itemId}/status` | Update individual item status |
| GET | `/api/admin/kitchen/stats` | Retrieve kitchen statistics |

### Billing APIs

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/billing/order/{orderId}` | Generate bill using order ID |
| GET | `/api/admin/billing/order/number/{orderNumber}` | Generate bill using order number |
| PATCH | `/api/admin/billing/order/{orderId}/pay` | Record payment status |

### Reports APIs

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/reports/summary` | Retrieve restaurant report summary |

### File Upload API

| HTTP Method | Endpoint | Description |
|---|---|---|
| POST | `/api/admin/upload` | Upload restaurant images |

### Authentication Header

Protected administrator API requests require a JWT token.

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 11. Prerequisites

Install the following software before running the project.

| Software | Requirement |
|---|---|
| Java JDK | 17 or later |
| Node.js | 18 or later |
| npm | Included with Node.js |
| PostgreSQL | Installed and running |
| Apache Maven | Maven 3.6+ |
| Git | Latest version |
| Postman | Optional for API testing |

Verify the installations:

```bash
java -version
```

```bash
node -v
```

```bash
npm -v
```

```bash
mvn -v
```

---

## 12. Installation and Setup

### Step 1: Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate to the project directory:

```bash
cd DineFlow
```

### Step 2: Create PostgreSQL Database

Open PostgreSQL or pgAdmin.

Execute:

```sql
CREATE DATABASE dineflow;
```

### Step 3: Configure Backend

Navigate to the backend folder:

```bash
cd dineflow-backend
```

Open `src/main/resources/application.properties`.

For local development, configure the following environment-variable-based properties:

```properties
# Server
server.port=8085

# PostgreSQL
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/dineflow}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD}

spring.datasource.driver-class-name=org.postgresql.Driver

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# JWT
app.jwt.secret=${JWT_SECRET}
app.jwt.expiration=${JWT_EXPIRATION:86400000}

# CORS
app.cors.allowed-origins=${CORS_ORIGINS:http://localhost:5173}
```

Set the following environment variables:

```text
DB_URL=jdbc:postgresql://localhost:5432/dineflow
DB_USERNAME=postgres
DB_PASSWORD=your_database_password

JWT_SECRET=your_base64_encoded_secret
JWT_EXPIRATION=86400000

CORS_ORIGINS=http://localhost:5173
```

The JWT secret must be a Base64-encoded secret with at least 32 decoded bytes.

**Important:** Replace all placeholder values with your own credentials. Never upload actual passwords or secret keys to GitHub.

### Step 4: Install Backend Dependencies

Run:

```bash
mvn clean install
```

### Step 5: Configure Frontend

Open another terminal.

Navigate to:

```bash
cd dineflow-frontend
```

The frontend uses the Vite proxy configured in `vite.config.js`.

API requests beginning with `/api` are automatically forwarded to:

```text
http://localhost:8085
```

Therefore, the default local development configuration does not require a separate frontend API URL.

### Step 6: Install Frontend Dependencies

Run:

```bash
npm install
```

---

## 13. Running the Application

Both frontend and backend must run simultaneously.

### Start Backend

Open the backend terminal:

```bash
cd dineflow-backend
```

Execute:

```bash
mvn spring-boot:run
```

The backend will start at:

```text
http://localhost:8085
```

### Start Frontend

Open another terminal:

```bash
cd dineflow-frontend
```

Execute:

```bash
npm run dev
```

The frontend will start at:

```text
http://localhost:5173
```

### Access the Application

**Customer Home Page**

```text
http://localhost:5173/
```

**Administrator Login**

```text
http://localhost:5173/admin/login
```

**Administrator Dashboard**

```text
http://localhost:5173/admin/dashboard
```

**Customer Table Menu**

```text
http://localhost:5173/table/T-01
```

Replace `T-01` with the required restaurant table number.

**Order Tracking**

```text
http://localhost:5173/order/track/ORDER_NUMBER
```

The customer can use the generated order number to track their order.

---

## 14. API Testing

Postman can be used to test the backend REST APIs.

### Testing Steps

1. Open Postman.
2. Start the Spring Boot backend.
3. Register an administrator if required.
4. Log in using administrator credentials.
5. Retrieve the JWT token from the login response.
6. Add the JWT token to the Authorization header for protected endpoints.
7. Test category creation and retrieval.
8. Test dish creation and updates.
9. Test restaurant table management.
10. Test QR code generation.
11. Place a customer order.
12. Retrieve order information.
13. Update order and kitchen statuses.
14. Test bill generation and payment status.
15. Retrieve restaurant report summaries.

---

## 15. Security Implementation

The backend uses Spring Security and JWT for authentication.

### JWT Authentication

After successful administrator login, the backend generates a JWT token.

The frontend stores the token in localStorage and automatically attaches it to API requests using an Axios request interceptor.

### Password Encryption

BCrypt is used to hash administrator passwords before storing them in PostgreSQL.

### Protected Routes

The React application uses a `ProtectedRoute` component to protect administrator dashboard pages.

The backend uses Spring Security to require authentication for protected administrator API endpoints.

### Stateless Authentication

The application uses stateless session management with JWT-based authentication.

### CORS Configuration

Cross-Origin Resource Sharing is configured to allow communication between the React frontend and Spring Boot backend.

---

## 16. Future Enhancements

The following features can be considered for future versions:

- Online payment gateway integration.
- Customer feedback and ratings.
- Waiter management and service tracking.
- Real-time kitchen notifications.
- WebSocket-based order status updates.
- Customer order history.
- Email and SMS notifications.
- Multiple restaurant support.
- Inventory and stock management.
- Advanced sales analytics.
- Mobile application integration.
- Cloud deployment.

---

## 17. Author

**Developed as a Full-Stack Development Project.**

**Technologies:** React.js | Java | Spring Boot | PostgreSQL | Spring Security | JWT | Hibernate | REST APIs | QR Code Generation

---

## ⭐ Support

If you find this project useful, consider giving the repository a star on GitHub.

Thank you for visiting DineFlow – Restaurant Management & QR-Based Ordering System!
