CREATE DATABASE eCommerce

--TABLES

CREATE TABLE categories(
    c_id SERIAL PRIMARY KEY,
    c_name VARCHAR(30) NOT NULL UNIQUE,
    c_img BYTEA NULL,
); 

CREATE TABLE products(
    p_id SERIAL PRIMARY Key,
    p_title VARCHAR(256) NOT NULL,
    p_regularPrice INT NOT NULL,
    p_salePrice INT NULL,
    p_sDesc VARCHAR(712) NOT NULL,
    p_lDesc VARCHAR(1500) Null
);

CREATE TABLE productCategory (
    c_id INT NOT NULL,
    p_id INT NOT NULL UNIQUE,
    FOREIGN KEY (c_id) REFERENCES categories(c_id) ON DELETE CASCADE,
    FOREIGN KEY (p_id) REFERENCES products(p_id) ON DELETE CASCADE
);

CREATE TABLE productImg(
    p_id INT NOT NULL,
    p_img1 BYTEA NULL,
    p_img2 BYTEA NULL,
    p_img3 BYTEA NULL,
    p_img4 BYTEA NULL,
    FOREIGN KEY (p_id) REFERENCES products(p_id) ON DELETE CASCADE
);

CREATE TABLE account (
    a_id SERIAL PRIMARY KEY,
    a_name VARCHAR(50) NOT NULL,
    a_username VARCHAR(50) NOT NULL,
    a_password VARCHAR(256) NOT NULL,
    a_type INT DEFAULT 0 NOT NULL,
    a_email VARCHAR(50) NOT NULL
);

CREATE TABLE customer (
	c_id SERIAL PRIMARY KEY,
	c_name VARCHAR(50) NOT NULL,
	c_phone VARCHAR(20) NOT NULL,
	c_email VARCHAR(50) NOT NULL,
	c_country VARCHAR(30) NOT NULL,
	c_city VARCHAR(30) NOT NULL,
	c_street VARCHAR(200) NOT NULL
    a_id INT NOT NULL,
    FOREIGN KEY (a_id) REFERENCES account(a_id)
)

CREATE TABLE orders (
    o_id SERIAL PRIMARY KEY,
    o_status VARCHAR(20) DEFAULT 'PENDING' NOT NULL,
    c_id INT NOT NULL,
    FOREIGN KEY (c_id) REFERENCES customer(c_id)
); 

CREATE TABLE orderDetail (
    p_id INT NOT NULL,
    p_quantity INT DEFAULT 1 NOT NULL,
    o_id INT NOT NULL,
    priceIntoQuantity INT NOT NULL,
    FOREIGN KEY (p_id) REFERENCES products(p_id) ON DELETE CASCADE,
    FOREIGN KEY (o_id) REFERENCES orders(o_id)
);

CREATE TABLE review (
    r_id SERIAL PRIMARY KEY,
    p_id INT NOT NULL,
    r_text VARCHAR(512) NOT NULL,
    a_id INT NOT NULL,
    FOREIGN KEY (p_id) REFERENCES products(p_id) ON DELETE CASCADE,
    FOREIGN KEY (a_id) REFERENCES account(a_id) ON DELETE CASCADE  
)


--VIEWS 
---------------------

-------PRODUCTS------

--GET ALL PRODUCTS--
CREATE VIEW getAllProducts AS 
 	SELECT products.p_id, p_title, p_regularPrice, p_salePrice, p_sDesc, p_lDesc, encode(p_img1::bytea, 'escape') AS p_img1, encode(p_img2::bytea, 'escape') AS p_img2, encode(p_img3::bytea, 'escape') AS p_img3, encode(p_img4::bytea, 'escape') AS p_img4, c_name
	FROM products
		LEFT JOIN productImg 
			ON products.p_id = productImg.p_id
		INNER JOIN productCategory
			ON products.p_id = productCategory.p_id
		INNER JOIN categories
			ON productCategory.c_id = categories.c_id
				ORDER BY publishedOn DESC

--For Category Insertion--
Create View insertCategory As
	Select c_name, c_img FROM categories

--FOR Getting Categories--
CREATE VIEW getCategories AS
	SELECT c_id, c_name, encode(c_img::bytea, 'escape') AS c_img From Categories

--For Storing Product Images-- Will be Inserting through VIEW
CREATE VIEW insertProductImages AS
 	SELECT p_id, p_img1, p_img2, p_img3, p_img4 From productImg
	    
