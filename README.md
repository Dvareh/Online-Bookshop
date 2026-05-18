# Online Bookstore Application (English version)
    An online application for browsing and ordering books.
    
## Sprint Plan
### Sprint 1 (Week 1–2)
  Sprint goal: Set up project architecture and implement basic book catalog functionality.
  #### Backend:
    Initialize backend project
    Configure PostgreSQL database connection
    Create Book entity
    Implement BookRepository
    Implement BookService
    Implement BookController with endpoints:
        GET /books/get
        GET /books/get/{id}
        POST /books/add
        PUT /books/update/{id}
        DELETE /books/delete/{id}
        GET /books/get/page?page=x&size=x
  #### Frontend:
    Initialize frontend project
    Configure project structure
    Prepare UI mockups in Figma
    Create main page
    API integration:
        Fetch book list from backend
        Display books on main page
        Implement pagination
### Sprint 2 (Week 3-4)
  Sprint goal: Implement user authentication and management system
  #### Backend:
    Create User entity
    Implement UserRepository
    Implement UserService
    Implement DTOs:
    	RegisterRequest
            LoginRequest
            UserDTO
    Implement AuthController with endpoints:
            POST /auth/register
            POST /auth/login
    Implement UserController with endpoints:
            GET /users/get
            GET /users/get/{id}
            PUT /users/update/{id}
            DELETE /users/delete/{id}
    
    Security:
        Implement password encryption (BCrypt)
        Implement JWT authentication
        Configure Spring Security
    
    Roles:
        ROLE_USER
        ROLE_ADMIN
  #### Frontend:
    Create pages:
        LoginPage
        RegisterPage
        ProfilePage

    Integrate authentication API
    
    Features:
        Login / Registration
        Store JWT token
        Edit profile
        Delete account
### Sprint 3 (Week 5–6)
  Sprint goal: Extend book catalog with genres, search, pagination, sorting, and cover images.
  #### Backend:
    Implement Genre entity
    Update Book entity (Many-to-Many relationship with Genre)
    Add coverUrl field to Book
    Create book_genres join table
    Implement GenreRepository
    Implement GenreService
    Implement DTOs:
    	BookResponse
            BookSearchRequest
            GenreDTO
    
    Implement GenreController with endpoints:
            GET /genres/get
            POST /genres/add
            PUT /genres/update/{id}
            DELETE /genres/delete/{id}
    
    Extend BookController with endpoint:
            GET /books/search?sort=x,(desc,asc)&page=x&size=x
    
    Features:
    	Filter books by genre
    	Search books (by title and author)
    	Combine filters (search endpoint)
    	Sorting books
    
  #### Frontend:
    Tworzenie stron:
        BookDetailsPage  

    Features:
        Filter by genre
        Search books
        Display book details
        Fetch and display book covers (based on ISBN or title)

### Sprint 4 (Week 7-8)
  Sprint goal: Implement shopping cart, orders, and admin panel.
  #### Backend:

    Implement entities:
            Cart
            CartItem
            Order
            OrderItem
    
    Implement CartRepository
    Implement CartService
    Implement CartController with endpoints:
            GET /cart/get
            POST /cart/add
            PUT /cart/update
            DELETE /cart/delete/{id}
    
    Implement OrderRepository
    Implement OrderService
    Implement OrderController with endpoints:
            POST /orders/add
            GET /orders/get
            GET /orders/get/{id}
    
    Implement admin controllers:
            AdminOrderController:
                GET /admin/orders/get
                PUT /admin/orders/update/{id}
    
            AdminBookController:
                POST /admin/books/add
                PUT /admin/books/update/{id}
                DELETE /admin/books/delete/{id}
    
    Security:
            Restrict POST/PUT/DELETE in BookController to ROLE_ADMIN
            Restrict access to /admin/** (ROLE_ADMIN)
            Users can access only their own orders
    
    Business Logic:
            Validate stockQuantity before adding to cart
            Update stockQuantity after order
            Prevent purchase if out of stock

  #### Frontend:
    Create pages:
            CartPage
            CheckoutPage
            OrdersPage
            AdminPanelPage

    Admin Panel (ROLE_ADMIN):
            View books list
            Add books
            Edit books
            Delete books
            Manage orders (change status)
    
    Features:
            Shopping cart (add, remove, update quantity)
            Place orders
            Order history
            
## Authors
    Artiom Prilepschi - Backend developer
      
    Nazar Pavlenko - Frontend developer


## Technologies
    Frontend: 
        Next.js
        TypeScript
  
    Backend: 
        Spring Boot
        Spring Data JPA
        Lombok
        Spring Security + JWT
        Swagger / Springdoc OpenAPI
        Logback
  
    Database: PostgreSQL

## Functionalities
    Browse books
    Search and filter books
    View book details
    User authentication (login/register)
    Add books to cart
    Place orders
    Admin panel (manage books and orders)

## Architecture
    The application follows a client-server architecture:
        Frontend: Next.js (UI layer)
        Backend: Spring Boot (REST API)
        Database: PostgreSQL
        
    Communication via REST API using JSON.
    
## Installation
### Backend
    cd backend
    Configure application.properties
    mvn clean install
    
### Frontend
    cd frontend
    npm install

## Run Application
### Backend
    mvn spring-boot:run
    http://localhost:8080

### Frontend
    npm run dev
    http://localhost:3000

## User Guide
    1. Register or login
    2. Browse books
    3. Use search and filters
    4. Add books to cart
    5. Place an order
    6. (Admin) Manage books and orders

## Project Structure
    /backend - backend part of the project
    /frontend - frontend part of the project

## API Documentation
### Books API
Endpoints for managing and searching books.

**GET** `/books/search`  
Flexible book search (filters, pagination, sorting)

**GET** `/books/get/{id}`  
  Get book by ID


---

### Cart API
Shopping cart operations.

**GET** `/cart/get`  
Get current user's cart

**POST** `/cart/add`  
Add item to cart

**PUT** `/cart/update`  
Update cart item (quantity, etc.)

**DELETE** `/cart/delete/{id}`  
Remove item from cart


---

### Orders API
User order management.

**POST** `/orders/add`  
Create a new order

**GET** `/orders/get`  
Get all user orders

**GET** `/orders/get/{id}`  
Get order by ID


---

### User API
Endpoints for managing current user profile.

**GET** `/user/me/get`  
Get current user's profile

**PUT** `/user/me/update`  
Update current user's profile


---

### Authentication API
User authentication.

**POST** `/auth/register`  
Register a new user

**POST** `/auth/login`  
Login user


---

### Genre API
Endpoints for genre management.

**GET** `/genres/get`  
Get all genres

**GET** `/genres/get/{id}`  
Get genre by ID

**POST** `/genres/create`  
Create new genre

**PUT** `/genres/update/{id}`  
Update genre by ID

**DELETE** `/genres/delete/{id}`  
Delete genre by ID


---

### Admin APIs

#### Admin Book Controller
**POST** `/admin/books/add`  
Add new book

**PUT** `/admin/books/update/{id}`  
Update book by ID

**DELETE** `/admin/books/delete/{id}`  
Delete book by ID


#### Admin Order Controller
**GET** `/admin/orders/get`  
Get all orders

**PUT** `/admin/orders/update/{id}`  
Update order status


#### Admin User Controller
**GET** `/admin/user/get`  
Get all users

**GET** `/admin/user/get/{id}`  
Get user by ID

**PUT** `/admin/user/update/{id}`  
Update user by ID

**DELETE** `/admin/user/delete/{id}`  
Delete user by ID

## Screenshots
<img width="1920" height="1200" alt="изображение" src="https://github.com/user-attachments/assets/eeeeac9e-19ef-4192-8085-554b0d63e8c1" />
<img width="1920" height="1200" alt="изображение" src="https://github.com/user-attachments/assets/90609cb8-85c2-41e6-9b41-0fb9f576fefb" />
<img width="1920" height="1200" alt="изображение" src="https://github.com/user-attachments/assets/15382dd9-cece-478d-b2ca-782de573b10e" />
<img width="1920" height="1200" alt="изображение" src="https://github.com/user-attachments/assets/6cd213c5-6206-469e-a07f-d1a525585b56" />
<img width="1920" height="1200" alt="изображение" src="https://github.com/user-attachments/assets/31b06f75-db04-4e83-9866-92a0d2185b55" />
<img width="1280" height="800" alt="изображение" src="https://github.com/user-attachments/assets/5ab98df8-2cee-42c7-80ff-952686faa470" />

## Project Status
    Project completed as part of the "Projekt Zespołowy Systemu Informatycznego 2026" course

## License
    This project is licensed under the MIT License.
