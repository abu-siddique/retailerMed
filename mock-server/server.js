const jsonServer  = require('json-server');
const server      = jsonServer.create();
const router      = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Initialize collections if missing
const db = router.db;
if (!db.has('otps').value()) {
  db.set('otps', []).write();
}
if (!db.has('users').value()) {
  db.set('users', []).write();
}
if (!db.has('categories').value()) {
  // Initialize with sample category data
  db.set('categories', [
    {
      _id: "cat1",
      slug: "surgical-items",
      name: "Surgical & Medical",
      color: "#4E9FDC",
      image: "surgical.png",
      createdAt: Date.now()
    },
    {
      _id: "cat2",
      slug: "medicines",
      name: "Medicines",
      color: "#E74C3C",
      image: "medicine.png",
      createdAt: Date.now()
    },
    {
      _id: "cat3",
      slug: "household-hygiene",
      name: "Home & Hygiene",
      color: "#27AE60",
      image: "household.png",
      createdAt: Date.now()
    },
    {
      _id: "cat4",
      slug: "wellness",
      name: "Wellness & Health",
      color: "#F39C12",
      image: "wellness.jpg",
      createdAt: Date.now()
    }
  ]).write();
}

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Utility: generate 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * POST /api/auth/otp/send
 * Expects { phone }
 * Returns { success: true }
 */
server.post('/api/auth/otp/send', (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }
  const otp = generateOtp();
  // Store OTP in db.json
  db.get('otps')
    .remove({ phone }) // remove any existing
    .write();
  db.get('otps')
    .push({ phone, otp, createdAt: Date.now() })
    .write();
  // TODO: integrate SMS provider here
  console.log(`Sent OTP ${otp} to phone ${phone}`);
  res.json({ success: true });
});

/**
 * POST /api/auth/otp/verify
 * Expects { phone, otp }
 * Returns { user, token } or 401
 */
server.post('/api/auth/otp/verify', (req, res) => {
  const { phone, otp } = req.body;
  const record = db.get('otps').find({ phone, otp }).value();
  if (!record) {
    return res.status(401).json({ error: 'Invalid OTP' });
  }
  // OTP valid: remove it
  db.get('otps').remove({ phone, otp }).write();

  // Find or create user by phone
  let user = db.get('users').find({ phone }).value();
  if (!user) {
    user = { _id: Date.now().toString(), phone, createdAt: Date.now(), verificationStatus: 'unverified' };
    db.get('users').push(user).write();
  }
  const { password, ...userSafe } = user;
  // Issue fake token
  const token = `fake-jwt-token-${user._id}`;
  res.json({ user: userSafe, token });
});

/**
 * GET /api/user/me
 * Returns current user based on token header
 */
server.get('/api/user/me', (req, res) => {
  const auth = req.headers.authorization || '';
  const match = auth.match(/fake-jwt-token-(\d+)/);
  console.log('auth', auth);
  if (!match) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const userId = match[1];
  const user = db.get('users').find({ _id: userId }).value();
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { password, ...userSafe } = user;

  console.log('userSafe', userSafe);
  res.json(userSafe);
});

/**
 * POST /api/user/verify
 * Expects verification data (e.g. name, idProof, etc.)
 * Returns updated user
 */
server.post('/api/user/verify', (req, res) => {
  const auth = req.headers.authorization || '';
  const match = auth.match(/fake-jwt-token-(\d+)/);
  if (!match) return res.status(401).json({ error: 'Not authenticated' });
  const userId = match[1];
  const updates = { verificationStatus: 'pending', verificationData: req.body };
  const updated = db.get('users').find({ _id: userId }).assign(updates).write();
  const { password, ...userSafe } = updated;
  res.json(userSafe);
});

/**
 * PATCH /api/user/update
 * Expects { _id, ...updates }
 * Returns updated user
 */
server.patch('/api/user/update', (req, res) => {
  const { _id, ...updates } = req.body;
  const updated = db.get('users').find({ _id }).assign(updates).write();
  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { password, ...userSafe } = updated;
  res.json(userSafe);
});

/**
 * GET /api/admin/pending-verifications
 * Returns all users with verificationStatus === 'pending'
 */
server.get('/api/admin/pending-verifications', (req, res) => {
  const pending = db.get('users').filter({ verificationStatus: 'pending' }).value();
  res.json({ data: pending });
});

/**
 * PATCH /api/admin/approve/:userId
 * Expects { status } where status is 'approved' or 'rejected'
 * Returns updated user
 */
server.patch('/api/admin/approve/:userId', (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const updated = db.get('users').find({ _id: userId }).assign({ verificationStatus: status }).write();
  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { password, ...userSafe } = updated;
  res.json(userSafe);
});

/**
 * GET /api/user?page=<n>
 * Pagination
 */
server.get('/api/user', (req, res) => {
  const page  = parseInt(req.query.page) || 1;
  const limit = 10;
  const all   = db.get('users').value();
  const start = (page - 1) * limit;
  const paged = all.slice(start, start + limit);
  res.json({ data: { users: paged, page } });
});

/**
 * DELETE /api/user/:id
 */
server.delete('/api/user/:id', (req, res) => {
  const id = req.params.id;
  db.get('users').remove({ _id: id }).write();
  res.status(204).end();
});



/**
 * GET /api/category
 * Returns all categories
 */
server.get('/api/category', (req, res) => {
  const categories = db.get('categories').value();
  res.json({ data: { categories } });
});

/**
 * GET /api/category/:id
 * Returns a single category by ID
 */
server.get('/api/category/:id', (req, res) => {
  const { id } = req.params;
  const category = db.get('categories').find({ _id: id }).value();
  
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  res.json({ data: category });
});

/**
 * PUT /api/category/:id
 * Updates a category
 * Expects body with category data
 */
server.put('/api/category/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  // Check if category exists
  const category = db.get('categories').find({ _id: id }).value();
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  // Update the category
  const updated = db.get('categories')
    .find({ _id: id })
    .assign({ ...updates, updatedAt: Date.now() })
    .write();
    
  res.json({ data: updated });
});

/**
 * POST /api/category
 * Creates a new category
 * Expects body with category data
 */
server.post('/api/category', (req, res) => {
  const newCategory = req.body;
  
  // Generate ID if not provided
  if (!newCategory._id) {
    newCategory._id = `cat${Date.now()}`;
  }
  
  // Add timestamps
  newCategory.createdAt = Date.now();
  
  // Add to database
  db.get('categories')
    .push(newCategory)
    .write();
    
  res.status(201).json({ data: newCategory });
});

// Custom API endpoint for feed data
server.get('/api/feed', (req, res) => {
  const db = router.db; // Get the lowdb instance
  const data = {
    categories: db.get('categories').value(),
    new_arrivals_medicine: db.get('products.new_arrivals_medicine').value(),
    new_arrivals_surgical: db.get('products.new_arrivals_surgical').value(),
    top_selling_medicine: db.get('products.top_selling_medicine').value(),
    top_selling_surgical: db.get('products.top_selling_surgical').value(),
  };
  
  res.json({ data: data });
});
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow any origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});



/**
 * GET /api/products
 * Gets products with pagination and filtering
 * Query params: category, page_size, page, sort, search, inStock, discount, price
 */
server.get('/api/products', (req, res) => {
  // Extract query parameters with defaults
  const {
    category,
    page_size = 10,
    page = 1,
    sort = 'createdAt',
    search = '',
    inStock,
    discount,
    price
  } = req.query;
  
  // Convert to numbers where needed
  const pageNum = parseInt(page) || 1;
  const limit = parseInt(page_size) || 10;
  const skip = (pageNum - 1) * limit;
  
  // Get all product categories
  const productCategories = [
    'new_arrivals_medicine', 
    'new_arrivals_surgical', 
    'top_selling_medicine', 
    'top_selling_surgical'
  ];
  
  // This approach simulates SQL-like operations without loading all data into memory
  // First, collect products from all categories that match the filters
  let allProducts = [];
  
  // Use array functions that are lazy-evaluated for better performance
  productCategories.forEach(categoryKey => {
    // Get products from this category
    const categoryProducts = db.get(`products.${categoryKey}`).value() || [];
    
    // Apply filters - simulating a database WHERE clause
    const filteredProducts = categoryProducts.filter(product => {
      // Category filter
      if (category && product.category !== category) return false;
      
      // Search filter - case insensitive
      if (search && !((product.name && product.name.toLowerCase().includes(search.toLowerCase())) || 
                      (product.title && product.title.toLowerCase().includes(search.toLowerCase())))) return false;
      
      // In stock filter
      if (inStock !== undefined) {
        const inStockNum = parseInt(inStock);
        if (inStockNum === 1 && product.inStock <= 0) return false;
        if (inStockNum === 0 && product.inStock > 0) return false;
      }
      
      // Discount filter
      if (discount !== undefined) {
        const discountNum = parseInt(discount);
        if (discountNum === 1 && (!product.discount || product.discount <= 0)) return false;
      }
      
      // Price range filter
      if (price) {
        const [minPrice, maxPrice] = price.split('-').map(p => parseFloat(p));
        if (minPrice && product.price < minPrice) return false;
        if (maxPrice && product.price > maxPrice) return false;
      }
      
      return true;
    });
    
    allProducts = [...allProducts, ...filteredProducts];
  });
  
  // Sort the products - simulating ORDER BY
  if (sort) {
    const [field, order] = sort.split(',');
    const isDesc = order && order.toLowerCase() === 'desc';
    
    allProducts.sort((a, b) => {
      let comparison = 0;
      // Handle different field types
      if (typeof a[field] === 'string') {
        comparison = a[field].localeCompare(b[field]);
      } else {
        comparison = a[field] - b[field];
      }
      return isDesc ? -comparison : comparison;
    });
  }
  
  // Count total for pagination info
  const totalCount = allProducts.length;
  
  // Paginate - simulating LIMIT and OFFSET
  const paginatedProducts = allProducts.slice(skip, skip + limit);
  
  // Return with pagination metadata
  res.json({
    data: {
      products: paginatedProducts,
      page: pageNum,
      total_pages: Math.ceil(totalCount / limit),
      total_count: totalCount
    }
  });
});

/**
 * GET /api/products/:id
 * Gets a single product by ID
 */
server.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  
  // Search for the product across all categories
  const productCategories = [
    'new_arrivals_medicine', 
    'new_arrivals_surgical', 
    'top_selling_medicine', 
    'top_selling_surgical'
  ];
  
  let product = null;
  
  // Find the product in any category
  for (const categoryKey of productCategories) {
    const foundProduct = db.get(`products.${categoryKey}`)
      .find({ _id: parseInt(id) || id })
      .value();
    
    if (foundProduct) {
      product = foundProduct;
      break;
    }
  }
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json({ data: product });
});

/**
 * GET /api/products/itemDetail
 * Gets detailed information for a product by ID
 * Query params: id
 */
server.get('/api/products/itemDetail', (req, res) => {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }
  
  // Search for the product across all categories
  const productCategories = [
    'new_arrivals_medicine', 
    'new_arrivals_surgical', 
    'top_selling_medicine', 
    'top_selling_surgical'
  ];
  
  let product = null;
  
  // Find the product in any category
  for (const categoryKey of productCategories) {
    const foundProduct = db.get(`products.${categoryKey}`)
      .find({ _id: parseInt(id) || id })
      .value();
    
    if (foundProduct) {
      product = foundProduct;
      break;
    }
  }
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  // Add any additional details needed for the detailed view
  const enhancedProduct = {
    ...product,
    // You could add related products, reviews, etc. here
    related_products: [], // This would be populated in a real implementation
  };
  
  res.json({ data: enhancedProduct });
});

/**
 * POST /api/products
 * Creates a new product
 */
server.post('/api/products', (req, res) => {
  const newProduct = req.body;
  
  // Validate required fields
  if (!newProduct.name || !newProduct.category) {
    return res.status(400).json({ error: 'Name and category are required' });
  }
  
  // Generate ID if not provided
  if (!newProduct._id) {
    newProduct._id = Date.now().toString();
  }
  
  // Add timestamps
  newProduct.createdAt = Date.now();
  
  // Determine which product category to add to based on product properties
  let targetCategory = 'new_arrivals_medicine'; // Default
  
  if (newProduct.category === 'cat1') {
    targetCategory = newProduct.isTopSelling ? 'top_selling_surgical' : 'new_arrivals_surgical';
  } else if (newProduct.category === 'cat2') {
    targetCategory = newProduct.isTopSelling ? 'top_selling_medicine' : 'new_arrivals_medicine';
  }
  
  // Add to database
  db.get(`products.${targetCategory}`)
    .push(newProduct)
    .write();
  
  res.status(201).json({ data: newProduct });
});

/**
 * PUT /api/products/:id
 * Updates a product
 */
server.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  // Search for the product across all categories
  const productCategories = [
    'new_arrivals_medicine', 
    'new_arrivals_surgical', 
    'top_selling_medicine', 
    'top_selling_surgical'
  ];
  
  let updated = null;
  let sourceCategory = null;
  
  // Find and update the product in the correct category
  for (const categoryKey of productCategories) {
    const exists = db.get(`products.${categoryKey}`)
      .find({ _id: parseInt(id) || id })
      .value();
    
    if (exists) {
      sourceCategory = categoryKey;
      updated = db.get(`products.${categoryKey}`)
        .find({ _id: parseInt(id) || id })
        .assign({ ...updates, updatedAt: Date.now() })
        .write();
      break;
    }
  }
  
  if (!updated) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  // If the product's category or top-selling status changed, we may need to move it
  if (
    (updated.category === 'cat1' && sourceCategory.includes('medicine')) ||
    (updated.category === 'cat2' && sourceCategory.includes('surgical')) ||
    (updated.isTopSelling && !sourceCategory.includes('top_selling')) ||
    (!updated.isTopSelling && sourceCategory.includes('top_selling'))
  ) {
    // Determine the new category
    let targetCategory = 'new_arrivals_medicine';
    
    if (updated.category === 'cat1') {
      targetCategory = updated.isTopSelling ? 'top_selling_surgical' : 'new_arrivals_surgical';
    } else if (updated.category === 'cat2') {
      targetCategory = updated.isTopSelling ? 'top_selling_medicine' : 'new_arrivals_medicine';
    }
    
    // If the category changed, move the product
    if (targetCategory !== sourceCategory) {
      // Remove from source category
      db.get(`products.${sourceCategory}`)
        .remove({ _id: parseInt(id) || id })
        .write();
      
      // Add to target category
      db.get(`products.${targetCategory}`)
        .push(updated)
        .write();
    }
  }
  
  res.json({ data: updated });
});

/**
 * DELETE /api/products/:id
 * Deletes a product
 */
server.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  
  // Search for the product across all categories
  const productCategories = [
    'new_arrivals_medicine', 
    'new_arrivals_surgical', 
    'top_selling_medicine', 
    'top_selling_surgical'
  ];
  
  let found = false;
  
  // Find and delete the product from the correct category
  for (const categoryKey of productCategories) {
    const exists = db.get(`products.${categoryKey}`)
      .find({ _id: parseInt(id) || id })
      .value();
    
    if (exists) {
      db.get(`products.${categoryKey}`)
        .remove({ _id: parseInt(id) || id })
        .write();
      found = true;
      break;
    }
  }
  
  if (!found) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.status(204).end();
});

server.use(router);

server.listen(3000, '0.0.0.0' ,() => {
  console.log('JSON-Server running on http://0.0.0.0:3000');
});